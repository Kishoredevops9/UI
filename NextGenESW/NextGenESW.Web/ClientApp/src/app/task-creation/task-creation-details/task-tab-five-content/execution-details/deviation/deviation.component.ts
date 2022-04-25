import {
  Component,
  OnInit,
  HostListener,
  Input,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  ControlContainer,
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FileUploadComponent } from '@app/task-creation/task-creation-details/task-tab-five-content/file-upload/file-upload.component';
import progressBar from 'src/assets/data/task-workflow.json';
import { TaskCrationPageService } from '@app/task-creation/task-creation.service';
import { addDeviationModel , uploadDDMModel} from '@app/task-creation/task-creation.model';
import { ActivatedRoute } from '@angular/router';
import { RecallReviseDialogComponent } from '../../execution-list/recall-revise-dialog/recall-revise-dialog.component';
import { ViewHistoryLogsComponent } from '../../execution-list/view-history-logs/view-history-logs.component';
import { SharedService } from '@app/shared/shared.service';
import { ViewAllDocumentsModalComponent } from '@app/task-creation/task-creation-details/task-tab-five-content/execution-list/viewAllDocumentsModal/viewAllDocumentsModal.component';
import { UploadWeblinkDialogComponent } from '../../upload-weblink-dialog/upload-weblink-dialog.component'
@Component({
  selector: 'app-deviation',
  templateUrl: './deviation.component.html',
  styleUrls: ['./deviation.component.scss'],
})
export class DeviationComponent implements OnInit {
  lowRisk: boolean = true;
  public screenWidth: any;
  public screenHeight: any;
  deviationForm: any;
  childForm: any;
  taskId: number;
  @Input() contentInfo: any;
  @Input() userForm;
  @Input() parentItem;
  @Input() editResultsStatus;
  @Input() criteriaMetOptions:any;
  @Output() updateForm = new EventEmitter();
  addDeviationModel = new addDeviationModel();
  deviationFormData: any;
  deviationNumber: any;
  deviationId:any;
  launchDDM: boolean = false;
  launchWebLink: boolean = false;
  progressBar: any;
  @Input() docStatus: string = 'WIP';
  @Input() formGroupName: string;
  @Input() isCgFormDelete;
  systemRiskInfo: string =
    'The engineer makes the initial determination if it’s a System Risk and the Deviation Approver makes the final determination.';
  form: FormGroup;
  deviationStatus: boolean = true;
  isLoading: boolean = false;
  uploadDdmModelDev = new uploadDDMModel();
  ddmformDev: FormGroup;
  ddmformDevRisk: FormGroup;
  fileUploadDataDev: Array<any>;
  viewMore: boolean = true;
  fileData: any;
  selectedContentFileDataDev: any;
  selectedContentReasonDev:any;
  selectedContentRiskDev:any;
  updatedFileData: any;
  totalFiles: any;
  fileUploadStatus: boolean = false;
  deviationTaskItem:any;
  deviationCompId:any;
  @Output() passExecutionDetails = new EventEmitter();
  deviationUpdateForm: FormGroup;
  deviationType:any = [
    {
      "id": '1',
      "Name": 'Work Instruction Output',
      "code": 'OUTPT'
    },
    {
      "id": '2',
      "Name": 'Criteria Result',
      "code": 'RESLT'
    },
    {
      "id": '3',
      "Name": 'Deviation justification',
      "code": 'DJUST'
    },
    {
      "id": '4',
      "Name": 'Risk Mitigation Proposal',
      "code": 'RSKMP'
    },
    {
      "id": '5',
      "Name": 'Discipline Uploads',
      "code": 'DUPLD'
    },
    {
      "id": '6',
      "Name": 'Step Uploads',
      "code": 'SUPLD'
    }
  ];
  uploaddocumentTitle:any;
  isDLoading:boolean;
  isaddedData:boolean;
  uploadRdocumentTitle:any;
  isRLoading:boolean;
  isRaddedData:boolean;
  dialogConfig:any;
  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private rootFormGroup: FormGroupDirective,
    public taskCrationPageService: TaskCrationPageService,
    private route: ActivatedRoute,
    private sharedService: SharedService
  ) {
    progressBar.map((item) => {
      this.progressBar = item.activityWorkFlow;
    });
  }

  ngOnInit(): void {
    this.ddmformDev = this.fb.group({
      fileNameDev: ['', Validators.required],
      idDev: ['', Validators.required],
    });
    this.ddmformDevRisk = this.fb.group({
      fileNameDev: ['', Validators.required],
      idDev: ['', Validators.required],
    });
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    this.addGroupToParent();
    this.route.params.subscribe((param) => {
      this.taskId = param['id'] ? param['id'] : 0;
    });
    

    this.form = this.fb.group({
      difference: [' ', Validators.required],
      uploadAcceptableFile: ' ',
      reason: [' ', Validators.required],
      criteriaUpdateInd: [false, Validators.required],
      criteriaUpdate: [''],
      riskLevelCode: [' ', Validators.required],
      6: [''],
      systemRisk: ' ',
      riskMitigationPlan: ' ',
      programRiskId: [' ', Validators.required],
      complete: [''],
      deviationStatusCode: '',
      deviationId: '',
      taskExecutionUpload: [],
    });

    // this.deviationFormbindData(this.parentItem, this.isCgFormDelete);
    
    if (this.editResultsStatus) {
      this.form.disable();
    }
    this.fileUploadDataDev = new Array();
    this.getAllUploadedDocuments(this.parentItem);

    // console.log("contentInfo:deviation", this.contentInfo);
    this.deviationCompId = this.contentInfo.TaskComponentId;

    this.deviationNumber = this.contentInfo.cgForm.value.deviation.deviationNumber;
    this.deviationId = this.contentInfo.cgForm.value.deviation.deviationId;
    
    // console.log("this.deviationNumber", this.deviationNumber);
    

    let contentlen:any = [this.contentInfo].length;
    let TaskComponentId = this.contentInfo.TaskComponentId;    
    let group={}
    for (let i = 0; i < contentlen; i++) {
      group['difference_'+TaskComponentId]= new FormControl('',[Validators.required]); 
      group['uploadAcceptableFile_'+TaskComponentId]= new FormControl(''); 
      group['reason_'+TaskComponentId]= new FormControl('',[Validators.required]);    
      group['criteriaUpdateInd_'+TaskComponentId]= new FormControl(false,[Validators.required]);    
      group['criteriaUpdate_'+TaskComponentId]= new FormControl('');    
      group['riskLevelCode_'+TaskComponentId]= new FormControl('',[Validators.required]);    
      group['6']= new FormControl('');    
      group['systemRisk_'+TaskComponentId]= new FormControl('');    
      group['riskMitigationPlan_'+TaskComponentId]= new FormControl('');    
      group['programRiskId_'+TaskComponentId]= new FormControl('',[Validators.required]);    
      group['complete_'+TaskComponentId]= new FormControl('');    
      group['deviationStatusCode_'+TaskComponentId]= new FormControl('');    
      group['deviationId_'+TaskComponentId]= new FormControl('');    
      group['deviationNumber_'+TaskComponentId]= new FormControl('');  
      group['taskExecutionUpload_'+TaskComponentId]= new FormControl('');      
      // group['scheduleTime'+i]= new FormControl('',[Validators.required]);
      // group['notification'+i]= new FormControl('');
    }
    this.deviationUpdateForm = new FormGroup(group);	
    this.deviationFormbindActData(this.parentItem, this.deviationCompId);
     
    if(this.criteriaMetOptions == 2) {
      this.criteriaMetOptions = 1;
      // console.log("this.deviationCompId", this.deviationCompId);
      this.deviationNumber = '';
      this.deviationId= '';
      let deviationUpdateForm = this.deviationUpdateForm;
      let deviationCompId = this.deviationCompId;
      deviationUpdateForm.controls["difference_"+deviationCompId].setValue(''); 
      deviationUpdateForm.controls["uploadAcceptableFile_"+deviationCompId].setValue('');   
      deviationUpdateForm.controls["reason_"+deviationCompId].setValue(''); 
      deviationUpdateForm.controls["criteriaUpdateInd_"+deviationCompId].setValue('');
      deviationUpdateForm.controls["criteriaUpdate_"+deviationCompId].setValue(''); 
      deviationUpdateForm.controls["riskLevelCode_"+deviationCompId].setValue('');      
      deviationUpdateForm.controls["systemRisk_"+deviationCompId].setValue('');
      deviationUpdateForm.controls["riskMitigationPlan_"+deviationCompId].setValue('');
      deviationUpdateForm.controls["programRiskId_"+deviationCompId].setValue('');
      deviationUpdateForm.controls["complete_"+deviationCompId].setValue('');
      deviationUpdateForm.controls["deviationStatusCode_"+deviationCompId].setValue('WIP');
      deviationUpdateForm.controls["deviationId_"+deviationCompId].setValue('');
      deviationUpdateForm.controls["deviationNumber_"+deviationCompId].setValue('');
      deviationUpdateForm.controls["taskExecutionUpload_"+deviationCompId].setValue('');
      this.selectedContentRiskDev = [];
      this.selectedContentReasonDev = [];
    }
    

    

  }
  ngOnChanges(event) {

    if (
      event.docStatus &&
      event.docStatus.currentValue &&
      event.docStatus.previousValue != event.docStatus.currentValue
    ) {
      this.docStatus = event.docStatus.currentValue;
    }
    // console.log("this.editResultsStatus", this.editResultsStatus);
    if (!this.editResultsStatus) {
      // console.log("this.editResultsStatus:not", this.editResultsStatus);
      this.parentItem.children.map((child) => {
        if (child.cgActivityForm != undefined) {
          child.cgActivityForm.map((el) => {
            // console.log("this.editResultsStatus:el", el);
            

            let cgForm = el.cgForm.value.deviation;

            // console.log("this.editResultsStatus:cgForm", cgForm);

            if (el.AssetStatementTypeCode == 'C') {
              if (
                cgForm.deviationStatusCode == 'WIP' ||
                cgForm.deviationStatusCode == 'COMP' ||
                cgForm.deviationStatusCode == 'Completed'
              ) {
                this.deviationUpdateForm.enable();
              } else {
                this.deviationUpdateForm.disable();
              }
            }
            // console.log("deviationUpdateForm", this.deviationUpdateForm.valid);
          });
        }
      });
    } else {
      setTimeout(() => this.deviationUpdateForm.disable());
    }

    // console.log("contentInfo:ngOnchanges", this.contentInfo);
    // console.log("criteriaMetOptions:ngOnchanges", this.criteriaMetOptions);
    if(event.docStatus.previousValue != event.docStatus.currentValue && this.criteriaMetOptions == 2) {
      this.criteriaMetOptions = 1;
      // console.log("this.deviationCompId", this.deviationCompId);
      this.deviationNumber = '';
      this.deviationId = '';
      let deviationUpdateForm = this.deviationUpdateForm;
      let deviationCompId = this.deviationCompId
      deviationUpdateForm.controls["difference_"+deviationCompId].setValue(''); 
      deviationUpdateForm.controls["uploadAcceptableFile_"+deviationCompId].setValue('');   
      deviationUpdateForm.controls["reason_"+deviationCompId].setValue(''); 
      deviationUpdateForm.controls["criteriaUpdateInd_"+deviationCompId].setValue('');
      deviationUpdateForm.controls["criteriaUpdate_"+deviationCompId].setValue(''); 
      deviationUpdateForm.controls["riskLevelCode_"+deviationCompId].setValue('');      
      deviationUpdateForm.controls["systemRisk_"+deviationCompId].setValue('');
      deviationUpdateForm.controls["riskMitigationPlan_"+deviationCompId].setValue('');
      deviationUpdateForm.controls["programRiskId_"+deviationCompId].setValue('');
      deviationUpdateForm.controls["complete_"+deviationCompId].setValue('');
      deviationUpdateForm.controls["deviationStatusCode_"+deviationCompId].setValue('WIP');
      deviationUpdateForm.controls["deviationId_"+deviationCompId].setValue('');
      deviationUpdateForm.controls["deviationNumber_"+deviationCompId].setValue('');
      deviationUpdateForm.controls["taskExecutionUpload_"+deviationCompId].setValue('');
      this.selectedContentRiskDev = [];
      this.selectedContentReasonDev = [];
    }
  }
  addGroupToParent() {
    // if(this.userForm && !this.userForm.deviationForm) {
    //   this.userForm.addControl('deviationForm',this.deviationForm);
    //   console.log("Deviation added once------->",this.deviationForm);
    // }
    this.form = this.rootFormGroup.control.get(this.formGroupName) as FormGroup;
  }
  handleOnCompleteChange(event) {
    if (event.checked == true) {
      this.updateForm.emit(event.checked);
    }
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
  }

  uploadFile(event, item, deviationCompId) {
    let taskComponentId = deviationCompId;
    let documentTypeCode;

    // if (item.content.assetTypeCode == 'A') {
    //   documentTypeCode = 'RESLT';
    // }
    // console.log("uploadFile", item);
    // console.log("uploadFile", deviationTaskItem);
    if (item.name == 'A') {
      documentTypeCode = 'RESLT';
    }
    event.stopPropagation();
    const dialogRef = this.dialog.open(FileUploadComponent, {
      width: '50%',
      height: '65%',
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
      if (result && result !== 'No') {
        if (result && result.length) {
        }
      }
    });
  }

  uploadFileRisk(event, item, deviationCompId) {
    // console.log("")
    let taskComponentId = deviationCompId;
    let documentTypeCode;

    // if (item.content.assetTypeCode == 'A') {
    //   documentTypeCode = 'RESLT';
    // }
    // console.log("uploadFile", item);
    // console.log("uploadFile", deviationTaskItem);
    if (item.name == 'A') {
      documentTypeCode = 'RSKMP';
    }
    event.stopPropagation();
    const dialogRef = this.dialog.open(FileUploadComponent, {
      width: '50%',
      height: '65%',
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
      if (result && result !== 'No') {
        if (result && result.length) {
        }
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
  handleOnRiskLevelChange(value) {
    if (value == 'r' || value == 'y') {
      this.form.get('riskMitigationPlan').setValidators(Validators.required);
      this.form.get('riskMitigationPlan').updateValueAndValidity();
    } else {
      this.form.get('riskMitigationPlan').clearValidators();
      this.form.get('riskMitigationPlan').updateValueAndValidity();
    }
  }

  onSubmitDeviationForm(item, deviationCompId) {
    this.isLoading = true;
    this.addDeviationModel.taskComponentId = this.deviationCompId; 
    this.addDeviationModel.taskExecutionDeviationId =
    this.contentInfo.cgForm.value.deviation.taskExecutionDeviationId;
    this.addDeviationModel.statementEvaluationId =
    this.contentInfo.cgForm.value.deviation.statementEvaluationId == '1' ? 1 : 2;
    this.addDeviationModel.existingDeviationInd =
    this.contentInfo.cgForm.value.deviation.existingDeviationInd == 'no' ||
    this.contentInfo.cgForm.value.deviation.existingDeviationInd == ''
      ? false
      : true;
    this.addDeviationModel.taskID = this.taskId;

    let displayName = sessionStorage.getItem('displayName');
    this.addDeviationModel.createdUser = displayName ? displayName : '';
    this.addDeviationModel.lastUpdateUser = displayName
    ? displayName
    : '';
    let formData = this.deviationUpdateForm;
    this.addDeviationModel.difference = formData.controls["difference_"+deviationCompId].value;
    this.addDeviationModel.reason = formData.controls["reason_"+deviationCompId].value;

    let criteriaUpdateInd = formData.controls["criteriaUpdateInd_"+deviationCompId].value;
    let criteriaUpdate = formData.controls["criteriaUpdate_"+deviationCompId].value;
    this.addDeviationModel.criteriaUpdateInd = criteriaUpdateInd ? criteriaUpdateInd : false;
    if (criteriaUpdateInd == 'false') {
      criteriaUpdate = formData.controls["criteriaUpdate_"+deviationCompId].setValue('');      
    } 
    this.addDeviationModel.criteriaUpdate = criteriaUpdate;
    this.addDeviationModel.riskLevelCode = formData.controls["riskLevelCode_"+deviationCompId].value; 
    this.addDeviationModel.riskMitigationPlan = formData.controls["riskMitigationPlan_"+deviationCompId].value; 
    this.addDeviationModel.programRiskId = formData.controls["programRiskId_"+deviationCompId].value; 
    this.addDeviationModel.deviationId = formData.controls["deviationId_"+deviationCompId].value;
    this.addDeviationModel.deviationNumber = formData.controls["deviationNumber_"+deviationCompId].value;
    let deviationComplete = formData.controls["complete_"+deviationCompId].value; 
    // console.log("deviationComplete", deviationComplete);
      if (deviationComplete == true) {
        this.addDeviationModel.deviationStatusCode = 'COMP';
      } else {
        // this.addDeviationModel.deviationStatusCode = 'Not Started';
        this.addDeviationModel.deviationStatusCode = 'WIP';
      }
      //Posting Data for Add Deviation
      this.taskCrationPageService
        .addDeviation(this.addDeviationModel)
        .subscribe(
          (res) => {
            // console.log("onSubmitDeviationFormTestold:addDeviation", res);
            this.deviationNumber = res['deviationNumber'];  
            this.deviationId =  res['deviationId'];  
            this.passExecutionDetails.emit(res);
            let deviationUpdateForm = this.deviationUpdateForm;
            deviationUpdateForm.controls["deviationNumber_"+deviationCompId].setValue(res['deviationNumber']);
            deviationUpdateForm.controls["deviationId_"+deviationCompId].setValue(res['deviationId']);
            deviationUpdateForm.controls["riskLevelCode_"+deviationCompId].setValue(res['riskLevelCode']);
            this.isLoading = false;

            let completStatus = formData.controls["complete_"+deviationCompId].value;

            if (res['deviationStatusCode'] !== 'WIP') {
              if (completStatus == true) {
                deviationUpdateForm.controls["deviationStatusCode_"+deviationCompId].setValue('Completed');                
              }
            } else {
              if (completStatus == false) {
                deviationUpdateForm.controls["deviationStatusCode_"+deviationCompId].setValue(res['deviationStatusCode']);                  
              }
            }
          },
          (error) => {
            this.isLoading = false;
            console.log(error.error);
          }
        );
    
  }

  openRecallDialog(item, itemName) {
    let data = [];
    let deviationNumber, taskComponentId, deviationStatusCode;

    console.log('Items', item.children);

    item.children &&
      item.children.map((child) => {
        child.cgActivityForm &&
          child.cgActivityForm.map((el) => {
            let cgForm = el.cgForm.value.deviation;

            if (el.AssetStatementTypeCode == 'C') {
              deviationNumber = cgForm.deviationNumber;
              taskComponentId = cgForm.taskComponentId;
              deviationStatusCode = cgForm.deviationStatusCode;
            }
          });
      });
    if (itemName == 'Deviation Recall') {
      data.push({
        type: 'Deviation Recall',
        msg: 'This will recall the Deviation from the approver and return the Deviation to WIP Status.',
        taskId: this.taskId,
        taskComponentId: taskComponentId,
        deviationNumber: deviationNumber,
        deviationStatusCode: deviationStatusCode,
      });
    } else {
      data.push({
        type: 'Deviation Revise',
        msg: 'This will revise the Deviation. A new version of the activity will be created.',
        taskId: this.taskId,
        taskComponentId: taskComponentId,
        deviationNumber: deviationNumber,
        deviationStatusCode: deviationStatusCode,
      });
    }

    const dialogRef = this.dialog.open(RecallReviseDialogComponent, {
      width: '50%',
      height: 'auto',
      maxWidth: this.screenWidth + 'px',
      maxHeight: this.screenHeight + 'px',
      data: data,
    });
  }
  openHistoryLogDialog(item, itemName) {
    let deviationNumber;
    let deviation: boolean;
    let activity: boolean;
    let statementTaskComponentId;

    item.children &&
      item.children.map((child) => {
        child.cgActivityForm &&
          child.cgActivityForm.map((el) => {
            let cgForm = el.cgForm.value.deviation;

            if (el.AssetStatementTypeCode == 'C') {
              deviationNumber = cgForm.deviationNumber;
              statementTaskComponentId = cgForm.taskComponentId;
            }
          });
      });

    if (itemName == 'Deviation') {
      deviation = true;
      activity = false;
    } else {
      deviation = false;
      activity = true;
    }

    let taskComponentId = item.content.taskComponentId;

    let maxHeight: any;
    maxHeight = screen.height;
    if (maxHeight < 768) {
      maxHeight = 400;
    } else {
      maxHeight = 700;
    }

    const dialogRef = this.dialog.open(ViewHistoryLogsComponent, {
      maxWidth: '690px',
      width: '100%',
      maxHeight: maxHeight,
      data: [
        {
          taskComponentId: taskComponentId,
          taskId: this.taskId,
          item: item,
          deviationNumber: deviationNumber,
          deviationStatus: deviation,
          activityStatus: activity,
          statementTaskComponentId: statementTaskComponentId,
        },
      ],
    });
  }

  deviationFormbindActData(item, deviationCompId){
    let pushData:any = [];
    item.children.map((child) => {
      if (child.cgActivityForm != undefined) {
        child.cgActivityForm.map((el) => {
          let cgForm = el.cgForm.value.deviation;
          if(cgForm.statementEvaluationId == '2') {
            pushData.push(el);
          }       
        });
      }
    });
    let getData = pushData;
    // console.log("deviationFormbindActData", pushData);
    let deviationUpdateForm = this.deviationUpdateForm;
    getData.forEach(function(item: any){
        if(item.TaskComponentId == deviationCompId) {
          deviationUpdateForm.controls["difference_"+deviationCompId].setValue(item.cgForm.value.deviation.difference);
          deviationUpdateForm.controls["reason_"+deviationCompId].setValue(item.cgForm.value.deviation.reason);
          deviationUpdateForm.controls["criteriaUpdateInd_"+deviationCompId].setValue(item.cgForm.value.deviation.criteriaUpdateInd);
          deviationUpdateForm.controls["riskLevelCode_"+deviationCompId].setValue(item.cgForm.value.deviation.riskLevelCode);
          deviationUpdateForm.controls["riskMitigationPlan_"+deviationCompId].setValue(item.cgForm.value.deviation.riskMitigationPlan);
          deviationUpdateForm.controls["programRiskId_"+deviationCompId].setValue(item.cgForm.value.deviation.programRiskId);
          deviationUpdateForm.controls["complete_"+deviationCompId].setValue(item.cgForm.value.deviation.complete);
          deviationUpdateForm.controls["deviationStatusCode_"+deviationCompId].setValue(item.cgForm.value.deviation.deviationStatusCode);
          deviationUpdateForm.controls["deviationNumber_"+deviationCompId].setValue(item.cgForm.value.deviation.deviationNumber);
          deviationUpdateForm.controls["deviationId_"+deviationCompId].setValue(item.cgForm.value.deviation.deviationId);
        }
    });        
  }

  deviationFormbindData(item, cgDeleteForm) {
    if (this.isCgFormDelete == true) {
      item.children.map((child) => {
        if (child.cgActivityForm != undefined) {
          child.cgActivityForm.map((el) => {
            let cgForm = el.cgForm.value.deviation;

            if (el.AssetStatementTypeCode == 'C') {
              this.form.patchValue({
                difference: '',
                reason: '',
                criteriaUpdateInd: '',
                riskLevelCode: '',
                riskMitigationPlan: '',
                programRiskId: '',
                complete: '',
                deviationStatusCode: '',
              });
            }
          });
        }
      });
    } else {
      item.children.map((child) => {
        if (child.cgActivityForm != undefined) {
          child.cgActivityForm.map((el) => {
            let cgForm = el.cgForm.value.deviation;
            // console.log("cgForm:::1", cgForm);
            if (el.AssetStatementTypeCode == 'C') {
              this.deviationNumber = cgForm.deviationNumber;
              this.deviationId = cgForm.deviationId;
              this.deviationTaskItem = cgForm;
              this.form.patchValue({
                difference: cgForm.difference,
                reason: cgForm.reason,
                criteriaUpdateInd: cgForm.criteriaUpdateInd,
                riskLevelCode: cgForm.riskLevelCode,
                riskMitigationPlan: cgForm.riskMitigationPlan,
                programRiskId: cgForm.programRiskId,
                complete: cgForm.complete,
                deviationStatusCode: cgForm.deviationStatusCode,
              });

              if (cgForm.deviationStatusCode !== 'WIP') {
                this.form.patchValue({
                  complete: true,
                });
              } else {
                this.form.patchValue({
                  complete: false,
                });
              }
            }
          });
        }
      });
    }
  }

  uploadAttach(parentItem, deviationCompId, uploadCode, dCode) {
    this.isDLoading = true;
    let dateTime = new Date().toISOString();
    let displayName = sessionStorage.getItem('displayName');
    this.uploadDdmModelDev.taskExecutionUploadId = 0;
    this.uploadDdmModelDev.documentTitle = this.ddmformDev.value.fileNameDev;
    this.uploadDdmModelDev.documentReference = this.ddmformDev.value.idDev;
    this.uploadDdmModelDev.documentTypeCode = dCode;
    this.uploadDdmModelDev.taskComponentId = deviationCompId;
    this.uploadDdmModelDev.uploadDestinationCode = uploadCode;
    this.uploadDdmModelDev.createdUser = displayName ? displayName : '';
    this.uploadDdmModelDev.lastUpdateUser = displayName ? displayName : '';
    this.uploadDdmModelDev.createdDateTime = dateTime;
    this.uploadDdmModelDev.lastUpdateDateTime = dateTime;
    if(uploadCode == 'DDM') {
      this.taskCrationPageService
      .uploadDDM(this.uploadDdmModelDev)
      .subscribe((res: any) => {
        this.uploadDynamicData(res,'DDM')
        // this.launchDDM = false;
        this.isDLoading = false;
      },(error) => {
        this.isDLoading = false;
        console.log(error.error);
      });
    this.ddmformDev.reset();
    }

    if(uploadCode == 'WLNK') {
      this.taskCrationPageService
      .uploadWebLink(this.uploadDdmModelDev)
      .subscribe((res: any) => {
        this.uploadDynamicData(res,'WLNK')
        // this.launchDDM = false;
        this.isDLoading = false;
      },(error) => {
        this.isDLoading = false;
        console.log(error.error);
      });
    this.ddmformDev.reset();
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
    this.selectedContentFileDataDev.push(res);
    this.selectedContentFileDataDev = this.selectedContentFileDataDev.reverse();
    this.uploadDataReasonRisk(this.selectedContentFileDataDev);
    let ddmFile = res.documentTitle;
    this.fileUploadDataDev.push(ddmFile);
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
        if(element.documentTypeCode == 'DJUST') {
          pushDataReasonDev.push(element);
        }
    });
    this.selectedContentReasonDev = pushDataReasonDev;
    // console.log("selectedContentReasonDev", this.selectedContentReasonDev);
    let selectedContentRiskDev = pushData;
    let pushDataRiskDev : any = [];
    selectedContentRiskDev.forEach(element => {
        if(element.documentTypeCode == 'RSKMP') {
          pushDataRiskDev.push(element);
        }
    });
    this.selectedContentRiskDev = pushDataRiskDev;
    // console.log("selectedContentRiskDev", this.selectedContentRiskDev);
  }

 

  getAllUploadedDocuments(itemArry, reset?: boolean) {

    this.taskId && this.taskCrationPageService
      .getAllTaskExecutionUploadDetails(this.taskId, reset)
      .subscribe((item) => {
        this.fileData = item;
        this.selectedContentFileDataDev = item;
        this.selectedContentFileDataDev = this.selectedContentFileDataDev.reverse();
        // console.log("this.selectedContentFileDataDev", this.selectedContentFileDataDev);
        this.uploadDataReasonRisk(this.selectedContentFileDataDev);
        // itemArry.children && itemArry.children.cgActivityForm && itemArry.children.cgActivityForm.map((el) => {
        //     if (el.AssetStatementTypeCode == 'C') {
        //       let filterData = this.fileData.filter(
        //         (fl) => fl.taskComponentId == el.content.taskComponentId
        //       );

        //       this.totalFiles = filterData.length;
        //     }
        //   });

        // if (this.totalFiles >= 2) {
        //   this.viewMore = false;
        // } else {
        //   this.viewMore = true;
        // }
      });
  }

  viewAllDocuments(taskComponentId, deviationData, documentCode) {
    let filterData = deviationData.filter(
      (item) => item.taskComponentId == taskComponentId
    );
    let fData = {
      ftData : filterData,
      documentTypeCode : documentCode
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
  moreDataReason($arg) {
    return this.selectedContentReasonDev.filter((node: any) => {
      return node.taskComponentId == $arg;
    }).length;
  }

  moreDataRisk($arg) {
    return this.selectedContentRiskDev.filter((node: any) => {
      return node.taskComponentId == $arg;
    }).length;
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
        console.log("result", result);
        this.isLoading = true;
        let dateTime = new Date().toISOString();
        let displayName = sessionStorage.getItem('displayName');
        this.uploadDdmModelDev.taskExecutionUploadId = uploadData.taskExecutionUploadId;
        this.uploadDdmModelDev.documentTitle = result.value.fileName;
        this.uploadDdmModelDev.documentReference = result.value.id;
        this.uploadDdmModelDev.documentTypeCode = uploadData.documentTypeCode;
        this.uploadDdmModelDev.taskComponentId = uploadData.taskComponentId;
        this.uploadDdmModelDev.uploadDestinationCode = uploadData.uploadDestinationCode == 'Other' ? 'WLNK' : uploadData.uploadDestinationCode;
        this.uploadDdmModelDev.createdUser = displayName ? displayName : '';
        this.uploadDdmModelDev.lastUpdateUser = displayName ? displayName : '';
        this.uploadDdmModelDev.createdDateTime = uploadData.createdDateTime;
        this.uploadDdmModelDev.lastUpdateDateTime = dateTime;
        console.log("uploadDdmModel", this.uploadDdmModelDev);
        this.taskCrationPageService
          .uploadUpdateDDMWebLink(this.uploadDdmModelDev)
          .subscribe((res: any) => {            
            if(res) {
              console.log("New::res", res);   
              this.isLoading = true;
              this.taskCrationPageService
                .getAllTaskExecutionUploadDetails(this.taskId, true)
                .subscribe((item) => {
                  this.fileData = item;
                  this.selectedContentFileDataDev = item;
                  this.selectedContentFileDataDev = this.selectedContentFileDataDev.reverse();
                  this.uploadDataReasonRisk(this.selectedContentFileDataDev);  
                  this.isLoading = false;              
                },(error) => {
                  this.isLoading = false;
                  console.log(error.error);
                });
            }  
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
            if(res) {
              console.log("New::res", res);   
              this.isLoading = true;
              this.taskCrationPageService
                .getAllTaskExecutionUploadDetails(this.taskId, true)
                .subscribe((item) => {
                  this.fileData = item;
                  this.selectedContentFileDataDev = item;
                  this.selectedContentFileDataDev = this.selectedContentFileDataDev.reverse();
                  this.uploadDataReasonRisk(this.selectedContentFileDataDev);  
                  this.isLoading = false;              
                },(error) => {
                  this.isLoading = false;
                  console.log(error.error);
                });
            }  
          },(error) => {
            this.isLoading = false;
            console.log(error.error);
          });
      }
    });
  }

}
