import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { ProcessMapsState } from '@app/process-maps/process-maps.reducer';
import { Subscription } from 'rxjs';
import { TabOneContentService } from '@app/task-creation/task-creation-details/task-tab-one-content/task-tab-one-content.service';
import { BlankMapComponent } from '../../../task-creation/blank-map/blank-map.component';
import { MatDialog } from '@angular/material/dialog';
import { SubMapSearchComponent } from '../../../process-maps/sub-map-search/sub-map-search.component';
import { ActivityPageSearchComponent } from '../../../process-maps/activity-page-search/activity-page-search.component';
import { TaskPopupsComponent } from '../../../task-creation/task-creation-details/task-popups/task-popups.component';
import { TaskAddSwimlaneComponent } from '../../../task-creation/task-creation-details/task-add-swimlane/task-add-swimlane.component';
import { ConfirmDialogModel, ConfirmDialogComponent } from '@app/shared/component/confirm-dialog/confirm-dialog.component';
import { AddBuildTask } from '@app/task-creation/store/task.actions';
import { SharedService } from '@app/shared/shared.service';
@Component({
  selector: 'task-creation-map-tree',
  templateUrl: './map-tree.component.html',
  styleUrls: ['./map-tree.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class TaskCreationMapTreeComponent implements OnInit {

  confirmOption: string = '';
  taskSubMapData;
  taskActivityData;
  taskKPackData;
  taskAddSwimlaneData: string = '';
  bredCrumb : any  =[]
  //  @Input() Data: Data;
  public Data :any ;

  @Output() buildCreatedOutput = new EventEmitter<any>();
  private subscription: Subscription;
  blankMapData: any;
  blankMapDataUpdate: any;
  MapDataUpdate: any;
  masterData : any;
  bredCrumbStatus : boolean = false;

  constructor(private store: Store<ProcessMapsState>,
    private tabOneContentService: TabOneContentService,
    private dialog: MatDialog,
    public kPackDialog: MatDialog,
    public subMapDialog: MatDialog,
    public activityPageDialog: MatDialog,
    public addSwimlaneDialog: MatDialog,
    public SharedService: SharedService,
    private taskstore: Store<any>
  ) { }

  ngOnChanges(changes: any) {
    //this.BuildTaskItems$ = this.taskstore.select(store => store.TaskBuild);   
  }


  removeBredCrumb($i){ 
        this.bredCrumb.length = $i+1;
        this.Data = [this.bredCrumb[$i]];
  }

  changeBredCrumb (  data    ){ 
    this.bredCrumbStatus = true; 
    data.addedMap = true;
    this.bredCrumb.push(data); 
    this.Data = [data];

    console.log(data);
    console.log(this.Data)
  }

  ngOnInit(): void {
    this.subscription = this.tabOneContentService.getBuildTaskMapTreeData().subscribe(data => {
      this.Data = data;
      this.masterData = JSON.parse(   JSON.stringify(  this.Data ) )
    });

    this.SharedService.chipmessage.subscribe((node) => {
      if (node.hasOwnProperty("tabindex")) {
        console.log("tabinidex click in map tree")
        let Data = JSON.parse(JSON.stringify(this.Data))
        let a = []
        Data.forEach((node) => {
          if (node.addedMap) {
            a.push(node)
          }
        })
        this.taskstore.dispatch(new AddBuildTask(a));
      }
    })
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.Data['accordions'], event.previousIndex, event.currentIndex);
  }

  public cCode: any = {
    "WI": "#9D5A83",
    "GB": "#008A90",
    "DS": "#8800BA",
    "M": "#DF4B09",
    "AP": "#30A62A",
    "KP": "#732121",
    "CG": "#17b4ef",
    "TOC": "#034796",
    "RC": "#FFC400",
    "SL": "#3C445C",
    "I": "#9D5A83",
    "G": "#008A90",
    "D": "#8800BA",
    "A": "#30A62A",
    "K": "#732121",
    "C": "#17b4ef",
    "T": "#034796",
    "R": "#FFC400"
  }

  public borderCode: any = {
    "WI": "2px solid #9D5A83",
    "GB": "2px solid #008A90",
    "DS": "2px solid #8800BA",
    "M": "2px solid #DF4B09",
    "AP": "2px solid #30A62A",
    "KP": "2px solid #732121",
    "CG": "2px solid #17b4ef",
    "TOC": "2px solid #034796",
    "RC": "2px solid #FFC400",
    "SL": "2px solid #3C445C",
    "I": "2px solid #9D5A83",
    "G": "2px solid #008A90",
    "D": "2px solid #8800BA",
    "A": "2px solid #30A62A",
    "K": "2px solid #732121",
    "C": "2px solid #17b4ef",
    "T": "2px solid #034796",
    "R": "2px solid #FFC400"
  }

  onAddBlankMap() {
    const dialogRef = this.dialog.open(BlankMapComponent, {
      width: '35%',
      data: {},
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log("Blank map result data", result);
      if (result) {
        this.Data.push(result);
        this.buildCreatedOutput.emit(true);
      }
    });
  }

  confirmMapDelete(mapData): void {
    const message = `Are you sure you want to remove?`;
    const dialogData = new ConfirmDialogModel("DELETE?", message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "500px",
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      var confirmDataObj = mapData;
      (dialogResult == true) ? confirmDataObj["addedMap"] = false : confirmDataObj["addedMap"] = true
    });
  }

  confirmSwimlaneDelete(MapData, processMapData): void {
    const message = `Are you sure you want to remove Swimlane?`;
    const dialogData = new ConfirmDialogModel("Confirm Remove?", message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "500px",
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      const dataRemoved = MapData["swimLanes"].filter((el) => {
        return el !== processMapData;
      });
      var swimLaneRemoveObj = MapData;
      swimLaneRemoveObj = (dialogResult == true) ? swimLaneRemoveObj['swimLanes'] = dataRemoved : MapData;
    });
  }

  confirmActivityDelete(processMapData): void {
    const message = `Are you sure you want to remove Activity?`;
    const dialogData = new ConfirmDialogModel("Delete?", message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "500px",
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      //console.log("processMapData", processMapData);
      var confirmProcessMapObj = processMapData;
    });
  }

  public onTaskAddSwimlane(swimlane) {
    const dialogRef = this.addSwimlaneDialog.open(TaskAddSwimlaneComponent, {
      width: '35%',
      height: '35%',
    });
    dialogRef.afterClosed().subscribe((result) => {
      var swimLaneObj = swimlane;
      swimLaneObj = (result != undefined && result != null && result != '') ? swimLaneObj['swimLanes'].push({ "id": swimlane.id, "type": "SL", "name": result, "excludedInd": false, "protectedInd": false, "activityBlocks": [] }) : swimlane;
    });
  }

  openTaskKPacks(kPackProcessMap) {
    const dialogRef = this.kPackDialog.open(TaskPopupsComponent,{
      width: '90%',
      height: '90%',
      data: {
        doc: { contentType: 'T' },
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      var kPakcsObj = kPackProcessMap;
      kPakcsObj = (result != undefined && result != null && result != '') ? kPakcsObj['activityBlocks'].push({ "id": kPackProcessMap.id, "type": "KP", "acticityDocumentCode": "K", "name": result.title, "excludedInd": false, "protectedInd": false, "expended": false }) : kPackProcessMap;
      //console.log("kPakcsObj data", kPakcsObj);
    });
  }

  openTaskSubMap(subProcessMap) {
    const dialogRef = this.subMapDialog.open(SubMapSearchComponent, {
      width: '90%',
      height: '90%',
      data: {
        doc: { contentType: 'T' },
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      var subProcessObj = subProcessMap;
      // console.log(result)
      // console.log( subProcessMap  )
      subProcessObj = (result != undefined && result != null && result != '') ? subProcessObj['activityBlocks'].push({ "id": subProcessMap.id, "type": "M", "acticityDocumentCode": "M", "name": result.title, "title" : result.title, "excludedInd": false, "protectedInd": false, "expended": false }) : subProcessMap;
      //console.log("subProcessObj data", subProcessObj);
    });
  }

  openTaskActivityPage(processMap) {
    const dialogRefAP = this.activityPageDialog.open(ActivityPageSearchComponent, {
      width: '90%',
      height: '90%',
      data: {
        doc: { contentType: 'T' },
      }
    });
    dialogRefAP.afterClosed().subscribe(result => {
      var activityObj = processMap;
      activityObj = (result != undefined && result != null && result != '') ? activityObj['activityBlocks'].push({
        "id": processMap.id, "type": "AP", "acticityDocumentCode": "A", "name": result.title, "excludedInd": false, "protectedInd": false, "expended": true, "content": [
          {
            "id": processMap.id,
            "type": "WI",
            "acticityDocumentCode": "I",
            "name": "Review WI RW 12",
            "description": "Review WI",
            "expended": false
          },
          {
            "id": processMap.id,
            "type": "CG",
            "acticityDocumentCode": "C",
            "name": "Review CG FC Group 21",
            "description": "Review CG",
            "expended": false
          }
        ]
      }) : processMap;
      //console.log("activityObj data", activityObj);
    });
  }

  openSite(siteUrl, contentId) {
    window.open(siteUrl + contentId, '_blank');
  }

  addProcessMap() {
    this.Data = JSON.parse(   JSON.stringify(  this.masterData ) )
    this.buildCreatedOutput.emit(true);
  }

  resetView() { 
     this.Data = [...this.masterData];
    this.bredCrumb = [];
    let tempData = Object.assign([] , this.Data);
      tempData.map((node)=>{ 
        node['extend'] = false;
      })   
    this.Data = tempData;
    this.bredCrumbStatus =false;
  }

}
