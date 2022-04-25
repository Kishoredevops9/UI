import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { ContentListsState } from '@app/dashboard/content-list/content-list.reducer';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpHelperService } from '@app/shared/http-helper.service';
import { ContextService } from '@app/shared/component/global-panel/context/context.service';
import { ContextInfo } from '@app/shared/component/global-panel/context/context.model';
import { DocumentViewService } from '@app/document-view/document-view.service';
import { GlobalService } from '@app/shared/component/global-panel/global.service';
import { SharedService } from '@app/shared/shared.service';
import { ContentCommonService } from '@app/shared/content-common.service';
import { RecordsService } from '../../shared/records.service';
import { RecordsService1 } from '../../shared/records1.service';
import * as data from 'src/assets/data/progress-bar.json';
import { MatDialog } from '@angular/material/dialog';
import { MsalService } from '@azure/msal-angular';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivityPageService } from '@app/activity-page/activity-page.service';
import { BaseContentDetailComponent } from '@app/shared/component/base-content-detail/base-content-detail.component';

import { ASSET_STATUSES } from '@environments/constants';

import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { shareReplay, tap } from 'rxjs/operators';

@Component({
  selector: 'app-design-details',
  templateUrl: './design-details.component.html',
  styleUrls: ['./design-details.component.scss'],
})
export class DesignDetailsComponent extends BaseContentDetailComponent implements OnInit {
  @ViewChildren(MatTab) tabs;
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  loading = false;
  id: number;
  contentIds: string = '';
  title: string;
  contentType: string = 'DS';
  isCheckOut: Boolean = true;
  docStatus = 'draft';
  globalData: any;
  showMenuActions: Boolean = false;
  hasProperty: any = false;
  previewMode: boolean = false;
  globalDataBuf: any;
  tablists: any;
  sourceUrl: any;
  parenttitle;
  webContent: boolean = false;
  hasTabList: boolean = false;
  hasApproved: boolean = false;
  updatedContentOwner: string = '';
  documentCreateStatus: boolean;
  docTypeStatus: string;
  parcontentid;
  broadCastMessage: any = 'false';
  progressBar: any = (data as any).default;
  UsClassification: any;
  requestApprovalOption: boolean = false;
  showTab: boolean = false;
  checkingPreview;
  version: string;
  status: string;
  assetStatusId:any;
  previewDocument$;

  constructor(
    protected route: ActivatedRoute,
    private store: Store<ContentListsState>,
    private helper: HttpHelperService,
    private contextService: ContextService,
    private documentViewService: DocumentViewService,
    private globalService: GlobalService,
    protected sharedService: SharedService,
    protected router: Router,
    private contentCommonService: ContentCommonService,
    private rservice: RecordsService,
    public dialog: MatDialog,
    private authService: MsalService,
    private _snackBar: MatSnackBar,
    private activityPageService: ActivityPageService,
  ) { super(router, route, sharedService); }

  ngOnInit(): void {
    this.rservice.UpdateBroadcastMessage('false');
    this.parenttitle = sessionStorage.getItem('title');
    this.parcontentid = sessionStorage.getItem('contentNumber');

    const pwStatus = sessionStorage.getItem('documentWorkFlowStatus');
    if(pwStatus == 'Submitted for Approval' || pwStatus == 'Approved, Waiting for JC'){
      this.showMenuActions = true;

    }

    this.route.params.subscribe((param) => {

      this.route.queryParams.subscribe(urlParam => {

        if (urlParam && urlParam['id'] && urlParam['id'] > 0) {
          this.id = (urlParam['id'] && urlParam['id'] > 0) ? urlParam['id'] : 0;
          this.contentType = (urlParam['contentType']) ? urlParam['contentType'] : 'KP';
          this.version = (urlParam['version']) ? urlParam['version'] : sessionStorage.getItem('version');
          this.status = (urlParam['status']) ? urlParam['status'].toLowerCase() : 'draft';
          this.contentIds = param['contentId'] ? param['contentId'] : '';
          this.hasProperty = (this.id && this.id > 0) ? false : true;
        } else if (param['contentId']) {
          let contentType = param['contentId'].split('-');
          contentType = contentType[1] == 'I' ? 'WI' : contentType[1] == 'G' ? 'GB' : contentType[1] == 'D' || contentType[1] == 'S' ? 'DS' : '';
          this.contentType = contentType || urlParam['contentType'] || this.contentType ||  '';
          this.id = param['contentId'] ? param['contentId'] : '';
          this.version = param['version'] ? param['version'] : sessionStorage.getItem('version');
          this.contentIds = param['contentId'] ? param['contentId'] : '';
          this.hasProperty = this.contentIds && this.contentType ? false : true;
        } else if (param['version']) {
          let contentType = param['contentId'].split('-');
          contentType = contentType[1] == 'I' ? 'WI' : contentType[1] == 'G' ? 'GB' : contentType[1] == 'D' || contentType[1] == 'S' ? 'DS' : '';
          this.contentType = contentType || urlParam['contentType'] || this.contentType ||  '';
          this.version = param['version'] ? param['version'] : sessionStorage.getItem('version');
          this.id = param['contentId'] ? param['contentId'] : '';
          this.contentIds = param['contentId'] ? param['contentId'] : '';
          this.hasProperty = this.contentIds && this.contentType ? false : true;
        }
         else if (param['id']) {
          this.id = param['id'] ? param['id'] : '';
          this.contentType = param['documentType'] ? param['documentType'] : '';
        }

      });

      this.rservice.broadcast.subscribe(

       //(broadCastMessage1) => (this.broadCastMessage1 = broadCastMessage1)
       (broadCastMessage) => (this.broadCastMessage = broadCastMessage)

      );

    });
    if (this.contentIds.length > 0 || this.id > 0) {
      this.loadDesignData();
    }
    this.docTypeStatus = sessionStorage.getItem('documentWorkFlowStatus');
    if (this.docTypeStatus === null || this.docTypeStatus === '') {
      this.documentCreateStatus = true;
    }
  }

  loadContextInfo() {
    this.contextService.ContextInfo = this.getContextInfo();
  }

  getContextInfo() {
    const contextInfo: ContextInfo = new ContextInfo();
    contextInfo.entityInfo = 'Design Standards';
    return contextInfo;
  }

  onCheckinClick(value) {
    this.isCheckOut = value == 'checkin' ? false : true;
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
          this.loadDesignData();
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
    this.webContent = false;
    this.tablists = [];
    this.hasTabList = false;
    this.parenttitle = (this.globalData.title) ? this.globalData.title : (sessionStorage.getItem('title')) ? sessionStorage.getItem('title') : '';
    this.sourceUrl = (this.globalData.sourceDocUrl && this.globalData.sourceDocUrl != null) ? this.globalData.sourceDocUrl : (sessionStorage.getItem('docUrl')) ? sessionStorage.getItem('docUrl') : '';

    if (!value) {
      this.loading = true;
      this.previewDocument().subscribe(
          (res) => {
            //console.log("previewExtraction res", res);
            this.showTab = true;
            let IdValue = sessionStorage.getItem('documentId')
              ? sessionStorage.getItem('documentId')
              : this.globalData.id;
            this.documentViewService
              .previewContentType(IdValue, this.contentType)
              .subscribe(
                (res) => {
                  //console.log("previewContentType res", res);
                  this.tablists = res;
                  if (this.tablists.length > 0) {
                    this.hasTabList = this.tablists.length > 6 ? true : false;
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
      this.globalData.originalAssetStatusId = this.globalDataBuf.assetStatusId;
      this.globalData.originalAssetStatus = this.globalDataBuf.assetStatus;
      this.globalData.assetStatusId = 2;
      this.globalData.assetStatus = ASSET_STATUSES.PUBLISHED;
      this.globalData.pwStatus = 'Published';
      this.previewMode = true;
      this.webContent = true;
    } else {
      this.showTab = false;
      this.globalData.originalAssetStatusId = this.globalDataBuf.originalAssetStatusId;
      this.globalData.originalAssetStatus = this.globalDataBuf.originalAssetStatus;
      this.globalData.assetStatusId = this.globalDataBuf.originalAssetStatusId;
      this.globalData.assetStatus = this.globalDataBuf.originalAssetStatus;

    }
    this.globalData = JSON.parse(JSON.stringify(this.globalData));
    this.loadContextInfo();
  }

  openDoc() {
    this.sourceUrl = (this.globalData.sourceDocUrl && this.globalData.sourceDocUrl !== null) ? this.globalData.sourceDocUrl : (sessionStorage.getItem('docUrl')) ? sessionStorage.getItem('docUrl') : '';
    if (this.sourceUrl != '') {
      var url = 'ms-word:ofe|u|' + this.sourceUrl;
      window.location.href = url;
    }
  }
  handleApprovalAction(value) {
    this.globalData.assetStatusId = 2;
    this.globalData.assetStatus = ASSET_STATUSES.PUBLISHED;
    this.globalData.originalAssetStatus = ASSET_STATUSES.PUBLISHED;
    this.globalData.originalAssetStatusId = 2;
    this.hasApproved = true;
    this.updatedContentOwner = '';
    this.globalData = JSON.parse(JSON.stringify(this.globalData));
  }
  handleRequestAction(value) {
    this.updatedContentOwner = value;
    this.globalData.contentOwnerMail = value;
    this.globalData.contentOwnerId = value;
  }

  loadDesignData() {
    let docId;
    const documentcontentType = this.contentType;
    if ((this.id && this.id > 0) || sessionStorage.getItem('contentType') && sessionStorage.getItem('contentType').toLowerCase() != 'published'
    ) {
      docId = (this.id && this.id > 0) ? this.id : (sessionStorage.getItem('documentId')) ? sessionStorage.getItem('documentId') : 0;
      var documentcontentId = (this.contentIds && this.contentIds.length > 0) ? this.contentIds : sessionStorage.getItem('documentcontentId') ? sessionStorage.getItem('documentcontentId') : '0';
      var documentversion = sessionStorage.getItem('documentversion') ? sessionStorage.getItem('documentversion') : '0';
      var documentStatusDetails = 'draft';
    } else {
      docId = sessionStorage.getItem('documentId') ? sessionStorage.getItem('documentId') : '0';
      var documentcontentId = (this.contentIds && this.contentIds.length > 0) ? this.contentIds : sessionStorage.getItem('documentcontentId') ? sessionStorage.getItem('documentcontentId') : '0';
      var documentversion = (this.version) ? this.version : '0';
      var documentStatusDetails = sessionStorage.getItem('contentType') ? sessionStorage.getItem('contentType') : 'published';
    }

    const userEmail = sessionStorage.getItem('userMail');
    const url = this.router.url.split('/');
    var redirectionPath = sessionStorage.getItem('redirectUrlPath');
    this.loading = true;

    let userProfileDataObj = this.sharedService.getHeaderRequestedData();
    if (userProfileDataObj) {
      var headerRequestedData = this.contentCommonService.getUserProfileData(userProfileDataObj);
    } else {
      let userProfileDataObj = JSON.parse(sessionStorage.getItem('userProfileData'));
      var headerRequestedData = this.contentCommonService.getUserProfileData(userProfileDataObj);
    }
    this.loading = true;
    this.contentCommonService
      .getDocumentConentData(
        docId,
        documentcontentType || this.contentType,
        documentStatusDetails,
        documentcontentId,
        documentversion,
        userEmail
      )
      .subscribe((res) => {
        this.globalDataBuf = JSON.parse(JSON.stringify(res));
        this.globalData = res;
        console.log("Design-details", res);
       if (!this.isEditableMode) {
          this.parenttitle = (this.globalData.title) ? this.globalData.title : (sessionStorage.getItem('title')) ? sessionStorage.getItem('title') : '';
          this.sourceUrl = (this.globalData.sourceDocUrl && this.globalData.sourceDocUrl != null) ? this.globalData.sourceDocUrl : (sessionStorage.getItem('docUrl')) ? sessionStorage.getItem('docUrl') : '';
          this.loading = true;
            this.previewDocument().subscribe(
                (res) => {
                  console.log("ak 1previewExtraction res", res);
                  this.showTab = true;
                  let IdValue = sessionStorage.getItem('documentId')
                    ? sessionStorage.getItem('documentId')
                    : this.globalData.id;
                  this.documentViewService
                    .previewContentType(IdValue, this.contentType)
                    .subscribe(
                      (res) => {
                        console.log("ak previewContentType res", res);
                        this.tablists = res;
                        if (this.tablists.length > 0) {
                          this.hasTabList = this.tablists.length > 6 ? true : false;
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
              // this.previewMode = true;
              this.webContent = true;
              //this.globalData = JSON.parse(JSON.stringify(this.globalData));
        } else {

          this.loading = false;
        }
        this.sourceUrl = (this.globalData.sourceDocUrl && this.globalData.sourceDocUrl != null) ? this.globalData.sourceDocUrl : (sessionStorage.getItem('docUrl')) ? sessionStorage.getItem('docUrl') : '';
        this.globalData.originalAssetStatusId = this.globalData.assetStatusId;
        this.globalData.originalAssetStatus = this.globalData.assetStatus;
        let getStatusValue = this.globalData.pwStatus.toLowerCase().trim();
        this.globalData.contentStatus = this.globalData.originalAssetStatusId;
        this.title = this.globalData.title;
        this.globalDataBuf = JSON.parse(JSON.stringify(res));
        if (this.globalData.assetStatus === ASSET_STATUSES.PUBLISHED) {
          this.webContent = true;
          this.hasApproved = true;
        }
        this.globalData['contentType'] = this.contentType;
        if (this.broadCastMessage == 'true') {
          this.globalData.assetStatusId = 2;
          this.globalData.assetStatus = ASSET_STATUSES.PUBLISHED
          this.previewMode = true;
          this.webContent = true;
        }
        this.UsClassification = this.globalData.usClassification;
        this.loadContextInfo();
        this.showMenuActions = true;
      }, (error) => {
        this.dialog.closeAll();
        console.error('There was an error!', error);
        if (error.status == 403 && headerRequestedData == '') {
          this.authService.loginRedirect();
        } else if (error.status == 403) {
          alert('Restricted Content - Not Viewable By Current User!');
          this.loading = false;
          if (redirectionPath == 'search') {
            this.contentIds = (this.contentIds.length > 0) ? this.contentIds : (url[3]) ? url[3] : '';
            this.router.navigate(['_search'], {
              queryParams: { q: this.contentIds },
            });
          } else {
            this.router.navigate(['dashboard']);
          }
        }
        if (error.status == 404) {
          alert('Invalid Content ID - Content Not Found!');
          this.loading = false;
          if (redirectionPath == 'search') {
            this.contentIds = (this.contentIds.length > 0) ? this.contentIds : (url[3]) ? url[3] : '';
            this.router.navigate(['_search'], {
              queryParams: { q: this.contentIds },
            });
          } else {
            this.router.navigate(['dashboard']);
          }
        }
        this.loading = false;
      });
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
  updateContentOwnerValue(value) {
    const updatedValue = JSON.parse(value);
    this.globalData.contentOwnerId = updatedValue.contentOwnerId;
    this.globalDataBuf.contentOwnerId = updatedValue.contentOwnerId;
    this.globalData.contentOwnerMail = updatedValue.contentOwnerId;
    this.globalDataBuf.contentOwnerMail = updatedValue.contentOwnerId;
    this.globalData.revisionTypeId = updatedValue.revisionTypeId;
    this.globalDataBuf.revisionTypeId = updatedValue.revisionTypeId;
    //this.globalData = JSON.parse(JSON.stringify(this.globalData));
  }
  updateRequestAproval(value) {
    this.requestApprovalOption = value;
  }

  get isContentOwner() {
    return this.globalData?.contentOwnerId === sessionStorage.getItem('userMail');
  }

  get isEditableMode() {
    return this.globalData?.assetStatus !== ASSET_STATUSES.PUBLISHED && this.globalData?.assetStatus !== ASSET_STATUSES.CURRENT && this.globalData?.assetStatus !== ASSET_STATUSES.OBSOLETE && this.globalData?.assetStatus !== ASSET_STATUSES.APPROVED_WAITING_FOR_JC && this.globalData?.assetStatus !== ASSET_STATUSES.ARCHIVED && (this.globalData?.assetStatus !== ASSET_STATUSES.SUBMITTED_FOR_APPROVAL || this.isContentOwner);
  }

  previewDocument() {
    console.log('Preview document');
    if ( !this.previewDocument$ ) {
      this.previewDocument$ = this.documentViewService.previewExtraction(this.sourceUrl, this.parenttitle, this.contentType).pipe(
        tap(() => this.previewDocument$ = null),
        shareReplay(1)
      );
    }
    return this.previewDocument$;
  }
}
