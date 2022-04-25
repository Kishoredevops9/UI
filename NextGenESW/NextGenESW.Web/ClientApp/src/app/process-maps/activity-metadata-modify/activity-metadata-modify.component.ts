import { selectSelectedProcessMap } from './../../reducers/index';
import {
  addActivitiesMetaData,
  deleteActivitiesMetaData,
} from './../process-maps.actions';
import { Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ProcessMapsState } from '../process-maps.reducer';
import { ProcessMap, Activity, ActivityMeta } from '../process-maps.model';

interface DialogData {
  model: any;
  activityId: number;
}

@Component({
  selector: 'app-activity-metadata-modify',
  templateUrl: './activity-metadata-modify.component.html',
  styleUrls: ['./activity-metadata-modify.component.scss']
})
export class ActivityMetadataModifyComponent implements OnInit {

  model: any = [];
  manageMetaDataForm;
  activityId: number;
  displayedColumns: string[] = ['key', 'value', 'action'];
  activityMetaData: ActivityMeta[];
  activities: Activity[];
  processMap: ProcessMap;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: DialogData,
    private fb: FormBuilder,
    private store: Store<ProcessMapsState>,
    private dialogRef: MatDialogRef<ActivityMetadataModifyComponent>
  ) {
    this.activityId = data.activityId;
    this.store.select(selectSelectedProcessMap).subscribe((processMap) => {
      this.processMap = processMap;
      this.activities = this.processMap.activityBlocks;
      this.activities = this.activities.filter((activity) => {
        if (activity.id == this.activityId) {
          this.activityMetaData = activity.activityMeta;
        }
      });
    });
  }

  ngOnInit() {
    this.manageMetaDataForm = this.fb.group({
      key: ['', Validators.required],
      value: ['', Validators.required],
    });
  }

  //Adds new key value pair to database
  onAddMetaData() {
    this.store.dispatch(
      addActivitiesMetaData({
        activityId: this.activityId,
        activityMeta: this.manageMetaDataForm.value,
      })
    );
    this.manageMetaDataForm.reset();
  }

  //Deletes specified metadata
  onDeleteMetaData(id) {
    this.store.dispatch(
      deleteActivitiesMetaData({
        activityId: this.activityId,
        activityMeta: id,
      })
    );
  }

}
