import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Item } from '@app/task-creation/task-creation.model';
import { TaskCrationPageService } from '@app/task-creation/task-creation.service';
import { addDeviationApprovalModel, addActivityApprovalModel, submissionForDeviationApprovalModel } from '@app/task-creation/task-creation.model';

@Component({
  selector: 'app-task-approval-workflow',
  templateUrl: './task-approval-workflow.component.html',
  styleUrls: ['./task-approval-workflow.component.scss']
})
export class TaskApprovalWorkflowComponent implements OnInit {
  isDeviation: boolean = false;
  isLoading = false;
  title = '';
  taskTitle = '';
  taskReaid = '';
  filteredManagerData: any;
  filteredDisciplineChiefData: any;
  filteredCiptLeaderData: any;
  filteredProgramChiefData: any;
  filteredManagerResponse: any;
  addDeviationApprovalModel = new addDeviationApprovalModel();
  addActivityApprovalModel = new addActivityApprovalModel();
  submissionForDeviationApprovalModel = new submissionForDeviationApprovalModel();
  @Input() parentItem?: Item;
  deviationForm = new FormGroup({
    manager: new FormControl(''),
    disciplineChief: new FormControl(''),
    ciptLeader: new FormControl(''),
    programChiefEngineer: new FormControl('')
  });
  commentForm = new FormGroup({
    comments: new FormControl(''),
  })
  selectedList = [];
  showSubmitDialog: boolean = false;
  showinnerContent: boolean = false;
  selectedItem = [];
  activitySelected: any = [];
  deviationSelected: any = [];
  devAppDisable:boolean = true;
  activitySelectedForApproval: any;
  deviationSelectedForApproval: any;
  deviationSelectedbtn:boolean = false;
  activitySelectedbtn:boolean;
  isSystemRiskenable:boolean;
  selectedManagerObject: any;
  selectedDisciplineChiefObject: any;
  selectedCiptLeaderObject: any;
  selectedProgramChiefObject: any;
  selectedActivityModelItem = [];
  selectedDeviationModelItem = [];
  taskId: any;
  constructor(
    private dialogRef: MatDialogRef<TaskApprovalWorkflowComponent>,
    private taskCrationPageService: TaskCrationPageService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    //console.log("data response",data);
    this.isDeviation = data.isDeviation;
    this.title = data.title;
    this.taskReaid = data.taskReaid;
    this.taskTitle = data.taskTitle;
    this.parentItem = data.item;
    this.taskCrationPageService.approvalManagerName().subscribe((response) => {
      this.filteredManagerResponse = response;
    });
    let taskIdCheck = isNaN(parseInt(window.location.href.split("/").pop())) ? false : true;
    if (taskIdCheck) {
      this.taskId = parseInt(window.location.href.split("/").pop());
    }
    this.isLoading = true;
    this.taskCrationPageService.getActivitiesGroupByDiscipline(this.taskId).subscribe((response) => {
      this.activitySelected = response;
      console.log("task execution activitySelected", this.activitySelected);
      this.isLoading = false;
      this.activitySelected.forEach(element => {
        element['expand'] = false;
        element['checked'] = false;
        element.Activities.forEach(activity => {
          activity['checked'] = false;
        })
      });
    });

    this.taskCrationPageService.getCompletedDeviationsGroupByDisciplineAsync(this.taskId).subscribe((response) => {
      this.deviationSelected = response;
      this.isLoading = false;
      console.log("task execution deviationSelected", this.deviationSelected);
      this.isSystemRiskenable =  this.deviationSelected[0] && this.deviationSelected[0].Activities[0] && this.deviationSelected[0].Activities[0].Deviations[0].IsSystemRisk;
      if(!this.isSystemRiskenable) {
        this.deviationForm.controls["ciptLeader"].disable();
        this.deviationForm.controls["programChiefEngineer"].disable();
      }
      this.deviationSelected.forEach(element => {
        element['expand'] = false;
        element['checked'] = false;

      });
    });

  }

  ngOnInit(): void {
    // let parentCopy = { ...this.parentItem };
    // parentCopy.children.forEach(childNode => {
    //   if (childNode.selectedItem.length > 0) {
    //     this.selectedItem.push(childNode.selectedItem)
    //   } else {
    //     this.updateChild(childNode);
    //   }
    // });

  }

  updateChild(existingParentNode) {
    if (existingParentNode.children.length > 0) {
      existingParentNode.children.forEach(childNode => {
        if (childNode.selectedItem.length > 0) {
          this.selectedItem.push(childNode.selectedItem[0])
        }
        else {
          this.updateChild(childNode);
        }
      })
    }
  }
  handleOnCancelButtonClick(showSubmitDialog) {
    this.dialogRef.close(showSubmitDialog);
  }

  eksActivityApprovalData(eksActivityApprovalData) {
    this.activitySelectedForApproval = (eksActivityApprovalData && eksActivityApprovalData.Activities) ? eksActivityApprovalData.Activities : [eksActivityApprovalData];
    let manager = this.deviationForm.controls["manager"].value;
    let actSelLen= this.activitySelectedForApproval[0].checked ? this.activitySelectedForApproval.length : 0;
    if(manager !='' && actSelLen > 0) {
      this.activitySelectedbtn = true;
    } else {
      this.activitySelectedbtn = false;
    }
  }

  eksDeviationApprovalData(eksDeviationApprovalData) {
    this.deviationSelectedForApproval = (eksDeviationApprovalData && eksDeviationApprovalData.Activities) ? eksDeviationApprovalData.Activities : '';
    let manager = this.deviationForm.controls["manager"].value;
    let disciplineChief = this.deviationForm.controls["disciplineChief"].value;
    let ciptLeader = this.deviationForm.controls["ciptLeader"].value;
    let programChiefEngineer = this.deviationForm.controls["programChiefEngineer"].value;
    let criteriaIndex:number = 0;
    let assetData = this.deviationSelected ? this.deviationSelected : [];
    assetData.forEach(item => {
      if(item.checked == true) {
        criteriaIndex++
      }
    });
    if(this.isSystemRiskenable) {     
      if( manager !='' &&  disciplineChief !='' && ciptLeader !='' && programChiefEngineer !='' && criteriaIndex > 0) {
        this.deviationSelectedbtn = true;
      } else{
        this.deviationSelectedbtn = false;
      }
    } else {
      if(manager !='' &&  disciplineChief !='' && criteriaIndex > 0) {
        this.deviationSelectedbtn = true;
      } else{
        this.deviationSelectedbtn = false;
      }
    }
    //console.log("this.deviationSelectedForApproval", this.deviationSelectedForApproval);
  }

  selectManager(item: any) {
    this.selectedManagerObject = item;  
  }

  selectDisciplineChief(item: any) {
    this.selectedDisciplineChiefObject = item;
  }

  selectCiptLeader(item: any) {
    this.selectedCiptLeaderObject = item;
  }

  selectProgramChiefEngineer(item: any) {
  }

  handleOnSubmitActivityButtonClick() {
    //console.log("handleOnSubmitActivityButtonClick this.activitySelectedForApproval", this.activitySelectedForApproval);
    if (this.activitySelectedForApproval.length > 0) {
      this.activitySelectedForApproval.forEach(element => {
        if (element.TaskComponentId > 0) {
          this.addActivityApprovalModel.Activity_Id = element.TaskComponentId;
          this.addActivityApprovalModel.Activity_Title = element.Title;
          this.addActivityApprovalModel.taskComponentId = (element.TaskComponentId > 0) ? element.TaskComponentId : 0;
          this.addActivityApprovalModel.Requester_Name = (sessionStorage.getItem('displayName')) ? sessionStorage.getItem('displayName') : '';
          this.addActivityApprovalModel.Requestor_Email = (sessionStorage.getItem('userMail')) ? sessionStorage.getItem('userMail') : '';
          this.addActivityApprovalModel.Requester_AAID = (sessionStorage.getItem('AADid')) ? sessionStorage.getItem('AADid') : '';
          this.addActivityApprovalModel.Manager_Name = (this.selectedManagerObject && this.selectedManagerObject.displayName) ? this.selectedManagerObject.displayName : '',
            this.addActivityApprovalModel.Manager_Email = (this.selectedManagerObject && this.selectedManagerObject.email) ? this.selectedManagerObject.email : '',
            this.addActivityApprovalModel.Manager_AAID = (this.selectedManagerObject && this.selectedManagerObject.aadId) ? this.selectedManagerObject.aadId : '',
            this.addActivityApprovalModel.Requestor_Comments = (this.commentForm.controls.comments) ? (this.commentForm.controls.comments.value) : '';
          this.addActivityApprovalModel.Manager_Comments = (this.commentForm.controls.comments) ? (this.commentForm.controls.comments.value) : '';
          this.addActivityApprovalModel.TaskURL = (this.taskId) ? this.taskId : 0;
          this.selectedActivityModelItem.push(this.addActivityApprovalModel)
        }
      });
    }
    this.isLoading = true;
    this.taskCrationPageService.submissionForActivityApprovalWF(this.selectedActivityModelItem)
      .subscribe((response) => {
        this.showSubmitDialog = true;
        this.isLoading = false;
        //console.log('submissionForActivityApprovalWF response', response);
      });
  }

  handleRadioButton(item) {
    // this.parentList.forEach((el) => {
    //   if (el['checked']) {
    //     el['checked'] = false;
    //   }
    // });
    // item['checked'] = true;
  }

  handleOnCheckboxChange(event, parentList, index, child) {
    if (event.checked) {
      if (
        this.selectedList['parentList'] &&
        this.selectedList['parentList'].length > 0
      ) {
        this.selectedList['parentList'].forEach((el) => {
          if (el.id == parentList.id) {
            el['selectedList'][0]['childList'].push(child);
          } else {
            this.selectedList['parentList'].push(parentList);
          }
        });
      } else {
        this.selectedList = [];
        this.selectedList['parentList'] = [];
        this.selectedList['parentList'].push(parentList);
        this.selectedList['parentList'][0]['selectedList'] = [];
        this.selectedList['parentList'][0]['selectedList'].push(
          parentList.stepflowlist[index]
        );
        this.selectedList['parentList'][0]['selectedList'][0]['childList'] = [];
        this.selectedList['parentList'][0]['selectedList'][0]['childList'].push(
          child
        );
      }
    }
  }

  filterMangerData(name, isDeviation) {
    if (name && name.length >= 3) {
      this.filteredManagerData = this.filteredManagerResponse.filter((node) => {
        return new RegExp(name.toLocaleLowerCase()).test(
          node.displayName.toLocaleLowerCase()
        );
      });
    } else {
      this.filteredManagerData = null;
    }
    let manager = this.deviationForm.controls["manager"].value;
    let disciplineChief = this.deviationForm.controls["disciplineChief"].value;
    let ciptLeader = this.deviationForm.controls["ciptLeader"].value;
    let programChiefEngineer = this.deviationForm.controls["programChiefEngineer"].value;
    let criteriaIndex:number = 0;
    let assetData = this.deviationSelected ? this.deviationSelected : [];
    assetData.forEach(item => {
      if(item.checked == true) {
        criteriaIndex++
      }
    });
    if(this.isSystemRiskenable) {     
      if( manager !='' &&  disciplineChief !='' && ciptLeader !='' && programChiefEngineer !='' && criteriaIndex > 0) {
        this.deviationSelectedbtn = true;
      } else{
        this.deviationSelectedbtn = false;
      }
    } else {
      if(manager !='' &&  disciplineChief !='' && criteriaIndex > 0) {
        this.deviationSelectedbtn = true;
      } else{
        this.deviationSelectedbtn = false;
      }
    }

    if(!isDeviation) {
      let actSelLen= this.activitySelectedForApproval ? this.activitySelectedForApproval.length : 0;
      if(manager !='' && actSelLen > 0) {
        this.activitySelectedbtn = true;
      } else{
        this.activitySelectedbtn = false;
      }
    }
    
  }

  filterDisciplineChiefData(name) {
    if (name && name.length >= 3) {
      this.filteredDisciplineChiefData = this.filteredManagerResponse.filter((node) => {
        return new RegExp(name.toLocaleLowerCase()).test(
          node.displayName.toLocaleLowerCase()
        );
      });
    } else {
      this.filteredDisciplineChiefData = null;
    }
    let manager = this.deviationForm.controls["manager"].value;
    let disciplineChief = this.deviationForm.controls["disciplineChief"].value;
    let ciptLeader = this.deviationForm.controls["ciptLeader"].value;
    let programChiefEngineer = this.deviationForm.controls["programChiefEngineer"].value;
    let criteriaIndex:number = 0;
    let assetData = this.deviationSelected ? this.deviationSelected : [];
    assetData.forEach(item => {
      if(item.checked == true) {
        criteriaIndex++
      }
    });
    if(this.isSystemRiskenable) {     
      if( manager !='' &&  disciplineChief !='' && ciptLeader !='' && programChiefEngineer !='' && criteriaIndex > 0) {
        this.deviationSelectedbtn = true;
      } else{
        this.deviationSelectedbtn = false;
      }
    } else {
      if(manager !='' &&  disciplineChief !='' && criteriaIndex > 0) {
        this.deviationSelectedbtn = true;
      } else{
        this.deviationSelectedbtn = false;
      }
    }
    
  }

  filterCiptLeaderData(name) {
    if (name && name.length >= 3) {
      this.filteredCiptLeaderData = this.filteredManagerResponse.filter((node) => {
        return new RegExp(name.toLocaleLowerCase()).test(
          node.displayName.toLocaleLowerCase()
        );
      });
    } else {
      this.filteredCiptLeaderData = null;
    }
    let manager = this.deviationForm.controls["manager"].value;
    let disciplineChief = this.deviationForm.controls["disciplineChief"].value;
    let ciptLeader = this.deviationForm.controls["ciptLeader"].value;
    let programChiefEngineer = this.deviationForm.controls["programChiefEngineer"].value;
    let criteriaIndex:number = 0;
    let assetData = this.deviationSelected ? this.deviationSelected : [];
    assetData.forEach(item => {
      if(item.checked == true) {
        criteriaIndex++
      }
    });
    if(this.isSystemRiskenable) {     
      if( manager !='' &&  disciplineChief !='' && ciptLeader !='' && programChiefEngineer !='' && criteriaIndex > 0) {
        this.deviationSelectedbtn = true;
      } else{
        this.deviationSelectedbtn = false;
      }
    } else {
      if(manager !='' &&  disciplineChief !='' && criteriaIndex > 0) {
        this.deviationSelectedbtn = true;
      } else{
        this.deviationSelectedbtn = false;
      }
    }
    
  }

  filterProgramChiefData(name) {
    if (name && name.length >= 3) {
      this.filteredProgramChiefData = this.filteredManagerResponse.filter((node) => {
        return new RegExp(name.toLocaleLowerCase()).test(
          node.displayName.toLocaleLowerCase()
        );
      });
    } else {
      this.filteredProgramChiefData = null;
    }
    let manager = this.deviationForm.controls["manager"].value;
    let disciplineChief = this.deviationForm.controls["disciplineChief"].value;
    let ciptLeader = this.deviationForm.controls["ciptLeader"].value;
    let programChiefEngineer = this.deviationForm.controls["programChiefEngineer"].value;
    let criteriaIndex:number = 0;
    let assetData = this.deviationSelected ? this.deviationSelected : [];
    assetData.forEach(item => {
      if(item.checked == true) {
        criteriaIndex++
      }
    });
    if(this.isSystemRiskenable) {     
      if( manager !='' &&  disciplineChief !='' && ciptLeader !='' && programChiefEngineer !='' && criteriaIndex > 0) {
        this.deviationSelectedbtn = true;
      } else{
        this.deviationSelectedbtn = false;
      }
    } else {
      if(manager !='' &&  disciplineChief !='' && criteriaIndex > 0) {
        this.deviationSelectedbtn = true;
      } else{
        this.deviationSelectedbtn = false;
      }
    }    
  }

  handleOnSubmitDeviationButtonClick() {
    this.deviationSelectedForApproval.forEach(elementData => {
      if (elementData.Deviations && elementData.Deviations.length > 0 && elementData) {
        let element = elementData.Deviations[0]
        let deviationSelectedItems = {
          "Activity_Id": elementData.TaskComponentId,
          "Activity_Title": elementData.Title,
          "Deviation_ID": (element.DeviationId > 0) ? element.DeviationId : 0,
          "Deviation_Title": (element.DeviationNumber) ? element.DeviationNumber : "",
          "Supervisor_Name": (this.selectedManagerObject && this.selectedManagerObject.displayName) ? this.selectedManagerObject.displayName : '',
          "Supervisor_Email": (this.selectedManagerObject && this.selectedManagerObject.email) ? this.selectedManagerObject.email : '',
          "Supervisor_AAID": (this.selectedManagerObject && this.selectedManagerObject.aadId) ? this.selectedManagerObject.aadId : '',
          "Discipline_Chief_Name": (this.selectedDisciplineChiefObject && this.selectedDisciplineChiefObject.displayName) ? this.selectedDisciplineChiefObject.displayName : '',
          "Discipline_Chief_Email": (this.selectedDisciplineChiefObject && this.selectedDisciplineChiefObject.email) ? this.selectedDisciplineChiefObject.email : '',
          "Discipline_Chief_AADID": (this.selectedDisciplineChiefObject && this.selectedDisciplineChiefObject.aadId) ? this.selectedDisciplineChiefObject.aadId : '',
          "CIPT_Lead_Name": (this.selectedCiptLeaderObject && this.selectedCiptLeaderObject.displayName) ? this.selectedCiptLeaderObject.displayName : '',
          "CIPT_Lead_Email": (this.selectedCiptLeaderObject && this.selectedCiptLeaderObject.email) ? this.selectedCiptLeaderObject.email : '',
          "CIPT_Lead_AADID": (this.selectedCiptLeaderObject && this.selectedCiptLeaderObject.aadId) ? this.selectedCiptLeaderObject.aadId : '',
          "PCE_Approver_Name": (this.selectedProgramChiefObject && this.selectedProgramChiefObject.displayName) ? this.selectedProgramChiefObject.displayName : '',
          "PCE_Approver_Email": (this.selectedProgramChiefObject && this.selectedProgramChiefObject.email) ? this.selectedProgramChiefObject.email : '',
          "PCE_Approver_AADID": (this.selectedProgramChiefObject && this.selectedProgramChiefObject.aadId) ? this.selectedProgramChiefObject.aadId : '',
          "Requester_Name": (sessionStorage.getItem('displayName')) ? sessionStorage.getItem('displayName') : '',
          "Requester_Email": (sessionStorage.getItem('userMail')) ? sessionStorage.getItem('userMail') : '',
          "Requester_AADID": (sessionStorage.getItem('AADid')) ? sessionStorage.getItem('AADid') : '',
          "Requester_Comments": (this.commentForm.controls.comments) ? (this.commentForm.controls.comments.value) : '',
          "TaskComponentId": (element.TaskComponentId > 0) ? element.TaskComponentId : 0,
          "System_Risk": (element.IsSystemRisk == true) ? true : false,
        };
        this.selectedDeviationModelItem.push(deviationSelectedItems);
      }
    });
    this.isLoading = true;
    this.taskCrationPageService.submissionForDeviationApprovalWF(this.selectedDeviationModelItem)
      .subscribe((response) => {
        this.showSubmitDialog = true;
        this.isLoading = false;
        console.log('submissionForDeviationApprovalWF response', response);
      });
  }

}
