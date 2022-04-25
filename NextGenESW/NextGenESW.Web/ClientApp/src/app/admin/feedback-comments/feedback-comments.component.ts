import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-feedback-comments',
  templateUrl: './feedback-comments.component.html',
  styleUrls: ['./feedback-comments.component.scss']
})
export class FeedbackCommentsComponent implements OnInit {

  feedbackForm: FormGroup;
  feedbackAlert: string = 'Feedback field is required';
  title = new FormControl;
  description = new FormControl;
  currentUserMail;
  currentUserName;
  elementValues;
  helpType;

  selectedValue;
  isViewMode: boolean = true;
  statusValues = [ "Open", "In-Progress", "Closed", "Re-open" ];

  constructor(
    private formBuilder: FormBuilder,
    public feedBackDialog: MatDialogRef<FeedbackCommentsComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private adminService: AdminService
    ) { 
      this.elementValues = data.element,
      this.helpType = data.helpType
    }

  ngOnInit(): void {

    this.currentUserMail = sessionStorage.getItem('userMail');
    this.currentUserName = sessionStorage.getItem('displayName');

    if(this.data.openView === 'OpenFeedback'){
      this.isViewMode = false;
    }

    this.feedbackForm = this.formBuilder.group({
      'title': [this.elementValues.title, Validators.required],
      'feedbackComment': [this.elementValues.comments, Validators.required],
      'userName': [this.elementValues.userId],
      'userEmail': [this.elementValues.createdUser],
      'feedbackStatus': [this.elementValues.status],
      'adminFeedback': [this.elementValues.adminFeedback]
    });  
  }

  onFeedbackSubmit(){
    let currentDateTime = new Date();

    let updateFeedbackData = {
      adminFeedback: this.feedbackForm.controls.adminFeedback.value,
      comments: this.elementValues.comments,
      id: this.elementValues.id,
      lastUpdateDateTime: currentDateTime,
      lastUpdateUser: this.currentUserName,
      status: this.feedbackForm.controls.feedbackStatus.value,
      title: this.feedbackForm.controls.title.value,
      createdUser: this.elementValues.createdUser,
      userId: this.elementValues.userId,
      helpType: this.elementValues.helpType == 'Help on this page' ? 'H' : 'U', 
      helpId: this.elementValues.helpId,
      createdDateTime: this.elementValues.createdDateTime,
      isActive: this.elementValues.isActive
    }
    
    this.adminService.updateEKSFeedbck(updateFeedbackData).subscribe( (data) => {
      if(data){
        this.feedBackDialog.close();    
      }
    });
  }
  
  closeFeedback(){
    this.feedBackDialog.close();
  }

}
