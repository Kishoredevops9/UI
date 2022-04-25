import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {StepflowService} from '@app/process-maps/step-flow/stepflow.service';
import { Subject, Subscription } from 'rxjs';
import { CreateDocumentService } from '@app/create-document/create-document.service';
import { SharedService } from '@app/shared/shared.service';
import { TaskCrationPageService } from '@app/task-creation/task-creation.service';

@Component({
  selector: 'app-add-discipline-popup',
  templateUrl: './add-discipline-popup.component.html',
  styleUrls: ['./add-discipline-popup.component.scss']
})
export class AddDisciplinePopupComponent implements OnInit {
  private subscription: Subscription;
  disciplineData;
  disciplineId: number;
  showDisciplineDropDown = false;
  disciplineBtn:boolean = true;
  active: boolean = false;
  globalData:any;
  activityTabs;
  discipline: any;
  chipDisciplineData: any[] = [];
  chipDisciplineContainer: any = [];
  selctdata: any = '';
  rowNoData:any = '';
  loading:boolean;
  selectedDisciplineCode: any;
  selectedDisciplineCodenew: any;
  eventsDiscipline: Subject<void> = new Subject<void>();
  constructor(
    public StepflowService  : StepflowService,
    private createDocumentService: CreateDocumentService,
    public addItemDialog: MatDialogRef<any>,
    private sharedService: SharedService,
    public TaskCrationPageService: TaskCrationPageService,
    @Inject(MAT_DIALOG_DATA) private data
  ) { 
    
    

  }

  ngOnInit(): void {

    this.globalData=this.sharedService.getExistingMapData()
    this.subscription = this.createDocumentService
    .getAllMetaDisciplineStep()
    .subscribe((res) => {
      this.discipline = res;
       console.log("getAllMetaDisciplineStep", res);
     this.activityTabs = this.globalData;
   

    });

  }

  cancelAction(){
    this.addItemDialog.close();   
  }

  setDisciplineData($event) {
    this.disciplineBtn = true;
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
    this.selctdata = '';
    if (this.chipDisciplineData.length > 0) {

      this.chipDisciplineData.forEach(node => {
        this.setDisciplineHirerachy(node);
        this.selctdata = node.name;
        this.rowNoData = node.rowNo;
        this.disciplineBtn = false;
      });
      console.log( ' this.selctdata',this.selctdata);
    }

  }

  setNodeValues(value) {

    this.createDocumentService
      .getDisciplineCode(value)
      .subscribe((res) => {
        this.selectedDisciplineCode = res;
        
      });
  }

  setDisciplineHirerachy(node) {
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

  submitForm() {
    const param = {
      "stepFlowId": this.data.stepFlowId,
      "stepId": this.data.stepId,
      // "stepId": this.data.KnowledgeAssetId,
      "taskId": parseInt(window.location.href.split("/").pop()),
      "name": this.selctdata,
      "sequenceNumber": 0,
      "createdUser": sessionStorage.getItem('userMail'),
      "disciplineId": this.rowNoData
    }
    this.loading = true;
    this.disciplineBtn = true;
    this.TaskCrationPageService.createspecificswimLanes(param).subscribe(res => {    
      this.addItemDialog.close("SAVE");   
    },(error) =>{
      this.loading = false;   
    })
  }

}
