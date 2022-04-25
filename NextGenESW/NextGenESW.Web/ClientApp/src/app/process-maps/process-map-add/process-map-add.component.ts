import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Store, select } from '@ngrx/store';
import { selectContentList } from '@app/reducers';
import { ContentListsState } from '@app/dashboard/content-list/content-list.reducer';
import { RecordsService } from '../../shared/records.service';
import { ProcessMapsService } from '../process-maps.service';
import { SharedService } from '@app/shared/shared.service';
import { ContextService } from '@app/shared/component/global-panel/context/context.service';
import { ContextInfo } from '@app/shared/component/global-panel/context/context.model';
import { StepflowService } from '../../process-maps/step-flow/stepflow.service';
import * as data from 'src/assets/data/progress-bar.json';
import { ActivityPageService } from '@app/activity-page/activity-page.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaseContentDetailComponent } from '@app/shared/component/base-content-detail/base-content-detail.component';

import { ASSET_STATUSES } from '@environments/constants';

import { MatTab, MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-process-map-add',
  templateUrl: './process-map-add.component.html',
  styleUrls: ['./process-map-add.component.scss'],
  //encapsulation: ViewEncapsulation.None,
})
export class ProcessMapAddComponent extends BaseContentDetailComponent implements OnInit {
  ASSET_STATUSES = ASSET_STATUSES;
  @ViewChildren(MatTab) tabs;
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  //tags: Tag[] = [  ];
  nodePath: any;
  addedStep: any = [];
  appened: any;
  broadCastMessage: any = '';
  selectable = true;
  removable = true;
  addOnBlur = true;
  globalData: any;
  documentStatus: any;
  //readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  public opened = true;
  public sharedValue: any;
  loading = false;
  id;
  title: string;
  contentType: string = 'SF';
  disableForm: boolean = false;
  docStatusM= ASSET_STATUSES.DRAFT;
  docTypeStatus: string = '';
  documentCreateStatus: boolean;
  mapTitle: string = '';
  disableTab: boolean = false;

  contentNo;
  docPreiewStatus = 0;
  propertiesLastUpdateDateTime: any;
  UsJurisdiction: any;
  UsClassification: any;
  contentId;
  type: string = 'SF';
  isCheckOut: Boolean = true;
  docStatus = ASSET_STATUSES.DRAFT;
  showMenuActions = false;
  dropDownList;
  previewMode: boolean = false;
  globalDataBuf: any;
  hasProperty: any = true;
  hasPublished: any = false;
  isFormDirty: boolean = false;
  prevSelectedIndex: number = 0;
  updatedContentOwner: string = '';
  backToSpepTab: any;
  showEditOption: any;
  stepflowData: any;
  sfDeshboardData: any;
  version: any;
  stepcontentType:boolean;
  progressBar: any = (data as any).default;
  requestApprovalOption: boolean = false;
  showSubMenuActions: boolean = false;
  prograssBarStatus:any;
  constructor(
    protected route: ActivatedRoute,
    public dialog: MatDialog,
    private store: Store<ContentListsState>,
    private rservice: RecordsService,
    private processMapsService: ProcessMapsService,
    protected sharedService: SharedService,
    public stepflow: StepflowService,
    private contextService: ContextService,
    private activityPageService: ActivityPageService,
    private _snackBar: MatSnackBar,
    protected router: Router,
    private cd: ChangeDetectorRef)
    {
      super(router, route, sharedService);
    }

  ngOnInit(): void {
    this.route.params.subscribe((param) => {
      console.log("param SF details", param);
      let contentType;
      if (param['contentId']) {
        contentType = param['contentId'].split('-');
        contentType = contentType[1] == 'F' ? 'SF' : 'SF';
        this.stepcontentType = contentType == 'SF' ? true : false;
        this.id = param['contentId'] ? param['contentId'] : '';
        this.contentId = param['contentId'] ? param['contentId'] : '';
        this.version = param['version'] ? param['version'] : sessionStorage.getItem('documentversion');
        this.contentType = contentType;
        this.hasProperty = this.id && this.id.length > 0 ? false : true;
        console.log('this.hasProperty', this.hasProperty);
        //this.hasPublished = (this.id && this.id.length > 0) ? true : false;
        this.hasPublished = true;
      } else if (param['id']) {
        this.id = param['id'] ? param['id'] : '';
        this.hasProperty = isNaN(this.id);
        //this.hasPublished = (this.id && this.id > 0) ? true : false;
        this.hasPublished = false;
        // sessionStorage.setItem('sfStatus', 'draft');
      }

      if ( this.route.snapshot.queryParams['version']  ) {

        this.version =   this.route.snapshot.queryParams['version'];
      }
      else{
        this.version = param['version'] || '0';


      }


      console.log('stepflowversion', this.version);
      //console.log("this.id", this.id);
      //console.log("this.hasProperty", this.hasProperty);

      const urlParam = this.route.snapshot.queryParams;

      if (param['contentId'] || (param && param['id'] && param['id'] > 0) || (param && param['id'] && param['id'] > 0 && urlParam['userMail'])) {
        if (urlParam['userMail'] && urlParam['userMail'].length > 0) {
          // sessionStorage.setItem('sfStatus', 'draft');
          // sessionStorage.setItem('documentWorkFlowStatus', 'draft');

        }

        if (this.id){
          if(!this.stepcontentType) {
            this.loading = true;
          }
          if (param['contentId']) {
            this.loading = true;
            this.processMapsService.getProcessMapbycontentID(param['contentId'],this.contentType,this.version)
              .subscribe((data) => {
                this.loading = false;
                this.newLoad(data)
                let assetStatus;
                if(data.assetStatus == ASSET_STATUSES.PUBLISHED || data.assetStatus == ASSET_STATUSES.ARCHIVED || data.assetStatus == ASSET_STATUSES.CURRENT || data.assetStatus == ASSET_STATUSES.OBSOLETE) {
                  assetStatus = 'published'
                } else if(data.assetStatus == ASSET_STATUSES.DRAFT) {
                  assetStatus = 'draft'
                } else {
                  assetStatus = 'draft'
                }
                // sessionStorage.setItem('sfID', data.id);
                // sessionStorage.setItem('sfcontentId', data.contentId);
                // sessionStorage.setItem('sfversion', data.version ? data.version : '0' );
                // sessionStorage.setItem('sfStatus', assetStatus);
                this.documentStatus = (data['assetStatus'] === ASSET_STATUSES.DRAFT ? 'Draft' : ( ( data['assetStatus'] === ASSET_STATUSES.PUBLISHED  ||  data['assetStatus'] === ASSET_STATUSES.ARCHIVED ) ? 'Published' : (data['assetStatusId'] == 3 ? 'Submitted for Approval' : 'Approved, Waiting for JC')));
                this.globalData = data;
                this.globalData.originalAssetStatusId = data.assetStatusId;
                this.globalData.originalAssetStatus = data.assetStatus;
                this.sharedService.stepflowGlobalData(data);
                this.prograssBarStatus = data['assetStatus'];
              }, ()=>{
                this.loading = false;
              });



          }

          else{
            let routeData = this.route.snapshot.queryParams['status'];
            this.processMapsService.getProcessMapbyID(param['id'],routeData)
              .subscribe((data) => {
                this.loading = false;
                this.newLoad(data)
                let assetStatus;
                if(data.assetStatus == ASSET_STATUSES.PUBLISHED || data.assetStatus == ASSET_STATUSES.ARCHIVED || data.assetStatus == ASSET_STATUSES.CURRENT || data.assetStatus == ASSET_STATUSES.OBSOLETE) {
                  assetStatus = 'published'
                } else if(data.assetStatus == ASSET_STATUSES.DRAFT) {
                  assetStatus = 'draft'
                } else {
                  assetStatus = 'draft'
                }
                // sessionStorage.setItem('sfID', data.id);
                // sessionStorage.setItem('sfcontentId', data.contentId);
                // sessionStorage.setItem('sfversion', data.version ? data.version : '0' );
                // sessionStorage.setItem('sfStatus', assetStatus);
                this.globalData = data;
                this.globalData.originalAssetStatusId = data.assetStatusId;
                this.globalData.originalAssetStatus = data.assetStatus;
                this.documentStatus = data['assetStatus'] || 'Approved, Waiting for JC';
                this.prograssBarStatus = data['assetStatus'];
                console.log(' this.globalData',  this.globalData);
                this.sharedService.stepflowGlobalData(data);
              });


          }


        }
      }


      // this.processMapsService.GetStepFlowByContentId(this.id).subscribe(
      //   (data) => {
      //     console.log('cintentid', data);
      //   });

      this.sharedService.backToStep.subscribe((backTostep) => {
        this.backToSpepTab = backTostep;
      });
      console.log('this.backToSpepTab', this.backToSpepTab);
      if (this.id && this.backToSpepTab == true) {

        this.nextTab(1);
        this.sharedService.backToStepflowShared(false);
        console.log('backToStepflowShared', this.sharedService.backToStepflowShared(false));
        this.sharedService.backToStep.subscribe((backTostep) => {
          console.log('backTostep', backTostep)
        });
      }

      if (this.sharedService.getNextTab()) {
        let redirect = this.sharedService.getNextTab();
        console.log('redirect Value', redirect);
        this.nextTab(redirect);
        this.sharedService.setNextTab(false);
      }
    });

    this.rservice.broadcast.subscribe(
      (broadCastMessage) => (this.broadCastMessage = broadCastMessage)
    );





    this.store.pipe(select(selectContentList)).subscribe((data) => {
      for (let doc of data) {
        if (doc.id == this.id) {
          this.title = doc.title;
          //this.contentType = doc.documentType;
        }
      }
    });
    this.docTypeStatus = sessionStorage.getItem('documentWorkFlowStatus');
    if (this.docTypeStatus === null || this.docTypeStatus === '') {
      this.documentCreateStatus = true;
    }
  }


  newLoad(data){
    const userEmail = sessionStorage.getItem('userMail');

    if (this.id) {


            this.loading = false;
            // if (data['assetStatusId'] == 4 || data['assetStatusId'] == 6) {
            //   //res['originalAssetStatusId'] = 2;
            //   data['assetStatusId'] = 2;
            // }
            this.prograssBarStatus = data['assetStatus'] || sessionStorage.getItem('documentWorkFlowStatus');

            if (data['assetStatusId'] == 4 || data['assetStatusId'] == 6) {
              // data['originalAssetStatusId'] = 2;
              // data['assetStatusId'] = 2;
              // data['assetStatus'] = this.ASSET_STATUSES.PUBLISHED;
              this.showSubMenuActions = false;
            } else {
              this.showSubMenuActions = true;
            }

            this.globalDataBuf = JSON.parse(JSON.stringify(data));
            this.globalData = data;
            sessionStorage.setItem('stepflowid', this.id);
            this.mapTitle = this.globalData.title;
            this.title = this.globalData.title;
            this.showMenuActions = true;
            console.log(this.globalData);
            //this.type = this.helper.getContentType(data.contentTypeId);
            this.globalData.contentType = this.contentType;
            this.globalData.contentStatus = data.assetStatusId;
            this.globalData['readMode'] = true;
            this.globalData['contentType'] = this.contentType;
            this.globalData.originalAssetStatusId = data.assetStatusId;
            this.globalData.originalAssetStatus = data.assetStatus;
            this.hasPublished = this.globalData.assetStatus === ASSET_STATUSES.PUBLISHED || this.globalData.assetStatus == ASSET_STATUSES.ARCHIVED || this.globalData.assetStatus === ASSET_STATUSES.APPROVED_WAITING_FOR_JC || this.globalData.assetStatus === ASSET_STATUSES.CURRENT || this.globalData.assetStatus === ASSET_STATUSES.OBSOLETE || (this.globalData.assetStatus === ASSET_STATUSES.SUBMITTED_FOR_APPROVAL && this.globalData.contentOwnerId !== userEmail);
            this.UsJurisdiction = data.usJurisdiction;
            this.UsClassification = data.usClassification;
            this.loadContextInfo();
            if (
              this.globalData.assetStatus === ASSET_STATUSES.PUBLISHED || this.globalData.assetStatus == ASSET_STATUSES.ARCHIVED   || this.globalData.assetStatus === ASSET_STATUSES.CURRENT || this.globalData.assetStatus === ASSET_STATUSES.OBSOLETE ||
              this.globalData.assetStatusId == 4
            ) {
              this.sharedService.nextStepPublishedData(true);
            } else {
              this.sharedService.nextStepPublishedData(false);
            }
            // let checkStepPreview = sessionStorage.getItem('backPriviewOn')
            // console.log('checkStepPreview', checkStepPreview);
            // if (checkStepPreview == 'true') {
            //   this.handleOnPreviewClick(false);
            //   // sessionStorage.setItem('backPriviewOn', 'false');
            // }
            // else if (checkStepPreview == 'false') {
            //   sessionStorage.setItem('backPriviewOn', 'false');
            // }
            // else {
            //   sessionStorage.setItem('backPriviewOn', 'false');
            // }








    } else {
      console.log('No ID');
      this.disableTab = true;
      this.type = 'SF';
      this.previewMode = false;
      this.hasPublished = false;
    }
  }
  loadContextInfo() {
    this.contextService.ContextInfo = this.getContextInfo();
  }

  setTitle(title) {
    this.title = title;
  }

  getContextInfo() {
    const contextInfo: ContextInfo = new ContextInfo();
    contextInfo.entityInfo = this.globalData;
    contextInfo.entityId = this.id;
    return contextInfo;
  }

  onCheckinClick(value) {
    this.isCheckOut = value == 'checkin' ? false : true;
  }

  nextTab(redirect) {
    if (redirect) {
      this.selectedIndex = this.selectedIndex + 1;
    }
  }

  moveToSelectedTab(tabName: string) {
    for (
      let i = 0;
      i < document.querySelectorAll('.mat-tab-label-content').length;
      i++
    ) {
      if (
        (<HTMLElement>document.querySelectorAll('.mat-tab-label-content')[i])
          .innerText == tabName
      ) {
        (<HTMLElement>document.querySelectorAll('.mat-tab-label')[i]).click();
      }
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
    if (value) {
      this.loading = true;
      this.processMapsService
        .saveAsStepflow(this.globalDataBuf)
        .subscribe((res: any) => {
          this.loading = false;
          this.globalData = res;
          this.globalData.originalAssetStatusId = res.assetStatusId;
          this.globalData.originalAssetStatus = res.assetStatus;
          this.globalData['readMode'] = false;
          // sessionStorage.setItem('sfStatus', 'draft')
          this.processMapsService.getProcessMap(res['id']).subscribe((data: any) => {
            this.globalData = data;
            this.globalData.originalAssetStatusId = data.assetStatusId;
            this.globalData.originalAssetStatus = data.assetStatus;
          });
          sessionStorage.setItem('stepflowid', res['id']);
          this.sharedService.nextDocStatus(true);
          this.sharedService.nextStepPublishedData(false);
          this.router.navigate([
            '/process-maps/create-progressmap/' + res['id'],
          ], {
            queryParams: {
              status: 'draft',
              contentId: res['contentId'],
              contentType: 'SF',
              version: res['version']
            }
          });
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
      this.sharedService.nextDocStatus(value);
      sessionStorage.setItem('backPriviewOn', 'false');
    } else {
      this.globalData.originalAssetStatusId = this.globalDataBuf.assetStatusId;
      this.globalData.originalAssetStatus = this.globalDataBuf.assetStatus;
      this.globalData.assetStatusId = 2;
      this.globalData.assetStatus = ASSET_STATUSES.PUBLISHED;
      this.hasPublished = true;
      this.previewMode = true;
      this.sharedService.nextDocStatus(value);
      sessionStorage.setItem('backPriviewOn', 'true');
    }
    this.globalData = JSON.parse(JSON.stringify(this.globalData));
    // this.cd.detectChanges();
  }
  handleOnRevisionClick(value) {
    if (value) {
      this.loading = true;
      this.processMapsService
        .reviseStepflow(this.globalDataBuf)
        .subscribe((res: any) => {
          this.globalData = res;
          this.globalData.originalAssetStatusId = res.assetStatusId;
          this.globalData.originalAssetStatus = res.assetStatus;
          this.globalData['readMode'] = false;
          // sessionStorage.setItem('sfStatus', 'draft')
          this.loading = true;
          this.processMapsService.getProcessMapbyID(res['id'] , 'draft').subscribe((data: any) => {
            this.loading = false;
            this.globalData = data;
            this.globalData.originalAssetStatusId = data.assetStatusId;
            this.globalData.originalAssetStatus = data.assetStatus;
            this.sharedService.stepflowGlobalData(data);
          });
          sessionStorage.setItem('stepflowid', res['id']);
          this.sharedService.nextDocStatus(true);
          this.sharedService.nextStepPublishedData(false);
          this.router.navigate([
            '/process-maps/create-progressmap/' + res['id'],
          ], {
            queryParams: {
              status: 'draft',
              contentId: res['contentId'],
              contentType: 'SF',
              version: res['version']
            }
          });
        }, ({ error }) => {
          this._snackBar.open(error?.error?.message || error, 'x', {
            duration: 5000
          });
          this.loading = false;
        });
    }
  }

  handleApprovalAction() {
    this.globalData.assetStatusId = 2;
    this.globalData.originalAssetStatusId = 2;
    this.globalData.assetStatus = ASSET_STATUSES.PUBLISHED;
    this.globalData.originalAssetStatus = ASSET_STATUSES.PUBLISHED;
    this.hasPublished = true;
    this.updatedContentOwner = '';
    this.globalData = JSON.parse(JSON.stringify(this.globalData));
  }

  handleRequestAction(value) {
    this.updatedContentOwner = value;
    this.globalData.contentOwnerMail = value;
    this.globalData.contentOwnerId = value;
  }

  handleOnOkButton() {
    this.dialog.closeAll();
  }


  updatePurposeField(updatedObj) {
    this.globalData.purpose = updatedObj;
  }

  handleDirtyPage(value) {
    this.isFormDirty = value;
  }

  updateLastModifiedDate(value) {
    this.propertiesLastUpdateDateTime = value;
  }

  changeStepFlowTitle(newTitle) {
    this.mapTitle = newTitle;
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
    sessionStorage.removeItem('backPriviewOn');

  }
  updateRequestAproval(value) {
    this.requestApprovalOption = value;
  }
}
