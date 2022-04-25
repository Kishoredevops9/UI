import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Color } from '@angular-material-components/color-picker';
import { ActivityPageSearchComponent } from '../../activity-page-search/activity-page-search.component';
import { TaskPopupsComponent } from '../../../task-creation/task-creation-details/task-popups/task-popups.component';
import { DEFAULT_NODE_BACKGROUND, DEFAULT_NODE_BORDER } from '../../process-maps.consts';
import { SubMapSearchComponent } from '../../sub-map-search/sub-map-search.component';
import { hexToRgb } from '../../../shared/utils/hexToRgb';
import { ProcessMapsService } from '../../process-maps.service';
import { Router, ActivatedRoute } from '@angular/router';

interface DialogData {
  activityTypeId: number;
  groupId: string;
  figure: string;
  processMapId: number;
  swimLaneId: number;
  model: any;
  milestoneActvities: any;
  autofill: boolean;
  editShapedata: any;
  editShapeMap: any;
  ShapeActivityData: any;
  swimMapID: any;
  procesMapId: number;
  isMapView: boolean;
}

@Component({
  selector: 'app-add-activity-modelbox',
  templateUrl: './add-activity-modelbox.component.html',
  styleUrls: ['./add-activity-modelbox.component.scss']
})
export class AddActivityModelboxComponent implements OnInit {

  // createdByUserId:profileUsers.mail
  hide = true;
  activityForm: FormGroup;
  selectedFormName: number = 0;
  activityShapeBlock: number;
  activityTypeId: number;
  groupId: string;
  figure: string;
  milestoneDropDown: boolean = true;
  processMapId: number;
  swimLaneId: number;
  model: any = [];
  ssID: any;
  milestoneActvities: any = [];
  touchUi: boolean;
  objData: any;
  // activityTypes = [
  //   { type: 'Milestone', activityTypeId: 1 },
  //   { type: 'Decision', activityTypeId: 2 },
  //   { type: 'Sub Map', activityTypeId: 3 },
  //   { type: 'Data', activityTypeId: 4 },
  //   { type: 'Activity Block', activityTypeId: 5 },
  //   { type: 'Off Page reference', activityTypeId: 6 },
  //   { type: 'Separator', activityTypeId: 7 },
  //   { type: 'Terminator', activityTypeId: 8 },
  //   { type: 'K-Pack', activityTypeId: 9 },
  //   { type: 'EmptyBlock', activityTypeId: 10 },
  //   { type: 'Start', activityTypeId: 11 },
  //   { type: 'End', activityTypeId: 12 }
  // ];
  autofill: boolean;
  addEditBTN: boolean = false;
  kpackForm: boolean = false;
  searchData: any = [];
  editActivityDataObj: any;
  editShapeMapView: any;
  swimMapID: any;
  toSelect: any;
  phases:any = [];
  activityAdd:any = [];
  phaseSelect:any;
  selected:any;
  id;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddActivityModelboxComponent>,
    @Inject(MAT_DIALOG_DATA) private data: DialogData,
    public searchDialog: MatDialog,
    private processMapsService: ProcessMapsService,
    private router: Router,
    private route: ActivatedRoute

  ) { }

  ngOnInit(): void {
    this.activityForm = this.createActivityForm();
    console.log(this.data);
    this.processMapsService.GetAllActivity().subscribe(
      (data) => {this.activityAdd = data; console.log('phasedata', this.phases)
      this.activityForm.get('activityTypeId').setValue( this.activityAdd[0].id);
    });

    this.processMapsService.GetAllPhases(this.data).subscribe(
      (data) => {this.phases = data; console.log('phasedata', this.phases)
      this.activityForm.get('phaseId').setValue( this.phases[0].id);
    });

    this.activityForm.get('activityTypeId').setValue(1);
    this.hideShowMilestoneDropDown(5);

    if (this.editActivityDataObj && this.editActivityDataObj.id != undefined) {
      this.activityForm.patchValue({
        id: this.editActivityDataObj.id,
        activityTypeId: this.editActivityDataObj.activityTypeId,
        swimLaneId: this.editActivityDataObj.swimLaneId,
        name: this.editActivityDataObj.name,
        reviewGate: this.editActivityDataObj.reviewGate,
        backgroundColor: this.createColorControl(this.editActivityDataObj.backgroundColor || DEFAULT_NODE_BACKGROUND),
        borderColor: this.createColorControl(this.editActivityDataObj.borderColor || DEFAULT_NODE_BORDER),
        borderWidth: this.editActivityDataObj.borderWidth,
        borderStyle: this.editActivityDataObj.borderStyle,
        description: this.editActivityDataObj.description,
      });
      this.addEditBTN = true;
    }

    if (this.editShapeMapView.id != undefined) {
      this.activityForm.patchValue({
        id: this.editShapeMapView.id,
        activityTypeId: this.editShapeMapView.activityTypeId,
        swimLaneId: this.editShapeMapView.swimLaneId,
        name: this.editShapeMapView.text,
        reviewGate: this.editShapeMapView.reviewGate,
        backgroundColor: this.createColorControl(this.editShapeMapView.fill || DEFAULT_NODE_BACKGROUND),
        borderColor: this.createColorControl(this.editShapeMapView.stroke || DEFAULT_NODE_BORDER),
        borderWidth: this.editShapeMapView.borderWidth,
        borderStyle: this.editShapeMapView.borderStyle,
        description: this.editShapeMapView.description,
      });
      this.addEditBTN = true;
    }

    this.activityForm.patchValue({
      swimLaneId: this.editShapeMapView && this.editShapeMapView.swimLaneId ? this.editShapeMapView.swimLaneId : this.model.cid,
      processMapId: this.editShapeMapView.processMapId
    });

    //If activity is a milestone, don't show the milestone dropdown
    if (this.data.activityTypeId == 4) {
      this.milestoneDropDown = false;
      this.activityForm.patchValue({
        milestoneId: null,
      });
    }

    if (this.activityTypeId) {
      this.hideShowMilestoneDropDown(this.activityTypeId)
    }



  }

  private createActivityForm(): FormGroup {
    return this.fb.group({
      id: [null],
      name: [null, Validators.required],
      swimLaneId: [null],
      activityTypeId: [null, Validators.required],
      phaseId: [null],
      description: [null],
      label: [null],
      sequenceNumber: [null],
      backgroundColor: [this.createColorControl(DEFAULT_NODE_BACKGROUND)],
      borderColor: [this.createColorControl(DEFAULT_NODE_BORDER)],
      borderStyle: ['solid'],
      borderWidth: [1],
      version: [1],
      processMapId: [null],
      assetContentId:[null]
    })


  }

  //Submits the form to the database

  onAddActivity() {

    var TempData = { ...this.activityForm.value }
    console.log('activityData', TempData);
    //  TempData['activityDocuments'] = this.searchData;
    TempData['assetContentId']= this.activityForm.value.description;
    TempData.backgroundColor = TempData.backgroundColor.hex
    TempData.borderColor = TempData.borderColor.hex
    console.log('temdata', TempData);
    this.dialogRef.close(TempData);
  }

  //Closes the form without submitting the new Activity
  onClose() {
    this.dialogRef.close();
  }

  //Determines if the milestone drop down should be shown(Hidden if it is a milestone, Show if it is not)
  hideShowMilestoneDropDown(value) {
    this.selectedFormName = value;
    if (value == 4) {
      this.milestoneDropDown = false;
      this.activityForm.patchValue({
        milestoneId: null,
      });
    }
    else {
      this.milestoneDropDown = true;
    }
  }

  activitySearch() {
    this.openSearchDialog();
  }

  openSearchDialog() {
    const searchDialogRef = this.searchDialog.open(ActivityPageSearchComponent, {
      width: '90%',
      height: '90%'
    });

    searchDialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('searchData', result);
        this.searchData.length = 0;
        if (this.selectedFormName == 5) {
          this.searchData.push({
            contentId: result.contentid,  // need to change with cid
            type: 'AP',
            version: 1,
            activityPageId: result.contentid,
          })
        }
        else if (this.selectedFormName == 3) {
          this.searchData.push({// need to change with cid
            contentId: result.contentid,
            type: 'SUB MAP',
            version: 1,
            subProcessMapId: result.id
          })
        }


      }
      this.activityForm.controls['description'].setValue(result.contentid);
      this.activityForm.controls['name'].setValue(result.title);
      this.activityForm.controls['version'].setValue(result.version);
      // this.activityForm.controls['reviewGate'].setValue(result.phaseid);

    });

  }

  openTaskKPacks(kPackProcessMap) {
    const dialogRef = this.searchDialog.open(TaskPopupsComponent, {
      width: '90%',
      height: '90%',
      data: {
        doc: { contentType: 'T' },
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.searchData.length = 0;
      console.log('id', result);
      result.id = result.contentid
      if (this.selectedFormName == 9) {
        this.searchData.push({
          contentId: result.id,  // need to change with cid
          type: 'K-Pack',
          version: 1,
          activityPageId: null,
        })
      }
      else if (this.selectedFormName == 3) {
        this.searchData.push({// need to change with cid
          contentId: result.id,
          type: 'SUB MAP',
          version: 1,
          subProcessMapId: result.id
        })
      }
      this.activityForm.controls['description'].setValue(result.id);
      this.activityForm.controls['name'].setValue(result.title);
      this.activityForm.controls['version'].setValue(result.version);
    });

  }

  dialogBoxMap() {
    const dialogRef = this.searchDialog.open(SubMapSearchComponent, {
      width: '90%',
      height: '90%'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.searchData.length = 0;
        if (this.selectedFormName == 5) {
          this.searchData.push({
            contentId: result.id,  // need to change with cid
            type: 'AP',
            version: 1,
            activityPageId: result.id
          })
        }
        else if (this.selectedFormName == 3) {
          this.searchData.push({// need to change with cid
            contentId: result.id,
            type: 'SUB MAP',
            version: 1,
            subProcessMapId: result.id
          })
        }
      }
      console.log('The dialog was closed');
      console.log(result);
      this.activityForm.controls['description'].setValue(result.id);
      this.activityForm.controls['name'].setValue(result.title);
      this.activityForm.controls['version'].setValue(result.version);
    });
  }

  private createColorControl(hex: string) {
    const { r, g, b } = hexToRgb(hex);
    return new Color(r, g, b);

    
  }

}
