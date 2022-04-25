import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  activityRecallRevise,
  deviationRecallRevise,
} from '@app/task-creation/task-creation.model';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { TaskCrationPageService } from '@app/task-creation/task-creation.service';
import { SharedService } from '@app/shared/shared.service';

@Component({
  selector: 'app-recall-revise-dialog',
  templateUrl: './recall-revise-dialog.component.html',
  styleUrls: ['./recall-revise-dialog.component.scss'],
})
export class RecallReviseDialogComponent implements OnInit {
  title: string;
  form: FormGroup;
  taskComponentId: any;
  requesterEmail: string;
  comments: string;
  taskType;
  deviationRecallRevise = new deviationRecallRevise();
  activityRecallRevise = new activityRecallRevise();
  isLoading: boolean = false;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<any>,
    private fb: FormBuilder,
    private recallWFService: TaskCrationPageService,
    private sharedData: SharedService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    data.map((item) => {
      this.title = item.msg;
      this.taskType = item.type;

      let userProfileData = JSON.parse(
        sessionStorage.getItem('userProfileData')
      );
      let globalId = userProfileData.globalUId;

      if (
        this.taskType == 'Deviation Recall' ||
        this.taskType == 'Deviation Revise'
      ) {
        this.recallRevise(item);
      } else if (
        this.taskType == 'Activity Recall' ||
        this.taskType == 'Activity Revise'
      ) {
        this.activityRecallRevise.taskComponentId = item.taskComponentId;
        this.activityRecallRevise.requesterEmail = item.requesterEmail;
      }
    });

    this.form = this.fb.group({
      comments: '',
    });
  }

  ngOnInit() { }
  onSubmit() {
    this.comments = this.form.value.comments;

    this.deviationRecallRevise.comments = this.comments;
    this.activityRecallRevise.comments = this.comments;

    this.isLoading = true;

    if (this.taskType == 'Deviation Recall') {
      this.recallWFService
        .recallDeviationAsync(this.deviationRecallRevise)
        .subscribe(
          (res) => {
            this.isLoading = false;
            this.close();
          },
          (error) => {
            this.isLoading = false;
          }
        );
    } else if (this.taskType == 'Activity Recall') {
      this.recallWFService
        .invokeActivityWFRecall(this.activityRecallRevise)
        .subscribe(
          (res) => {
            //console.log("activity recall res", res);
            if (res != "successful") {
              this.sharedData.nextRecallStatus(res);
            }
            this.dialogRef.close(res);
            //this.close();            
            this.isLoading = false;
          },
          (error) => {
            this.isLoading = false;
          }
        );
    } else if (this.taskType == 'Deviation Revise') {
      console.log(this.deviationRecallRevise);
      this.recallWFService
        .invokeDeviationWFRevise(this.deviationRecallRevise)
        .subscribe(
          (res) => {
            this.close();
            this.isLoading = false;
          },
          (error) => {
            this.isLoading = false;
          }
        );
    } else if (this.taskType == 'Activity Revise') {
      this.recallWFService
        .invokeActivityWFRevise(this.activityRecallRevise)
        .subscribe(
          (res) => {
            console.log(res);
            this.close();
            this.isLoading = false;
          },
          (error) => {
            console.log(error.error);
            this.isLoading = false;
          }
        );
    }
  }

  close() {
    this.dialogRef.close();
  }

  recallRevise(item) {
    let userProfileData = JSON.parse(sessionStorage.getItem('userProfileData'));
    let globalId = userProfileData.globalUId;

    this.deviationRecallRevise.taskId = item.taskId;
    this.deviationRecallRevise.taskComponentId = item.taskComponentId;
    this.deviationRecallRevise.deviationNumber = item.deviationNumber;
    this.deviationRecallRevise.deviationStatusCode = item.deviationStatusCode;
    this.deviationRecallRevise.requester = globalId;
  }
}
