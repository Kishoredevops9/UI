import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { addActivitiesMetaData } from '@app/process-maps/process-maps.actions';
import { ProcessMapsService } from '@app/process-maps/process-maps.service';
import { TabOneContentService } from '@app/task-creation/task-creation-details/task-tab-one-content/task-tab-one-content.service';
import { Store } from '@ngrx/store';
import { $ } from 'protractor';
import { Subscription } from 'rxjs';
import { Observable, of } from 'rxjs';
import { startWith, map } from 'rxjs/operators';


interface DialogData {
  name: string;
  caption: string;
}

@Component({
  selector: 'app-blank-map',
  templateUrl: './blank-map.component.html',
  styleUrls: ['./blank-map.component.scss']
})
export class BlankMapComponent implements OnInit {
  private subscription: Subscription;
  public NoOfSwimLanes = '1';
  addBlanMapForm: FormGroup;
  TitleForMap: string;
  TitleForSwimLane: string;
  selectedSwimlane: string;
  blankMapDataNew: any;
  addSwimlane: any;
  valueSwim: number;
  processMapName: any;

  constructor(
    private fb: FormBuilder,
    private tabOneContentService: TabOneContentService,
    private processMapService: ProcessMapsService,
    private dialogRef: MatDialogRef<BlankMapComponent>,
    private store: Store<BlankMapComponent>,
    @Inject(MAT_DIALOG_DATA) private data: DialogData,
  ) {
    this.TitleForMap = data.name;
    this.TitleForSwimLane = data.caption;
  }

  ngOnInit(): void {
    this.addBlanMapForm = this.createBlankMapForm();
  }
  swimaleList = [
    { value: 1, viewValue: '1' },
    { value: 2, viewValue: '2' },
    { value: 3, viewValue: '3' },
    { value: 4, viewValue: '4' },
    { value: 5, viewValue: '5' }
  ];
  swimaleListBox = [
    { value: "" }
  ];

  private createBlankMapForm(): FormGroup {
    return this.fb.group({
      'TitleForMap': [null, Validators.required],
      'TitleForSwimLane': [null, Validators.required]
    })
  }

  onSelect(event) {
    this.swimaleListBox = [];
    console.log(event.value)
    var i;
    for (i = 0; i < event.value; i++) {
      console.log(i)
      this.swimaleListBox.push({ value: "" });
    };
  }

  onAddBlankMap() {
    this.processMapName;
    this.swimaleListBox;
    var mapId = Math.floor(Math.random() * (1000 - 100 + 1)) + 100;
    var mapType = "M";
    var blankMapdata = {
      "id": mapId, "type": mapType, "title": this.processMapName, "contentId": "", "swimLanes": [],
      "extend": true, "addedMap": true
    };
    if (this.processMapName && this.swimaleListBox.length > 0) {
      this.swimaleListBox.forEach(function (swimlaneValues) {
        var swimlaneId = Math.floor(Math.random() * (1000 - 100 + 1)) + 100;
        var swimLaneType = "SL";
        if (swimlaneValues.value) {
          blankMapdata['swimLanes'].push({
            "id": swimlaneId, "type": swimLaneType, "name": swimlaneValues.value,
            "excludedInd": false, "protectedInd": false, "activityBlocks": []
          });
        }
      });
    }
    this.dialogRef.close(blankMapdata);
  }

  onClose() {
    this.dialogRef.close();
  }
}
