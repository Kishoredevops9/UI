import { ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Item, WICDdocList } from '@app/task-creation/task-creation.model';
import { TaskCrationPageService } from '@app/task-creation/task-creation.service';
import { ApproveSelectedActivityComponent } from './approve-selected-activity/approve-selected-activity.component';
import { SendBackDeviationComponent } from './send-back-deviation/send-back-deviation.component';
import { SendBackSelectedActivityComponent } from './send-back-selected-activity/send-back-selected-activity.component';
import { SharedService } from '@app/shared/shared.service';
@Component({
  selector: 'app-task-tab-seven-content',
  templateUrl: './task-tab-seven-content.component.html',
  styleUrls: ['./task-tab-seven-content.component.scss'],
})
export class TaskTabSevenContentComponent implements OnInit {
  activitySelected: boolean = true;
  deviationSelected: boolean = false;
  toggle: boolean = true;
  selectedActivity: boolean = false;
  selectedActivityName = {};
  activityForm: any;
  isChecked: boolean;
  reviewData = [];
  deviationReviewData = [];
  taskId;
  loading: boolean = false;
  @Input() titleData;
  selectedActivitiesData: any;
  selectedDeviationsData: any;
  criteriaResult = [];
  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private taskCreationService: TaskCrationPageService,
    private activeRoute: ActivatedRoute,
    private SharedService: SharedService
  ) {
    this.activityForm = this.fb.group({
      checkbox1: [false],
      checkbox2: [false],
    });
    this.SharedService.chipmessage.subscribe((node) => {
      if (node.hasOwnProperty('tabindex')) {
        if (node['tabindex'].index == 5) {
          this.taskReviewData();
        }
      }
    });
  }

  ngOnInit() {
    this.taskReviewData();
  }

  taskReviewData() {
    //this.loading = true;
    this.activeRoute.params.subscribe((param) => {
      this.taskId = param.id;
    });
    if (this.taskId && this.taskId > 0) {
      this.taskReviewSubmittedActivities();
      this.taskReviewSubmittedDeviation();
    }
  }

  taskReviewSubmittedActivities() {
    this.loading = true;
    this.taskCreationService
      .getAllCriteriaBPValues(this.taskId)
      .subscribe((res) => {
        this.criteriaResult = JSON.parse(JSON.stringify(res));
        //console.log("criteriaResult tab seven ----->", this.criteriaResult);
        this.taskCreationService
          .getAllActivities(this.taskId, false, 'SUBM')
          .subscribe((res) => {
            const data = JSON.parse(JSON.stringify(res));
            this.reviewData = data;
            //console.log("reviewData----->", this.reviewData);
            this.loading = false;
          });
      });
  }

  taskReviewSubmittedDeviation() {
    this.loading = true;
    this.taskCreationService
      .getSubmittedDeviationsGroupByCurrentUser(this.taskId, true)
      .subscribe((res) => {
        const data = JSON.parse(JSON.stringify(res));
        this.deviationReviewData = data;
        this.loading = false;
      });
  }

  handleOnApproveSelected() {
    if (this.activitySelected) {
      const dialogRef = this.dialog.open(ApproveSelectedActivityComponent, {
        maxWidth: '690px',
        width: '100%',
        minHeight: 'calc(100vh - 90px)',
        height: 'auto',
        disableClose: true,
        panelClass: 'custom-dialog-container',
        data: {
          activityData: this.selectedActivitiesData,
          taskTitle: this.titleData,
          reviewType: 'activity',
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if(result) {
          this.taskReviewData();
        }
      });
    } else {
      const dialogRef = this.dialog.open(ApproveSelectedActivityComponent, {
        maxWidth: '690px',
        width: '100%',
        minHeight: 'calc(100vh - 90px)',
        height: 'auto',
        disableClose: true,
        panelClass: 'custom-dialog-container',
        data: {
          activityData: this.selectedDeviationsData,
          taskTitle: this.titleData,
          reviewType: 'deviation',
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if(result) {
          this.taskReviewData();
        }
      });
    }
  }

  handleOnSendBackdeviation() {
    if (this.deviationSelected) {
      const dialogRef = this.dialog.open(SendBackSelectedActivityComponent, {
        width: '40%',
        disableClose: true,
        panelClass: 'custom-dialog-container',
        data: {
          activityData: this.selectedDeviationsData,
          taskTitle: this.titleData,
          reviewType: 'deviation',
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if(result) {
          this.taskReviewData();
        }
      });
    } else {
      const dialogRef = this.dialog.open(SendBackSelectedActivityComponent, {
        width: '40%',
        disableClose: true,
        panelClass: 'custom-dialog-container',
        data: {
          activityData: this.selectedActivitiesData,
          taskTitle: this.titleData,
          reviewType: 'activity',
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if(result) {
          this.taskReviewData();
        }
      });
    }
  }

  onTabChanged(event) {
    if (event.index === 1) {
      this.activitySelected = false;
      this.deviationSelected = true;
    } else {
      this.activitySelected = true;
      this.deviationSelected = false;
    }
  }

  selectedActivtyData(event) {
    this.selectedActivitiesData = event;
  }

  selectedDeviationData(event) {
    //console.log("selectedDeviationData 1212", event);
    this.selectedDeviationsData = event;
  }
}
