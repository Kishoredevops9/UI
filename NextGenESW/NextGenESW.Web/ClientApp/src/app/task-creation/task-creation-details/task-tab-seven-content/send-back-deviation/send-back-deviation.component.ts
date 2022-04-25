import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Item, WICDdocList } from '@app/task-creation/task-creation.model';
import { FormControl, FormGroup } from '@angular/forms';
import { TaskCrationPageService } from '@app/task-creation/task-creation.service';
import { aproveSendbackActivityModel } from '@app/task-creation/task-creation.model';
@Component({
  selector: 'app-send-back-deviation',
  templateUrl: './send-back-deviation.component.html',
  styleUrls: ['./send-back-deviation.component.scss'],
})
export class SendBackDeviationComponent implements OnInit {
  public parentItem: any;
  resultArray: any;
  docTitle: string;
  activityForm = new FormGroup({
    comments: new FormControl(''),
  })
  aproveSendbackActivityModel = new aproveSendbackActivityModel();
  selectedActivityModelItem = [];
  constructor(private dialogRef: MatDialogRef<SendBackDeviationComponent>, 
    private taskCrationPageService: TaskCrationPageService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    const wICDdocList = new WICDdocList();
    wICDdocList.title = '';
    //this.resultArray = data.activityData;
    //this.docTitle = data.taskTitle;
    //console.log("Send Back deviation data",data);
    this.parentItem = [
      {
        name: 'A',
        content: {
          title: 'Airfoil Preliminary Design',
          contentId: 'MD-F-013651',
          id: 1,
          contentCode: '',
        },
      },
    ];
  }
  showSubmitDialog: boolean = false;
  ngOnInit(): void {}
  handleOnCancelButtonClick() {
    this.dialogRef.close();
  }
  handleOnSubmitButtonClick() {
    if (this.resultArray.length > 0) {
      this.resultArray.forEach(element => {
        if (element.taskComponentId > 0) {
          this.aproveSendbackActivityModel.taskComponentId = (element.taskComponentId > 0) ? element.taskComponentId : 0;
          this.aproveSendbackActivityModel.isApprove = false;
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
            console.log('Send Back Deviation submissionForApproveSendBackActivityWF response', response);
          });
      }
    }
    this.showSubmitDialog = true;
  }
}
