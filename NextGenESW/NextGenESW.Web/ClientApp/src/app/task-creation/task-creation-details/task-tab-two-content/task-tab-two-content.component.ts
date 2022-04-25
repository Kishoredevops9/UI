import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TaskCrationPageService } from '@app/task-creation/task-creation.service';

@Component({
  selector: 'app-task-tab-two-content',
  templateUrl: './task-tab-two-content.component.html',
  styleUrls: ['./task-tab-two-content.component.scss'],
})
export class TabTwoContentComponent implements OnInit {
  constructor(    private taskCreationService: TaskCrationPageService,
    ) {}
  //@Output() knowledgeReviewCreatedOutput = new EventEmitter<any>();
  //hasKnowledgeCreated: any = false;
  @Input() contentType1: any;
  isActiveNOofCasesNo: boolean;
  AuthTaskUser:any;
  AccessingTaskAuthorized:any;
  CreatingTaskAuthorized:any;
  ExecutingTaskAuthorized:any;
  ngOnInit(): void {
    this.isActiveNOofCasesNo = true;
    //console.log(' in task tab two',this.contentType1);

   
    let userProfileData = localStorage.getItem('logInUserEmail');
    if (this.contentType1) {
    this.taskCreationService.GetTaskAuthorizations(this.contentType1,userProfileData).subscribe((data)=>{
    this.AuthTaskUser = data;
    console.log(' in task creation details component',this.AuthTaskUser);
    this.AuthTaskUser.taskId;
    this.AuthTaskUser.isAccessingTaskAuthorized;
    this.AuthTaskUser.isCreatingTaskAuthorized;
    this.AuthTaskUser.isExecutingTaskAuthorized;
    console.log('taskId in task creation details component',this.AuthTaskUser.taskId);
    console.log('isAccessingTaskAuthorized in task creation details component',this.AuthTaskUser.isAccessingTaskAuthorized);
    console.log('isCreatingTaskAuthorized in task creation details component',this.AuthTaskUser.isCreatingTaskAuthorized);
    console.log('isExecutingTaskAuthorized in task creation details component',this.AuthTaskUser.isExecutingTaskAuthorized);

    if(this.AuthTaskUser.isAccessingTaskAuthorized == false){
      this.AccessingTaskAuthorized = false;
    }
    else{
      this.AccessingTaskAuthorized = true;
    }

    if(this.AuthTaskUser.isCreatingTaskAuthorized == false){
      this.CreatingTaskAuthorized = false;
      this.isActiveNOofCasesNo = true;
    }
    else{
      this.CreatingTaskAuthorized = true;
      this.isActiveNOofCasesNo = false;
    }

    if(this.AuthTaskUser.isExecutingTaskAuthorized == false){
      this.ExecutingTaskAuthorized = false;
    }
    else{
      this.ExecutingTaskAuthorized = true;
    }

   })

  }

  }
  // buildCreatedOutput(hasKnowledgeCreated){
  //   this.hasKnowledgeCreated = hasKnowledgeCreated;
  //   this.knowledgeReviewCreatedOutput.emit(hasKnowledgeCreated);
  // }

}
