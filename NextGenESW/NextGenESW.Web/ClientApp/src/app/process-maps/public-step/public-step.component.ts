
import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewChildren } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Store, select } from '@ngrx/store';
import { selectContentList } from '@app/reducers';
import { ContentListsState } from '@app/dashboard/content-list/content-list.reducer';
import { RecordsService } from '../../shared/records.service';
import { ProcessMapsService } from '../process-maps.service';
import { SharedService } from '@app/shared/shared.service';
import { HttpHelperService } from '@app/shared/http-helper.service';
import { ContextService } from '@app/shared/component/global-panel/context/context.service';
import { ContextInfo } from '@app/shared/component/global-panel/context/context.model';
import { GlobalService } from '@app/shared/component/global-panel/global.service';
import { ContentCommonService } from '@app/shared/content-common.service';
import { StepflowService } from '../step-flow/stepflow.service';
import * as data from 'src/assets/data/progress-bar.json';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivityPageService } from '@app/activity-page/activity-page.service';
import { BaseContentDetailComponent } from '@app/shared/component/base-content-detail/base-content-detail.component';

import { ASSET_STATUSES } from '@environments/constants';
import { MatTab, MatTabGroup } from '@angular/material/tabs';


@Component({
  selector: 'app-publicStep',
  templateUrl: './public-step.component.html',
  styleUrls: ['./public-step.component.scss']
})

export class PublicStepComponent extends BaseContentDetailComponent implements OnInit {
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
  //readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  public opened = true;
  public sharedValue: any;
  loading = false;
  loadingProcessMap = false;
  loadingProcessMapByContentType = false;
  id;
  title: string;
  contentType: string = 'SP';
  disableForm: boolean = false;
  docStatusM = ASSET_STATUSES.DRAFT;
  docTypeStatus: string = '';
  documentCreateStatus: boolean;
  mapTitle: string = '';
  disableTab: boolean = false;

  contentNo;
  version:any;
  docPreiewStatus = 0;
  propertiesLastUpdateDateTime: any;
  UsJurisdiction: any;
  UsClassification: any;
  contentId;
  type: string = 'SP';
  isCheckOut: Boolean = true;
  docStatus = ASSET_STATUSES.DRAFT;
  showMenuActions = false;
  dropDownList;
  previewMode: boolean = false;
  previewModeJC : boolean = false
  globalDataBuf: any;
  hasProperty: any = true;
  // hasProperty: any = false;
  hasPublished: any = false;
  isFormDirty: boolean = false;
  prevSelectedIndex: number = 0;
  updatedContentOwner: string = '';
  backToSpepTab: any;
  showEditOption: any;
  stepflowData: any;
  sfDeshboardData: any;
  stepflowversion: any;
  prograssBarStatus: any;
  isChecked = false;
  activityArg: any = null;
  contentTextId:any;

  //getStepFlowByIdOrContentId



  loadStepFwd() {
    setTimeout(() => {
      this.addedStep.map((node) => {
        if (node.swimLaneId == this.activityArg) {
          node.active = true;
        }
        else {
          node.active = false;
        }
      })
      this.activityArg = null;
    }, 300)
    this.loading = false;
  }

  loadStep() {
    this.route.params.subscribe((param) => {
      let version = param['version'] ? param['version'] : sessionStorage.getItem('version');
      this.version = version ? version : '0';
      if (param['id']) {
        sessionStorage.setItem('sfStatus','draft');
        this.loading = true;
        this.StepflowService.getStepById(param['id']).subscribe((data: any) => {
          this.addedStep = data[0].stepSwimLanes;
          this.loadStepFwd();
          this.loading = false;
        }, () => {
          this.loading = false;
        })
      }
      if (param['contentId']) {
        this.loading = true;
        this.StepflowService.getStepBycontentId(param['contentId'],this.version, this.status).subscribe((data: any) => {
          this.addedStep = data[0].stepSwimLanes;
          this.loadStepFwd();
          this.loading = false;
        }, () => {
          this.loading = false;
        })
      }

      console.log(":::::")
      console.log(param)
    })
  }



  datannx: any = [
    {
      "stepId": 3760,
      "stepContentId": "P-1006430",
      "stepTitle": "Yoc",
      "baseType": "P",
      "stepActivityBlockId": null,
      "sequenceNumber": null,
      "stepSwimLanes": [
        {
          "swimLaneId": 5407,
          "stepId": 3760,
          "swimLaneTitle": "Controls & Diagnostics > APU Control Systems",
          "baseType": "SL",
          "disciplineId": 35,
          "disciplineText": "Controls & Diagnostics > APU Control Systems",
          "color": "#ffffff",
          "borderColor": "#cccccc",
          "borderStyle": "solid",
          "borderWidth": 2,
          "sequenceNumber": null,
          "activityBlocks": []
        },
        {
          "swimLaneId": 5408,
          "stepId": 3760,
          "swimLaneTitle": "Aerothermal Fluids > Acoustics",
          "baseType": "SL",
          "disciplineId": 356,
          "disciplineText": "Aerothermal Fluids > Acoustics",
          "color": "#ffffff",
          "borderColor": "#cccccc",
          "borderStyle": "solid",
          "borderWidth": 2,
          "sequenceNumber": null,
          "activityBlocks": []
        },
        {
          "swimLaneId": 5409,
          "stepId": 3760,
          "swimLaneTitle": "Controls & Diagnostics > APU Control Systems",
          "baseType": "SL",
          "disciplineId": 35,
          "disciplineText": "Controls & Diagnostics > APU Control Systems",
          "color": "#ffffff",
          "borderColor": "#cccccc",
          "borderStyle": "solid",
          "borderWidth": 2,
          "sequenceNumber": null,
          "activityBlocks": []
        },
        {
          "swimLaneId": 5410,
          "stepId": 3760,
          "swimLaneTitle": "Aerothermal Fluids > Acoustics",
          "baseType": "SL",
          "disciplineId": 356,
          "disciplineText": "Aerothermal Fluids > Acoustics",
          "color": "#ffffff",
          "borderColor": "#cccccc",
          "borderStyle": "solid",
          "borderWidth": 2,
          "sequenceNumber": null,
          "activityBlocks": []
        },
        {
          "swimLaneId": 5411,
          "stepId": 3760,
          "swimLaneTitle": "Engine Performance & Operability > Advanced Technology & Preliminary Engine Design",
          "baseType": "SL",
          "disciplineId": 152,
          "disciplineText": "Engine Performance & Operability > Advanced Technology & Preliminary Engine Design",
          "color": "#ffffff",
          "borderColor": "#cccccc",
          "borderStyle": "solid",
          "borderWidth": 2,
          "sequenceNumber": null,
          "activityBlocks": []
        }
      ],
      "contentPhase": [],
      "contentExportCompliances": [],
      "contentTag": [],
      "activityConnections": []
    }
  ];

  progressBar: any = (data as any).default;
  requestApprovalOption: boolean = false;
  constructor(
    protected route: ActivatedRoute,
    public dialog: MatDialog,
    private store: Store<ContentListsState>,
    private rservice: RecordsService,
    private processMapsService: ProcessMapsService,
    protected sharedService: SharedService,
    public stepflow: StepflowService,
    private activityPageService: ActivityPageService,
    private contextService: ContextService,
    protected router: Router,
    private globalService: GlobalService,
    private contentCommonService: ContentCommonService,
    private StepflowService: StepflowService,
    private _snackBar: MatSnackBar,
    private cd: ChangeDetectorRef
  ) {
    super(router, route, sharedService);
  }


  initValue(data) {
    data = { ...data };
    console.log("hasPublished", this.hasPublished);
    console.log("hasProperty", this.hasProperty);
    if (data.assetStatus == ASSET_STATUSES.PUBLISHED || data.assetStatus == ASSET_STATUSES.CURRENT) {
      data.assetStatus = ASSET_STATUSES.PUBLISHED
    } else if (data.assetStatus == ASSET_STATUSES.OBSOLETE) {
      data.assetStatus = ASSET_STATUSES.OBSOLETE;
      this.hasPublished = true;
    } else if (data.assetStatus == ASSET_STATUSES.DRAFT) {
      data.assetStatus = ASSET_STATUSES.DRAFT
    } else {
      data.assetStatus = data.assetStatus
    }
    // sessionStorage.setItem('sfID', data.id);
    // sessionStorage.setItem('sfcontentId', data.contentId);
    // sessionStorage.setItem('sfversion', data.version ? data.version : '0');
    // sessionStorage.setItem('sfStatus', assetStatus);
    this.globalData = data;

    this.globalData.originalAssetStatusId = data.assetStatusId;
    this.globalData.originalAssetStatus = data.assetStatus;
    this.sharedService.stepflowGlobalData(data);

  }


  ngOnInit(): void {
    const userEmail = sessionStorage.getItem('userMail');
    this.loadStep();
    let version;
    this.route.params.subscribe((param) => {
      let contentType;
      if (param['contentId']) {
        console.log("contentId", param);
        this.contentTextId = 'contentId';
        contentType = param['contentId'].split('-');
        contentType = contentType[1] == 'P' ? 'SP' : 'SP';
        this.id = param['contentId'] ? param['contentId'] : '';
        this.contentId = param['contentId'] ? param['contentId'] : '';
        this.contentType = contentType;
        this.status = this.route.snapshot.queryParams['status'] ? this.route.snapshot.queryParams['status'] : 'published';
        this.hasProperty = this.id && this.id.length > 0 ? false : true;
        version = param['version'];
      } else if (param['id']) {
        this.contentTextId = 'id';
        this.id = param['id'] ? param['id'] : '';
        this.hasProperty = isNaN(this.id);
        this.status = this.route.snapshot.queryParams['status'] ? this.route.snapshot.queryParams['status'] : 'published';
        version = this.route.snapshot.queryParams['version'];
      }
      this.version = version ? version : '1';
      this.route.queryParams.subscribe(urlParam => {
        if (param['contentId'] || (param && param['id'] && param['id'] > 0) || (param && param['id'] && param['id'] > 0 && urlParam['userMail'])) {
          if (urlParam['userMail'] && urlParam['userMail'].length > 0) {
            // sessionStorage.setItem('sfStatus', 'draft');
          }

          if (param['id'] || urlParam['userMail']) {
            // this.hasPublished = false;
            this.loadingProcessMap = true;
            this.processMapsService.getProcessMap(param['id'], undefined, urlParam.contentType, this.status, this.version)
              .subscribe((data) => {
                this.initValue(data);
                this.loadingProcessMap = false;
              }, () => {
                this.loadingProcessMap = false;
              });
          }
          if (param['contentId']) {
            // sessionStorage.setItem('sfStatus', 'published');
            // sessionStorage.setItem('sfversion', param['version'] ? param['version'] : '0');
            // sessionStorage.setItem('documentWorkFlowStatus', 'published');
            this.hasPublished = true;
            this.loadingProcessMap = true;
            this.processMapsService.getProcessMapbycontentID(param['contentId'], this.contentType, this.version, this.status)
              .subscribe((data) => {
                this.loadingProcessMap = false;
                this.initValue(data);
              },() => {
                this.loadingProcessMap = false;
                });
          }

        }

      });





      // this.processMapsService.GetStepFlowByContentId(this.id).subscribe(
      //   (data) => {
      //     console.log('cintentid', data);
      //   });

      this.sharedService.backToStep.subscribe((backTostep) => {
        this.backToSpepTab = backTostep;
      });

      if (this.id && this.backToSpepTab == true) {
        this.nextTab(1);
        this.sharedService.backToStepflowShared(false);

        this.sharedService.backToStep.subscribe(() => {

        });
      }

      if (this.sharedService.getNextTab()) {
        let redirect = this.sharedService.getNextTab();

        this.nextTab(redirect);
        this.sharedService.setNextTab(false);
      }
    });

    this.rservice.broadcast.subscribe(
      (broadCastMessage) => (this.broadCastMessage = broadCastMessage)
    );
    if (this.id) {
      let getGlobalData;
      // this.loading = true;
      if(this.contentTextId == 'contentId') {
        this.loading = true;
        this.processMapsService.getProcessMapbycontentID(this.id, this.contentType, this.version, this.status).subscribe(
          (contentData) => {
            getGlobalData = contentData;
            this.showMenuActions = true;
            this.hasPublished = true;
            this.globalDataBuf = JSON.parse(JSON.stringify(contentData));
            this.prograssBarStatus = this.globalData.assetStatus;
          },
          (error) => {
            console.error('There was an error!', error);
            if (error.status == 403 && error.statusText == 'Not Authorized') {
              console.log('Access Denied!');
              this.loading = false;
              }

            this.loading = false;
          }
        )
      } else {
        this.loadingProcessMapByContentType = true;
        this.processMapsService.getProcessMap(this.id, this.contentId, this.contentType, this.status, this.version).subscribe(
          (data) => {
            this.loadingProcessMapByContentType = false;
            getGlobalData = data;
            this.showMenuActions = true;
            console.log(data);
            console.log(data, "anupam")
            if ( data.assetStatusId == 4 ) {
              console.log("okkkkkkkk");
              this.hasPublished = true;
              this.previewModeJC = true;
            }  if ( data.assetStatusId == 3 ){
              this.previewModeJC = true;
            } else {
              // this.hasPublished = false;
            }




            this.globalDataBuf = JSON.parse(JSON.stringify(data));
            this.globalDataBuf.originalAssetStatusId = this.globalDataBuf.assetStatusId;
            this.globalDataBuf.originalAssetStatus = this.globalDataBuf.assetStatus;
            this.prograssBarStatus = data?.assetStatus;
          },
          (error) => {
            this.loadingProcessMapByContentType = false;
          }
        )
      }
      this.disableTab = false;
      if(this.globalData) {
        this.prograssBarStatus = this.globalData['assetStatus'] || sessionStorage.getItem('documentWorkFlowStatus');

        sessionStorage.setItem('stepflowid', this.id);

        this.mapTitle = this.globalData.title;
        this.title = this.globalData.title;
        // this.showMenuActions = true;
        console.log(this.globalData);
        //this.type = this.helper.getContentType(data.contentTypeId);
        this.globalData.contentType = this.contentType;
        this.globalData.contentStatus = this.globalDataBuf.assetStatus;
        this.globalData['readMode'] = true;
        this.globalData['contentType'] = this.contentType;
        this.globalData.originalAssetStatusId = this.globalData.assetStatusId;
        this.globalData.originalAssetStatus = this.globalData.assetStatus;
        this.hasPublished = this.globalData.assetStatus === ASSET_STATUSES.PUBLISHED || this.globalData.assetStatus == ASSET_STATUSES.ARCHIVED || this.globalData.assetStatus === ASSET_STATUSES.CURRENT || this.globalData.assetStatus === ASSET_STATUSES.OBSOLETE || this.globalData.assetStatus === ASSET_STATUSES.APPROVED_WAITING_FOR_JC || (this.globalData.assetStatus === ASSET_STATUSES.SUBMITTED_FOR_APPROVAL && this.globalData.contentOwnerId !== userEmail);
        console.log("UsJurisdiction", data);
          // this.UsJurisdiction = data.usJurisdiction;
          // this.UsClassification = data.usClassification;
        this.loadContextInfo();
        if (
          this.globalData.assetStatus === ASSET_STATUSES.PUBLISHED || this.globalData.assetStatus === ASSET_STATUSES.CURRENT || this.globalData.assetStatus === ASSET_STATUSES.OBSOLETE  || this.globalData.assetStatus === ASSET_STATUSES.APPROVED_WAITING_FOR_JC
        ) {
          this.sharedService.nextStepPublishedData(true);
        } else {
          this.sharedService.nextStepPublishedData(false);
        }
        let checkStepPreview = sessionStorage.getItem('backPriviewOn')
        console.log('checkStepPreview', checkStepPreview);
        if (checkStepPreview == 'true') {
          this.handleOnPreviewClick(false);
          // sessionStorage.setItem('backPriviewOn', 'false');
        }
        else if (checkStepPreview == 'false') {
          sessionStorage.setItem('backPriviewOn', 'false');
        }
        else {
          sessionStorage.setItem('backPriviewOn', 'false');
        }
      }

    } else {
      console.log('No ID');
      this.disableTab = true;
      this.type = 'SP';
      this.previewMode = false;
      this.hasPublished = false;
    }
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

  onTabChanged(event) {
    super.onTabChanged(event);
    if (this.isFormDirty) {
      this.selectedIndex = this.prevSelectedIndex;
    } else if (!this.isFormDirty) {
      this.prevSelectedIndex = event.index;
      this.selectedIndex = event.index;
    }

    console.log('Tab Change', event);
    // this.setToolTip()
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
          this.loadStep();
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
      const ID = JSON.parse(JSON.stringify(this.globalDataBuf.id));
      this.processMapsService
        .saveAsStep({ id: ID })
        .subscribe((res) => {
          this.globalDataBuf = JSON.parse(JSON.stringify(res));
          this.globalData = res;
          this.globalData['readMode'] = false;
          // sessionStorage.setItem('sfStatus', 'draft')
          this.processMapsService.getProcessMap(res['id']).subscribe((data: any) => {
            this.loading = false;
            this.globalData = data;

            this.globalData.originalAssetStatusId = data.assetStatusId;
            this.globalData.originalAssetStatus = data.assetStatus;
          });
          sessionStorage.setItem('stepflowid', res['id']);
          this.sharedService.nextDocStatus(true);
          this.sharedService.nextStepPublishedData(false);
          this.router.navigate([
            '/process-maps/SP/' + res['id'],
          ],{
            queryParams: {
              status: 'draft',
              contentId: res['contentId'],
              contentType: 'SP',
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
  }
  handleOnRevisionClick(value) {
    if (value) {
      this.loading = true;
      console.log("handleOnRevisionClick.globalDataBuf", this.globalDataBuf);
      const ID = JSON.parse(JSON.stringify(this.globalDataBuf.id));
      this.processMapsService
        .reviseStep({ id: ID })
        .subscribe((res) => {
          this.globalData = res;
          this.globalData['readMode'] = false;
          // sessionStorage.setItem('sfStatus', 'draft')
          this.loading = true;
          this.processMapsService.getProcessMap(res['id']).subscribe((data: any) => {
            this.globalData = data;

            this.globalData.originalAssetStatusId = data.assetStatusId;
            this.globalData.originalAssetStatus = data.assetStatus;
            this.sharedService.stepflowGlobalData(data);
            this.loading = false;
          });
          console.log("handleOnRevisionClick", res);
          sessionStorage.setItem('stepflowid', res['id']);
          this.sharedService.nextDocStatus(true);
          this.sharedService.nextStepPublishedData(false);
          this.router.navigate([
            '/process-maps/SP/' + res['id'],
          ],{
            queryParams: {
              status: 'draft',
              contentId: res['contentId'],
              contentType: 'SP',
              version: res['version']
            }
          });
          this.loading = false;
        },
          ({ error }) => {
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

  // updatePurposeField(updatedObj) {
  //   console.log("Purpose updateObj", updatedObj);
  //   if(updatedObj.purpose){
  //     this.globalData.purpose = updatedObj.purpose;
  //   }else{
  //     this.globalData.purpose = updatedObj;
  //   }

  //   this.propertiesLastUpdateDateTime = updatedObj.propertiesLastUpdateDateTime;
  // }
  updatePurposeField(updatedObj) {
    this.globalData.purpose = updatedObj;
    // this.propertiesLastUpdateDateTime = updatedObj.propertiesLastUpdateDateTime;
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

  loadProcessMap() {
    this.loading = true;
    this.processMapsService.getProcessMap(this.id)
      .subscribe((processMap: any) => {
        this.globalData = processMap;

        this.globalData.originalAssetStatusId = processMap.assetStatusId;
        this.globalData.originalAssetStatus = processMap.assetStatus;
        this.loading = false;
      });
  }


  reloadData(arg) {


    this.activityArg = arg;
    this.loadStep()
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

