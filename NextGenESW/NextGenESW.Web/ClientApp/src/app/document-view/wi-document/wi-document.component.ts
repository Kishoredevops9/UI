import { Component, OnInit, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { CollabComponent } from '../collab/collab.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DocumentViewService } from '../document-view.service';
import { ExtractedDocument, ContentList } from '../document-view.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PersistanceService } from '@app/shared/persistance.service';
import { Subscription, Observable } from 'rxjs';
import { selectContentList } from '@app/reducers';
import { Store, select } from '@ngrx/store';
import { ContentListsState } from '@app/dashboard/content-list/content-list.reducer';
import { SharedService } from '@app/shared/shared.service';
import { ContextService } from '@app/shared/component/global-panel/context/context.service';
import { ContextInfo } from '@app/shared/component/global-panel/context/context.model';
import { CriteriaGroupPageService } from '@app/criteria-group/criteria-group.service';
import { ContentCommonService } from '@app/shared/content-common.service';
import { MsalService } from '@azure/msal-angular';
import { ActivityPageService } from '@app/activity-page/activity-page.service';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { BaseContentDetailComponent } from '@app/shared/component/base-content-detail/base-content-detail.component';
import * as data from 'src/assets/data/progress-bar.json';
import { ASSET_STATUSES, Constants } from '@environments/constants';

@Component({
  selector: 'app-wi-document',
  templateUrl: './wi-document.component.html',
  styleUrls: ['./wi-document.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class WiDocumentComponent extends BaseContentDetailComponent implements OnInit {
  ASSET_STATUSES = ASSET_STATUSES;
  @ViewChildren(MatTab) tabs;
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  contentType = 'DocumentView';
  wiContentType: string = 'WI';
  docTitle;
  users;
  loading = false;
  title: string;
  version:string;
  type: string;
  isPublishMode: boolean = false;
  docStatus: number = 1;
  document: ContentList[];
  globalData: any = {};
  contentList$: Observable<ContentList[]>;
  progressBar: any = (data as any).default;

  tablists: ExtractedDocument[];
  id: number;
  contentIds: string = '';
  isPreview: boolean = false;
  webContent;
  //wordDocumentDetails;
  previewMode: boolean = false;
  globalDataBuf: any;
  sourceUrl: any;

  contextInfo: ContextInfo;
  lessonLearned: any;
  documentTitle: string;
  hasTabLists: boolean = false;
  dupGlobalData: any;
  UsJurisdiction: any;
  UsClassification: any;
  saveAs: boolean = false;

  constructor(
    private store: Store<ContentListsState>,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private documentViewService: DocumentViewService,
    protected route: ActivatedRoute,
    protected router: Router,
    private persistanceService: PersistanceService,
    protected sharedService: SharedService,
    private contextService: ContextService,
    private criteriaGroupService: CriteriaGroupPageService,
    private contentCommonService: ContentCommonService,
    private authService: MsalService,
    private activityPageService: ActivityPageService,
  ) {
    super(router, route, sharedService);
    this.route.params.subscribe((param) => {
      //console.log("wi document param", param);
      let contentType = param['contentId'].split('-');
      let version = param['version'] ? param['version'] : sessionStorage.getItem('version');
      contentType = (contentType[1].toUpperCase() == "I") ? "WI" : (contentType[1].toUpperCase() == "G") ? "GB" : (contentType[1].toUpperCase() == "D" || contentType[1].toUpperCase() == "S") ? "DS" : '';
      this.contentType = contentType;
      this.id = (param['id']) ? param['id'] : (param['contentId']) ? param['contentId'] : '';
      this.contentIds = (param['contentId']) ? param['contentId'] : '';
      this.type = param['documentType'] ? param['documentType'] : contentType ? contentType : '';
      //console.log("contentType loading", this.type);
      this.version = version ? version : '0';
    });
  }

  ngOnInit() {
    this.documentTitle = sessionStorage.getItem('title');
    console.log(sessionStorage.getItem('title'));
    this.loading = true;
    this.contextService.getContextInfo.subscribe((context) => {
      this.contextInfo = context;
      this.lessonLearned = this.contextInfo.lessonLearned;
    });
    if (this.sharedService.getPreviewVal()) {
      this.isPublishMode = true;
      this.documentViewService.previewContentType(this.id, this.type).subscribe((res) => {
        this.tablists = res;
        //this.webContent = true;
        const contentStatus = sessionStorage.getItem('documentStatusDetails');
        this.loadContextInfo();

        if ((this.type == 'WI' || this.type == 'GB' || this.type == 'DS') && this.tablists.length > 0) {
          this.sourceUrl = this.tablists[0].sourceUrl;
          this.hasTabLists = this.tablists.length > 6 ? true : false;
          this.tablists.sort(function (a, b) {
            return a['displayOrder'] - b['displayOrder']
          })
        }

        this.computeActiveIndex();
        for (let doc of res) {
        }
      }, (error) => {
        console.error('There was an error!', error);
        this.loading = false;
      });
    } else {
      //const url = this.router.url.split("/");
      this.documentViewService.getExtractedWIDocList(this.id, this.type, this.version).subscribe((res) => {
        this.tablists = res['listSP'];
        //this.webContent = true;
        const contentStatus = sessionStorage.getItem('documentStatusDetails');
        this.loadContextInfo();

        if ((this.type == 'WI' || this.type == 'GB' || this.type == 'DS') && this.tablists.length > 0) {
          this.hasTabLists = this.tablists.length > 6 ? true : false;
          this.tablists.sort(function (a, b) {
            return a['displayOrder'] - b['displayOrder']
          })
        }
        //for (let doc of res) { }
        this.computeActiveIndex();
      }, (error) => {
        console.error('There was an error!', error);
        this.loading = false;
      });
    }

    let userEmail = sessionStorage.getItem('userMail');
    if (sessionStorage.getItem('contentType') && sessionStorage.getItem('contentType').toLowerCase() != "published") {
      var documentId = this.id;
      var documentStatusDetails = "draft";
      var documentcontentId = (this.contentIds && this.contentIds.length > 0) ? this.contentIds : sessionStorage.getItem('contentNumber');
      var documentcontentType = this.wiContentType;
      var documentversion = this.version;
    } else {
      var documentId = 0;
      var documentStatusDetails = sessionStorage.getItem('contentType') ? sessionStorage.getItem('contentType') : 'published';
      var documentcontentId = (this.contentIds && this.contentIds.length > 0) ? this.contentIds : sessionStorage.getItem('contentNumber');
      var documentcontentType = this.wiContentType;
      var documentversion = this.version;
    }
    var redirectionPath = sessionStorage.getItem('redirectUrlPath');
    const urll = this.router.url.split("/");

    let userProfileDataObj = this.sharedService.getHeaderRequestedData();
    if (userProfileDataObj) {
      var headerRequestedData = this.contentCommonService.getUserProfileData(userProfileDataObj);
    } else {
      let userProfileDataObj = JSON.parse(sessionStorage.getItem('userProfileData'));
      var headerRequestedData = this.contentCommonService.getUserProfileData(userProfileDataObj);
    }

    this.contentCommonService.getDocumentConentData(documentId, documentcontentType, documentStatusDetails, documentcontentId, documentversion, userEmail).
    subscribe((res: any) => {
      this.loading = false;

      this.webContent = (res['pwStatus'].toLowerCase() == "published" || res['pwStatus'].toLowerCase() == "current" || res['pwStatus'].toLowerCase() == "obsolete");
      let pwStatus = res['pwStatus'] ? res['pwStatus'].toLowerCase() : '';

      // ===== BussiessRules =====
      // When the loaded Work Instruction is published without classier (JC)
      // the content is restricted to user
      const { classifierId } = res;
      const isWorkInstruction = this.type === 'WI';
      // Only apply when document is published (assetStatusId = 2) work instruction
      // use '==' instead of '===' to caputre both 'null' and 'undefined'
      if (isWorkInstruction && pwStatus === 'published' && classifierId == null) {
        alert('Restricted Content - Not Viewable By Current User!');
        this.navigateToSearchOrDashboard(redirectionPath);
      }


      res['assetStatusId'] = pwStatus == "published" ? 2 : 1;

      const pwStatusMapping = {
        'published': ASSET_STATUSES.PUBLISHED,
        'current': ASSET_STATUSES.CURRENT,
        'obsolete': ASSET_STATUSES.OBSOLETE
      };
      res['assetStatusId'] = (pwStatus == 'published' || pwStatus == 'current') ? 2 : 1;
      this.dupGlobalData = { ...res };
      this.globalData = res;
      this.documentTitle = this.globalData.title;
      this.globalData.originalAssetStatusId = res['assetStatusId'];
      this.globalData.originalAssetStatus = res['assetStatus'];
      this.globalData.assetStatusId = this.globalData.originalAssetStatusId;
      this.globalData.assetStatus = res['assetStatus'];
      this.globalData.contentStatus = this.globalData.originalAssetStatusId;
      this.UsJurisdiction = this.globalData.usJuridiction;
      this.UsClassification = this.globalData.usClassification;
      this.loadContextInfo();
    }, (error) => {
      this.dialog.closeAll();
      console.error('There was an error!', error);
      if (error.status == 403 && headerRequestedData == '') {
        this.authService.loginRedirect();
      } else if (error.status == 403) {
        alert('Restricted Content - Not Viewable By Current User!');
        this.navigateToSearchOrDashboard(redirectionPath);
      }
      if (error.status == 404) {
        alert('Invalid Content ID - Content Not Found!');
        this.loading = false;
        this.navigateToSearchOrDashboard(redirectionPath);
      }
      this.loading = false;
    });
  }

  /**
   * When document content is restricted or not found
   * an alert is displayed and the application should
   * be navigated to the 'dashboard' or 'homepage'
   */
  navigateToSearchOrDashboard(redirectionPath: string) {
    // Stop loading first
    this.loading = false;
    // Check redirect condition
    if (redirectionPath == 'search') {
      this.router.navigate(['_search'], { queryParams: { q: this.id } })
      this.router.navigate(['_search'], {
        queryParams: { q: this.contentIds },
      });
    } else {
      this.router.navigate(['dashboard']);
    }
  }

  loadContextInfo() {
    this.contextService.ContextInfo = this.getContextInfo();
  }

  getContextInfo() {
    const contextInfo: ContextInfo = new ContextInfo();
    if (this.type == 'WI') {
      contextInfo.entityInfo = this.globalData;
      contextInfo.entityId = this.id;
    } else if (this.type == 'GB') {
      contextInfo.entityInfo = this.globalData;
      contextInfo.entityId = this.id;
    } else if (this.type == 'DS') {
      contextInfo.entityInfo = this.globalData;
      contextInfo.entityId = this.id;
    }
    return contextInfo;
  }

  // Open Dialog Function
  openDialog() {
    const dialogRef = this.dialog.open(CollabComponent, {
      width: '70%',
      data: { doc: { title: this.docTitle } },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this._snackBar.open("'" + this.docTitle + "' shared", 'x', {
        duration: 5000,
      });
    });
  }


  // downloadSourceFile() {
  //   const link = document.createElement('a');
  //   const mimeType = '.docx';
  //   link.href =
  //     'https://pwesw1.sharepoint.com/sites/PWESW/_layouts/15/download.aspx?UniqueId=a9d9e13d%2D4554%2D4b80%2D8202%2Da5165f82d35d';
  //   link.download = 'XA-I-0524_Demo';
  //   link.click();
  // }

  handleOnPreviewClick(value) {
    super.handleOnPreviewClick(value);
    this.previewMode = value;
    //this.wordDocumentDetails.assetStatusId = this.globalDataBuf.assetStatusId;
    this.globalData.assetStatusId = this.globalDataBuf.assetStatusId;
    this.globalData.originalAssetStatusId = this.globalDataBuf.assetStatusId;

    this.globalData.originalAssetStatus = this.globalDataBuf.assetStatus;
    this.globalData.assetStatus = this.globalDataBuf.assetStatus;

    this.webContent = false;
    if (value) {
      //this.wordDocumentDetails.assetStatusId = 2;
      this.globalData.assetStatusId = 2;
      this.globalData.assetStatus = ASSET_STATUSES.PUBLISHED;
      this.webContent = true;
    }
    this.globalData = JSON.parse(JSON.stringify(this.globalData));
    this.loadContextInfo();
  }

  handleOnRecallClick(value){
    if (value) {
      this.loading = true;
      const modelValue = {
        contentId: this.globalData.contentId,
        requestor: sessionStorage.getItem('requesterClockId'),
        version: `${ this.globalData.version }` || '1'
      };
      this.activityPageService.GateAPRecallData(modelValue).subscribe(
        (res) => {
          console.log('res', res);
          this.loading = false;
          this._snackBar.open("'Content has been recalled!", 'x', {
            duration: 5000,
          });
          this.loadContextInfo();
        },
        (error) => {
          console.log('error', error);
          this.loading = false;
          this._snackBar.open("'There was an error!", 'x', {
            duration: 5000,
          });
          console.error('There was an error!', error);
        }
      );
    }
  }

  handleOnSaveAsClick(value) {
    const userEmail = sessionStorage.getItem('userMail');
    this.dupGlobalData.author = userEmail;
    if (value) {
      this.loading = true;


      if (this.dupGlobalData.documentType && (this.dupGlobalData.documentType == 'GB' || this.dupGlobalData.documentType == 'DS' || this.dupGlobalData.documentType == 'WI')) {
        this.dupGlobalData.lessonLearned = this.lessonLearned ? this.lessonLearned : [];
      }

      this.documentViewService.GetContentID(this.dupGlobalData).subscribe((res) => {
        this.dupGlobalData = { ...res };
        this.globalData = res;
        this.saveAs = true;
        sessionStorage.setItem('contentType', 'draft');
        sessionStorage.setItem('documentId', res['id']);
        sessionStorage.setItem('documentcontentId', res['contentId']);
        sessionStorage.setItem('documentversion', res['versionNumber']);
        sessionStorage.setItem('documentcontentType', res['documentType']);
        sessionStorage.setItem('documentStatusDetails', res['pwStatus']);
        sessionStorage.setItem('documentWorkFlowStatus', res['pwStatus']);
        sessionStorage.setItem('docStatus', res[''])
        this.globalData['readMode'] = true;
        //this.router.navigate(['/view-draft', res['contentId']]);
        if(sessionStorage.getItem('documentcontentType') == 'WI'){
          this.router.navigate(['/view-document/WI', res['contentId']]);
        }
        else if(sessionStorage.getItem('documentcontentType') == 'GB'){
          this.router.navigate(['/view-document/GB', res['contentId']]);
        }
        else{
          this.router.navigate(['/view-document/DS', res['contentId']]);
        }

        // if (this.globalData.documentType == 'WI') {
        //   this.router.navigate(['/create-document', res['id']]);
        // }
        // else if (this.globalData.documentType == 'GB') {
        //   this.router.navigate(['/guide-book', res['id']]);
        // }
        // else {
        //   this.router.navigate(['/view-draft', res['contentId']]);
        // }
        this.loading = false;
        this.globalData = JSON.parse(JSON.stringify(this.globalData));
      }, (error) => {
        console.error('There was an error!', error);
        this.loading = false;
      });
    }
  }

  handleOnRevisionClick(value) {
    const userEmail = sessionStorage.getItem('userMail');
    if ( !this.dupGlobalData ) {
      this.dupGlobalData = { ...this.globalData };
    }
    this.dupGlobalData.author = userEmail;
    if (value) {
      this.loading = true;

      if (this.dupGlobalData.documentType && (this.dupGlobalData.documentType == 'GB' || this.dupGlobalData.documentType == 'DS' || this.dupGlobalData.documentType == 'WI')) {
        this.dupGlobalData.lessonLearned = this.lessonLearned ? this.lessonLearned : [];
      }
      this.documentViewService.reviseSharePointContent(this.dupGlobalData).subscribe((res) => {
          this.dupGlobalData = { ...res };
          this.loading = false;
          this.globalData = res;
          this.saveAs = true;
          sessionStorage.setItem('contentType', 'draft');
          sessionStorage.setItem('documentId', res['id']);
          sessionStorage.setItem('documentcontentId', res['contentId']);
          sessionStorage.setItem('documentversion', res['versionNumber']);
          sessionStorage.setItem('documentcontentType', res['documentType']);
          sessionStorage.setItem('documentStatusDetails', res['pwStatus']);
          sessionStorage.setItem('documentWorkFlowStatus', res['pwStatus']);
          sessionStorage.setItem('docStatus', res[''])
          this.globalData['readMode'] = true;
          //this.router.navigate(['/view-draft', res['contentId']]);
          if(sessionStorage.getItem('documentcontentType') == 'WI'){
            this.router.navigate(['/view-document/WI', res['contentId']]);
          }
          else if(sessionStorage.getItem('documentcontentType') == 'GB'){
            this.router.navigate(['/view-document/GB', res['contentId']]);
          }
          else{
            this.router.navigate(['/view-document/DS', res['contentId']]);
          }
          this.globalData = JSON.parse(JSON.stringify(this.globalData));
        },
        (data) => {
          this.loading = false;
          console.error('There was an error!', data);
          const errorMsg = 'content has already been revised'; // error code is not unique so comparing the error message
          if (((data.error.error.message).toLocaleLowerCase()).includes(errorMsg)) {
            this._snackBar.open(data.error.error.message, 'x', {
              duration: 5000,
            });
          }
        });
    }
  }

  openDoc() {
    if (this.sourceUrl != '') {
      var url = 'ms-word:ofe|u|' + this.sourceUrl;
      window.location.href = url;
    }
  }
  ngOnDestroy() {
    if (this.saveAs) {
      this.saveAs = false;
    } else { /* Should not clear session storage values when doing SaveAs */
      sessionStorage.removeItem('componentType');
      sessionStorage.removeItem('contentNumber');
      sessionStorage.removeItem('contentType');
      sessionStorage.removeItem('redirectUrlPath');
      sessionStorage.removeItem('documentversion');
      sessionStorage.removeItem('documentId');
      sessionStorage.removeItem('documentcontentType');
      sessionStorage.removeItem('documentStatusDetails');
      sessionStorage.removeItem('documentcontentId');
      sessionStorage.removeItem('documentcurrentUserEmail');
      sessionStorage.removeItem('title');
      sessionStorage.removeItem('docUrl');
      sessionStorage.removeItem('documentClassificationDetails');
      sessionStorage.removeItem('statusCheck');
      sessionStorage.removeItem('documentWorkFlowStatus');
    }
  }
}
