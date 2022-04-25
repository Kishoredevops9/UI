import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { TaskCrationPageService } from '@app/task-creation/task-creation.service';

@Component({
  selector: 'app-view-history-logs',
  templateUrl: './view-history-logs.component.html',
  styleUrls: ['./view-history-logs.component.scss'],
})
export class ViewHistoryLogsComponent implements OnInit {
  title: string = 'History';
  dataSource: any;
  activityTitle: string;
  activityNumber: string;
  taskId: any;
  taskComponentId: any;
  deviationNumber: any;
  deviationStatus: boolean;

  constructor(
    public dialogRef: MatDialogRef<any>,
    private taskCreationService: TaskCrationPageService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data[0].deviationStatus && !data[0].activitiyStatus) {
      this.deviationNumber = data[0].deviationNumber;
      this.deviationStatus = data[0].deviationStatus;
      this.taskComponentId = data[0].statementTaskComponentId;
      this.taskId = data[0].taskId;
    } else {
      this.taskComponentId = data[0].taskComponentId;
      this.taskId = data[0].taskId;
      this.activityTitle = data[0].item.content.title;
      this.activityNumber = data[0].item.content.contentId;
    }
  }

  displayedColumns: string[] = ['user', 'dateTime', 'action', 'comments'];

  ngOnInit() {
    this.taskCreationService
      .getTaskWFAuditDetails(this.taskId, this.taskComponentId)
      .subscribe((data: any) => {
        this.dataSource = data;
      });
  }
  close() {
    this.dialogRef.close();
  }
}
