import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { KPacksService } from '@app/k-packs/k-packs.service';
import { ContextService } from '@app/shared/component/global-panel/context/context.service';
import { ContextInfo } from '@app/shared/component/global-panel/context/context.model';
import { GlobalService } from '@app/shared/component/global-panel/global.service';
import { SharedService } from '@app/shared/shared.service';
import { ContentCommonService } from '@app/shared/content-common.service';
import * as data from 'src/assets/data/progress-bar.json';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MsalService } from '@azure/msal-angular';
import { ActivityPageService } from '@app/activity-page/activity-page.service';
import { BaseContentDetailComponent } from '@app/shared/component/base-content-detail/base-content-detail.component';
import { ASSET_STATUSES } from '@environments/constants';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
@Component({
  selector: 'app-k-packs-details',
  templateUrl: './k-packs-details.component.html',
  styleUrls: ['./k-packs-details.component.scss'],
})
export class KPacksDetailsComponent extends BaseContentDetailComponent implements OnInit {
  ASSET_STATUSES = ASSET_STATUSES;
  @ViewChildren(MatTab) tabs;
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  hasPublished: boolean = false;
  id;
  contentNo;
  threeDots: boolean = false;
  contentId: string = '';
  IsCheckOut: boolean = false;
  userMail;
  disableForm: boolean = false;
  hasProperty: any = false;
  title: string;
  type: string = 'K';
  contentType: string = 'KP';
  globalData: any;
  loading: boolean = false;
  kPackData: any;
  showMenuActions = false;
  tabCodePhysics: any;
  tabCodeHistory: any;
  tabCodeLessons: any;
  previewMode: boolean = false;
  isApprove: boolean = false;
  globalDataBuf: any;
  updatedContentOwner: string = '';
  documentCreateStatus: boolean;
  docTypeStatus: string;
  UsJurisdiction: any;
  UsClassification: any;
  version: string;
  status: string;

  progressBar: any = (data as any).default;
  revision: boolean = false;
  requestApprovalOption: boolean = false;
  showSubMenuActions: boolean = false;
  prograssBarStatus:any;
  displayName1: string = '';
  contentOwner1: any ='';
    constructor(
      protected route: ActivatedRoute,
    private kPacksService: KPacksService,
    private contextService: ContextService,
    private globalService: GlobalService,
    protected router: Router,
    protected sharedService: SharedService,
    private contentCommonService: ContentCommonService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private authService: MsalService,
    private activityPageService: ActivityPageService,
  ) {
      super(router, route, sharedService);
    }

  textEditorValue($DATA){
   console.log($DATA)
  }

  ngOnInit(): void {
    this.route.params.subscribe((param) => {
      this.route.queryParams.subscribe(urlParam => {
        //console.log("url query param", urlParam);
        let contentType: string;
        if (urlParam && urlParam['id'] && urlParam['id'] > 0) {
          this.id = (urlParam['id'] && urlParam['id'] > 0) ? urlParam['id'] : 0;
          this.contentType = (urlParam['contentType']) ? urlParam['contentType'] : 'KP';
          this.version = (urlParam['version']) ? urlParam['version'] : sessionStorage.getItem('version');
          this.status = (urlParam['status']) ? urlParam['status'].toLowerCase() : 'draft';
          this.hasProperty = (this.id && this.id > 0) ? false : true;
        } else if (param['contentId']) {
          contentType = param['contentId'].split('-');
          contentType = contentType[1] == 'K' ? 'KP' : 'KP';
          this.id = param['contentId'] ? param['contentId'] : '';
          this.contentId = param['contentId'] ? param['contentId'] : '';
          this.version = param['version'] ? param['version'] : sessionStorage.getItem('version');
          this.contentType = contentType;
          this.hasProperty = this.id && this.id.length > 0 ? false : true;
        } else if (param['id']) {
          this.id = param['id'];
          this.hasProperty = this.id && this.id.length > 0 ? false : true;
        }
      });
    });
    this.hasProperty = this.id && this.id.length > 0 ? false : true;
    this.getContentAllData();
    this.sharedService.setNextTab(false);
    this.docTypeStatus = sessionStorage.getItem('documentWorkFlowStatus');
    if (this.docTypeStatus === null || this.docTypeStatus === '') {
      this.documentCreateStatus = true;
    }
  }

  getContentAllData() {
    if (this.contentId.length > 0 || this.id > 0) {
      this.loadKPData();
    } else {
      sessionStorage.setItem('statusCheck', 'false');
    }
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

  onTabClick(event) { }

  nextTab(redirect) {
    if (redirect) {
      this.selectedIndex = this.selectedIndex + 1;
    }
  }

  handleOnPreviewClick(value) {
    super.handleOnPreviewClick(value);
    this.kPackData.modeChange = true;

    if (value) {
      this.globalData.originalAssetStatusId = this.globalDataBuf.originalAssetStatusId;
      this.globalData.originalAssetStatus = this.globalDataBuf.originalAssetStatus;
      this.globalData.assetStatusId = this.globalDataBuf.originalAssetStatusId;
      this.globalData.assetStatus = this.globalDataBuf.originalAssetStatus;

      this.kPackData.originalAssetStatusId = this.globalDataBuf.originalAssetStatusId;
      this.kPackData.originalAssetStatus = this.globalDataBuf.originalAssetStatus;
      this.kPackData.assetStatusId = this.globalDataBuf.originalAssetStatusId;
      this.kPackData.assetStatus = this.globalDataBuf.originalAssetStatus;
      this.hasPublished = false;
      this.previewMode = false;
    } else {
      this.globalData.originalAssetStatusId = this.globalDataBuf.assetStatusId;
      this.globalData.originalAssetStatus = this.globalDataBuf.assetStatus;
      this.globalData.assetStatusId = 2;
      this.globalData.assetStatus = ASSET_STATUSES.PUBLISHED;

      this.kPackData.originalAssetStatusId = this.globalDataBuf.assetStatusId;
      this.kPackData.originalAssetStatus = this.globalDataBuf.assetStatus;
      this.kPackData.assetStatusId = 2;
      this.kPackData.assetStatus = ASSET_STATUSES.PUBLISHED;
      this.hasPublished = true;
      this.previewMode = true;
    }
    this.kPackData = JSON.parse(JSON.stringify(this.kPackData));
    this.globalData = JSON.parse(JSON.stringify(this.globalData));
    this.loadContextInfo();
  }

  handleApprovalAction(value) {
    this.kPackData.assetStatusId = 2;
    this.kPackData.originalAssetStatusId = 2;
    this.kPackData.assetStatus = ASSET_STATUSES.PUBLISHED;
    this.kPackData.originalAssetStatus = ASSET_STATUSES.PUBLISHED;
    this.hasPublished = true;
    this.updatedContentOwner = '';
    this.kPackData = JSON.parse(JSON.stringify(this.kPackData));
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
          this.loadKPData();
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
    if (value) {
      this.loading = true;
      this.kPacksService
        .copyKpack(this.globalData.knowledgePackId, userEmail)
        .subscribe((res: any) => {
          this.globalData = res;

          this.globalData.originalAssetStatusId = res.assetStatusId;
          this.globalData.originalAssetStatus = res.assetStatus;
          this.globalData['readMode'] = true;
          this.router.navigate(['/k-pack', res['knowledgePackId']]);
          this.loading = false;
          this.id = res['knowledgePackId'];
          //this.getContentAllData();
        });
    }
  }

  handleOnRevisionClick(value) {
    const userEmail = sessionStorage.getItem('userMail');
    //this.globalData.author = userEmail;
    if (value) {
      this.loading = true;
      this.kPacksService
        .getRevisionData(this.globalData.knowledgePackId, userEmail)
        .subscribe((res: any) => {
          this.globalData = res;

          this.globalData.originalAssetStatusId = res.assetStatusId;
          this.globalData.originalAssetStatus = res.assetStatus;
          sessionStorage.setItem('documentId', this.globalData.knowledgePackId);
          sessionStorage.setItem('documentversion', this.globalData.version);
          sessionStorage.setItem('documentcontentType', 'KP');
          sessionStorage.setItem('documentWorkFlowStatus', 'Draft');
          sessionStorage.setItem('documentcontentId', this.globalData.contentId);
          this.globalData['readMode'] = true;
          this.router.navigate(['/k-pack', res['knowledgePackId']]);
          this.loading = false;
          this.id = res['knowledgePackId'];
          this.revision = true;
          //this.getContentAllData();
        },
          (data) => {
            this.loading = false;
            console.error('There was an error!', data);
            const errorMsg = 'content has already been revised'; // error code is not unique so comparing the error message
            if ((data.error.error.message).toLocaleLowerCase().includes(errorMsg)) {
              this._snackBar.open(data.error.error.message, 'x', {
                duration: 5000,
              });
            }
          });
    }
  }

  handleRequestAction(value) {
    this.updatedContentOwner = value;
    this.kPackData.contentOwnerMail = value;
    this.kPackData.contentOwnerId = value;
  }

  loadKPData() {
    if (this.sharedService.getNextTab()) {
      let redirect = this.sharedService.getNextTab();
      this.nextTab(redirect);
    }

    if ((this.id && this.id > 0) || (sessionStorage.getItem('contentType') && sessionStorage.getItem('contentType').toLowerCase() != 'published')) {
      this.contentNo = this.id && this.id > 0 ? this.id : sessionStorage.getItem('documentId') ? sessionStorage.getItem('documentId') : 0;
      var documentcontentId = sessionStorage.getItem('documentcontentId') ? sessionStorage.getItem('documentcontentId') : '0';
      var documentStatusDetails = 'draft';
      var documentcontentType = this.contentType;
    } else {
      this.hasPublished = true;
      this.contentNo = this.id && this.id > 0 ? this.id : sessionStorage.getItem('documentId') ? sessionStorage.getItem('documentId') : 0;
      var documentcontentId = this.contentId && this.contentId.length > 0 ? this.contentId : sessionStorage.getItem('contentNumber');
      //var documentversion = '0';
      var documentStatusDetails = sessionStorage.getItem('contentType') ? sessionStorage.getItem('contentType') : 'published';
      var documentcontentType = this.contentType;
    }
    var documentversion = this.version ? this.version :'0';
    const userEmail = sessionStorage.getItem('userMail');
    const loginInUserEmail = localStorage.getItem('logInUserEmail');
    let LoggedInUserEmail = (userEmail && userEmail.length > 0) ? userEmail : (loginInUserEmail && loginInUserEmail.length > 0) ? loginInUserEmail : '';
    const urlPaths = this.router.url.split('/');
    var redirectionPath = sessionStorage.getItem('redirectUrlPath');
    this.loading = true;
    let statusCheck = sessionStorage.getItem('statusCheck');

    let userProfileDataObj = this.sharedService.getHeaderRequestedData();
    if (userProfileDataObj) {
      var headerRequestedData = this.contentCommonService.getUserProfileData(userProfileDataObj);
    } else {
      let userProfileDataObj = JSON.parse(sessionStorage.getItem('userProfileData'));
      var headerRequestedData = this.contentCommonService.getUserProfileData(userProfileDataObj);
    }
    let counter = 0;
    if (this.id) {
      this.contentCommonService
        .getKnowledgePageData(
          this.contentNo,
          documentcontentType,
          documentStatusDetails,
          documentcontentId,
          documentversion,
          LoggedInUserEmail
        )
        .subscribe((res: any) => {
          const data = JSON.parse(JSON.stringify(res));
          if (res['assetStatusId'] == 4) {
            this.threeDots = true;
            // res['originalAssetStatusId'] = 2;
            // res['assetStatusId'] = 2;
            // res['assetStatus'] = ASSET_STATUSES.PUBLISHED;

          }
          else{
            this.threeDots = false;
          }
          // if (res['assetStatusId'] == 2) {
          //   res['originalAssetStatusId'] = 2;
          //   res['assetStatusId'] = 2;

          // }
          //console.log('in kp details',this.threeDots);

          this.prograssBarStatus = res['assetStatus'];

          this.title = data.title;
          this.globalDataBuf = JSON.parse(JSON.stringify(res));
          this.kPackData = JSON.parse(JSON.stringify(res));
          this.kPackData.modeChange = false;
          this.showMenuActions = true;
          this.globalData = JSON.parse(JSON.stringify(res));
          this.tabCodePhysics = 'Physics';
          this.tabCodeHistory = 'History';
          this.tabCodeLessons = 'Lessons';
          this.globalData.id = this.globalData.knowledgePackId;
          this.globalData.contentStatus = this.globalData.assetStatusId;
          this.globalData.contentStatus = this.globalData.assetStatus;
          this.globalData.originalAssetStatusId = this.globalData.assetStatusId;
          this.globalData.originalAssetStatus = this.globalData.assetStatus;
          this.globalData.contentType = this.contentType;
          this.UsJurisdiction = data.usJurisdiction;
          this.UsClassification = data.usClassification;
          this.hasPublished =
            this.globalData.assetStatus === ASSET_STATUSES.PUBLISHED || this.globalData.assetStatus === ASSET_STATUSES.CURRENT || this.globalData.assetStatus === ASSET_STATUSES.OBSOLETE ||
            this.globalData.assetStatusId == 3 ||
            this.globalData.assetStatusId == 4;
          this.loadContextInfo();
          this.loading = false;
        //   console.log(' this.hasPublished',this.hasPublished);
        //   console.log(' this.globalData.contentOwnerId', this.globalData.contentOwnerId);
        //   console.log(' in purpose displayName1 ngOnChanges',sessionStorage.getItem('displayName'));
        //  console.log(' userMail',sessionStorage.getItem('userMail'));

          this.displayName1 = sessionStorage.getItem('userMail');
          this.contentOwner1 = this.globalData.contentOwnerId;

          if(this.displayName1 == this.contentOwner1){

              if(this.globalData.assetStatus === ASSET_STATUSES.PUBLISHED && this.globalData.assetStatus === ASSET_STATUSES.CURRENT){
                this.hasPublished = true;
              }
              else{
                this.hasPublished = false;
              }

            //this.hasPublished = ! this.hasPublished
            //console.log(' this.hasPublished',this.hasPublished);
          }

          // ===== BussiessRules =====
          // When the loaded K-Pack is published without classier (JC)
          // the content is restricted to user
          const { assetStatusId, classifierId } = res;
          // Only apply when document is published (assetStatusId = 2)
          // use '==' instead of '===' to caputre both 'null' and 'undefined'
          if (assetStatusId === 2 && classifierId == null) {
            alert('Restricted Content - Not Viewable By Current User!');
            this.navigateToSearchOrDashboard(redirectionPath, urlPaths);
          }
        }, (error) => {
          this.dialog.closeAll();
          console.error('There was an error!', error);
          if (error.status == 403 && headerRequestedData == '') {
            this.authService.loginRedirect();
          } else if (error.status == 403) {
            alert('Restricted Content - Not Viewable By Current User!');
            this.navigateToSearchOrDashboard(redirectionPath, urlPaths);
          }
          if (error.status == 404) {
            alert('Invalid Content ID - Content Not Found!');
            this.navigateToSearchOrDashboard(redirectionPath, urlPaths);
          }
          this.loading = false;
        });
    }
  }

  /**
   * When document content is restricted or not found
   * an alert is displayed and the application should
   * be navigated to the 'dashboard' or 'homepage'
   */
  navigateToSearchOrDashboard(redirectionPath: string, urlPaths: string[]) {
    // Stop loading first
    this.loading = false;
    // Check redirect condition
    if (redirectionPath == 'search') {
      this.contentId = (this.contentId.length > 0) ? this.contentId : (urlPaths[3]) ? urlPaths[3] : '';
      this.router.navigate(['_search'], {
        queryParams: { q: this.contentId },
      });
    } else {
      this.router.navigate(['dashboard']);
    }
  }

  ngOnDestroy() {
    if (this.revision) {
      this.revision = false;
    } else {
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
  }
  updateContentOwnerValue(value) {
    const updatedValue = JSON.parse(value);
    this.globalData.contentOwnerId = updatedValue.contentOwnerId;
    this.globalDataBuf.contentOwnerId = updatedValue.contentOwnerId;
    this.globalData.contentOwnerMail = updatedValue.contentOwnerId;
    this.globalDataBuf.contentOwnerMail = updatedValue.contentOwnerId;
    this.globalData.revisionTypeId = updatedValue.revisionTypeId;
    this.globalDataBuf.revisionTypeId = updatedValue.revisionTypeId;
    this.globalData.title = updatedValue.title;
    this.globalDataBuf.title = updatedValue.title;
    //this.globalData = JSON.parse(JSON.stringify(this.globalData));
  }
  updateNocData(data) {
    this.globalData.natureOfChange = JSON.parse(data);
    this.globalDataBuf.natureOfChange = JSON.parse(data);
  }

  updateRequestAproval(value) {
    this.requestApprovalOption = value;
  }
}
