import { Component, OnInit } from '@angular/core';
import { CreateDocumentService } from '@app/create-document/create-document.service';
import { Subscription } from 'rxjs';
import { ExportAuthority } from '@app/create-document/create-document.model';
import { SharedService } from '@app/shared/shared.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskCrationPageService } from '@app/task-creation/task-creation.service';
import { selectExportAuthorityList } from '@app/reducers/common-list.selector';
import { Store } from '@ngrx/store';
@Component({
  selector: 'app-specific-step-flow',
  templateUrl: './specific-step-flow.component.html',
  styleUrls: ['./specific-step-flow.component.scss']
})
export class SpecificStepFlowComponent implements OnInit {
  private subscription: Subscription;
  exportAuthorityList: ExportAuthority[];
  specificstepnewBtn:boolean= true;
  loggedInUserNationality;
  formObj : any = {
     taskId :   parseInt(window.location.href.split("/").pop()),
     createdUser : sessionStorage.getItem('userMail')
   }
   loading:boolean;


  constructor(
    private createDocumentService: CreateDocumentService,
    public addItemDialog: MatDialogRef<any>,
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private store: Store<any>,
    public TaskCrationPageService: TaskCrationPageService
  ) { }

  ngOnInit(): void {
    this.formObj.title  = '';
    this.formObj.exportAuthorityId = '';
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


  submitForm(){
    this.specificstepnewBtn = true;
    this.loading = true;
    this.TaskCrationPageService.createspecificstepflow(this.formObj).subscribe(arg => {
      this.cancelAction();
      this.loading = false;
      this.sharedService.electedEKSreload.emit(true)
    },(error) =>{
      this.loading = false;
    })



  }

  specificStepchange() {
    this.specificstepnewBtn = true;
    if(this.formObj.title != '' && this.formObj.exportAuthorityId != '') {
      this.specificstepnewBtn = false;
    }
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

}
