import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Store, select } from '@ngrx/store';
import { selectContentList } from '@app/reducers';
import { ContentListsState } from '@app/dashboard/content-list/content-list.reducer';
import { RecordsService } from '@app/shared/records.service'
import { ProcessMapsService } from '../../process-maps.service';
import { ExportComplianceComponent } from '@app/shared/component/top-menu-actions/export-compliance/export-compliance.component';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { StepExportComplianceComponent } from './step-export-compliance/step-export-compliance.component';
import { StepflowService } from '../stepflow.service';
import { SharedService } from '@app/shared/shared.service';
import { ProcessMapEditDataService } from '@app/process-maps/process-map-edit/services/process-map-edit-data.service';
import { ActivityPageService } from '@app/activity-page/activity-page.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-step',
  templateUrl: './step.component.html',
  styleUrls: ['./step.component.scss']
})
export class StepComponent implements OnInit {
  @Input() globalData: any;
  selectedIndex = 0;
  mapTitle: string = "";
  backText: string =  "<< Back to the STEP Flow";
  previewMode: boolean = false;
  contentType: string = 'SP';
  documentCreateStatus: boolean;
  publishMode: boolean = true;
  formDirty: boolean = false;
  hasPublished = false;
  loading = false;
  isFormDirty: boolean = false;
  hasProperty: any = false;
  showMenuActions = true;
  id;
  disableTab: boolean = false;
  disableForm: boolean = false;
  docStatusM: any = 'draft';
  docTypeStatus: string = "";
  contentId;
  type: string = 'CG';
  isCheckOut: Boolean = true;
  docStatus = 1;
  dropDownList;
  globalDataBuf: any;
  prevSelectedIndex: number = 0;
  updatedContentOwner: string = "";
  nodePath: any;
  appened: any;
  broadCastMessage: any = '';
  selectable = true;
  removable = true;
  addOnBlur = true;
  public opened = true;
  public sharedValue:any;
  previewStatus:any;
  publishedStatus:any;
  title: string;
  propertiesLastUpdateDateTime: any;
  docStatusValue:any;
  backToStepflow:boolean = false;
  swnumber : any = null;


  addedStep : any = [];

  public stepData : any ;

  isChecked = false;
  showSubMenuActions: boolean = false;

  constructor(private route: ActivatedRoute,public dialog: MatDialog,
    private store: Store<ContentListsState>,private rservice: RecordsService,
    private processMapsService: ProcessMapsService,
    private dataService: ProcessMapEditDataService,
    private dbService: NgxIndexedDBService,
    public  stepflow :  StepflowService,
    private sharedService: SharedService,
    private router: Router,
    private activityPageService: ActivityPageService,
    private _snackBar: MatSnackBar,
    ){

      this.route.params.subscribe((param) => {
        this.id = parseInt(param['id']);
      this.dbService.getByKey('step', this.id).subscribe((step) => {
      this.stepData = step});
      });
  }


  reloadSw(){


    console.log(this.swnumber)
    this.sharedService.activeSw.emit(this.swnumber)
    this.swnumber = null;
  }
  reloadData(isListView) {


    if (typeof isListView == 'number'){

this.swnumber = isListView

    }


    if (isListView) {
      this.initData();

    } else {
      this.loadProcessMap();
    }
  }

  initData(){
    let stepID;
    if(parseInt(window.location.href.split("/").pop())) {
      stepID = parseInt(window.location.href.split("/").pop())
    } else {
      stepID = sessionStorage.getItem('stepId');
    }

    this.stepflow.getStepById(parseInt(stepID)).subscribe((data)=>{
    this.stepData = data[0]
    this.addedStep = data[0].stepSwimLanes;
    this.mapTitle =this.stepData.stepTitle;
    this.reloadSw();
     })
  }

  ngOnInit(): void {
    this.sharedService.docValue.subscribe(previewValue => {
      this.previewStatus = previewValue;
      console.log( 'previewStatus', this.previewStatus);
    });

    this.initData();

    this.route.params.subscribe((param) => {
      if(parseInt(window.location.href.split("/").pop())) {
        this.id = parseInt(param['id']);
      } else {
        this.id = sessionStorage.getItem('stepId');
      }
      this.hasProperty = isNaN(this.id);
    });

    this.rservice.broadcast.subscribe(
      (broadCastMessage) => (this.broadCastMessage = broadCastMessage)
    );
    if(this.id){
      this.loading = true;
      this.disableTab = false;
      this.hasProperty = isNaN(this.id);
      this.loadProcessMap();
    } else {
      console.log("No ID");
      this.disableTab = true;
      this.type = 'SF';
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



  nextTab(redirect) {
    if (redirect) {
      this.selectedIndex = this.selectedIndex + 1;
    }
  }

  clickss(){
    console.log("Clicksss");
  }

  onExportComplianceClick(warningTemplate) {

    // if(this.formDirty) {
    //   const dialogRef = this.dialog.open(warningTemplate, {
    //     width: '42%',
    //     disableClose: true,
    //     panelClass: 'custom-dialog-container'
    //   });
    // } else {
    //   const exportDialog = this.dialog.open(ExportComplianceComponent, {
    //     width: '60%',
    //     height: '90%',
    //   });
    // }
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
          this.loadProcessMap();
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
      this.processMapsService.saveAsStepflow(this.globalDataBuf).subscribe((res) => {
        this.globalData = res;
        this.globalData['readMode'] = true;
        this.router.navigate(['/view-document/SF', res['id']]);
        sessionStorage.setItem("stepflowid", res['id']);
        this.loading = false;

      });
    }
  }

  handleOnPreviewClickstep(value){
    // this.sharedService.setNextTab(true);
    this.sharedService.nextDocStatus(value);
    this.globalData.assetStatusId = this.globalDataBuf.assetStatusId;
    this.globalData.originalAssetStatusId = this.globalDataBuf.assetStatusId;
    if (value == true) {
      // this.globalData.assetStatusId = 2;
      this.hasPublished = false;
      this.previewMode = false;
    }
    else if(value==false){
      this.globalData.assetStatusId = 2;
      this.hasPublished = true;
      this.previewMode = true;
    }
    else {
      this.hasPublished = false;
      this.previewMode = false;
    }
    this.globalData = JSON.parse(JSON.stringify(this.globalData));

  }

  handleOnPreviewClick(value) {
    this.sharedService.setNextTab(true);
    this.globalData.assetStatusId = this.globalDataBuf.assetStatusId;
    this.globalData.originalAssetStatusId = this.globalDataBuf.assetStatusId;

    this.globalData.assetStatus = this.globalDataBuf.assetStatus;
    this.globalData.originalAssetStatus = this.globalDataBuf.assetStatus;
    if (value) {
      this.hasPublished = false;
      this.previewMode = false;
      this.docStatusValue=1;
    } else {
      this.globalData.assetStatusId = 2;
      this.hasPublished = true;
      this.previewMode = true;
      this.docStatusValue=2;
    }
    this.globalData = JSON.parse(JSON.stringify(this.globalData));
    let redirect = this.sharedService.getNextTab();
    if(this.selectedIndex==0 || this.selectedIndex==1){
      this.nextTab(redirect)
    }
    else{
      this.selectedIndex=0;
    }

  }
  handleOnRevisionClick(value) {
    if (value) {
      // this.loading = true;
      // this.criteriaGroupService.GetRevisionData(this.globalDataBuf).subscribe((res) => {
      //   this.globalData = res;
      //   this.globalData['readMode'] = true;
      //   this.router.navigate(['criteria-group', res['id']]);
      //   this.loading = false;

      // });
    }
  }

  handleApprovalAction(value) {
    this.globalData.assetStatusId = 2;
    this.globalData.originalAssetStatusId = 2;
    this.hasPublished = true;
    this.updatedContentOwner = "";
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

  onTabClick(event) {
      this.selectedIndex = event.index;
    }
  backToStepFlow(){
    this.sharedService.backToStepflowShared(true);

    if(this.previewStatus==false){
      sessionStorage.setItem('backPriviewOn', 'true');
    }
    else if(this.previewStatus==true){
      sessionStorage.setItem('backPriviewOn', 'false');
    }
    else{
      sessionStorage.setItem('backPriviewOn', 'false');
    }



    this.sharedService.nextDocStatus(true);
    this.sharedService.nextStepPublishedData(false);

    let stepflowId:any;
    stepflowId = sessionStorage.getItem("stepflowid")
    console.log('stepflowId', stepflowId);

    let idCheck = isNaN(stepflowId)
    if(idCheck){
      if(stepflowId.includes('-')){
        this.router.navigate(['/view-document/SF/', stepflowId]);
      }
    }
    else{
      this.router.navigate(['/process-maps/create-progressmap/', stepflowId]);
    }



  }

  loadProcessMap() {
    console.log("steps-SPSF");
    this.processMapsService.getProcessMap(this.id)
      .subscribe((data) => {
          this.globalDataBuf = JSON.parse(JSON.stringify(data));
          this.globalData = data;
          if (data['assetStatusId'] == 4) {
            // data['originalAssetStatusId'] = 2;
            // data['assetStatusId'] = 2;
            this.showSubMenuActions = false;
          } else {
            this.showSubMenuActions = true;
          }
          this.mapTitle = this.globalData.title;
          this.loading = false;
          this.showMenuActions = true;
          //this.type = this.helper.getContentType(data.contentTypeId);
          this.globalData.contentType = this.contentType;
          this.globalData.contentStatus = data.assetStatusId;
          this.globalData['readMode'] = true;
          this.globalData['contentType'] = this.contentType;
          this.globalData.originalAssetStatusId = this.globalData.assetStatusId;
          // this.globalData['editMode'] = true;
          // this.previewMode = this.globalData.assetStatusId != 2;
          if(this.previewStatus==false){
            this.handleOnPreviewClickstep(this.previewStatus);
          }

          this.sharedService.sharedStepPublished.subscribe(publishedValue => {
            this.publishedStatus = publishedValue;
            console.log( 'publishedStatus', this.publishedStatus);
            if(this.publishedStatus == true){
              this.globalData.contentStatus = 2;
              this.globalData.assetStatusId = 2;
              this.hasPublished = true;
              this.docStatus = 2 ;
              this.docStatusValue=2;
              this.globalData.originalAssetStatusId = 2;
            }
            else if( this.previewStatus == false){
              // this.globalData.contentStatus = 2;
              // this.globalData.assetStatusId = 2;
              // this.hasPublished = true;
              // this.docStatus = 2 ;
              // this.docStatusValue=2;
              // this.globalData.originalAssetStatusId = 2;
              this.handleOnPreviewClickstep(this.previewStatus);
            }

            else{
              this.hasPublished = false;
              this.docStatus = 1 ;
              this.docStatusValue=1;
              this.globalData.contentStatus = data.assetStatusId;
              this.globalData.assetStatusId = this.globalDataBuf.assetStatusId;
              this.globalData.originalAssetStatusId = this.globalDataBuf.assetStatusId;
            }


          });

        },
        (error) => {
          this.dialog.closeAll();
          console.error('There was an error!', error);
          if (error.status == 403) {
            console.log("Access Denied! ");
            this.loading = false;
          }
          this.loading = false;

        });
  }

}

