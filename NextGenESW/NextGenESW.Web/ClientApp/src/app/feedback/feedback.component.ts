import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LobbyHomeService } from '@app/lobby-home/lobby-home.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
})

export class FeedbackComponent implements OnInit {

  feedbackForm: FormGroup;
  feedbackAlert: string = 'Feedback field is required';
  title = new FormControl;
  description = new FormControl;
  currentUserMail;
  currentUserName;
  elementValues;
  helpType;

  constructor( 
    private formBuilder: FormBuilder,
    public feedBackDialog: MatDialogRef<FeedbackComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private lobbyHomeService: LobbyHomeService

    ) { 
      this.elementValues = data.element,
      this.helpType = data.helpType
    }
  
  ngOnInit() { 
    
    this.currentUserMail = sessionStorage.getItem('userMail');
    this.currentUserName = sessionStorage.getItem('displayName');

    this.feedbackForm = this.formBuilder.group({
      'title': [this.elementValues.title, Validators.required],
      'feedbackComment': [null, Validators.required],
      'userName': [this.currentUserName],
      'userEmail': [this.currentUserMail]
    });

  }

  onFeedbackSubmit(){
    //console.log(this.feedbackForm.value);
    let feedbackData = {
      title: this.feedbackForm.controls.title.value,
      
      userId: this.feedbackForm.controls.userName.value,
      helpType: this.helpType,
      helpId: this.elementValues.id,
      comments: this.feedbackForm.controls.feedbackComment.value,
      createdUser: this.feedbackForm.controls.userEmail.value
    }
    //console.log(feedbackData);
    this.lobbyHomeService.postFeedbacks(feedbackData).subscribe( 
      (data) => {
        console.log(data);
    });
    this.feedBackDialog.close();
  }
  
  closeFeedback(){
    this.feedBackDialog.close();
  }
  
}
