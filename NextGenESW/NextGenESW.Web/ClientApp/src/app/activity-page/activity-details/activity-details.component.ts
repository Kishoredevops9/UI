import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { CreateDocumentService } from '@app/create-document/create-document.service';

import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PersistanceService } from '@app/shared/persistance.service';
import { ActivityPageService } from '@app/activity-page/activity-page.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store, select } from '@ngrx/store';
import { selectContentList } from '@app/reducers';
import { ContentListsState } from '@app/dashboard/content-list/content-list.reducer';
import { SharedService } from '@app/shared/shared.service';
import { HttpHelperService } from '@app/shared/http-helper.service';
import { ContextService } from '@app/shared/component/global-panel/context/context.service';
import { ContextInfo } from '@app/shared/component/global-panel/context/context.model';
import { GlobalService } from '@app/shared/component/global-panel/global.service';
import { variable } from '@angular/compiler/src/output/output_ast';
import { ContentCommonService } from '@app/shared/content-common.service';
import * as data from 'src/assets/data/progress-bar.json';
import { MsalService } from '@azure/msal-angular';
import { BaseContentDetailComponent } from '@app/shared/component/base-content-detail/base-content-detail.component';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { ASSET_STATUSES } from '@environments/constants';
@Component({
  selector: 'app-activity-details',
  templateUrl: './activity-details.component.html',
  styleUrls: ['./activity-details.component.scss'],
})
export class ActivityDetailsComponent extends BaseContentDetailComponent implements OnInit {
  ASSET_STATUSES = ASSET_STATUSES;
  @ViewChildren(MatTab) tabs;
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  id;
  contentNo;
  contentId: string = '';
  IsCheckOut: boolean = false;
  userMail;
  disableForm: boolean = false;
  isEditableMode: boolean = true;

  loading: boolean = false;
  contentCollaboration;
  hasProperty: any = true;
  title: string;
  type: string;
  checkOut: any;
  showCheckBtns: boolean = true;
  contentType: string = 'AP';
  globalData: any;
  docStatus = ASSET_STATUSES.CURRENT;;
  showMenuActions = false;
  previewMode: boolean = false;
  globalDataBuf: any;
  isApprove: boolean = false;
  hasPublished: boolean = false;
  updatedContentOwner: string = '';
  documentCreateStatus: boolean;
  docTypeStatus: string;
  propertiesLastUpdateDateTime: '';
  docPreiewStatus = 0;
  UsJurisdiction: any;
  UsClassification: any;
  showExternalWI: boolean = false;
  requestApprovalOption: boolean = false;
  showSubMenuActions: boolean = false;
  isLoading: boolean = false;
  version: string;
  status: string;
  prograssBarStatus:any;
  parentData:any;
  titleName;
  constructor(
    private dialog: MatDialog,
    protected route: ActivatedRoute,
    private profileData: PersistanceService,
    private activityPageService: ActivityPageService,
    private _snackBar: MatSnackBar,
    private store: Store<ContentListsState>,
    protected sharedService: SharedService,
    private helper: HttpHelperService,
    private contextService: ContextService,
    protected router: Router,
    private contentCommonService: ContentCommonService,
    private globalService: GlobalService,
    private authService: MsalService,
  ) {
    super(router, route, sharedService);
    //this.id = this.sharedService.getData;
    this.sharedService.titleName.subscribe((uname) => {
      this.titleName = uname;
    });

  }

  progressBar: any = (data as any).default;

  ngOnInit(): void {
    this.route.params.subscribe((param) => {
      //console.log("param activity details", param);
      this.route.queryParams.subscribe(urlParam => {
        let contentType;
        if (urlParam && urlParam['id'] && urlParam['id'] > 0) {
          this.id = (urlParam['id'] && urlParam['id'] > 0) ? urlParam['id'] : 0;
          this.contentType = (urlParam['contentType']) ? urlParam['contentType'] : 'KP';
          this.version = (urlParam['version']) ? urlParam['version'] : sessionStorage.getItem('version');
          this.status = (urlParam['status']) ? urlParam['status'].toLowerCase() : 'draft';
          this.contentId = param['contentId'] ? param['contentId'] : '';
          this.hasProperty = (this.id && this.id > 0) ? false : true;
        } else if (param['contentId']) {
          contentType = param['contentId'].split('-');
          contentType = contentType[1] == 'A' ? 'AP' : 'AP';
          this.version = param['version'] ? param['version'] : sessionStorage.getItem('version');
          this.id = param['id'] ? param['id'] : param['contentId'] ? param['contentId'] : '';
          this.contentId = param['id'] ? param['id'] : param['contentId'] ? param['contentId'] : '';
          this.contentType = contentType;
          this.hasProperty = this.id && this.id.length > 0 ? false : true;
        } else if (param['id']) {
          this.id = param['id'] ? param['id'] : '';
          this.hasProperty = isNaN(this.id);
        }
      });
    });
    if (this.contentId.length > 0 || this.id > 0) {
      this.loadActivityPageData();
    } else {
      this.type = 'AP';
      sessionStorage.setItem('statusCheck', 'false');
    }
    this.sharedService.setNextTab(false);
    this.docTypeStatus = sessionStorage.getItem('documentWorkFlowStatus');

    if (this.docTypeStatus === null || this.docTypeStatus === '') {
      this.documentCreateStatus = true;
    }
    this.contextService.getContextInfo.subscribe((context) => {
      const contextInfo = context;
      if (contextInfo.activityContent) {
        this.loadData(contextInfo.activityContent);
      }
    });

  }

  // ngOnChanges(){
  //   receiveDragDropData(p) {
  //     this.parentData = p;
  //   }
  // }
  loadData(value) {
    this.globalData.content.forEach(el => {
      if (el.activityContainerId == value.activityContainerId) {
        el.guidance = value.guidance;
      }
    })
  }
  loadContextInfo() {
    this.contextService.ContextInfo = this.getContextInfo();
  }

  setTitle(title) {
    this.title = title;
  }

  nextTab(redirect) {
    if (redirect) {
      this.selectedIndex = this.selectedIndex + 1;
    }
  }

  getContextInfo() {
    const contextInfo: ContextInfo = new ContextInfo();
    contextInfo.entityInfo = this.globalData;
    contextInfo.entityId = this.id;
    return contextInfo;
  }

  handleOnPreviewClick(value) {
    super.handleOnPreviewClick(value);
    this.isEditableMode = (this.isEditableMode) ? false:true;
    console.log('handleOnPreviewClick', this.isEditableMode);
    this.sharedService.apDragDropData(this.isEditableMode);
    this.isLoading = true;
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
    this.globalData = JSON.parse(JSON.stringify(this.globalData)); // Uncomment this to change reference of globalData then it will trigger onChanges on child compoonents.
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
          this.loadActivityPageData();
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
    if (this.globalDataBuf.generalGuidance) {
      var result = JSON.parse(this.globalDataBuf.generalGuidance);
      this.globalDataBuf.wiGuidence = result.WorkInstructionGuidance;
      this.globalDataBuf.cgGuidence = result.CriteriaGuidance;
    }
    if (value) {
      this.loading = true;
      this.activityPageService.GateAPSaveAsData(this.globalDataBuf).subscribe(
        (res) => {
          this.loading = false;
          this.globalData = res;
          this.globalData['originalAssetStatusId'] = res['assetStatusId'];
          this.globalData['originalAssetStatus'] = res['assetStatus'];
          this.router.navigate(['/activity-page', res['id']]);
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
    if (this.globalDataBuf.generalGuidance) {
      var result = JSON.parse(this.globalDataBuf.generalGuidance);
      this.globalDataBuf.wiGuidence = result.WorkInstructionGuidance;
      this.globalDataBuf.cgGuidence = result.CriteriaGuidance;
    }
    if (value) {
      this.loading = true;
      this.activityPageService.GetAPRevisionData(this.globalDataBuf).subscribe(
        (res) => {
          this.globalData = res;
          this.globalData['originalAssetStatusId'] = res['assetStatusId'];
          this.globalData['originalAssetStatus'] = res['assetStatus'];
          this.router.navigate(['/activity-page', res['id']]);
          this.loading = false;
        },
        (data) => {
          this.loading = false;
          console.error('There was an error!', data);
          const errorMsg = 'content has already been revised'; // error code is not unique so comparing the error message
          if (data.error.error.message.toLocaleLowerCase().includes(errorMsg)) {
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

  loadActivityPageData() {
    if (this.sharedService.getNextTab()) {
      let redirect = this.sharedService.getNextTab();
      this.nextTab(redirect);
    }

    if ((this.id && this.id > 0) || (sessionStorage.getItem('contentType') && sessionStorage.getItem('contentType').toLowerCase() != 'published')) {
      this.contentNo = (this.id && this.id > 0) ? this.id : sessionStorage.getItem('documentId') ? sessionStorage.getItem('documentId') : 0;
      var documentcontentId = (this.contentId && this.contentId.length > 0) ? this.contentId : sessionStorage.getItem('documentcontentId') ? sessionStorage.getItem('documentcontentId') : '0';
      var documentversion = this.version ? this.version : '0';;
      var documentStatusDetails = (this.status) ? this.status : sessionStorage.getItem('documentStatusDetails') ? sessionStorage.getItem('documentStatusDetails').toLowerCase() : 'draft';
      var documentcontentType = this.contentType;
    } else {
      this.contentNo = (this.id && this.id > 0) ? this.id : sessionStorage.getItem('documentId') ? sessionStorage.getItem('documentId') : 0;
      var documentcontentId = (this.contentId && this.contentId.length > 0) ? this.contentId : sessionStorage.getItem('contentNumber') ? sessionStorage.getItem('contentNumber') : '0';
      var documentversion = this.version ? this.version : '0';;
      var documentStatusDetails = sessionStorage.getItem('contentType') ? sessionStorage.getItem('contentType').toLowerCase() : 'published';
      var documentcontentType = this.contentType;
    }

    let statusCheck = sessionStorage.getItem('statusCheck');
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
        .getActivityPageData(
          this.contentNo,
          documentcontentType,
          documentStatusDetails,
          documentcontentId,
          documentversion,
          userEmail
        )
        .subscribe(
          (res) => {
            this.loading = false;
            // if (res['assetStatusId'] == 4 || res['assetStatusId'] == 6) {
            //   //res['originalAssetStatusId'] = 2;
            //   res['assetStatusId'] = 2;
            // }
            if (res['assetStatus'] === ASSET_STATUSES.APPROVED_WAITING_FOR_JC) {
              // res['originalAssetStatusId'] = 2;
              // res['assetStatusId'] = 2;
              // res['assetStatus'] = ASSET_STATUSES.PUBLISHED;
              this.showSubMenuActions = false;
            } else {
              this.showSubMenuActions = true;
            }
            this.prograssBarStatus = res['assetStatus'] || sessionStorage.getItem('documentWorkFlowStatus');
            const data = JSON.parse(JSON.stringify(res));
            this.title = data.title;
            this.showMenuActions = true;
            if (data.assetTypeId === 1) {
              data.contentType = 'WI';
            } else if (data.assetTypeId === 2) {
              data.contentType = 'CD';
            } else if (data.assetTypeId === 6) {
              data.contentType = 'AP';
            } else if (data.assetTypeId === 5) data.contentType = 'RD';
            this.globalDataBuf = JSON.parse(JSON.stringify(res));
            this.globalData = data;
            this.globalData.originalAssetStatusId = this.globalData.assetStatusId;
            this.globalData.originalAssetStatus = this.globalData.assetStatus;
            this.globalData.contentStatus = data.assetStatusId;
            this.type = 'AP';
            this.hasPublished = this.globalData.assetStatus === ASSET_STATUSES.PUBLISHED || this.globalData.assetStatus == ASSET_STATUSES.ARCHIVED || this.globalData.assetStatus === ASSET_STATUSES.CURRENT || this.globalData.assetStatus === ASSET_STATUSES.OBSOLETE || this.globalData.assetStatus === ASSET_STATUSES.APPROVED_WAITING_FOR_JC || (this.globalData.assetStatus === ASSET_STATUSES.SUBMITTED_FOR_APPROVAL && this.globalData.contentOwnerId !== userEmail);
            var globalContentId = this.globalData.contentId;
            var splittedValues = globalContentId.split('-')[2];
            var contentId = Number(
              splittedValues.slice(splittedValues.length - 5)
            );
            // this.showExternalWI = contentId < 10000;
            this.loadContextInfo();
            this.loading = false;
            this.UsJurisdiction = data.usJurisdiction;
            this.UsClassification = data.usClassification;
          },
          (error) => {
            this.dialog.closeAll();
            console.error('There was an error!', error);
            if (error.status == 403 && headerRequestedData == '') {
              this.authService.loginRedirect();
            } else if (error.status == 403) {
              alert('Restricted Content - Not Viewable By Current User!');
              this.loading = false;
              if (redirectionPath == 'search') {
                this.router.navigate(['_search'], {
                  queryParams: { q: this.id },
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
                  queryParams: { q: this.id },
                });
              } else {
                this.router.navigate(['dashboard']);
              }
            }
            this.loading = false;
          }
        );
    }
  }
  updatePurposeField(updatedObj) {
    this.globalData.purpose = updatedObj.purpose;
    this.propertiesLastUpdateDateTime = updatedObj.propertiesLastUpdateDateTime;
  }
  ngOnDestroy() {
    sessionStorage.removeItem('documentversion');
    sessionStorage.removeItem('documentId');
    sessionStorage.removeItem('documentcontentType');
    sessionStorage.removeItem('documentStatusDetails');
    sessionStorage.removeItem('documentcontentId');
    sessionStorage.removeItem('contentNumber');
    sessionStorage.removeItem('componentType');
    sessionStorage.removeItem('redirectUrlPath');
    sessionStorage.removeItem('statusCheck');
    sessionStorage.removeItem('contentType');
    sessionStorage.removeItem('documentversion');
    sessionStorage.removeItem('title');
    sessionStorage.removeItem('documentWorkFlowStatus');
  }
  updateLastModifiedDate(value) {
    this.propertiesLastUpdateDateTime = value;
    this.loadActivityPageData();
  }
  updateGeneralGuidanceField(obj) {
    this.propertiesLastUpdateDateTime = obj.propertiesLastUpdateDateTime;
    this.globalData.wiGuidence = obj.wiGuidence;
    this.globalData.cgGuidence = obj.cgGuidence;
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
  updateLessonLearned(data) {
    this.globalData.lessonLearned = JSON.parse(data);
    this.globalDataBuf.lessonLearned = JSON.parse(data);
  }
  updateNocData(data) {
    this.globalData.natureOfChange = JSON.parse(data);
    this.globalDataBuf.natureOfChange = JSON.parse(data);
  }
  updateRequestAproval(value) {
    this.requestApprovalOption = value;
  }
}
