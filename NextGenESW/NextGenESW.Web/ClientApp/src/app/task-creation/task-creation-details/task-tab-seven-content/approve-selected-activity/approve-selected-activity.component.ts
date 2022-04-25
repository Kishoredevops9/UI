import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { TaskCrationPageService } from '@app/task-creation/task-creation.service';
import { aproveSendbackActivityModel, aproveSendbackDeviationModel } from '@app/task-creation/task-creation.model';
@Component({
  selector: 'app-approve-selected-activity',
  templateUrl: './approve-selected-activity.component.html',
  styleUrls: ['./approve-selected-activity.component.scss'],
})
export class ApproveSelectedActivityComponent implements OnInit {
  resultArray: any;
  docTitle: string;
  taskType: string;
  deviationDisplayData: any = [];
  activityForm = new FormGroup({
    comments: new FormControl(''),
  })
  deviationForm = new FormGroup({
    manager: new FormControl(''),
    disciplineChief: new FormControl(''),
    ciptLeader: new FormControl(''),
    programChiefEngineer: new FormControl('')
  });
  commentForm = new FormGroup({
    comments: new FormControl(''),
  })
  aproveSendbackActivityModel = new aproveSendbackActivityModel();
  aproveSendbackDeviationModel = new aproveSendbackDeviationModel();
  selectedActivityModelItem = [];
  selectedDeviationApproverData: any;
  selectedDeviationActivitiesData: any;
  constructor(
    private dialogRef: MatDialogRef<ApproveSelectedActivityComponent>,
    private taskCrationPageService: TaskCrationPageService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.resultArray = data.activityData;
    this.docTitle = data.taskTitle;
    this.taskType = data.reviewType;
    //this.deviationDisplayData.push((data && data.activityData[0]) ? data.activityData[0].deviationData : '');
    console.log("data.activityData", data);
    this.selectedDeviationActivitiesData = (this.resultArray != undefined && this.resultArray.length > 0 && data.activityData && data.activityData[0].deviationData) ? data.activityData[0].deviationData.activityDtoList : '';
    //console.log('this.selectedDeviationActivitiesData wwww', this.selectedDeviationActivitiesData);
    this.selectedDeviationApproverData = (this.resultArray != undefined && this.resultArray.length > 0 && data.activityData && data.activityData[0].deviationApproverData) ? data.activityData[0].deviationApproverData[0] : '';
    //console.log('this.selectedDeviationApproverData', this.selectedDeviationApproverData);

    this.deviationForm.patchValue({
      manager: (this.selectedDeviationApproverData && this.selectedDeviationApproverData.ApproverName) ? this.selectedDeviationApproverData.ApproverName : '',
      disciplineChief: (this.selectedDeviationApproverData && this.selectedDeviationApproverData.DisciplineChiefName) ? this.selectedDeviationApproverData.DisciplineChiefName : '',
      ciptLeader: (this.selectedDeviationApproverData && this.selectedDeviationApproverData.CIPTLeadName) ? this.selectedDeviationApproverData.CIPTLeadName : '',
      programChiefEngineer: (this.selectedDeviationApproverData && this.selectedDeviationApproverData.ProgramChiefName) ? this.selectedDeviationApproverData.ProgramChiefName : ''
    });
  }
  showSubmitDialog: boolean = false;
  ngOnInit(): void { }

  handleOnCancelButtonClick(showSubmitDialog) {
    this.dialogRef.close(showSubmitDialog);
  }

  handleOnSubmitButtonClick() {
    if (this.taskType == "activity") {
      if (this.resultArray.length > 0) {
        this.resultArray.forEach(element => {
          if (element.taskComponentId > 0) {
            this.aproveSendbackActivityModel.taskComponentId = (element.taskComponentId > 0) ? element.taskComponentId : 0;
            this.aproveSendbackActivityModel.isApprove = true;
            this.aproveSendbackActivityModel.Comments = (this.activityForm.controls.comments.value) ? this.activityForm.controls.comments.value : '';
            this.aproveSendbackActivityModel.approver_Name = (sessionStorage.getItem('displayName')) ? sessionStorage.getItem('displayName') : '';
            this.aproveSendbackActivityModel.approver_Email = (element.activityApprover) ? element.activityApprover : '';
            this.aproveSendbackActivityModel.approver_AAID = (sessionStorage.getItem('AADid')) ? sessionStorage.getItem('AADid') : '';
            this.selectedActivityModelItem.push(this.aproveSendbackActivityModel)
          }
        });
        console.log('this.selectedActivityModelItem activity', this.selectedActivityModelItem);
        if (this.selectedActivityModelItem && this.selectedActivityModelItem.length > 0) {
          this.taskCrationPageService.submissionForApproveSendBackActivityWF(this.selectedActivityModelItem)
            .subscribe((response) => {
              this.showSubmitDialog = true;
              console.log('submissionForApproveSendBackActivityWF response', response);
            });
        }
      }
      this.showSubmitDialog = true;
    }

    if (this.taskType == "deviation") {
      if (this.resultArray.length > 0) {
        console.log("resultArray", this.resultArray);
        this.resultArray.forEach(element => {
          if (element.taskComponentId > 0 && element.deviationId > 0) {
            this.aproveSendbackDeviationModel.deviationId = (element.deviationId > 0) ? element.deviationId : 0;
            this.aproveSendbackDeviationModel.taskComponentId = (element.taskComponentId > 0) ? element.taskComponentId : 0;
            this.aproveSendbackDeviationModel.isApprove = true;
            this.aproveSendbackDeviationModel.Comments = (this.commentForm.controls.comments.value) ? this.commentForm.controls.comments.value : '';
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
        console.log("this.selectedActivityModelItem deviation", this.selectedActivityModelItem);
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
