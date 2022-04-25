import { Component, OnInit, Output, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivityPageService } from '@app/activity-page/activity-page.service';
import { ContextInfo } from '@app/shared/component/global-panel/context/context.model';
import { ContextService } from '@app/shared/component/global-panel/context/context.service';
import { GlobalService } from '@app/shared/component/global-panel/global.service';
import { RelatedContentService } from '../related-content.service';
import { SharedService } from '@app/shared/shared.service';
import { ContentCommonService } from '@app/shared/content-common.service';
import { ThisReceiver } from '@angular/compiler';
import * as data from 'src/assets/data/progress-bar.json';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MsalService } from '@azure/msal-angular';
import { EventEmitter } from 'stream';
import { BaseContentDetailComponent } from '@app/shared/component/base-content-detail/base-content-detail.component';
import { ASSET_STATUSES } from '@environments/constants';
import { MatTab, MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-related-content-details',
  templateUrl: './related-content-details.component.html',
  styleUrls: ['./related-content-details.component.scss'],
})
export class RelatedContentDetailsComponent extends BaseContentDetailComponent implements OnInit {
  ASSET_STATUSES = ASSET_STATUSES;
  @ViewChildren(MatTab) tabs;
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  hasPublished: boolean = false;
  contentType: string = 'RC';
  loading: boolean = false;
  title: string = '';
  id: any;
  contentNo;
  contentId: string = '';
  globalData;
  ContentId: number;
  CId: number;
  hasProperty: any = false;
  isApprove: boolean = false;
  previewMode: boolean = false;
  globalDataBuf: any;
  showMenuActions: boolean = false;
  updatedContentOwner: string = '';
  propertiesLastUpdateDateTime: '';

  documentCreateStatus: boolean;
  docTypeStatus: string;
  UsJurisdiction: any;
  UsClassification: any;
  progressBar: any = (data as any).default;
  requestApprovalOption: boolean = false;
  showSubMenuActions: boolean = false;
  version: string;
  status: string;
  prograssBarStatus:any;
  handleContentOwnerValue;
  constructor(
    protected route: ActivatedRoute,
    private activityPageService: ActivityPageService,
    private contextService: ContextService,
    private globalService: GlobalService,
    private relatedContentService: RelatedContentService,
    protected router: Router,
    protected sharedService: SharedService,
    private contentCommonService: ContentCommonService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private authService: MsalService,
  ) {
    super(router, route, sharedService);
  }

  ngOnInit(): void {
    sessionStorage.removeItem('title');
    this.route.params.subscribe((param) => {
      //console.log("related content details param", param);
      this.route.queryParams.subscribe(urlParam => {
        let contentType;
        if (urlParam && urlParam['id'] && urlParam['id'] > 0) {
          this.id = (urlParam['id'] && urlParam['id'] > 0) ? urlParam['id'] : 0;
          this.contentType = (urlParam['contentType']) ? urlParam['contentType'] : 'KP';
          this.version = this.version || ((urlParam['version']) ? urlParam['version'] : '0');
          this.status = (urlParam['status']) ? urlParam['status'].toLowerCase() : 'draft';
          this.contentId = param['contentId'] ? param['contentId'] : '';
          this.hasProperty = (this.id && this.id > 0) ? false : true;
        } else if (param['contentId']) {
          contentType = param['contentId'].split('-');
          contentType = contentType[1] == 'R' ? 'RC' : 'RC';
          this.id = param['contentId'] ? param['contentId'] : '';
          this.contentId = param['contentId'] ? param['contentId'] : '';
          this.version = this.version || (param['version'] ? param['version'] : sessionStorage.getItem('version'));
          this.contentType = contentType;
          this.hasProperty = this.id && this.id.length > 0 ? false : true;
        }else if (param['id']) {
          this.id = param['id'] ? param['id'] : 0;
          this.hasProperty = isNaN(this.id);
        } else {
          this.hasProperty = isNaN(this.id);
        }
      });
    });
    if (this.contentId.length > 0 || this.id > 0) {
      this.loadRelatedContentData();
    } else {
      sessionStorage.setItem('statusCheck', 'false');
    }

    this.sharedService.setNextTab(false);
    this.docTypeStatus = sessionStorage.getItem('documentWorkFlowStatus');
    if (this.docTypeStatus === null || this.docTypeStatus === '') {
      this.documentCreateStatus = true;
    }
  }

  updatePurposeField(updatedObj) {
    this.globalData.purpose = updatedObj.purpose;
    this.propertiesLastUpdateDateTime = updatedObj.propertiesLastUpdateDateTime;
  }

  loadContextInfo() {
    this.contextService.ContextInfo = this.getContextInfo();
  }
  getContextInfo() {
    const contextInfo: ContextInfo = new ContextInfo();
    contextInfo.entityInfo = this.globalData;
    contextInfo.entityId = this.id;
    return contextInfo;
  }

  nextTab(redirect) {
    if (redirect) {
      this.title = sessionStorage.getItem('title');
      this.selectedIndex = this.selectedIndex + 1;
    }
  }
  handleApprovalAction(value) {
    this.globalData.assetStatusId = 2;
    this.globalData.originalAssetStatusId = 2;
    this.globalData.assetStatus = ASSET_STATUSES.PUBLISHED;
    this.globalData.originalAssetStatus = ASSET_STATUSES.PUBLISHED;
    this.hasPublished = true;
    this.updatedContentOwner = '';
    this.globalData = JSON.parse(JSON.stringify(this.globalData));
  }
  handleOnPreviewClick(value) {
    super.handleOnPreviewClick(value);
    if (value) {
      this.globalData.originalAssetStatusId = this.globalDataBuf.originalAssetStatusId;
      this.globalData.originalAssetStatus = this.globalDataBuf.originalAssetStatus;
      this.globalData.assetStatusId = this.globalDataBuf.originalAssetStatusId;
      this.globalData.assetStatus = this.globalDataBuf.originalAssetStatus;
      this.hasPublished = false;
      this.previewMode = false;
    } else {
      this.globalData.originalAssetStatusId = this.globalDataBuf.assetStatusId;
      this.globalData.originalAssetStatus = this.globalDataBuf.assetStatus;
      this.globalData.assetStatusId = 2;
      this.globalData.assetStatus = ASSET_STATUSES.PUBLISHED;
      this.hasPublished = true;
      this.previewMode = true;
    }

    this.globalData = JSON.parse(JSON.stringify(this.globalData));
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
          this.loadRelatedContentData();
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
    this.globalDataBuf.author = userEmail;
    if (value) {
      this.loading = true;
      this.relatedContentService
        .GetRelatedContentID(this.globalDataBuf)
        .subscribe(
          (res) => {
            this.globalData = res;
            this.globalData['originalAssetStatusId'] = res['assetStatusId'];
            this.globalData['originalAssetStatus'] = res['assetStatus'];
            this.router.navigate(['/related-content', res['id']]);
            sessionStorage.setItem('documentWorkFlowStatus', 'Draft');
            this.loading = false;
          },
          (error) => {
            this.loading = false;
            console.error('There was an error!', error);
          }
        );
    }
  }
  handleOnRevisionClick(value) {
    const userEmail = sessionStorage.getItem('userMail');
    this.globalDataBuf.author = userEmail;
    if (value) {
      this.loading = true;
      this.relatedContentService
        .GetRelatedContentRevisionData(this.globalDataBuf)
        .subscribe(
          (res) => {
            this.globalData = res;
            this.globalData['originalAssetStatusId'] = res['assetStatusId'];
            this.globalData['originalAssetStatus'] = res['assetStatus'];
            this.router.navigate(['/related-content', res['id']]);
            this.loading = false;
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
          }
        );
    }
  }
  handleRequestAction(value) {
    this.updatedContentOwner = value;
    this.globalData.contentOwnerMail = value;
    this.globalData.contentOwnerId = value;
  }

  loadRelatedContentData() {
    if (this.sharedService.getNextTab()) {
      let redirect = this.sharedService.getNextTab();
      this.nextTab(redirect);
    }

    if ((this.id && this.id > 0) || (sessionStorage.getItem('contentType') && sessionStorage.getItem('contentType').toLowerCase() != 'published')) {
      this.contentNo = (this.id && this.id > 0) ? this.id : sessionStorage.getItem('documentId') ? sessionStorage.getItem('documentId') : 0;
      var documentcontentId = (this.contentId && this.contentId.length > 0) ? this.contentId : sessionStorage.getItem('documentcontentId') ? sessionStorage.getItem('documentcontentId') : '0';
      var documentversion = (this.version) ? this.version : sessionStorage.getItem('documentversion') ? sessionStorage.getItem('documentversion') : '0';
      var documentStatusDetails = (this.status) ? this.status : sessionStorage.getItem('documentStatusDetails') ? sessionStorage.getItem('documentStatusDetails').toLowerCase() : 'draft';
      var documentcontentType = this.contentType;
    } else {
      this.hasPublished = true;
      this.contentNo = (this.id && this.id > 0) ? this.id : sessionStorage.getItem('documentId') ? sessionStorage.getItem('documentId') : 0;
      var documentcontentId = (this.contentId && this.contentId.length > 0) ? this.contentId : sessionStorage.getItem('contentNumber');
      var documentversion = this.version || '0';
      var documentStatusDetails = sessionStorage.getItem('contentType') ? sessionStorage.getItem('contentType') : 'published';
      var documentcontentType = this.contentType;
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

    if (this.id) {
      this.contentCommonService
        .getRelatedContentData(
          this.contentNo,
          documentcontentType,
          documentStatusDetails,
          documentcontentId,
          documentversion,
          userEmail
        )
        .subscribe(
          (res) => {

            console.log(":::::::::::::::::")
            console.log(res)


            this.showMenuActions = true;
            this.title = res['title'];
            if (res['assetStatusId'] == 4 && res['assetStatus']!= ASSET_STATUSES.APPROVED_WAITING_FOR_JC ) {
              // res['originalAssetStatusId'] = 2;
              // res['assetStatusId'] = 2;
              // res['originalAssetStatus'] = ASSET_STATUSES.PUBLISHED;
              // res['assetStatus'] = ASSET_STATUSES.PUBLISHED;
              this.showSubMenuActions = false;
            } else {
              this.showSubMenuActions = true;
            }

            this.prograssBarStatus = res['assetStatus'];
            this.globalDataBuf = JSON.parse(JSON.stringify(res));
            this.globalData = res;
            this.globalData['contentType'] = this.contentType;
            this.globalData.contentStatus = this.globalData.assetStatusId;
            this.globalData.contentStatus = this.globalData.assetStatus;
            this.globalData.originalAssetStatusId = this.globalData.assetStatusId;
            this.globalData.originalAssetStatus = this.globalData.assetStatus;
            this.ContentId = this.globalData.id;
            this.CId = this.globalData.id;
            this.UsJurisdiction = this.globalData.usJurisdiction;
            this.UsClassification = this.globalData.usClassification;
            this.hasPublished = this.globalData.assetStatus === ASSET_STATUSES.PUBLISHED || this.globalData.assetStatus == ASSET_STATUSES.ARCHIVED || this.globalData.assetStatus === ASSET_STATUSES.CURRENT || this.globalData.assetStatus === ASSET_STATUSES.OBSOLETE || this.globalData.assetStatus === ASSET_STATUSES.APPROVED_WAITING_FOR_JC || (this.globalData.assetStatus === ASSET_STATUSES.SUBMITTED_FOR_APPROVAL && this.globalData.contentOwnerId !== userEmail);
            this.loadContextInfo();
            this.loading = false;
            sessionStorage.removeItem('documentcontentType');
            sessionStorage.removeItem('documentStatusDetails');
            sessionStorage.removeItem('documentversion');
            sessionStorage.removeItem('documentcontentId');
          },
          (error) => {
            this.loading = false;
            this.dialog.closeAll();
            console.error('There was an error!', error);
            if (error.status == 403 && headerRequestedData == '') {
              this.authService.loginRedirect();
            } else if (error.status == 403) {
              alert('Restricted Content - Not Viewable By Current User!');
              this.loading = false;
              if (redirectionPath == 'search') {
                this.router.navigate(['_search'], {
                  queryParams: { q: url[2] },
                });
              } else {
                this.router.navigate(['dashboard']);
              }
            }
            if (error.status == 404) {
              alert('Invalid Content ID - Content Not Found!');
              this.loading = false;
              if (redirectionPath == 'search') {
                this.router.navigate(['_search'], {
                  queryParams: { q: url[2] },
                });
              } else {
                this.router.navigate(['dashboard']);
              }
            }

          }
        );
    }
  }
  ngOndestroy() {
    sessionStorage.removeItem('documentversion');
    sessionStorage.removeItem('documentId');
    sessionStorage.removeItem('documentcontentType');
    sessionStorage.removeItem('documentStatusDetails');
    sessionStorage.removeItem('documentcontentId');
    sessionStorage.removeItem('documentcurrentUserEmail');
    sessionStorage.removeItem('contentNumber');
    sessionStorage.removeItem('componentType');
    sessionStorage.removeItem('redirectUrlPath');
    sessionStorage.removeItem('statusCheck');
    sessionStorage.removeItem('contentType');
    sessionStorage.removeItem('documentversion');
    sessionStorage.removeItem('title');
    sessionStorage.removeItem('documentWorkFlowStatus');
  }
  updateRCFile(updatedObj) {
    this.globalData.relatedContentInformation = [];
    this.globalData.relatedContentInformation = updatedObj;
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
    this.handleContentOwnerValue = this.globalData;
  }
  updateNocData(data) {
    this.globalData.natureOfChange = JSON.parse(data);
    this.globalDataBuf.natureOfChange = JSON.parse(data);
  }
  updateRequestAproval(value) {
    this.requestApprovalOption = value;
  }
}
