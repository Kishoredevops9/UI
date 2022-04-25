import { Component, Inject, OnInit } from '@angular/core';
import { CreateDocumentService } from '@app/create-document/create-document.service';
import { Subject, Subscription } from 'rxjs';
import { ExportAuthority } from '@app/create-document/create-document.model';
import { SharedService } from '@app/shared/shared.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {StepflowService} from '@app/process-maps/step-flow/stepflow.service';
import { TaskCrationPageService } from '@app/task-creation/task-creation.service';
import { selectExportAuthorityList } from '@app/reducers/common-list.selector';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-add-new-step',
  templateUrl: './add-new-step.component.html',
  styleUrls: ['./add-new-step.component.scss']
})
export class AddNewStepComponent implements OnInit {
  private subscription: Subscription;
  formData : any = {
    dlength :1
  }
  Arr = Array;
  disciplineArrayData = [];
  exportAuthorityList: ExportAuthority[];
  disciplinelen:number;
  loggedInUserNationality;
  showDisciplineDropDown0 = false;
  showDisciplineDropDown1 = false;
  showDisciplineDropDown2 = false;
  stepnewBtn:boolean = true;
  disciplineId: number;
  globalData:any;
  activityTabs;
  discipline: any;
  chipDisciplineData: any[] = [];
  chipDisciplineContainer: any = [];
  selctdata0: any = '';
  selctdata1: any = '';
  selctdata2: any = '';
  row0: any = '';
  row1: any = '';
  row2: any = '';
  loading:boolean;
  stepSHgt:boolean;
  selectedDisciplineCode: any;
  selectedDisciplineCodenew: any;
  eventsDiscipline: Subject<void> = new Subject<void>();
  constructor(
    public StepflowService  : StepflowService,
    public TaskCrationPageService: TaskCrationPageService,
    private createDocumentService: CreateDocumentService,
    public addItemDialog: MatDialogRef<any>,
    public store: Store<any>,
    private sharedService: SharedService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

  }

  ngOnInit(): void {
    this.formData.title = '';
    this.formData.exportAuthorityId = '';
    this.counter(3);
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

    this.globalData=this.sharedService.getExistingMapData()
    this.subscription = this.createDocumentService
    .getAllMetaDisciplineStep()
    .subscribe((res) => {
      this.discipline = res;
      console.log('dis',res);
     this.activityTabs = this.globalData;
    });
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

  submitForm(){
    console.log("this.this.formData", this.formData);
    let swimLanes = [];
    if(this.disciplinelen == 1) {
      swimLanes = [{
        "name": this.selctdata0,
        "disciplineId": this.row0,
        "sequenceNumber": 1,
        "createdUser": sessionStorage.getItem('userMail'),
      } ]
    }

    if(this.disciplinelen == 2) {
      swimLanes = [{
        "name": this.selctdata0,
        "disciplineId": this.row0,
        "sequenceNumber": 1,
        "createdUser": sessionStorage.getItem('userMail'),
      } , {
        "name": this.selctdata1,
        "disciplineId": this.row1,
        "sequenceNumber": 1,
        "createdUser": sessionStorage.getItem('userMail'),
      } ]
    }

    if(this.disciplinelen == 3) {
      swimLanes = [{
        "name": this.selctdata0,
        "disciplineId": this.row0,
        "sequenceNumber": 1,
        "createdUser": sessionStorage.getItem('userMail'),
      } , {
        "name": this.selctdata1,
        "disciplineId": this.row1,
        "sequenceNumber": 2,
        "createdUser": sessionStorage.getItem('userMail'),
      } ,
      {
        "name": this.selctdata2,
        "disciplineId": this.row2,
        "sequenceNumber": 3,
        "createdUser": sessionStorage.getItem('userMail'),
      }]
    }

    const param = {
      "title": this.formData.title,
      "exportAuthorityId": this.formData.exportAuthorityId,
      "createdUser": sessionStorage.getItem('userMail'),
      "stepFlowId": this.data.KnowledgeAssetId,
      "taskId": this.data.taskId,
      "swimLanes": swimLanes
    }
    this.loading = true;
    this.stepnewBtn = true;
    this.TaskCrationPageService.createspecificsteps(param).subscribe(res => {
      this.addItemDialog.close();
      this.loading = false;
      this.sharedService.electedEKSreload.emit(this.data)
    },(error) =>{
      this.loading = false;
    })
}
  onChange($event) {
    this.disciplineArrayData =[];
    this.disciplinelen = Number($event.value);
    this.stepSHgt = false;
    this.selctdata0 = "";
    this.row0 = "";
    this.selctdata1 = "";
    this.row1 = "";
    this.selctdata2 = "";
    this.row2 ="";
    if(this.disciplinelen == 2) {
      this.stepSHgt = true
    }
    this.valuechange();
  }

  counter(i: number) {
    return new Array(i);
  }

  cancelAction(){
    this.addItemDialog.close();
  }

  valuechange() {
    this.stepnewBtn = true;
    if(this.disciplinelen == 3 && this.formData.title != '' && this.formData.exportAuthorityId != '' && this.selctdata0 !='' && this.selctdata1 !='' && this.selctdata2 !='') {
      this.stepnewBtn = false;
    } else if(this.disciplinelen == 2 && this.formData.title != '' && this.formData.exportAuthorityId != '' && this.selctdata0 !='' && this.selctdata1 !='') {
      this.stepnewBtn = false;
    } else if(this.disciplinelen == 1 && this.formData.title != '' && this.formData.exportAuthorityId != '' && this.selctdata0 !='') {
      this.stepnewBtn = false;
    }
  }

  setDisciplineData($event, datalen:any) {
    this.stepnewBtn = true;
    if (this.activityTabs && $event[0]) {
      this.activityTabs.disciplineIds = $event[0].name;
      this.activityTabs.disciplineId = $event[0].rowNo;
    }
    if ($event[0]) {
      this.disciplineId = $event[0].rowNo;
      this.setNodeValues($event[0].rowNo);
    }

    this.chipDisciplineData = $event;

    this.chipDisciplineContainer = $event;
    this.chipDisciplineContainer = [];
    if(datalen == 0) {
      this.selctdata0 = '';
      this.row0 = '';
    }

    if(datalen == 1) {
      this.selctdata1 = '';
      this.row1 = '';
    }

    if(datalen == 2) {
      this.selctdata2 = '';
      this.row2 = '';
    }

    if (this.chipDisciplineData.length > 0) {

      // this.removeDisciplineChip(this.chipDisciplineContainer);
      this.chipDisciplineData.forEach(node => {
        this.setDisciplineHirerachy(node);
        console.log("setDisciplineData", node);
        // this.selctdata.push(node.name);
        if(datalen == 0) {
          this.selctdata0 = node.name;
          this.row0 = node.rowNo;
        }

        if(datalen == 1) {
          this.selctdata1 = node.name;
          this.row1 = node.rowNo;
        }

        if(datalen == 2) {
          this.selctdata2 = node.name;
          this.row2 = node.rowNo;
        }
      });
    }
    this.valuechange();
  }

setNodeValues(value) {
    this.createDocumentService
      .getDisciplineCode(value)
      .subscribe((res) => {
        this.selectedDisciplineCode = res;
      });
  }
  setDisciplineHirerachy(node) {
    // this.disciplineId = node.rowNo;
    this.chipDisciplineContainer = [];
    if (this.discipline.length > 0) {
      this.discipline.forEach(nodeAll => {
          if (nodeAll.rowNo && nodeAll.rowNo == node.rowNo) {
          this.chipDisciplineContainer.push({ name: nodeAll.name, rowNo: node.rowNo });
        } else if (nodeAll.children.length) {
          nodeAll.children.forEach((c1) => {
            if (c1.rowNo && c1.rowNo == node.rowNo) {
              this.chipDisciplineContainer.push({ name: nodeAll.name + ' > ' + c1.name, rowNo: c1.rowNo });
            } else
              if (c1.children.length) {
                c1.children.forEach((c2) => {
                  if (c2.rowNo && c2.rowNo == node.rowNo) {
                    this.chipDisciplineContainer.push({ name: nodeAll.name + ' > ' + c1.name + ' > ' + c2.name, rowNo: c2.rowNo });
                  } else {
                    if (c2.children.length) {
                      c2.children.forEach((c3) => {
                        if (c3.rowNo && c3.rowNo == node.rowNo) {
                          this.chipDisciplineContainer.push({ name: nodeAll.name + ' > ' + c1.name + ' > ' + c2.name + ' > ' + c3.name, rowNo: c3.rowNo });
                        }
                      });
                    }
                  }
                });
              }
          });
        }
      });
    }
  }

}
