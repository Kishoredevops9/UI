import { Component, OnInit, Input, ViewChildren, ViewChild } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { selectContentList } from '@app/reducers';
import { ContentListsState } from '@app/dashboard/content-list/content-list.reducer';
import { ActivatedRoute, Router } from '@angular/router';
import { ContextService } from '@app/shared/component/global-panel/context/context.service';
import { ContextInfo } from '@app/shared/component/global-panel/context/context.model';
import { DocumentViewService } from '@app/document-view/document-view.service';
import { Title } from '@angular/platform-browser';
import { GlobalService } from '@app/shared/component/global-panel/global.service';
import { ContentCommonService } from '@app/shared/content-common.service';
import * as data from 'src/assets/data/progress-bar.json';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivityPageService } from '@app/activity-page/activity-page.service';
import { ASSET_STATUSES } from '@environments/constants';
import { BaseContentDetailComponent } from '@app/shared/component/base-content-detail/base-content-detail.component';
import { SharedService } from '@app/shared/shared.service';
import { MatTab, MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-wi-details',
  templateUrl: './wi-details.component.html',
  styleUrls: ['./wi-details.component.scss'],
})
export class WiDetails extends BaseContentDetailComponent implements OnInit {
  @ViewChildren(MatTab) tabs;
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;

  ASSET_STATUSES = ASSET_STATUSES;
  loading = false;
  id;
  version:string;
  title: string;
  contentIds:string;
  contentType: string = 'WI';
  webContent: boolean = false;
  disableForm: boolean = false;
  docStatus = 'draft';
  globalData: any;
  hasProperty: any = false;
  showMenuActions: Boolean = false;
  previewMode: boolean = false;
  globalDataBuf: any;
  tablists: any;
  sourceUrl: any;
  parenttitle;
  hasTabList: boolean = false;
  hasApproved: boolean = false;
  updatedContentOwner: string = '';
  documentCreateStatus: boolean;
  docTypeStatus: string;
  progressBar: any = (data as any).default;
  constructor(
    protected route: ActivatedRoute,
    private store: Store<ContentListsState>,
    private titleService: Title,
    private contextService: ContextService,
    private documentViewService: DocumentViewService,
    private globalService: GlobalService,
    private contentCommonService: ContentCommonService,
    protected router: Router,
    private _snackBar: MatSnackBar,
    protected sharedService: SharedService
  ) {
    super(router, route, sharedService);
    this.route.params.subscribe((param) => {
      this.id = parseInt(param['id']);
    });
    //  this.titleService.setTitle(`EKS/Create WI`);
  }

  ngOnInit(): void {
    console.log('globalData',this.globalData)
    this.parenttitle = sessionStorage.getItem('title');
    this.sourceUrl = sessionStorage.getItem('docUrl');
    this.route.params.subscribe((param) => {
      this.id = parseInt(param['id']);
      this.contentIds = param['contentId'] ? param['contentId'] : '';
      this.hasProperty = isNaN(this.id);
      this.version =param['version'] ? param['version'] : sessionStorage.getItem('version');
    });

    if (this.contentIds.length > 0 || this.id > 0) {
      this.loadWIData();
    }
    this.docTypeStatus = sessionStorage.getItem('documentWorkFlowStatus');

    if (this.docTypeStatus === null || this.docTypeStatus === '') {
      this.documentCreateStatus = true;
    }
  }

  onTabClick(event) {}

  nextTab(redirect) {
    if (redirect) {
      this.selectedIndex = this.selectedIndex + 1;
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
  handleOnPreviewClick(value) {
    this.previewMode = false;
    this.globalData.assetStatusId = this.globalDataBuf.assetStatusId;
    this.globalData.originalAssetStatusId = this.globalDataBuf.assetStatusId;
    this.globalData.originalAssetStatus = this.globalDataBuf.assetStatus;
    this.globalData.assetStatus = this.globalDataBuf.assetStatus;
    this.globalData.pwStatus = this.globalDataBuf.pwStatus;
    this.webContent = false;
    this.tablists = [];
    this.hasTabList = false;
    if (!value) {
      this.loading = true;
      this.documentViewService
        .previewExtraction(this.sourceUrl, this.parenttitle, this.contentType)
        .subscribe(
          (res) => {
            //console.log("previewExtraction res",res);
            this.documentViewService
              .previewContentType(this.id, this.contentType)
              .subscribe(
                (res) => {
                  //console.log("previewContentType res",res);
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
  loadWIData() {
    let userEmail = sessionStorage.getItem('userMail');
    if (
      sessionStorage.getItem('contentType') &&
      sessionStorage.getItem('contentType').toLowerCase() == 'published'
    ) {
      var documentStatusDetails = sessionStorage.getItem('contentType')
        ? sessionStorage.getItem('contentType')
        : 'published';
      var documentcontentId = sessionStorage.getItem('contentNumber');
      var documentcontentType = this.contentType;
      var documentversion = (this.version) ? this.version : '0';
      this.id = (this.id && this.id > 0) ? this.id : this.contentIds ? this.contentIds : 0;
    } else {
      var documentcontentId = sessionStorage.getItem('contentNumber');
      var documentStatusDetails = 'draft';
      var documentcontentType = this.contentType;
      var documentversion = (this.version) ? this.version : '0';
    }
    this.loading = true;
    if (
      documentStatusDetails == 'submitted for approval' ||
      documentStatusDetails == 'approve'
    ) {
      documentStatusDetails = 'draft';
    }
    const documentClassificationDetails = sessionStorage.getItem(
      'documentClassificationDetails'
    );

    this.contentCommonService
      .getDocumentConentData(
        this.id,
        documentcontentType,
        documentStatusDetails,
        documentcontentId,
        documentversion,
        userEmail
      )
      .subscribe(
        (res) => {
          this.globalDataBuf = JSON.parse(JSON.stringify(res));
          this.globalData = res;
          if (this.globalData.assetStatusId == 2) {
            this.hasApproved = true;
          }
          this.globalData.originalAssetStatusId =
            this.globalData.pwStatus == 'Published' ? 2 : 1;
          this.globalData.assetStatusId = this.globalData.originalAssetStatusId;
          this.globalData.contentStatus = this.globalData.originalAssetStatusId;

          this.titleService.setTitle(
            `EKS | WI | ${res['contentId']} | ${res['title']}`
          );

          this.globalData['contentType'] = this.contentType;
          this.title = this.globalData.title;
          this.loadContextInfo();
          this.showMenuActions = true;
          this.loading = false;
        },
        (error) => {
          console.error('There was an error!', error);
          this.loading = false;
          this.router.navigate(['/dashboard']);
        }
      );

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
