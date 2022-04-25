import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { ContentListsState } from '@app/dashboard/content-list/content-list.reducer';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpHelperService } from '@app/shared/http-helper.service';
import { DocumentViewService } from '@app/document-view/document-view.service';
import { ContextInfo } from '@app/shared/component/global-panel/context/context.model';
import { ContextService } from '@app/shared/component/global-panel/context/context.service';
import { GlobalService } from '@app/shared/component/global-panel/global.service';
import { ContentCommonService } from '@app/shared/content-common.service';
import * as data from 'src/assets/data/progress-bar.json';
import { ActivityPageService } from '@app/activity-page/activity-page.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { BaseContentDetailComponent } from '@app/shared/component/base-content-detail/base-content-detail.component';
import { ASSET_STATUSES } from '@environments/constants';
import { SharedService } from '@app/shared/shared.service';

@Component({
  selector: 'app-guide-details',
  templateUrl: './guide-details.component.html',
  styleUrls: ['./guide-details.component.scss'],
})
export class GuideDetailsComponent extends BaseContentDetailComponent implements OnInit {
  @ViewChildren(MatTab) tabs;
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  loading = false;
  id;
  version:string;
  status:string;
  contentIds:string;
  title: string;
  contentType: string = 'GB';
  hasProperty: any = false;
  isCheckOut: Boolean = true;
  docStatus = 'draft';
  globalData: any;
  showMenuActions: Boolean = false;
  previewMode: boolean = false;
  globalDataBuf: any;
  tablists: any;
  sourceUrl: any;
  parenttitle;
  webContent: boolean = false;
  hasTabLists: boolean = false;
  hasApproved: boolean = false;
  updatedContentOwner: string = '';
  documentCreateStatus: boolean;
  docTypeStatus: string;
  progressBar: any = (data as any).default;
  constructor(
    protected route: ActivatedRoute,
    private store: Store<ContentListsState>,
    private helper: HttpHelperService,
    private documentViewService: DocumentViewService,
    private contextService: ContextService,
    protected router: Router,
    protected sharedService: SharedService,
    private contentCommonService: ContentCommonService,
    private globalService: GlobalService,
    private activityPageService: ActivityPageService,
    private _snackBar: MatSnackBar,
  ) {
    super(router, route, sharedService);
  }

  ngOnInit(): void {
    this.route.params.subscribe((param) => {
      this.id = parseInt(param['id']);
      this.contentIds = (param['contentId']);
      this.version = (param['version']);
      this.hasProperty = isNaN(this.id);
    if (this.contentIds?.length > 0 || this.id > 0) {
      this.loadGuideBookData();
    }
  });
    // if (this.id > 0) {
    //   this.criteriaGroupService.getCriteriaGroupPageList(this.id).subscribe((res) => {
    //     const data = JSON.parse(JSON.stringify(res));
    //     this.title = data.title;
    //     console.log("res", data);
    //     this.type = this.helper.getContentType(data.contentTypeId);
    //   });
    // }
    // else{
    this.contentType = 'GB';
    // }

    this.docTypeStatus = sessionStorage.getItem('documentWorkFlowStatus');

    if (this.docTypeStatus === null || this.docTypeStatus === '') {
      this.documentCreateStatus = true;
    }
  }

  onTabClick(event) {}
  onCheckinClick(value) {
    this.isCheckOut = value == 'checkin' ? false : true;
  }
  loadContextInfo() {
    this.contextService.ContextInfo = this.getContextInfo();
  }

  getContextInfo() {
    const contextInfo: ContextInfo = new ContextInfo();
    contextInfo.entityInfo = 'Design Standards';
    return contextInfo;
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
          this.loadGuideBookData();
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

  handleOnPreviewClick(value) {
    super.handleOnPreviewClick(value);
    this.previewMode = false;
    this.globalData.assetStatusId = this.globalDataBuf.assetStatusId;
    this.globalData.assetStatus = this.globalDataBuf.assetStatus;
    this.globalData.pwStatus = this.globalDataBuf.pwStatus;
    this.globalData.originalAssetStatusId = this.globalDataBuf.assetStatusId;
    this.globalData.originalAssetStatus = this.globalDataBuf.assetStatus;
    this.webContent = false;
    this.tablists = [];
    this.hasTabLists = false;
    if (!value) {
      this.loading = true;
      this.documentViewService
        .previewExtraction(this.sourceUrl, this.parenttitle, this.contentType)
        .subscribe(
          (res) => {
            this.documentViewService
              .previewContentType(this.id, this.contentType)
              .subscribe(
                (res) => {
                  this.tablists = res;
                  this.sourceUrl = this.tablists[0].sourceUrl;

                  if (this.tablists.length > 0) {
                    this.hasTabLists = this.tablists.length > 6 ? true : false;
                    this.tablists.sort(function (a, b) {
                      return a['displayOrder'] - b['displayOrder'];
                    });
                  }
                  this.loading = false;
                },
                (error) => {
                  console.error('There was an error!', error);
                  this.loading = false;
                }
              );
          },
          (error) => {
            console.error('There was an error!', error);
            this.loading = false;
          }
        );
      this.globalData.assetStatusId = 2;
      this.globalData.assetStatus = ASSET_STATUSES.PUBLISHED;
      this.globalData.pwStatus = 'Published';
      this.previewMode = true;
      this.webContent = true;
    }
    this.globalData = JSON.parse(JSON.stringify(this.globalData));
    this.loadContextInfo();
  }

  openDoc() {
    if (this.sourceUrl != '') {
      var url = 'ms-word:ofe|u|' + this.sourceUrl;
      window.location.href = url;
    }
  }
  handleApprovalAction(value) {
    this.globalData.assetStatusId = 2;
    this.globalData.assetStatus = ASSET_STATUSES.PUBLISHED;
    this.globalData.originalAssetStatusId = 2;
    this.globalData.originalAssetStatus = ASSET_STATUSES.PUBLISHED;
    this.hasApproved = true;
    this.updatedContentOwner = '';
    this.globalData = JSON.parse(JSON.stringify(this.globalData));
  }
  handleRequestAction(value) {
    this.updatedContentOwner = value;
    this.globalData.contentOwnerMail = value;
    this.globalData.contentOwnerId = value;
  }
  loadGuideBookData() {
    console.log('guide book loadGuideBookData');

    if (
      sessionStorage.getItem('contentType') &&
      sessionStorage.getItem('contentType').toLowerCase() == 'published'
    ) {
      var documentcontentId = sessionStorage.getItem('contentNumber');
      var documentversion = this.version;
      var documentStatusDetails = sessionStorage.getItem('contentType')
        ? sessionStorage.getItem('contentType')
        : 'published';
      var documentcontentType = this.contentType;
      this.id = (this.id && this.id > 0) ? this.id : this.contentIds ? this.contentIds : 0;
    } else {
      var documentcontentId = sessionStorage.getItem('documentcontentId')
        ? sessionStorage.getItem('documentcontentId')
        : '0';
      var documentversion = (this.version) ? this.version : '0';
      var documentStatusDetails = sessionStorage.getItem(
        'documentStatusDetails'
      )
        ? sessionStorage.getItem('documentStatusDetails').toLowerCase()
        : 'draft';
      var documentcontentType = this.contentType;
    }

    const userEmail = sessionStorage.getItem('userMail');
    const url = this.router.url.split('/');
    var redirectionPath = sessionStorage.getItem('redirectUrlPath');
    this.parenttitle = sessionStorage.getItem('title');
    this.sourceUrl = sessionStorage.getItem('docUrl');

    this.loading = true;

    this.contentCommonService
      .getDocumentConentData(
        this.id,
        documentcontentType,
        documentStatusDetails,
        documentcontentId,
        documentversion,
        userEmail
      )
      .subscribe((res) => {
        this.globalDataBuf = JSON.parse(JSON.stringify(res));
        this.globalData = res;
        if (this.globalData.assetStatus == ASSET_STATUSES.PUBLISHED || this.globalData.assetStatus == ASSET_STATUSES.CURRENT) {
          this.hasApproved = true;
        }
        this.globalData.originalAssetStatusId =
        this.globalData.pwStatus == 'Published' ? 2 : 1;
        this.globalData.assetStatusId = this.globalData.originalAssetStatusId;
        this.globalData.contentStatus = this.globalData.originalAssetStatusId;
        this.globalData['contentType'] = this.contentType;
        this.title = this.globalData.title;
        this.loading = false;
        this.loadContextInfo();
        this.showMenuActions = true;
      }),
      (error) => {
        console.error('There was an error!', error);
        this.loading = false;
      };
  }
  ngOnDestroy() {
    sessionStorage.removeItem('componentType');
    sessionStorage.removeItem('contentType');
    sessionStorage.removeItem('contentNumber');
    sessionStorage.removeItem('contentVersion');
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
