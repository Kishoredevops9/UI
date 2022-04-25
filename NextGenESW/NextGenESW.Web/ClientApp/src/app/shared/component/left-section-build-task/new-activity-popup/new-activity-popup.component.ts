import { Component, Inject, OnInit } from '@angular/core';
import { CreateDocumentService } from '@app/create-document/create-document.service';
import { Subscription } from 'rxjs';
import { ExportAuthority } from '@app/create-document/create-document.model';
import { SharedService } from '@app/shared/shared.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskCrationPageService } from '@app/task-creation/task-creation.service';
import { selectExportAuthorityList } from '@app/reducers/common-list.selector';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-new-activity-popup',
  templateUrl: './new-activity-popup.component.html',
  styleUrls: ['./new-activity-popup.component.scss']
})
export class NewActivityPopupComponent implements OnInit {
  formData : any = {}
  private subscription: Subscription;
  stepActivityBtn:boolean = true;
  loading:boolean;
  exportAuthorityList: ExportAuthority[];
  loggedInUserNationality;
  constructor(
    private createDocumentService: CreateDocumentService,
    public addItemDialog: MatDialogRef<any>,
    private sharedService: SharedService,
    private store: Store<any>,
    public TaskCrationPageService: TaskCrationPageService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {

    console.log("activity:data", this.data);
    this.formData.title = '';
    this.formData.exportAuthorityId = '';

    console.log("activity:data", this.data);

    let userProfileDataObj = this.sharedService.getHeaderRequestedData();
    if (userProfileDataObj) {
      var userProfileData = userProfileDataObj;
    } else {
      var userProfileData = JSON.parse(
        sessionStorage.getItem('userProfileData')
      );
    }
    this.loggedInUserNationality =
      userProfileData && userProfileData.nationality
        ? userProfileData.nationality
        : '';
    this.loadDropDowndata();
  }

  loadDropDowndata() {
    this.subscription = this.store.select(selectExportAuthorityList)
      .subscribe((res) => {
        this.exportAuthorityList =
          this.loggedInUserNationality.toLowerCase() === 'canada'
            ? res.filter((x) => x.exportAuthorityCode === 'CA')
            : this.loggedInUserNationality.toLowerCase() === 'foreign' ||
              this.loggedInUserNationality === 'NR'
              ? res.filter((x) => x.exportAuthorityCode === 'NR')
              : res;

      });

  }

  cancelAction(){
    this.addItemDialog.close();
  }


  valuechange() {
    this.stepActivityBtn = true;
    console.log("this.formData", this.formData);
    if(this.formData.title != '' && this.formData.exportAuthorityId != '') {
      this.stepActivityBtn = false;
    }
  }

  submitForm(){


    let param = {
      "title": this.formData.title,
      "exportAuthorityId": this.formData.exportAuthorityId,
      "stepFlowId": this.data.stepFlowId,
      "stepId": this.data.stepId,
      "taskId":  this.data.taskId,
      "swimlaneId": this.data.SwimLaneId,
      "createdUser": sessionStorage.getItem('userMail'),
    }

    console.log("param", param);

    this.loading = true;
    this.stepActivityBtn = true;
    this.TaskCrationPageService.createspecificactivity(param).subscribe(res => {
      this.addItemDialog.close();
      this.loading = false;
      this.sharedService.electedEKSreload.emit(this.data)
    },(error) =>{
      this.loading = false;
    })


}

}
