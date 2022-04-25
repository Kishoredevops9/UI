import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { Store } from '@ngrx/store';
import { ContentListsState } from '@app/dashboard/content-list/content-list.reducer';
import { ActivatedRoute, Router } from '@angular/router';
import { CriteriaGroupPageService } from '../criteria-group.service';
import { HttpHelperService } from '@app/shared/http-helper.service';
import { ContextService } from '@app/shared/component/global-panel/context/context.service';
import { ContextInfo } from '@app/shared/component/global-panel/context/context.model';
import { GlobalService } from '@app/shared/component/global-panel/global.service';
import { MatDialog } from '@angular/material/dialog';
import { SharedService } from '@app/shared/shared.service';
import { ContentCommonService } from '@app/shared/content-common.service';
import { AdminService } from '@app/admin/admin.service';
import { ActivityPageService } from '@app/activity-page/activity-page.service';
import * as data from 'src/assets/data/progress-bar.json';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MsalService } from '@azure/msal-angular';
import { BaseContentDetailComponent } from '@app/shared/component/base-content-detail/base-content-detail.component';
import { ASSET_STATUSES } from '@environments/constants';
import { MatTab, MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-criteria-details',
  templateUrl: './criteria-details.component.html',
  styleUrls: ['./criteria-details.component.scss'],
})
export class CriteriaDetailsComponent extends BaseContentDetailComponent implements OnInit {
  @ViewChildren(MatTab) tabs;
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  loading = false;
  id;
  contentNo;
  contentId: string = '';
  title: string;
  type: string = 'CG';
  isCheckOut: Boolean = true;
  contentType: string = 'CG';
  docStatus = 1;
  docPreiewStatus = 0;
  globalData: any;
  showMenuActions = false;
  dropDownList;
  previewMode: boolean = false;
  hasPublished: any = false;
  globalDataBuf: any;
  hasProperty: any = true;
  isFormDirty: boolean = false;
  prevSelectedIndex: number = 0;
  updatedContentOwner: string = '';
  docTypeStatus: string = '';
  documentCreateStatus: boolean;
  tooltip: any;
  propertiesLastUpdateDateTime: any;
  UsJurisdiction: any;
  UsClassification: any;
  progressBar: any = (data as any).default;
  requestApprovalOption: boolean = false;
  version: any;
  status: string;
  prograssBarStatus:any;
  documentversion:any
  constructor(
    protected route: ActivatedRoute,
    private store: Store<ContentListsState>,
    private criteriaGroupService: CriteriaGroupPageService,
    private helper: HttpHelperService,
    private contextService: ContextService,
    protected router: Router,
    private globalService: GlobalService,
    private contentCommonService: ContentCommonService,
    private dialog: MatDialog,
    public AdminService: AdminService,
    protected sharedService: SharedService,
    private _snackBar: MatSnackBar,
    private authService: MsalService,
    private activityPageService: ActivityPageService,
  ) {
    super(router, route, sharedService);
  }

  ngOnInit(): void {
    this.route.params.subscribe((param) => {
      this.route.queryParams.subscribe(urlParam => {
        let contentType;
        if (urlParam && urlParam['id'] && urlParam['id'] > 0) {
          this.id = (urlParam['id'] && urlParam['id'] > 0) ? urlParam['id'] : 0;
          this.contentType = (urlParam['contentType']) ? urlParam['contentType'] : 'KP';
          this.version = (urlParam['version']) ? urlParam['version'] : sessionStorage.getItem('version');
          this.status = (urlParam['status']) ? urlParam['status'].toLowerCase() : 'draft';
          this.contentId = param['contentId'] ? param['contentId'] : '';
          this.hasProperty = (this.id && this.id > 0) ? false : true;
        }else if (param['version']) {
          contentType = param['contentId'].split('-');
          contentType = contentType[1] == 'C' ? 'CG' : 'CG';
          this.id = param['contentId'] ? param['contentId'] : '';
          this.contentId = param['contentId'] ? param['contentId'] : '';
          this.version = param['version'] ? param['version'] : sessionStorage.getItem('version');
          this.contentType = contentType;
          this.hasProperty = this.id && this.id.length > 0 ? false : true;
        }
         else if (param['contentId']) {
          contentType = param['contentId'].split('-');
          contentType = contentType[1] == 'C' ? 'CG' : 'CG';
          this.id = param['contentId'] ? param['contentId'] : '';
          this.contentId = param['contentId'] ? param['contentId'] : '';
          this.version = param['version'] ? param['version'] : sessionStorage.getItem('version');
          this.contentType = contentType;
          this.hasProperty = this.id && this.id.length > 0 ? false : true;
        } else if (param['id']) {
          this.id = param['id'] ? param['id'] : '';
          this.hasProperty = isNaN(this.id);
        }
      });
    });

    if (this.contentId.length > 0 || this.id > 0) {
      this.loadCriteriaData();
    } else {
      this.type = 'CG';
      sessionStorage.setItem('statusCheck', 'false');
      this.previewMode = false;
      this.hasPublished = false;
    }
    this.sharedService.setNextTab(false);

    this.docTypeStatus = sessionStorage.getItem('documentWorkFlowStatus');

    if (this.docTypeStatus === null || this.docTypeStatus === '') {
      this.documentCreateStatus = true;
    }

    this.AdminService.getAllToolTip().subscribe((data) => {
      this.tooltip = data;
      setTimeout(() => {
        this.setToolTip();
        //console.log("Tooltip Added")
      }, 1000);
    });
  }

  setToolTip() {
    this.tooltip.forEach((element) => {
      var tid = element.tokenId.toString();
      let selector = document.querySelector("*[data-tooltip='" + tid + "']");
      if (selector) {
        selector.setAttribute('tooltip', element.description);
        selector.setAttribute('ng-reflect-tooltip-value', element.description);
      }
    });
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

  onTabClick(event, requestApprovalTemplate) {
    this.onTabChanged(event);
    if ( this.isFormDirty ) {
      this.selectedIndex = this.prevSelectedIndex;
      const dialogRef = this.dialog.open(requestApprovalTemplate, {
        width: '42%',
        disableClose: true,
        panelClass: 'custom-dialog-container',
      });
    } else if (!this.isFormDirty) {
      this.prevSelectedIndex = event.index;
      this.selectedIndex = event.index;
    }

    console.log('Tab Change');
    this.setToolTip();
  }
  onCheckinClick(value) {
    this.isCheckOut = value == 'checkin' ? false : true;
  }
  nextTab(redirect) {
    if (redirect) {
      this.selectedIndex = this.selectedIndex + 1;
    }
  }
  classifierDropDownList(value) {
    this.dropDownList = value;
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
          this.loadCriteriaData();
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
      this.criteriaGroupService
        .GetContentID(this.globalDataBuf)
        .subscribe((res) => {
          this.globalData = res;
          this.globalData['readMode'] = true;
          this.router.navigate(['criteria-group', res['id']]);
          this.loading = false;
        });
    }
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

  handleOnRevisionClick(value) {
    const userEmail = sessionStorage.getItem('userMail');
    this.globalDataBuf.author = userEmail;
    if (value) {
      this.loading = true;
      this.criteriaGroupService
        .GetRevisionData(this.globalDataBuf)
        .subscribe((res) => {
          this.globalData = res;
          this.globalData['readMode'] = true;
          this.router.navigate(['criteria-group', res['id']]);
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
          });
    }
  }
  handleApprovalAction(value) {
    this.globalData.assetStatusId = 2;
    this.globalData.originalAssetStatusId = 2;
    this.globalData.originalAssetStatus =  ASSET_STATUSES.PUBLISHED;
    this.globalData.assetStatus =  ASSET_STATUSES.PUBLISHED;
    this.hasPublished = true;
    this.updatedContentOwner = '';
    this.globalData = JSON.parse(JSON.stringify(this.globalData));
  }
  handleRequestAction(value) {
    this.updatedContentOwner = value;
    this.globalData.contentOwnerMail = value;
    this.globalData.contentOwnerId = value;
  }
  loadCriteriaData() {
    if (this.sharedService.getNextTab()) {
      let redirect = this.sharedService.getNextTab();
      this.nextTab(redirect);
    }

    let statusCheck = sessionStorage.getItem('statusCheck');
    const userEmail = sessionStorage.getItem('userMail');
    const url = this.router.url.split('/');

    if ((this.id && this.id > 0) || (sessionStorage.getItem('contentType') && sessionStorage.getItem('contentType').toLowerCase() != 'published')) {
      this.contentNo = (this.id && this.id > 0) ? this.id : sessionStorage.getItem('documentId') ? sessionStorage.getItem('documentId') : 0;
      var documentcontentId = (this.contentId && this.contentId.length > 0) ? this.contentId : sessionStorage.getItem('documentcontentId') ? sessionStorage.getItem('documentcontentId') : '0';
      this.documentversion = this.version ? this.version : '0';
      var documentStatusDetails = (this.status) ? this.status : sessionStorage.getItem('documentStatusDetails') ? sessionStorage.getItem('documentStatusDetails') : 'draft';
      var documentcontentType = this.contentType;
    } else {
      this.contentNo = sessionStorage.getItem('documentId') ? sessionStorage.getItem('documentId') : 0;
      var documentcontentId = this.contentId && this.contentId.length > 0 ? this.contentId : sessionStorage.getItem('contentNumber') ? sessionStorage.getItem('contentNumber') : '0';
      this.documentversion = this.version ? this.version : '0';
      var documentStatusDetails = sessionStorage.getItem('contentType') ? sessionStorage.getItem('contentType') : 'published';
      var documentcontentType = this.contentType;
    }

    var redirectionPath = sessionStorage.getItem('redirectUrlPath');
    this.loading = true;

    let userProfileDataObj = this.sharedService.getHeaderRequestedData();
    if (userProfileDataObj) {
      var headerRequestedData = this.contentCommonService.getUserProfileData(userProfileDataObj);
    } else {
      let userProfileDataObj = JSON.parse(sessionStorage.getItem('userProfileData'));
      var headerRequestedData = this.contentCommonService.getUserProfileData(userProfileDataObj);
    }

    this.contentCommonService
      .getCriteriaGroupData(
        this.contentNo,
        documentcontentType,
        documentStatusDetails,
        documentcontentId,
        this.documentversion,
        userEmail
      )
      .subscribe(
        (res) => {
          this.loading = false;
          this.prograssBarStatus = res['assetStatus'] || sessionStorage.getItem('documentWorkFlowStatus');
          const data = JSON.parse(JSON.stringify(res));
          this.title = data.title;
          this.globalDataBuf = JSON.parse(JSON.stringify(res));
          this.type = this.helper.getContentType(data.contentTypeId);
          this.globalData = data;
          this.globalData.contentType = this.contentType;
          this.globalData.contentStatus = data.assetStatusId;
          this.globalData['readMode'] = true;
          this.globalData['contentType'] = this.contentType;
          this.globalData.originalAssetStatusId = this.globalData.assetStatusId;
          this.globalData.originalAssetStatus = this.globalData.assetStatus;
          //this.globalData['editMode'] = false;
          this.showMenuActions = true;
          this.hasPublished = this.globalData.assetStatus === ASSET_STATUSES.PUBLISHED || this.globalData.assetStatus == ASSET_STATUSES.ARCHIVED || this.globalData.assetStatus === ASSET_STATUSES.APPROVED_WAITING_FOR_JC || this.globalData.assetStatus === ASSET_STATUSES.CURRENT || this.globalData.assetStatus === ASSET_STATUSES.OBSOLETE || (this.globalData.assetStatus === ASSET_STATUSES.SUBMITTED_FOR_APPROVAL && this.globalData.contentOwnerId !== userEmail);
          //this.previewMode = this.globalData.assetStatusId != 2;
          this.UsJurisdiction = data.usJurisdiction;
          this.UsClassification = data.usClassification;
          this.loadContextInfo();

          setTimeout(() => {
            this.setToolTip();
          }, 1000);
          sessionStorage.removeItem('documentcontentType');
          sessionStorage.removeItem('documentStatusDetails');
          sessionStorage.removeItem('documentcurrentUserEmail');
          sessionStorage.removeItem('documentversion');
          sessionStorage.removeItem('documentcontentId');
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
  updatePurposeField(updatedObj) {
    this.globalData.purpose = updatedObj.purpose;
    this.propertiesLastUpdateDateTime = updatedObj.propertiesLastUpdateDateTime;
  }
  updateIntentBasisValidationField(updatedObj) {
    this.globalData.intentOfCriteria = updatedObj.intentOfCriteria;
    this.globalData.basisOfCriteria = updatedObj.basisOfCriteria;
    this.globalData.validationOfCriteria = updatedObj.validationOfCriteria;
    this.propertiesLastUpdateDateTime = updatedObj.propertiesLastUpdateDateTime;
  }
  updateReferenceField(updatedObj) {
    this.globalData.requiredReferences = updatedObj.requiredReferences;
    this.globalData.informationalReferences =
      updatedObj.informationalReferences;
    this.propertiesLastUpdateDateTime = updatedObj.propertiesLastUpdateDateTime;
  }
  updateCriteriaField(updatedObj) {
    this.globalData.criteria = updatedObj.criteriaData;
    this.propertiesLastUpdateDateTime = updatedObj.propertiesLastUpdateDateTime;
  }
  updateDefinitionField(updatedObj) {
    this.globalData.definitions = updatedObj.definitionData;
    this.propertiesLastUpdateDateTime = updatedObj.propertiesLastUpdateDateTime;
  }
  handleDirtyPage(value) {
    this.isFormDirty = value;
  }
  handleOnOkButton() {
    this.dialog.closeAll();
  }
  ngOnDestroy() {
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
    this.isFormDirty = false;
  }
  updateLastModifiedDate(value) {
    this.propertiesLastUpdateDateTime = value;
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
