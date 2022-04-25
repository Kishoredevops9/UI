import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { TaskCrationPageService } from '@app/task-creation/task-creation.service'; 
@Component({
  selector: 'app-release-popup',
  templateUrl: './release-popup.component.html',
  styleUrls: ['./release-popup.component.scss']
})
export class ReleasePopupComponent implements OnInit {

  constructor(public addItemDialog: MatDialogRef<any>, 
      @Inject(MAT_DIALOG_DATA) public data: any ,
      public  TaskCrationPageService : TaskCrationPageService
    ) { 


     }

  ngOnInit(): void {
  
  }   
  submitForm() {  
    this.TaskCrationPageService.releasependingitem({
      "taskComponentId": this.data.TaskComponentId,
      // "taskId" : this.data.taskID
    }).subscribe( arg => { 
         console.log(arg)
         this.addItemDialog.close("SAVE");               
    },err => {
      console.log(err);
      this.cancelAction();
    })  
          
   }  
  cancelAction(){
    this.addItemDialog.close();   
  }

}
 
 
