import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WICDdocList } from '@app/activity-page/activity-page.model';
import { FormControl, FormGroup } from '@angular/forms';
import { TaskCrationPageService } from '@app/task-creation/task-creation.service';
import { aproveSendbackActivityModel, aproveSendbackDeviationModel } from '@app/task-creation/task-creation.model';
@Component({
  selector: 'app-send-back-selected-activity',
  templateUrl: './send-back-selected-activity.component.html',
  styleUrls: ['./send-back-selected-activity.component.scss'],
})
export class SendBackSelectedActivityComponent implements OnInit {
  parentItem: any;
  resultArray: any;
  docTitle: string;
  taskType: string;
  activitySendBackForm = new FormGroup({
    comments: new FormControl(''),
  })
  aproveSendbackActivityModel = new aproveSendbackActivityModel();
  aproveSendbackDeviationModel = new aproveSendbackDeviationModel();
  selectedActivityModelItem = [];
  constructor(
    private dialogRef: MatDialogRef<SendBackSelectedActivityComponent>,
    private taskCrationPageService: TaskCrationPageService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    const wICDdocList = new WICDdocList();
    wICDdocList.title = '';
    this.resultArray = (data.activityData) ? data.activityData : '';
    this.docTitle = data.taskTitle;
    this.taskType = data.reviewType;
    //console.log("Send Back data",this.resultArray);
  }
  showSubmitDialog: boolean = false;
  ngOnInit(): void { }
  handleOnCancelButtonClick() {
    this.dialogRef.close();
  }
  handleOnSubmitButtonClick() {
    if (this.taskType == "activity") {
      if (this.resultArray.length > 0) {
        this.resultArray.forEach(element => {
          if (element.taskComponentId > 0) {
            this.aproveSendbackActivityModel.taskComponentId = (element.taskComponentId > 0) ? element.taskComponentId : 0;
            this.aproveSendbackActivityModel.isApprove = false;
            this.aproveSendbackActivityModel.Comments = (this.activitySendBackForm.controls.comments.value) ? this.activitySendBackForm.controls.comments.value : '';
            this.aproveSendbackActivityModel.approver_Name = (sessionStorage.getItem('displayName')) ? sessionStorage.getItem('displayName') : '';
            this.aproveSendbackActivityModel.approver_Email = (element.activityApprover) ? element.activityApprover : '';
            this.aproveSendbackActivityModel.approver_AAID = (sessionStorage.getItem('AADid')) ? sessionStorage.getItem('AADid') : '';
            this.selectedActivityModelItem.push(this.aproveSendbackActivityModel)
          }
        });
        if (this.selectedActivityModelItem && this.selectedActivityModelItem.length > 0) {
          this.taskCrationPageService.submissionForApproveSendBackActivityWF(this.selectedActivityModelItem)
            .subscribe((response) => {
              this.showSubmitDialog = true;
              console.log('Send Back submissionForApproveSendBackActivityWF response', response);
            });
        }
      }
      this.showSubmitDialog = true;
    }
    if (this.taskType == "deviation") {
      if (this.resultArray.length > 0) {
        this.resultArray.forEach(element => {
          if (element.taskComponentId > 0 && element.deviationId > 0) {
            this.aproveSendbackDeviationModel.deviationId = (element.deviationId > 0) ? element.deviationId : 0;
            this.aproveSendbackDeviationModel.taskComponentId = (element.taskComponentId > 0) ? element.taskComponentId : 0;
            this.aproveSendbackDeviationModel.isApprove = false;
            this.aproveSendbackDeviationModel.Comments = (this.activitySendBackForm.controls.comments.value) ? this.activitySendBackForm.controls.comments.value : '';
            this.aproveSendbackDeviationModel.requester_Name = (element.activitySubmitter.length > 0) ? element.activitySubmitter : '';
            this.aproveSendbackDeviationModel.requester_Email = (element.activitySubmitterEmail.length > 0) ? element.activitySubmitterEmail : '';
            this.aproveSendbackDeviationModel.requester_AAID = (element.activitySubmitterAADID.length > 0) ? element.activitySubmitterAADID : '';
            this.aproveSendbackDeviationModel.approver_Role = "";
            this.aproveSendbackDeviationModel.approver_Name = (element.activityCurrentApprover.length > 0) ? element.activityCurrentApprover : '';
            this.aproveSendbackDeviationModel.approver_Email = (element.activityCurrentApproverEmail.length > 0) ? element.activityCurrentApproverEmail : '';
            this.aproveSendbackDeviationModel.approver_AAID = (element.activityCurrentApproverAADID.length > 0) ? element.activityCurrentApproverAADID : '';
            this.selectedActivityModelItem.push(this.aproveSendbackDeviationModel)
          }
        });
        console.log("send back this.selectedActivityModelItem", this.selectedActivityModelItem);
        if (this.selectedActivityModelItem && this.selectedActivityModelItem.length > 0) {
          this.taskCrationPageService.submissionForApproveSendBackDeviationWF(this.selectedActivityModelItem)
            .subscribe((response) => {
              this.showSubmitDialog = true;
              console.log('submissionForApproveSendBackDeviationWF response', response);
            });
        }
      }
      this.showSubmitDialog = true;
    }

  }
}
