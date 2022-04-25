import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddStepModelboxComponent } from './add-step-modelbox/add-step-modelbox.component';
import { AddStepPopupComponent } from './add-step-popup/add-step-popup.component';
import { StepflowService } from './stepflow.service';
import { ActivatedRoute } from '@angular/router';
import { ProcessMapsService } from '@app/process-maps/process-maps.service';
import { SharedService } from '@app/shared/shared.service';
import { ProcessMap } from '../process-maps.model';
import { ProcessMapEditDataService } from '../process-map-edit/services/process-map-edit-data.service';
import { Store, select } from '@ngrx/store';
import { selectSelectedProcessMap } from '@app/reducers';
import { ASSET_STATUSES } from '@environments/constants';
import { RecordsService } from '@app/shared/records.service';

@Component({
  selector: 'app-step-flow',
  templateUrl: './step-flow.component.html',
  styleUrls: ['./step-flow.component.scss']
})
export class StepFlowComponent implements OnInit {
  ASSET_STATUSES = ASSET_STATUSES;
  @Input() globalData: any;
  addedStep: any = [];
  version:any;
  contentType:any;
  status:any;
  sfId: any;
  loading = false;
  id:any;
  contentId:any;
  globalDataBuf: any;
  hasProperty: any = true;
  hasPublished: any = false;
  @Input()
  previewMode: boolean;
  stepID:any;
  ReviseVersion:any;
  isChecked = false;
  isMapLoaded = false;

  constructor(
    public dialog: MatDialog,
    public stepflow: StepflowService,
    private route: ActivatedRoute,
    public processMapsService: ProcessMapsService,
    private sharedService: SharedService,
  ) {}

  ngOnChanges(event) {

  }

  onTabClick(event) {
    console.log(event.index);
    console.log('Tab Change')
  }


  ngOnInit(): void {

    console.log("step-flow-SPSF");

    let contentType;
    this.route.params.subscribe((param) => {
      if(param['id']) {
        this.sfId = param['id'];
        this.version = this.route.snapshot.queryParams['version'];
        this.contentType = this.route.snapshot.queryParams['contentType'];
        this.status = this.route.snapshot.queryParams['status'];
      } else{
        this.contentId = param['contentId'];
        contentType = param['contentId'].split('-');
        contentType = contentType[1] == 'F' ? 'SF' : 'SF';
        this.contentType = contentType;
        this.version = param['version'] || '0';
        this.status = this.route.snapshot.queryParams['status'] ? this.route.snapshot.queryParams['status'] : 'published';
      }

      // this.loadSteptreeData();
    });
    this.sharedService.stepflowID.subscribe(stepValue => {
      this.stepID = stepValue;
      console.log('this.stepID ', this.stepID );
    });

    if(this.id) {
      this.processMapsService.getProcessMap(this.id, this.contentId, this.contentType, this.status, this.version)
      .subscribe((processMap) => {
        this.globalData = processMap;
        this.ReviseVersion = this.globalData.version;
        this.loadSteptreeData();
      });
    } else {
      if(this.contentId){
        this.loading = true;
        this.processMapsService.getProcessMapbycontentID(this.contentId, this.contentType, this.version, this.status )
      .subscribe((processMap) => {
        this.globalData = processMap;
        this.ReviseVersion = this.globalData.version;
        this.loading = false;
        this.loadSteptreeData();
      }, ()=>{
        this.loading = false;
      });
    }

    }

    let FlagCheck = isNaN(parseInt(window.location.href.split("/").pop())) ? false : true;



    if  (FlagCheck) {
      this.stepflow.getStepFlowByid(parseInt(window.location.href.split("/").pop())).subscribe((data)=> {
        if (data && data[0] && data[0].sfSwimLanes && data[0].sfSwimLanes[0] && data[0].sfSwimLanes[0].steps) {
          this.addedStep = data[0].sfSwimLanes[0].steps;
        }
      })
    }







    // let FlagCheck = isNaN(parseInt(window.location.href.split("/").pop())) ? false : true;
    // if (FlagCheck) {
    //   this.stepflow.getStepFlowByid(parseInt(window.location.href.split("/").pop())).subscribe((data) => {
    //     if (data && data[0] && data[0].sfSwimLanes && data[0].sfSwimLanes[0] && data[0].sfSwimLanes[0].steps) {
    //       this.addedStep = data[0].sfSwimLanes[0].steps;
    //     }
    //   })

    // }
  }
  loadSteptreeData(){
    console.log("Load tree function call...")
    let FlagContentId = !isNaN(parseInt(window.location.href.split("/").pop()));


    if (this.contentId){
      console.log("Stepflow add come by contentid");
      this.loading = true;
      this.stepflow.getStepFlowByIdOrContentId(this.contentId, this.version).subscribe((data)=> {
        this.loading = false;
        if (data && data[0] && data[0].sfSwimLanes && data[0].sfSwimLanes[0] && data[0].sfSwimLanes[0].steps) {
          this.addedStep = data[0].sfSwimLanes[0].steps;
          this.loading = false;
        }
      },(err)=>{
        this.loading = false;
        console.warn(err)
      })

    }

    if (this.id){
      console.log("Stepflow add come by id");
      this.loading = true;
      this.stepflow.getStepFlowByid(this.id).subscribe((data)=> {
        this.loading = false;
        if (data && data[0] && data[0].sfSwimLanes && data[0].sfSwimLanes[0] && data[0].sfSwimLanes[0].steps) {
          this.addedStep = data[0].sfSwimLanes[0].steps;
          this.loading = false;
        }
      },(err)=>{
        this.loading = false;
        console.warn(err)
      })


    }

    if  (FlagContentId) {
      this.loading = true;

      this.stepflow.getStepFlowByid(parseInt(window.location.href.split("/").pop())).subscribe((data)=> {

        this.loading = false;
        if (data && data[0] && data[0].sfSwimLanes && data[0].sfSwimLanes[0] && data[0].sfSwimLanes[0].steps) {
          this.addedStep = data[0].sfSwimLanes[0].steps;
          this.loading = false;
        }
      },(err)=>{
        this.loading = false;
        console.warn(err)
      })





    }
  }

  openDialog() {

    const dialogRef = this.dialog.open(AddStepModelboxComponent,
      {
        data: this.globalData.id
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  addStepPopup() {

    const dialogRef = this.dialog.open(AddStepPopupComponent,
      {
        data: this.globalData
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log("addStepPopup", result);
      if(result) {
        this.stepflow.getStepFlowByid(result.processMapId).subscribe((data) => {
          if (data && data[0] && data[0].sfSwimLanes && data[0].sfSwimLanes[0] && data[0].sfSwimLanes[0].steps) {
            this.addedStep = data[0].sfSwimLanes[0].steps;
          }
        })
      }

      console.log(`Dialog result: ${result}`);



    });
  }

  reloadData(isListView) {
    if (isListView) {
      this.loadSteptreeData();
    }
  }
}

