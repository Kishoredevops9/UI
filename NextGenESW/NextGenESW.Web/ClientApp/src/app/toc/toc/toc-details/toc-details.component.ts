import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TocService } from '@app/toc/toc.service';
import { ContextService } from '@app/shared/component/global-panel/context/context.service';
import { ContextInfo } from '@app/shared/component/global-panel/context/context.model';
import { CriteriaGroupPageService } from '@app/criteria-group/criteria-group.service';
import { GlobalService } from '@app/shared/component/global-panel/global.service';
import { SharedService } from '@app/shared/shared.service';
import { ContentCommonService } from '@app/shared/content-common.service';
import * as data from 'src/assets/data/progress-barTOC.json';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MsalService } from '@azure/msal-angular';
import { ASSET_STATUSES } from '@environments/constants';
@Component({
  selector: 'app-toc-details',
  templateUrl: './toc-details.component.html',
  styleUrls: ['./toc-details.component.scss'],
})
export class TocDetailsComponent implements OnInit {
  id;
  contentId: string = '';
  contentNo;
  IsCheckOut: boolean = false;
  userMail;
  disableForm: boolean = false;
  hasProperty: any = false;
  title: string;
  type: string = 'ToC';
  contentType: string = 'ToC';
  contentTypeTOC: string = 'TOC';
  globalData: any;
  loading: boolean = false;
  showMenuActions = false;
  previewMode: boolean = false;
  globalDataBuf: any;
  isApprove: boolean = false;
  hasPublished: boolean = false;
  // saveAsData:any;
  updatedContentOwner: string = '';
  documentCreateStatus: boolean;
  docTypeStatus: string;
  UsJurisdiction: any;
  UsClassification: any;
  progressBar: any = (data as any).default;
  requestApprovalOption: boolean = false;
  showSubMenuActions: boolean = false;
  version: string;
  status: string;
  prograssBarStatus: any;

  constructor(
    private route: ActivatedRoute,
    private tocService: TocService,
    private contextService: ContextService,
    private router: Router,
    private globalService: GlobalService,
    private sharedService: SharedService,
    private contentCommonService: ContentCommonService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private authService: MsalService,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((param) => {
      //console.log("toc details param", param);
      this.route.queryParams.subscribe(urlParam => {
        let contentType;
        if (urlParam && urlParam['id'] && urlParam['id'] > 0) {
          this.id = (urlParam['id'] && urlParam['id'] > 0) ? urlParam['id'] : 0;
          this.contentTypeTOC = (urlParam['contentType']) ? urlParam['contentType'] : 'KP';
          this.version = (urlParam['version']) ? urlParam['version'] : sessionStorage.getItem('version');
          this.status = (urlParam['status']) ? urlParam['status'].toLowerCase() : 'draft';
          this.contentId = param['contentId'] ? param['contentId'] : '';
          this.hasProperty = (this.id && this.id > 0) ? false : true;
        } else if (param['contentId']) {
          contentType = param['contentId'].split('-');
          contentType = contentType[1] == 'T' ? 'TOC' : 'TOC';
          this.id = param['contentId'] ? param['contentId'] : '';
          this.contentId = param['contentId'] ? param['contentId'] : '';
          this.version = param['version'] ? param['version'] : sessionStorage.getItem('version');
          this.contentTypeTOC = contentType;
          this.hasProperty = this.id && this.id.length > 0 ? false : true;
        } else if (param['id']) {
          this.id = param['id'];
          this.hasProperty = isNaN(this.id);
        } else {
          this.hasProperty = isNaN(this.id);
        }
      });
    });
    //this.hasProperty = isNaN(this.id);
    if (this.id) {
      this.loadTOCData();
    } else {
      this.type = 'ToC';
      sessionStorage.setItem('statusCheck', 'false');
    }
    this.sharedService.setNextTab(false);
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
    this.previewMode = value;
    this.globalData.assetStatusId = this.globalDataBuf.assetStatusId;
    this.globalData.originalAssetStatusId = this.globalDataBuf.assetStatusId;

    this.globalData.assetStatus = this.globalDataBuf.assetStatus;
    this.globalData.originalAssetStatus = this.globalDataBuf.assetStatus;
    if (value) {
      this.hasPublished = false;
      this.previewMode = false;
    } else {
      this.globalData.assetStatusId = 2;
      this.globalData.assetStatus = ASSET_STATUSES.PUBLISHED;
      this.hasPublished = true;
      this.previewMode = true;
    }
    this.globalData = JSON.parse(JSON.stringify(this.globalData));
  }

  handleOnSaveAsClick(value) {
    const userEmail = sessionStorage.getItem('userMail');
    this.globalDataBuf.author = userEmail;
    if (value) {
      this.loading = true;
      this.tocService.GetContentID(this.globalDataBuf).subscribe((res) => {
        this.globalData = res;
        this.globalData['originalAssetStatusId'] =
          this.globalData.assetStatusId;
        this.globalData['readMode'] = true;
        this.router.navigate(['toc', res['id']]);
        this.loading = false;
      });
    }
  }

  handleOnRevisionClick(value) {
    const userEmail = sessionStorage.getItem('userMail');
    this.globalDataBuf.author = userEmail;
    if (value) {
      this.loading = true;
      this.tocService.GetRevisionData(this.globalDataBuf).subscribe((res) => {
        this.globalData = res;
        this.globalData['originalAssetStatusId'] =
          this.globalData.assetStatusId;
        this.globalData['readMode'] = true;
        this.router.navigate(['toc', res['id']]);
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
    this.hasPublished = true;
    this.updatedContentOwner = '';
    this.globalData = JSON.parse(JSON.stringify(this.globalData));
  }
  handleRequestAction(value) {
    this.updatedContentOwner = value;
    this.globalData.contentOwnerMail = value;
    this.globalData.contentOwnerId = value;
  }

  loadTOCData() {
    if (this.sharedService.getNextTab()) {
      let redirect = this.sharedService.getNextTab();
      this.nextTab(redirect);
    }

    if ((this.id && this.id > 0) || (sessionStorage.getItem('contentType') && sessionStorage.getItem('contentType').toLowerCase() != 'published')) {
      this.contentNo = this.id && this.id > 0 ? this.id : sessionStorage.getItem('documentId') ? sessionStorage.getItem('documentId') : 0;
      var documentcontentId = (this.contentId && this.contentId.length > 0) ? this.contentId : sessionStorage.getItem('documentcontentId') ? sessionStorage.getItem('documentcontentId') : '0';
      var documentversion = (this.version) ? this.version : '0';
      var documentcontentType = this.contentTypeTOC;
      var documentStatusDetails = 'draft';
    } else {
      this.hasPublished = true;
      this.contentNo = sessionStorage.getItem('documentId') ? sessionStorage.getItem('documentId') : 0;
      var documentcontentId = (this.contentId && this.contentId.length > 0) ? this.contentId : sessionStorage.getItem('contentNumber');
      var documentversion = (this.version) ? this.version : '0';
      var documentcontentType = this.contentTypeTOC;
      var documentStatusDetails = 'published';
    }

    const userEmail = sessionStorage.getItem('userMail');
    const url = this.router.url.split('/');
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

    if (this.id) {
      this.contentCommonService
        .getTableOfContentData(
          this.contentNo,
          documentcontentType,
          documentStatusDetails,
          documentcontentId,
          '1',
          userEmail
        )
        .subscribe(
          (res) => {
            if (res['assetStatusId'] == 4) {
              // res['originalAssetStatusId'] = 2;
              // res['assetStatusId'] = 2;
              this.showSubMenuActions = false;
            } else {
              this.showSubMenuActions = true;
            }
            this.prograssBarStatus = res['assetStatus'];

            const data = JSON.parse(JSON.stringify(res));
            this.title = data.title;
            this.globalDataBuf = JSON.parse(JSON.stringify(res));
            if (data.contentTypeId === 1) {
              data.contentType = 'WI';
            } else if (data.contentTypeId === 2) {
              data.contentType = 'CD';
            } else if (data.contentTypeId === 6) {
              data.contentType = 'AP';
            } else if (data.contentTypeId === 5) {
              data.contentType = 'RD';
            } else if (data.contentTypeId === 6) {
              data.contentType = 'AP';
            } else if (data.contentTypeId === 11) {
              data.contentType = 'ToC';
            }
            this.globalData = data;
            this.globalData.contentStatus = this.globalData.assetStatusId;
            this.globalData.contentType = this.contentType;
            this.globalData.originalAssetStatusId =
              this.globalData.assetStatusId;
            this.showMenuActions = true;
            this.UsJurisdiction = data.usJurisdiction;
            this.UsClassification = data.usClassification;
            this.hasPublished =
              this.globalData.assetStatusId == 2 ||
              this.globalData.assetStatusId == 4;
            this.loadContextInfo();
            this.loading = false;
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
            this.loading = false;
            sessionStorage.setItem('statusCheck', 'false');
          }
        );
    }
  }
  updatePurposeField(value) {
    this.globalData.purpose = value;
  }
  ngOnDestroy() {
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
  updateNocData(data) {
    this.globalData.natureOfChange = JSON.parse(data);
    this.globalDataBuf.natureOfChange = JSON.parse(data);
  }
  updateRequestAproval(value) {
    this.requestApprovalOption = value;
  }
}
