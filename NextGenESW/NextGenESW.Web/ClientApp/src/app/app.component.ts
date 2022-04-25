import { DOCUMENT } from '@angular/common';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import {
  Router,
  Event,
  NavigationStart,
  NavigationEnd,
  NavigationError,
  ActivatedRoute,
  NavigationCancel,
  RoutesRecognized
} from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { AdminService } from '@app/admin/admin.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { RedirectChromeComponent } from './redirect-chrome/redirect-chrome.component';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import * as CommonListAction from './shared/action/common-list.action';
import {
  GetActivityPageDisciplineCodeList,
  GetAllApprovalRequirement,
  GetAllExportAuthorityList,
  GetAllRestrictingProgramList, GetAllSetOfCategoriesList, GetConfidentialitiesList
} from './shared/action/common-list.action';
import { WiDropDownList } from '@app/create-document/create-document.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  title = 'ESW-Application';
  active: boolean = false;
  loading = true;
  isIE: boolean = false;
  leftNavHeaderPanelCreated: boolean;
  leftNavAdminHeaderPanelCreated: boolean;
  tooltip: any = [];

  constructor(
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    private titleService: Title,
    private store: Store,
    public AdminService: AdminService,
    private dbService: NgxIndexedDBService,
    private route: ActivatedRoute,
    public dialogRedirectChrom: MatDialog
  ) {

    // this.dbService.clear('people').subscribe((successDeleted) => {
    //   console.log('success? ', successDeleted);
    // });

    // this.dbService
    // .add('people', {
    //   id : 10,
    //   name: `Bruce Wayne`,
    //   email: `bruce@wayne.com`,
    //   description : 'sdfsd'
    // })
    // .subscribe((key) => {
    //   console.log('key: ', key);
    // });
    //this.titleService.setTitle("Angular SEO Meta Tag Example - ItSolutionStuff.com");

    this.router.events.subscribe((event: Event) => {
      if ( event instanceof NavigationStart ) {
        // Show loading indicator
        this.loading = true;
      }

      if ( event instanceof NavigationEnd ) {
        this.loading = false;
        var newClass = event.url.split('/')[1];
        document.body.id = newClass;

        if ( this.tooltip.length ) {
          setTimeout(() => {
            this.setToolTip();
            //console.log("Tooltip Added")
          }, 1000);
        } else {
          this.AdminService.getAllToolTip().subscribe((data) => {
            this.tooltip = data;
            setTimeout(() => {
              this.setToolTip();
              //console.log("Tooltip Added")
            }, 1000);
          });

        }

      }

      if ( event instanceof NavigationCancel ) {
        this.loading = false;

      }
      if ( event instanceof NavigationError ) {
        this.loading = false;

        console.log(event.error);
      }
    });

    // let match = navigator.userAgent.search(/(?:Edge|MSIE|Trident\/.*; rv:)/);
    // this.isIE = false;

    // if (match !== -1) {
    //   this.isIE = true;
    // }
    // console.log(this.isIE,'isIE');

    // if(this.isIE == true){
    //   this.redirectChromPopup();
    // }

    this.loadMetaData();
  }

  // redirectChromPopup() {
  //   const dialogRefFeedback = this.dialogRedirectChrom.open(RedirectChromeComponent, {
  //     width: '40%',
  //     height: 'auto',
  //   });
  //   dialogRefFeedback.afterClosed().subscribe((result) => {
  //   });
  // }

  setToolTip() {
    this.tooltip.forEach(element => {
      var tid = element.tokenId.toString();
      let selector = document.querySelector('*[data-tooltip=\'' + tid + '\']');
      if ( selector ) {
        selector.setAttribute('tooltip', element.description);
        selector.setAttribute('ng-reflect-tooltip-value', element.description);
      }
    });

  }

  onOpen($event) {
    this.active = $event;
  }

  leftNavHeaderPanel(leftNavOutput) {
    this.leftNavHeaderPanelCreated = leftNavOutput;
    //console.log("left panel show content app component",leftNavOutput);
  }

  leftNavAdminHeaderPanel(leftAdminOutput) {
    this.leftNavAdminHeaderPanelCreated = leftAdminOutput;
    //console.log("left panel show admin app component",leftAdminOutput);
  }

  loadMetaData() {
    this.store.dispatch(CommonListAction.getAllMetaDataDisciplineCode.load());
    this.store.dispatch(CommonListAction.GetAllApprovalRequirement.load());
    this.store.dispatch(CommonListAction.GetCategoryList.load());
    this.store.dispatch(CommonListAction.GetAllSetOfPhasesList.load());
    this.store.dispatch(CommonListAction.GetExportComplianceList.load());
    this.store.dispatch(CommonListAction.GetAllExportAuthorityList.load());
    this.store.dispatch(CommonListAction.GetAllRestrictingProgramList.load());
    this.store.dispatch(CommonListAction.GetActivityPageDisciplineCodeList.load());
    this.store.dispatch(CommonListAction.GetClassifiersList.load());
    this.store.dispatch(CommonListAction.GetRevisionTypeList.load());
    this.store.dispatch(CommonListAction.GetAllSetOfCategoriesList.load());
    this.store.dispatch(CommonListAction.GetConfidentialitiesList.load());
    this.store.dispatch(CommonListAction.GetEngineSectionList.load());

    this.store.dispatch(CommonListAction.GetWiDropDownList.load({listType: 'GetAllDiscipline'}));
    this.store.dispatch(CommonListAction.GetWiDropDownList.load({listType: 'GetAllSubDiscipline'}));
    this.store.dispatch(CommonListAction.GetWiDropDownList.load({listType: 'GetAllPhase'}));
    this.store.dispatch(CommonListAction.GetWiDropDownList.load({listType: 'GetAllEngineeringOrg'}));

    this.store.dispatch(CommonListAction.GetUserList.load());
  }
}
