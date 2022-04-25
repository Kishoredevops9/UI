import {
  Component,
  OnInit,
  Input,
  HostListener,
  ViewChild,
  Inject,
  Output,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Item } from '@app/activity-page/activity-page.model';
import { FileUploadComponent } from '@app/task-creation/task-creation-details/task-tab-five-content/file-upload/file-upload.component';
import progressBar from 'src/assets/data/task-workflow.json';
import { DeviationComponent } from './deviation/deviation.component';
import {
  WICDdocList,
  statementExecutionModel,
  activityBlockResultEntryModel,
  addDeviationModel,
  addUpdateExceptionModel,
  addUpdateDeviationStatusAsyncModel,
  uploadDDMModel
} from '@app/task-creation/task-creation.model';
import { TaskCrationPageService } from '@app/task-creation/task-creation.service';
import { ExceptionComponent } from './exception/exception.component';
import { FlexAlignStyleBuilder } from '@angular/flex-layout';
import { formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { truncate } from 'fs';
import { SharedService } from '@app/shared/shared.service';
import { ViewAllDocumentsModalComponent } from '@app/task-creation/task-creation-details/task-tab-five-content/execution-list/viewAllDocumentsModal/viewAllDocumentsModal.component';
import { MatMenuTrigger } from '@angular/material/menu';
import { environment } from '@environments/environment';
import { UploadWeblinkDialogComponent } from '../upload-weblink-dialog/upload-weblink-dialog.component'
import { ConsoleLogger } from '@angular/compiler-cli/private/localize';
@Component({
  selector: 'app-execution-details',
  templateUrl: './execution-details.component.html',
  styleUrls: ['./execution-details.component.scss'],
})
export class ExecutionDetailsComponent implements OnInit {
  @Input() contentInfo: any;
  @Input() parentItem: any;
  @Input() currentActivityTaskId: any;
  @Input() editResultsStatus: boolean;
  @Input() criteriaAndBPData:any;
  content: any;
  showException: boolean = false;
  showDeviation: boolean = false;
  isSetDeviation: boolean = false;
  existingDeviation: boolean = false;
  launchDDM: boolean = false;
  launchWebLink: boolean = false;
  public screenWidth: any;
  public screenHeight: any;
  progressBar: any;
  progressBarDefault: any;
  statementExecutionModel = new statementExecutionModel();
  addUpdateDeviationStatusAsyncModel = new addUpdateDeviationStatusAsyncModel();
  activityBlockResultEntryModel = new activityBlockResultEntryModel();
  addDeviationModel = new addDeviationModel();
  addUpdateExceptionModel = new addUpdateExceptionModel();
  disableToggler = true;
  docType = 'AP';
  loading: boolean = false;
  activityTaskComponentId: number;
  activityStatus: string = '';
  taskId: number;
  docTypeStatus: string;
  isShowDropDown: boolean = false;
  isCgFormDelete: any;
  deviationGlobalStatus: boolean = false;
  counterEnable: boolean = true;
  selectedDeviationIndex;
  lastIndexOfDeviationDocNum: number;
  firstIndexOfDeviationDocNum: number;
  taskDeviationCount: number = 0;
  activityTaskComponentID: any;
  criteriaMetOptions:any;
  cgForm = this.fb.group({
    taskExecutionStatementEvaluationId: 0,
    deviation: this.fb.group({
      taskExecutionDeviationId: 0,
      statementEvaluationId: '',
      existingDeviationInd: '',
      deviationNumber: '',
      deviationStatusCode: ['WIP'],
      uploadDeviationFile: [''],
      uploadAcceptableFile: [''],
      reason: [''], //,Validators.required],
      difference: [''], //,Validators.required],
      criteriaUpdateInd: [''], //,Validators.required],
      riskLevelCode: [''], //,Validators.required],
      programRiskId: [null], //,Validators.required],
      complete: [null],
      uploadRiskFile: [''],
      systemRisk: [''],
      riskMitigationPlan: [''],
      taskComponentId: [],
      isValid: ['true'],
    }),
    exception: this.fb.group({
      taskExecutionExceptionId: 0,
      statementEvaluationId: '',
      difference: [''], //,Validators.required],
      reason: [''], //,Validators.required],
      needUpdateInd: [''],
      updateComment: [''], //,Validators.required],
      taskComponentId: [],
      isValid: ['true'],
    }),
  });
  criteriaCompleteData: any;
  updateValue: boolean = false;
  @ViewChild(DeviationComponent) deviationChanged: DeviationComponent;
  uploadDdmModel = new uploadDDMModel();
  ddmform: FormGroup;
  fileUploadData: Array<any>;
  viewMore: boolean = true;
  fileData: any;
  selectedContentFileData: any;
  updatedFileData: any;
  totalFiles: any;
  fileUploadStatus: boolean = false;
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  msg: string;
  newDeviation:any;
  selectedContentActDev:any;
  deviationType:any = [
    {
      id: '1',
      Name: 'Work Instruction Output',
      code: 'OUTPT'
    },
    {
      id: '2',
      Name: 'Criteria Result',
      code: 'RESLT'
    },
    {
      id: '3',
      Name: 'Deviation justification',
      code: 'DJUST'
    },
    {
      id: '4',
      Name: 'Risk Mitigation Proposal',
      code: 'RSKMP'
    },
    {
      id: '5',
      Name: 'Discipline Uploads',
      code: 'DUPLD'
    },
    {
      id: '6',
      Name: 'Step Uploads',
      code: 'SUPLD'
    },

  ];
  uploaddocumentTitle:any;
  isLoading:boolean;
  isaddedData:boolean;
  enableActivityBtn:boolean;
  enableActivityID:any;
  executionData = [];
  criteriaResult = [];
  activityCriteriaChk:boolean;
  bestPractiseChk:boolean;
  dialogConfig:any;
  actDeviationNumError:boolean;
  actDeviationNumMessage:any;

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private taskCrationPageService: TaskCrationPageService,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.route.params.subscribe((param) => {
      this.taskId = param['id'] ? param['id'] : '';

      // console.log('::TaskID::', this.taskId);
      if (this.taskId){
        this.getAllDeviationStatus(this.taskId);
      }

    });


  }
  ngOnChanges(event) {
    if (
      event.criteriaAndBPData &&
      event.criteriaAndBPData.currentValue &&
      event.criteriaAndBPData.previousValue !=
        event.criteriaAndBPData.currentValue
    ) {
      this.criteriaCompleteData = event.criteriaAndBPData.currentValue;
    }

    // console.log("contentInfo", this.contentInfo);
    // console.log("deviationChanged:ngOnChanges", this.deviationChanged);
  }
  ngOnInit(): void {
    this.ddmform = this.fb.group({
      fileName: ['', Validators.required],
      id: ['', Validators.required],
    });
    this.route.params.subscribe((param) => {
      this.taskId = param['id'] ? param['id'] : 0;
    });

    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    this.content = this.contentInfo.content;
    if (this.contentInfo && this.contentInfo.name == 'A') {
      this.bindData();
    }
    this.activityTaskComponentID =
      this.sharedService.getActivitytaskComponentId();

    this.defaultProgressBarData();
    this.fileUploadData = new Array();
    this.getAllUploadedDocuments(this.contentInfo);
    // console.log("deviationType", this.deviationType);
    // console.log("this.contentInfo:::1", this.contentInfo);
    // console.log("this.parentItem:::1", this.parentItem);
    this.criteriaResult = this.contentInfo.criteriaBPData;
    let currentSFData = [this.contentInfo];
    this.taskCriteriaBPEnableLoad(currentSFData);
    
  }
  taskCriteriaBPEnableLoad(currentSFData:any) {
    let criteriaData:any = this.criteriaResult;
    let assetlen:number = 0;
    let criteriaIndex:number = 0;
    let assetBPlen:number = 0;
    let criteriaBPIndex:number = 0;
    let assetStatTypeCode = 'C';
    currentSFData.forEach(stepFlows => {
      let assetSP = stepFlows.children ? stepFlows.children : [];
      assetSP.forEach(step => {
        let assetDP = step.children ? step.children : [];
        assetDP.forEach(discipline => {
          let assetAP = discipline.children ? discipline.children : [];
          assetAP.forEach(activitie => {
            let containItem = activitie.children ? activitie.children : []; 
            containItem.forEach(container => {
              let assetStat = container.cgActivityForm ? container.cgActivityForm : [];
              assetStat.forEach(assetStatement => {
                if(assetStatTypeCode == 'C' || assetStatTypeCode == 'B') {
                  if(assetStatement.AssetStatementTypeCode == 'C' || assetStatement.AssetStatementTypeCode == 'CG') {
                    assetlen++;
                  }
                  if(assetStatement.AssetStatementTypeCode == 'B') {
                    assetBPlen++;
                  }
                }
                criteriaData.forEach(element => {
                  if(assetStatTypeCode == 'C' || assetStatTypeCode == 'B') {
                    if(assetStatement.AssetStatementTypeCode == 'C' || assetStatement.AssetStatementTypeCode == 'CG') {
                      if(assetStatement.TaskComponentId == element.taskComponentId) {
                        criteriaIndex++;
                      }
                    }
                    if(assetStatement.AssetStatementTypeCode == 'B') {
                      if(assetStatement.TaskComponentId == element.taskComponentId) {
                        criteriaBPIndex++;
                      }
                    }
                  }                    
                });
              });
            });
            
            if(assetlen == criteriaIndex && assetlen !=0) {
              activitie.activityCriteriaChk = false;
            } else {
              activitie.activityCriteriaChk = true;
            }
        
            if(assetBPlen == criteriaBPIndex && assetBPlen !=0) {
              activitie.bestPractiseChk = false;
            } else {
              activitie.bestPractiseChk = true;
            }
          });
        });
      });
    });
  }
  taskReviewSubmittedActivities(assetStatTypeCode) {
    console.log("taskReviewSubmittedActivities", assetStatTypeCode);
    this.loading = true;
    this.taskCrationPageService
      .getAllCriteriaBPValues(this.taskId)
      .subscribe((res) => {
        this.criteriaResult = JSON.parse(JSON.stringify(res));
        this.taskCrationPageService
          .gettaskstepflowbytaskid(this.taskId)
          .subscribe((res) => {
            const data = JSON.parse(JSON.stringify(res));
            this.executionData = data;
            this.getExecutionData(this.executionData,assetStatTypeCode);
            this.loading = false;
          },(error) => {
            this.loading = false;
            console.log(error.error);
          });
      },(error) => {
        this.loading = false;
        console.log(error.error);
      });
  }
  getExecutionData(exData:any,assetStatTypeCode:any) {
    let exeData:any = exData;
    let criteriaData:any = this.criteriaResult;
    let assetlen:number = 0;
    let criteriaIndex:number = 0;
    let assetBPlen:number = 0;
    let criteriaBPIndex:number = 0;
    let assetTask = exeData.Tasks ? exeData.Tasks : [];
    assetTask.forEach(task => {
      let assetSF = task.StepFlows ? task.StepFlows : [];
      assetSF.forEach(stepFlows => {
        let assetSP = stepFlows.Steps ? stepFlows.Steps : [];
        assetSP.forEach(step => {
          let assetDP = step.Disciplines ? step.Disciplines : [];
          assetDP.forEach(discipline => {
            let assetAP = discipline.Activities ? discipline.Activities : [];
            assetAP.forEach(activitie => {
              let containItem = activitie.ContainerItems ? activitie.ContainerItems : [];              
              containItem.forEach(container => {
                let assetStat = container.AssetStatements ? container.AssetStatements : [];
                assetStat.forEach(assetStatement => {
                  if(assetStatTypeCode == 'C' || assetStatTypeCode == 'B') {
                    if(assetStatement.AssetStatementTypeCode == 'C' || assetStatement.AssetStatementTypeCode == 'CG') {
                      assetlen++;
                    }
                    if(assetStatement.AssetStatementTypeCode == 'B') {
                      assetBPlen++;
                    }
                  }
                  criteriaData.forEach(element => {
                    if(assetStatTypeCode == 'C' || assetStatTypeCode == 'B') {
                      if(assetStatement.AssetStatementTypeCode == 'C' || assetStatement.AssetStatementTypeCode == 'CG') {
                        if(assetStatement.TaskComponentId == element.taskComponentId) {
                          criteriaIndex++;
                        }
                      }
                      if(assetStatement.AssetStatementTypeCode == 'B') {
                        if(assetStatement.TaskComponentId == element.taskComponentId) {
                          criteriaBPIndex++;
                        }
                      }
                    }                    
                  });
                });
              });
              // if(assetlen == criteriaIndex && assetlen !=0) {
              //   activitie.activityCriteriaChk = false;
              // } else {
              //   activitie.activityCriteriaChk = true;
              // }
          
              // if(assetBPlen == criteriaBPIndex && assetBPlen !=0) {
              //   activitie.bestPractiseChk = false;
              // } else {
              //   activitie.bestPractiseChk = true;
              // }
            });            
          });
        });
      });
      
    });
    
    if(assetlen == criteriaIndex && assetlen !=0) {
      this.activityCriteriaChk = false;
      this.parentItem.activityCriteriaChk = false;
      this.contentInfo.activityCriteriaChk = false;
    } else {
      this.activityCriteriaChk = true;
      this.parentItem.activityCriteriaChk = true;
      this.contentInfo.activityCriteriaChk = true;
    }

    if(assetBPlen == criteriaBPIndex && assetBPlen !=0) {
      this.bestPractiseChk = false;
      this.parentItem.bestPractiseChk = false;
      this.contentInfo.bestPractiseChk = false;
    } else {
      this.bestPractiseChk = true;
      this.parentItem.bestPractiseChk = true;
      this.contentInfo.bestPractiseChk = true;
    }

  }
  getDeviationData($event) {
    this.newDeviation = $event;

    // console.log("this.contentInfo", this.contentInfo);
    // console.log("this.contentInfo.cgActivityForm", this.contentInfo.cgActivityForm);
    // console.log("getDeviationData", this.newDeviation);
    // this.contentInfo.cgActivityForm = this.msg;
  }
  updateChildNode(existingParentNode) {
    if (existingParentNode.children.length > 0) {
      existingParentNode.children.forEach((childNode) => {
        if (childNode.name == 'A') {
          childNode.children = [];
        } else {
          this.updateChildNode(childNode);
        }
      });
    }
  }
  setCriteriaMetOptions(
    critieriaValue: any,
    event: any,
    index,
    form,
    warningTemplateCG
  ) {
    const criteriaform = form.value;
    const criteriaForm = form;
    const currentBPValue = event;
    const completeData = critieriaValue;
    // console.log("setCriteriaMetOptions", this.contentInfo.cgActivityForm);
    let deviationNumber = this.newDeviation && this.newDeviation.deviationNumber ? this.newDeviation.deviationNumber : criteriaform.deviation.deviationNumber;
    let taskComponentId = this.newDeviation && this.newDeviation.taskComponentId ? this.newDeviation.taskComponentId : criteriaform.deviation.taskComponentId;



    if (
      (criteriaform.deviation.statementEvaluationId == '2' || criteriaform.deviation.statementEvaluationId == '1') &&
      criteriaform.deviation.difference != '' &&
      criteriaform.deviation.reason != '' &&
      event == '1'
    ) {
      const dialog = this.dialog.open(warningTemplateCG, {
        width: '42%',
        disableClose: true,
        panelClass: 'custom-dialog-container',
      });
      dialog.afterClosed().subscribe((result) => {
        if (this.updateValue) {
          this.taskCrationPageService
            .deleteDeviationByNumber(deviationNumber, taskComponentId)
            .subscribe((res) => {
              this.isCgFormDelete = res;
            });
        } else {
          criteriaForm.controls.deviation.patchValue({
            statementEvaluationId: '2',
          });
        }
      });
    }
    this.contentInfo.activityCriteriaChk = true;
    // console.log("addUpdateStatementExecution:parentItem", this.parentItem);
    this.addUpdateStatementExecution(completeData, event, criteriaform);
    if (event == '1') {
      this.parentItem.disableWIToggler = false;
    } else {
      this.parentItem.disableWIToggler = true;
    }
    this.criteriaMetOptions = event;
  }

  setDeviationOptions(critieriaValue, value, form, warningTemplateCG) {
    const criteriaform = form.value;
    const criteriaForm = form;
    const currentBPValue = value;
    const completeData = critieriaValue;

    let deviationNumber = this.newDeviation && this.newDeviation.deviationNumber ? this.newDeviation.deviationNumber : criteriaform.deviation.deviationNumber;
    let taskComponentId = this.newDeviation && this.newDeviation.taskComponentId ? this.newDeviation.taskComponentId : criteriaform.deviation.taskComponentId;
    if ( (criteriaform.deviation.deviationNumber != '' && value == 'yes') )
    {
      const dialog = this.dialog.open(warningTemplateCG, {
        width: '42%',
        disableClose: true,
        panelClass: 'custom-dialog-container',
      });
      dialog.afterClosed().subscribe((result) => {
        if (this.updateValue) {
          this.taskCrationPageService
            .deleteDeviationByNumber(deviationNumber, taskComponentId)
            .subscribe((res) => {
              this.isCgFormDelete = res;
              this.actDeviationNumError = false;
              this.actDeviationNumMessage = '';
            });
        } else {
          criteriaForm.controls.deviation.patchValue({
            existingDeviationInd: 'no',
          });
        }
      });
    }

    if (value == 'yes') {
      if (critieriaValue.cgForm.value.deviation.deviationNumber == '') {
        critieriaValue.cgForm
          .get('deviation.deviationNumber')
          .setValidators(Validators.required);
        critieriaValue.cgForm
          .get('deviation.deviationNumber')
          .updateValueAndValidity();
        critieriaValue.cgForm.get('deviation.reason').clearValidators();
        critieriaValue.cgForm.get('deviation.reason').updateValueAndValidity();
        critieriaValue.cgForm.get('deviation.difference').clearValidators();
        critieriaValue.cgForm
          .get('deviation.difference')
          .updateValueAndValidity();
        critieriaValue.cgForm
          .get('deviation.criteriaUpdateInd')
          .clearValidators();
        critieriaValue.cgForm
          .get('deviation.criteriaUpdateInd')
          .updateValueAndValidity();
        critieriaValue.cgForm.get('deviation.riskLevelCode').clearValidators();
        critieriaValue.cgForm
          .get('deviation.riskLevelCode')
          .updateValueAndValidity();
        critieriaValue.cgForm.get('deviation.programRiskId').clearValidators();
        critieriaValue.cgForm
          .get('deviation.programRiskId')
          .updateValueAndValidity();
        this.parentItem.disableWIToggler = true;
      } else {
        this.parentItem.disableWIToggler = false;
      }
    } else {
      critieriaValue.cgForm.get('deviation.deviationNumber').clearValidators();
      critieriaValue.cgForm
        .get('deviation.deviationNumber')
        .updateValueAndValidity();
      critieriaValue.cgForm
        .get('deviation.reason')
        .setValidators(Validators.required);
      critieriaValue.cgForm.get('deviation.reason').updateValueAndValidity();
      critieriaValue.cgForm
        .get('deviation.difference')
        .setValidators(Validators.required);
      critieriaValue.cgForm
        .get('deviation.difference')
        .updateValueAndValidity();
      critieriaValue.cgForm
        .get('deviation.criteriaUpdateInd')
        .setValidators(Validators.required);
      critieriaValue.cgForm
        .get('deviation.criteriaUpdateInd')
        .updateValueAndValidity();
      critieriaValue.cgForm
        .get('deviation.riskLevelCode')
        .setValidators(Validators.required);
      critieriaValue.cgForm
        .get('deviation.riskLevelCode')
        .updateValueAndValidity();
      critieriaValue.cgForm
        .get('deviation.programRiskId')
        .setValidators(Validators.required);
      critieriaValue.cgForm
        .get('deviation.programRiskId')
        .updateValueAndValidity();
      this.parentItem.disableWIToggler = true;
    }
  }
  setBPMetOption(critieriaValue, event, form, warningTemplate) {
    const criteriaForm = form;
    const criteriaFormValue = form.value;
    const currentBPValue = event;
    const completeData = critieriaValue;

    let taskComponentId = criteriaFormValue.exception.taskComponentId;

    if (
      criteriaFormValue.exception.statementEvaluationId == '2' &&
      criteriaFormValue.exception.difference != '' &&
      criteriaFormValue.exception.reason != '' &&
      ((criteriaFormValue.exception.needUpdateInd == true &&
        criteriaFormValue.exception.updateComment != '') ||
        criteriaFormValue.exception.needUpdateInd == false) &&
      (event == '1' || event == '3')
    ) {
      const dialog = this.dialog.open(warningTemplate, {
        width: '42%',
        disableClose: true,
        panelClass: 'custom-dialog-container',
      });
      dialog.afterClosed().subscribe((result) => {
        if (this.updateValue) {
          this.taskCrationPageService
            .deleteTaskExecutionExceptionAsyn(taskComponentId)
            .subscribe((res) => {});
        } else {
          criteriaForm.controls.exception.patchValue({
            statementEvaluationId: '2',
          });
        }
      });
    } else {
      this.addUpdateStatementExecution(completeData, event, criteriaFormValue);
      this.parentItem.disableBPToggler = event == '2';
    }
  }
  setDeviationId(criteriaValue, event) {
    
    let deviationNumber = event.target.value;
    let TaskComponentId = criteriaValue.TaskComponentId;
    // let displayName = sessionStorage.getItem('displayName');
    // let createdOrModifiedBy = displayName ? displayName : '';

    let displayName = sessionStorage.getItem('userMail');
    let createdOrModifiedBy = displayName ? displayName : '';

    if (event.target.value == '') {
      this.parentItem.disableWIToggler = true;
    } else {
      this.parentItem.disableWIToggler = false;
      this.loading = true;
      this.taskCrationPageService
        .isDeviationNumberExistsAsync(
          deviationNumber,
          TaskComponentId,
          createdOrModifiedBy
        )
        .subscribe(
          (status) => {
            if (status == true) {
              console.log('Deviation Number is valid');
            } else {
              alert('Deviation does not found or already deleted.');
              this.actDeviationNumError = true;
              this.actDeviationNumMessage = 'Deviation does not found or already deleted.';
            }
            this.loading = false;
          },
          (error) => {
            this.loading = false;
            this.actDeviationNumError = true;
            this.actDeviationNumMessage = error.error;
            //alert(error);
          }
        );
    }
    
    // this.addUpdateDeviationStatusAsyncModel.deviationNumber = criteriaValue.cgForm.value.deviation.deviationNumber;
    // this.addUpdateDeviationStatusAsyncModel.deviationStatusCode = criteriaValue.cgForm.value.deviation.deviationStatusCode;
    // this.addUpdateDeviationStatusAsyncModel.lastUpdateUser = (sessionStorage.getItem('displayName')) ? sessionStorage.getItem('displayName') : '';
    // this.taskCrationPageService.updateDeviationStatusAsync(this.addUpdateDeviationStatusAsyncModel).subscribe((res) => {
    //   console.log("addUpdateStatementExecution res", res);
    // });
  }

  setActivityDeviationOptions(
    deviationValue: any,
    event: any,
    completionFlag: any,
    option
  ) {
    let userProfileDataObj = JSON.parse(
      sessionStorage.getItem('userProfileData')
    );
    this.activityBlockResultEntryModel.taskExecutionId = 0;
    this.activityBlockResultEntryModel.taskComponentId = deviationValue.content[
      'taskComponentId'
    ]
      ? deviationValue.content['taskComponentId']
      : '';
    this.activityBlockResultEntryModel.executionStatusCode = '';
    this.activityBlockResultEntryModel.completionInd =
      option == 'disableWIToggler'
        ? event.checked
        : deviationValue.disableWIToggler;
    this.activityBlockResultEntryModel.bestPracticesInd =
      option == 'disableBPToggler'
        ? event.checked
        : deviationValue.disableBPToggler;
    this.activityBlockResultEntryModel.createdUser = sessionStorage.getItem(
      'displayName'
    )
      ? sessionStorage.getItem('displayName')
      : '';
    this.activityBlockResultEntryModel.lastUpdateUser = sessionStorage.getItem(
      'displayName'
    )
      ? sessionStorage.getItem('displayName')
      : '';
    this.activityBlockResultEntryModel.completionFlag = completionFlag
      ? completionFlag
      : false;
    this.activityBlockResultEntryModel.userId = userProfileDataObj.globalUId
      ? userProfileDataObj.globalUId
      : '12345';

    // console.log("activityBlockResultEntryModel", this.activityBlockResultEntryModel);
    this.activityBlockResultEntryAsync(
      this.activityBlockResultEntryModel,
      deviationValue
    );
    this.parentItem.selectedItem.push(this.parentItem);
  }

  setDeviation(val) {
    this.isSetDeviation = true;
    this.showDeviation = val;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
  }

  uploadFile(event, item) {
    let taskComponentId = item.content.taskComponentId;
    let documentTypeCode;

    if (item.name == 'A') {
      documentTypeCode = 'OUTPT';
    }
    event.stopPropagation();
    const dialogRef = this.dialog.open(FileUploadComponent, {
      width: '50%',
      height: 'auto',
      maxWidth: this.screenWidth + 'px',
      maxHeight: this.screenHeight + 'px',
      data: {
        type: 'T',
        message: 'ADD ONS',
        showEksPanel: false,
        taskComponentId: taskComponentId,
        documentTypeCode: documentTypeCode,
        taskId: this.taskId,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getAllUploadedDocuments(this.parentItem, true);
      this.fileUploadStatus = this.sharedService.getFileUploadData();
      if (this.fileUploadData) {
        this.trigger.closeMenu();
      }
    });
  }

  launchDDMTrigger() {
    this.launchDDM = !this.launchDDM;
  }
  closeDropdown() {
    this.launchDDM = false;
  }

  launchWebLinkTrigger() {
    this.launchWebLink = !this.launchWebLink;
  }
  closeWebLink() {
    this.launchWebLink = false;
  }

  addUpdateStatementExecution(critieriaValue, event, criteriaform) {
    this.statementExecutionModel.activityTaskComponentId =
      this.parentItem.content.taskComponentId;
    this.statementExecutionModel.taskExecutionStatementEvaluationId =
      criteriaform.taskExecutionStatementEvaluationId;
    this.statementExecutionModel.statementEvaluationId = Number(event);
    this.statementExecutionModel.taskComponentId = critieriaValue[
      'TaskComponentId'
    ]
      ? critieriaValue['TaskComponentId']
      : '';
    this.statementExecutionModel.createdUser = sessionStorage.getItem(
      'displayName'
    )
      ? sessionStorage.getItem('displayName')
      : '';
    this.statementExecutionModel.lastUpdateUser = sessionStorage.getItem(
      'displayName'
    )
      ? sessionStorage.getItem('displayName')
      : '';
    this.taskCrationPageService
      .addUpdateStatementExecution(this.statementExecutionModel)
      .subscribe((res) => {
        // if(critieriaValue.AssetStatementTypeCode == 'C') {
          this.taskReviewSubmittedActivities(critieriaValue.AssetStatementTypeCode);
        // }
        critieriaValue.cgForm.patchValue({
          taskExecutionStatementEvaluationId:
            res['taskExecutionStatementEvaluationId'],
        });
        this.updateValue = false;
      }, (error) => {
        console.log(error.error);
      });
  }

  activityBlockResultEntryAsync(param: any, deviationValue) {
    this.taskCrationPageService
      .activityBlockResultEntryAsync(param)
      .subscribe((res) => {
        // console.log("activityBlockResultEntryAsync", res)
        this.activityTaskComponentId = res['taskComponentId'];
        this.activityStatus = res['executionStatusCode'];
        if(param.completionFlag) {
          if (res['executionStatusCode'] == 'COMP') {
            this.docTypeStatus = 'Completed';
            deviationValue.docStatus = 'Completed';
            sessionStorage.setItem('documentWorkFlowStatus', 'Completed');
          } else {
            deviationValue.docStatus = 'WIP';
            sessionStorage.setItem('documentWorkFlowStatus', 'WIP');
          }
        }
        /*Get All Activity Response Data Start Here*/
        let taskProcessId = parseInt(window.location.href.split('/').pop());
        if (taskProcessId > 0) {
          this.getAllActivity(taskProcessId);
        }
        /*Get All Activity Response Data End Here*/
      });
  }

  getAllActivity(param: any) {
    this.taskCrationPageService.getAllActivity(param).subscribe((res) => {
      //console.log('getAllActivity res', res);
    });
  }

  addUpdateTaskExecutionExceptionsAsync(deviationValue: any) {
    this.addUpdateExceptionModel.taskExecutionExceptionId = 0;
    this.addUpdateExceptionModel.taskComponentId = deviationValue[
      'TaskComponentId'
    ]
      ? deviationValue['TaskComponentId']
      : '';
    this.addUpdateExceptionModel.listAvailableInd = true;
    this.addUpdateExceptionModel.rationalAvailableInd = true;
    this.addUpdateExceptionModel.difference = deviationValue.cgForm.value
      .difference
      ? deviationValue.cgForm.value.difference
      : '';
    this.addUpdateExceptionModel.reason = deviationValue.cgForm.value.reason
      ? deviationValue.cgForm.value.reason
      : '';
    //this.addUpdateExceptionModel.statementEvaluationId = true;
    this.addUpdateExceptionModel.updateComment = 'string';
    this.addUpdateExceptionModel.createdUser = sessionStorage.getItem(
      'displayName'
    )
      ? sessionStorage.getItem('displayName')
      : '';
    this.addUpdateExceptionModel.lastUpdateUser = sessionStorage.getItem(
      'displayName'
    )
      ? sessionStorage.getItem('displayName')
      : '';
    //console.log('addUpdateExceptionModel--->', this.addUpdateExceptionModel);
    this.taskCrationPageService
      .addUpdateTaskExecutionExceptionsAsync(this.addUpdateExceptionModel)
      .subscribe((res) => {
        if(res) {

        }
      });
  }

  ngOnDestroy() {
    sessionStorage.removeItem('documentWorkFlowStatus');
  }
  updateExceptionForm(value) {
    if (value == 'true') {
      this.updateException(this.contentInfo);
    } else {
      this.parentItem.disableBPToggler = true;
    }
  }
  updateException(item) {
    item.cgActivityForm.forEach((el) => {
      if (el.AssetStatementTypeCode == 'B') {
        this.addUpdateExceptionModel.taskComponentId = el['TaskComponentId']
          ? el['TaskComponentId']
          : '';
        this.addUpdateExceptionModel.taskExecutionExceptionId =
          el.cgForm.value.exception.taskExecutionExceptionId;
        this.addUpdateExceptionModel.difference =
          el.cgForm.value.exception.difference;
        this.addUpdateExceptionModel.reason = el.cgForm.value.exception.reason;
        this.addUpdateExceptionModel.needUpdateInd =
          el.cgForm.value.exception.needUpdateInd == '' ||
          el.cgForm.value.exception.needUpdateInd == false
            ? true
            : false;
        this.addUpdateExceptionModel.updateComment =
          el.cgForm.value.exception.updateComment;
        this.addUpdateExceptionModel.createdUser = sessionStorage.getItem(
          'displayName'
        )
          ? sessionStorage.getItem('displayName')
          : '';
        this.addUpdateExceptionModel.lastUpdateUser = sessionStorage.getItem(
          'displayName'
        )
          ? sessionStorage.getItem('displayName')
          : '';
        this.taskCrationPageService
          .addUpdateTaskExecutionExceptionsAsync(this.addUpdateExceptionModel)
          .subscribe((res) => {
            el.cgForm.controls.exception.patchValue({
              taskExecutionExceptionId: res['taskExecutionExceptionId'],
            });
            this.bindData();
            //this.parentItem.disableBPToggler = false;
            this.loading = false;
          });
      }
    });
  }
  handleOnOkButton() {
    this.dialog.closeAll();
    this.updateValue = true;
  }
  handleOnCloseButton() {
    this.dialog.closeAll();
    this.updateValue = false;
  }
  bindData() {
    let activityData = this.contentInfo;
    // activityData['docStatus'] =
    //   activityData.content.AssetStatusId == 1 ? 'WIP' : 'Completed';
    let activityWIStatus = false;
    let activityBPStatus = false;
    activityData.children.length > 0 &&
      activityData.children.forEach((child) => {
        if (child.cgActivityForm) {
          child.cgActivityForm.forEach((content) => {
            content['criteriaFormValid'] = true;
            content['BPFormValid'] = true;

            const existingDeviation =
              content.cgForm.value.deviation.statementEvaluationId == '2' &&
              content.cgForm.value.deviation.existingDeviationInd == 'yes' &&
              content.cgForm.value.deviation.deviationNumber != '';
            const savedDeviation =
              content.cgForm.value.deviation.statementEvaluationId == '2' &&
              content.cgForm.value.deviation.existingDeviationInd == 'no' &&
              content.cgForm.value.deviation.deviationStatusCode == 'Completed';
            const existingBP =
              content.cgForm.value.exception.statementEvaluationId == '2' &&
              content.cgForm.value.exception.difference != '' &&
              content.cgForm.value.exception.reason != '' &&
              (content.cgForm.value.exception.needUpdateInd == false ||
                (content.cgForm.value.exception.needUpdateInd == true &&
                  content.cgForm.value.exception.updateComment != ''));
            if (content.AssetStatementTypeCode == 'C') {
              content['criteriaFormValid'] =
                existingDeviation == true ||
                savedDeviation == true ||
                content.cgForm.value.deviation.statementEvaluationId == 1;
            }
            if (content.AssetStatementTypeCode == 'B') {
              content['BPFormValid'] =
                existingBP == true ||
                content.cgForm.value.exception.statementEvaluationId == 1 ||
                content.cgForm.value.exception.statementEvaluationId == 3;
            }
          });
          let criteriaData = child.cgActivityForm.filter((item) => {
            return (
              item.AssetStatementTypeCode == 'C' &&
              item.criteriaFormValid == false
            );
          });
          let BPData = child.cgActivityForm.filter((item) => {
            return (
              item.AssetStatementTypeCode == 'B' && item.BPFormValid == false
            );
          });
          activityWIStatus = criteriaData.length > 0;
          activityBPStatus = BPData.length > 0;
        }
      });
    activityData.disableWIToggler = activityWIStatus;
    activityData.disableBPToggler = activityBPStatus;
    // activityData.WIToggler = false;
    // activityData.BPToggler = false;
  }

  //Default Progress bar Data

  defaultProgressBarData() {
    progressBar.map((item) => {
      this.progressBarDefault = item.deviationWorkFlow;
      this.deviationGlobalStatus = true;
    });
  }

  getAllDeviationStatus(taskId) {
    this.taskCrationPageService
      .getAllDeviationStatusByTaskIdAsync(taskId)
      .subscribe(
        (item) => {
          if (item != null) {
            let taskComponentId = item[0].taskComponentId;

            this.sharedService.setActivitytaskComponentId(taskComponentId);
            const data = JSON.parse(JSON.stringify(item[0].deviationStatusDto));
            data.forEach((el) => {
              const status = el.name;
              this.taskDeviationCount += el.count;
              if (status == 'Work-In-Progress') {
                el['order'] = '1';
              } else if (status == 'Completed') {
                el['order'] = '2';
              } else if (status == 'Submitted') {
                el['order'] = '3';
              } else if (status == 'Supervisor Approved') {
                el['order'] = '4';
              } else if (status == 'Chief Approved') {
                el['order'] = '5';
              } else if (status == 'CIPT Lead Approved') {
                el['name'] = 'CIPTL Approved';
                el['order'] = '6';
              } else if (status == 'Approved') {
                el['order'] = '7';
              } else if (status == 'Cancelled') {
                el['order'] = '8';
              }
            });
            this.progressBar = data.sort(function (a, b) {
              return a.order - b.order;
            });

            let filteredItems = this.progressBar.filter((item) => {
              return item.count > 0;
            });


            let lastItem = filteredItems[filteredItems.length - 1];
            let firstItem = filteredItems[0];
            this.enableActivityID = taskComponentId;
            this.enableActivityBtn = firstItem && firstItem.name == 'Approved' ? false : true;

            this.lastIndexOfDeviationDocNum = lastItem.order - 1; //Index of Last Activity with Document Number
            this.firstIndexOfDeviationDocNum = firstItem.order - 1;

            this.progressBar.forEach((el, index) => {
              const status = el.name;
              this.taskDeviationCount += el.count;
              if (status == 'Work-In-Progress') {
                if (el.count == this.taskDeviationCount) {
                  this.selectedDeviationIndex = index;
                }
              } else if (status == 'Completed') {
                if (el.count == this.taskDeviationCount) {
                  this.selectedDeviationIndex = index;
                }
              } else if (status == 'Submitted') {
                if (el.count == this.taskDeviationCount) {
                  this.selectedDeviationIndex = index;
                }
              } else if (status == 'Supervisor Approved') {
                if (el.count == this.taskDeviationCount) {
                  this.selectedDeviationIndex = index;
                }
              } else if (status == 'Chief Approved') {
                if (el.count == this.taskDeviationCount) {
                  this.selectedDeviationIndex = index;
                }
              } else if (status == 'CIPT Lead Approved') {
                if (el.count == this.taskDeviationCount) {
                  this.selectedDeviationIndex = index;
                }
              } else if (status == 'Approved') {
                if (el.count == this.taskDeviationCount) {
                  this.selectedDeviationIndex = index;
                }
              } else if (status == 'Cancelled') {
                if (el.count == this.taskDeviationCount) {
                  this.selectedDeviationIndex = index;
                }
              }
            });

            this.deviationGlobalStatus = true;
            this.counterEnable = true;
          }
        },
        (error) => {
          if (error.error == 'No record found' && error.status == 400) {
            this.progressBar = progressBar.map((item) => {
              return item.deviationWorkFlow;
            });
          }
        }
      );
  }

  removeHTMLTags(string: any) {
    if (string === null || string === '') return false;
    else string = string.toString();
    return string.replace(/(<([^>]+)>)/gi, '');
  }

  uploadAttach(parentItem, contentInfo, uploadCode, dCode) {
    this.isLoading = true;
    let dateTime = new Date().toISOString();
    let displayName = sessionStorage.getItem('displayName');
    this.uploadDdmModel.taskExecutionUploadId = 0;
    this.uploadDdmModel.documentTitle = this.ddmform.value.fileName;
    this.uploadDdmModel.documentReference = this.ddmform.value.id;
    this.uploadDdmModel.documentTypeCode = dCode;
    this.uploadDdmModel.taskComponentId = contentInfo.content.taskComponentId;
    this.uploadDdmModel.uploadDestinationCode = uploadCode;
    this.uploadDdmModel.createdUser = displayName ? displayName : '';
    this.uploadDdmModel.lastUpdateUser = displayName ? displayName : '';
    this.uploadDdmModel.createdDateTime = dateTime;
    this.uploadDdmModel.lastUpdateDateTime = dateTime;
    if(uploadCode == 'DDM') {
      this.taskCrationPageService
      .uploadDDM(this.uploadDdmModel)
      .subscribe((res: any) => {
        this.uploadDynamicData(res,'DDM')
        // this.launchDDM = false;
        this.isLoading = false;
      },(error) => {
        this.isLoading = false;
        console.log(error.error);
      });
    this.ddmform.reset();
    }

    if(uploadCode == 'WLNK') {
      this.taskCrationPageService
      .uploadWebLink(this.uploadDdmModel)
      .subscribe((res: any) => {
        this.uploadDynamicData(res,'WLNK')
        // this.launchDDM = false;
        this.isLoading = false;
      },(error) => {
        this.isLoading = false;
        console.log(error.error);
      });
    this.ddmform.reset();
    }

  }

  uploadDynamicData(res:any, uploadCode:any) {
    if(res.documentTitle){
      this.isaddedData = true;
      this.uploaddocumentTitle = res.documentTitle;
      setTimeout(()=>{
        this.isaddedData = false;
        if(uploadCode == 'DDM') {
          this.launchDDM = false;
        }
        if(uploadCode == 'WLNK') {
          this.launchWebLink = false;
        }
      },2000)
    }
    this.selectedContentFileData.push(res);
    this.selectedContentFileData = this.selectedContentFileData.reverse();
    this.uploadDataReasonRisk(this.selectedContentFileData);
    let ddmFile = res.documentTitle;
    this.fileUploadData.push(ddmFile);
  }

  uploadDataReasonRisk(dataList:any) {
    // console.log("dataList", dataList);
    let deviationType = this.deviationType;
    let pushData : any = [];
    let getData:any = dataList;
    getData.forEach(function(item: any){
      deviationType.forEach(function(dID: any){
        if(item.documentTypeId == dID.id) {
          let uploadDCode;
          if(item.uploadDestinationCode == 'WLNK') {
            uploadDCode = 'Other'
          } else {
            uploadDCode = item.uploadDestinationCode;
          }
          let tableModel: any = {
            createdDateTime: item.createdDateTime,
            createdUser: item.createdUser,
            documentReference: item.documentReference,
            documentTitle: item.documentTitle,
            documentTypeCode: dID.code,
            documentTypeId: item.documentTypeId,
            lastUpdateDateTime: item.lastUpdateDateTime,
            lastUpdateUser: item.lastUpdateUser,
            taskComponentId: item.taskComponentId,
            taskExecutionUploadId: item.taskExecutionUploadId,
            uploadDestinationCode: uploadDCode
          }
          pushData.push(tableModel);
        }
      });
    });
    let selectedContentReasonDev = pushData;
    let pushDataReasonDev : any = [];
    selectedContentReasonDev.forEach(element => {
        if(element.documentTypeCode == 'RESLT') {
          pushDataReasonDev.push(element);
        }
    });
    this.selectedContentActDev = pushDataReasonDev;

  }


  viewAllDocuments(taskComponentId) {
    let filterData = this.fileData.filter(
      (item) => item.taskComponentId == taskComponentId
    );
    let fData = {
      ftData : filterData,
      documentTypeCode : 'RESLT'
    }
    this.totalFiles = filterData.length;

    if(this.totalFiles > 0) {
      const dialogRef = this.dialog.open(ViewAllDocumentsModalComponent, {
        width: '50%',
        height: 'auto',
        maxWidth: this.screenWidth + 'px',
        maxHeight: this.screenHeight + 'px',
        data: fData,
      });
    }

  }
  moreData($arg) {
    return this.selectedContentFileData.filter((node: any) => {
      return node.taskComponentId == $arg;
    }).length;
  }

  getAllUploadedDocuments(itemArry, reset?: boolean) {

    this.taskId && this.taskCrationPageService
      .getAllTaskExecutionUploadDetails(this.taskId, reset)
      .subscribe((item) => {
        this.fileData = item;
        this.selectedContentFileData = item;
        this.selectedContentFileData = this.selectedContentFileData.reverse();
        this.uploadDataReasonRisk(this.selectedContentFileData);
        itemArry.children && itemArry.children.children && itemArry.children.children.children && itemArry.children.children.children &&
        itemArry.children.children.children.map((el) => {
            if (el.assetTypeCode == 'A') {
              let filterData = this.fileData.filter(
                (fl) => fl.taskComponentId == el.content.taskComponentId
              );

              this.totalFiles = filterData.length;
            }
          });

        if (this.totalFiles >= 2) {
          this.viewMore = false;
        } else {
          this.viewMore = true;
        }
      });
  }

   statusReportCrt(taskReaid){
    if(environment.SSRSContentTaskIdEnable) {
      window.open(environment.SSRSContenteTaskCriteriaReport+"="+this.taskId,'_blank');
    } else {
      window.open(environment.SSRSContenteTaskCriteriaReport+"="+taskReaid,'_blank');
    }
  }

  popupEditPopup(uploadData,DestCode) {
    let formGroup;
    if(DestCode == 'Other') {
      formGroup = 
        {
          formName1 : 'File Name/ID',
          formName2 : 'Location',
        }
      
    } else {
      formGroup = 
        {
          formName1 : 'File Name',
          formName2 : 'ID',
        }
      
    }
    this.dialogConfig = {
      header: (DestCode == 'Other') ? 'Other' : DestCode,
      action: 'addEditPopup',
      editData: uploadData,
      controlForm: formGroup
    }
    const dialogRef = this.dialog.open(UploadWeblinkDialogComponent, {
      width: '500px',
      data: this.dialogConfig
    });

    dialogRef.afterClosed().subscribe((result) => {
      if(result) {
        // console.log("result", result);
        this.isLoading = true;
        let dateTime = new Date().toISOString();
        let displayName = sessionStorage.getItem('displayName');
        this.uploadDdmModel.taskExecutionUploadId = uploadData.taskExecutionUploadId;
        this.uploadDdmModel.documentTitle = result.value.fileName;
        this.uploadDdmModel.documentReference = result.value.id;
        this.uploadDdmModel.documentTypeCode = uploadData.documentTypeCode;
        this.uploadDdmModel.taskComponentId = uploadData.taskComponentId;
        this.uploadDdmModel.uploadDestinationCode = uploadData.uploadDestinationCode == 'Other' ? 'WLNK' : uploadData.uploadDestinationCode;
        this.uploadDdmModel.createdUser = displayName ? displayName : '';
        this.uploadDdmModel.lastUpdateUser = displayName ? displayName : '';
        this.uploadDdmModel.createdDateTime = uploadData.createdDateTime;
        this.uploadDdmModel.lastUpdateDateTime = dateTime;
        // console.log("uploadDdmModel", this.uploadDdmModel);
        this.taskCrationPageService
          .uploadUpdateDDMWebLink(this.uploadDdmModel)
          .subscribe((res: any) => {            
            this.isLoading = false;
          },(error) => {
            this.isLoading = false;
            console.log(error.error);
          });
      }
    });
  }

  popupDeletePopup(uploadData) {
    console.log("popupDeletePopup", uploadData);
    this.dialogConfig = {
      action: 'deletePopup',
      editData: uploadData
    }
    const dialogRef = this.dialog.open(UploadWeblinkDialogComponent, {
      data: this.dialogConfig
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("deleteDDMWebLink::result", result);
      if(result == "Yes") {
        this.isLoading = true;
        this.taskCrationPageService
          .deleteDDMWebLink(uploadData.taskExecutionUploadId)
          .subscribe((res: any) => {
            console.log("deleteDDMWebLink", res);
            this.getAllUploadedDocuments(this.contentInfo);
            this.isLoading = false;
          },(error) => {
            this.isLoading = false;
            console.log(error.error);
          });
      }
    });
  }

}
