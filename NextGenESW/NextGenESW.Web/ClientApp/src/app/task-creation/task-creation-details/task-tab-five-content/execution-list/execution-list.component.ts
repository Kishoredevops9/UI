import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ViewContainerRef,
  ComponentFactory,
  ComponentFactoryResolver,
  HostListener,
} from '@angular/core';
import {
  Item,
  WICDdocList,
  uploadDDMModel,
} from '@app/task-creation/task-creation.model';
import { ExecutionDetailsComponent } from '@app/task-creation/task-creation-details/task-tab-five-content/execution-details/execution-details.component';
import { MatDialog } from '@angular/material/dialog';
import { FileUploadComponent } from '@app/task-creation/task-creation-details/task-tab-five-content/file-upload/file-upload.component';
import { TaskCrationPageService } from '@app/task-creation/task-creation.service';
import progressBar from 'src/assets/data/task-workflow.json';
import { MatAccordion } from '@angular/material/expansion';
import { environment } from 'src/environments/environment';
import { RecallReviseDialogComponent } from './recall-revise-dialog/recall-revise-dialog.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedService } from '@app/shared/shared.service';
import { ViewHistoryLogsComponent } from './view-history-logs/view-history-logs.component';
import { ViewAllDocumentsModalComponent } from './viewAllDocumentsModal/viewAllDocumentsModal.component';
import { MatMenuTrigger } from '@angular/material/menu';
import { documentPath } from '@environments/constants';
import { UploadWeblinkDialogComponent } from '../upload-weblink-dialog/upload-weblink-dialog.component'

@Component({
  selector: 'app-execution-list',
  templateUrl: './execution-list.component.html',
  styleUrls: ['./execution-list.component.scss'],
})
export class ExecutionListComponent implements OnInit {
  @Input() item: Item;
  @Input() parentItem?: Item;
  @Input() criteriaAndBPData;
  @Input() filterTask: any;
  @Input() closeStatuschk : boolean ;
  @Input() public set connectedDropListsIds(ids: string[]) {
    this.allDropListsIds = ids;
  }
  @Input() showUnselected: boolean;
  ddmEndPoint: any = environment.TaskExecutionDDMEndPoint;
  @ViewChild('contentDetails', { read: ViewContainerRef }) rowContainers;
  @ViewChild('accordion', { static: true }) Accordion: MatAccordion;
  panelOpenState: boolean = false;
  expandAllChilds: boolean = false;
  expanded: boolean = false;
  expandDetails: boolean = false;
  loading = false;
  public screenWidth: any;
  public screenHeight: any;
  arrowClicked = true;
  progressBar: any;
  launchDDM: boolean = false;
  launchWebLink: boolean = false;
  editResults: string = 'Edit Results';
  editResultsStatus: boolean = true;
  isShowDropDown: boolean = false;
  uploadDdmModel = new uploadDDMModel();
  ddmform: FormGroup;
  taskId: any;
  fileUploadData: Array<any>;
  viewMore: boolean = true;
  fileData: any;
  selectedFileData: any;
  updatedFileData: any;
  totalFiles: any;
  fileUploadStatus: boolean = false;
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  deviationCurrentStatus: string;
  activityRecallReviseTaskComponentId: number = 0;
  recallReviseStatus: boolean = false;
  uploaddocumentTitle:any;
  isLoading:boolean;
  isaddedData:boolean;
  dialogConfig:any;
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
  }
  public get connectedDropListsIds(): string[] {
    return this.allDropListsIds.filter((id) => id !== this.item.uId);
  }

  get dragDisabled(): boolean {
    return !this.parentItem;
  }

  get parentItemId(): string {
    return this.dragDisabled ? '' : this.parentItem.uId;
  }
  public cType: any =
  [
    {
      "assetTypeCode": "I",
      "code": "WI"
    },
    {
      "assetTypeCode": "WI",
      "code": "WI"
    },
    {
      "assetTypeCode": "C",
      "code": "CG"
    },
    {
      "assetTypeCode": "CG",
      "code": "CG"
    },
    {
      "assetTypeCode": "K",
      "code": "KP"
    },
    {
      "assetTypeCode": "KP",
      "code": "KP"
    },
    {
      "assetTypeCode": "SP",
      "code": "SP"
    },
    {
      "assetTypeCode": "SF",
      "code": "SF"
    },
    {
      "assetTypeCode": "D",
      "code": "D"
    },
    {
      "assetTypeCode": "A",
      "code": "A"
    },
    {
      "assetTypeCode": "TC",
      "code": "TOC"
    },
    {
      "assetTypeCode": "TOC",
      "code": "TOC"
    },
    {
      "assetTypeCode": "G",
      "code": "GB"
    },
    {
      "assetTypeCode": "GB",
      "code": "GB"
    },
    {
      "assetTypeCode": "S",
      "code": "DS"
    },
    {
      "assetTypeCode": "DS",
      "code": "DS"
    },
    {
      "assetTypeCode": "R",
      "code": "RC"
    },
    {
      "assetTypeCode": "RC",
      "code": "RC"
    }
  ];
  public allDropListsIds: string[];
  selectedContentStepDev:any;
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

  ]
  constructor(
    private router: Router,
    private resolver: ComponentFactoryResolver,
    public dialog: MatDialog,
    private taskCrationPageService: TaskCrationPageService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public sharedService: SharedService
  ) {
    this.allDropListsIds = [];

    this.route.params.subscribe((param) => {
      this.taskId = param['id'] ? param['id'] : '';
    });
  }


   
 
  ngOnInit(): void {

 
    // console.log("Execution-list-Item", this.item);
    // console.log("parentItem", this.parentItem);

    if (this.expandAllChilds) {
      let action = '';
      // this.expandChildItemDetails(this.item, action);
    }
    progressBar.map((item) => {
      this.progressBar = item.activityStatus;
    });

    this.ddmform = this.fb.group({
      fileName: ['', Validators.required],
      id: ['', Validators.required],
    });

    this.fileUploadData = new Array();

    //Get All upload Files Details
    this.getAllUploadedDocuments(this.item);

    //console.log('This is Data', this.item);
  }

  getID($i) {
    let d = this.cType.find((node) => {
      return node.assetTypeCode == $i
    })

    return d.code
  }

  

  ngOnChanges(event) {
    // this.sharedService.statusTerm.subscribe(statusValue => {
    //   console.log("statusValue", statusValue);
    //   //this.statusTerm = searchValue;
    // });
  }

  expandAllChildItems(item, action, event) {
    this.expandDetails = !this.expandDetails;
    this.arrowClicked = false;
    // this.expandChildItemDetails(item, action, event);
    if (action === 'collapse') {
      this.expandAllChilds = false;
    } else {
      this.expandAllChilds = true;
    }
  }

  expandChildItemDetails(item, action, event?) {
    item.content.expanded = !item.content.expanded;
    item['panelOpenState'] = !item['panelOpenState'];
    if (item.content.expanded) {
      // sessionStorage.setItem('documentWorkFlowStatus', 'Draft');
      // sessionStorage.setItem('componentType', item.name);
      // this.rowContainers.clear();
      // const container = this.rowContainers;
      // const factory: ComponentFactory<any> =
      //   this.resolver.resolveComponentFactory(ExecutionDetailsComponent);
      // const inlineComponent = container.createComponent(factory);
      // inlineComponent.instance.contentInfo = item;
      // inlineComponent.instance.parentItem = this.parentItem;
      // if(item.name == "CG") {
      //   inlineComponent.instance.currentActivityTaskId = this.parentItem.content.taskComponentId;
      // }
    } else {
      //this.rowContainers.clear();
    }
  }

  uploadFile(event, item) {
    let taskComponentId = item.content.taskComponentId;
    let documentTypeCode;

    if (item.content.assetTypeCode == 'P') {
      documentTypeCode = 'SUPLD';
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
      this.getAllUploadedDocuments(this.item, true);
      this.fileUploadStatus = this.sharedService.getFileUploadData();
      if (this.fileUploadData) {
        this.trigger.closeMenu();
      }
    });
  }

  setOpened(item) {
    return item.content.expanded;
  }

  handleOnArrowClick(value) {
    //console.log("handleOnArrow response", value);
    if (value == 'header') {
      this.arrowClicked = true;
    }
  }

  openAllPanels(parent) {
    //console.log("openAllPanels", parent);
    if (parent.children.length > 0) {
      parent['panelOpenState'] = !parent['panelOpenState'];
      parent.content.expanded = !parent.content.expanded;
      this.expandChildren(parent.children);
    } else {
      parent['panelOpenState'] = !parent['panelOpenState'];
      parent.content.expanded = !parent.content.expanded;
    }
  }
  expandChildren(child) {
    //console.log("expandChildren", child);
    child.forEach((innerChild) => {
      if (innerChild.children.length > 0) {
        innerChild['panelOpenState'] = !innerChild['panelOpenState'];
        innerChild.content.expanded = !innerChild.content.expanded;
        innerChild.children.forEach((el) => {
          //console.log("innerChild", el);
          this.expandChildren(el.children);
          el['panelOpenState'] = !el['panelOpenState'];
          el.content.expanded = !el.content.expanded;
        });
      } else {
        innerChild['panelOpenState'] = !innerChild['panelOpenState'];
        innerChild.content.expanded = !innerChild.content.expanded;
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

  saveEntryResults(children) {
    children.forEach((item) => {
      //   item.editResultsStatus = !item.editResultsStatus;

      //console.log("item", item);

      if (item.editResultsStatus) {
        this.editResults = 'Finish Editing';
        item.editResultsStatus = false;
      } else {
        this.editResults = 'Edit Results';
        item.editResultsStatus = true;
      }
    });
    console.log("saveEntryResults", children);
    // this.editResultsStatus = !this.editResultsStatus;
  }
  handleOnFormClick(event, item) {
    item.docStatus = 'WIP';
  }

  openRecallReviseDialog(item, taskComponentId) {
    let data = [];
    let requesterEmail = sessionStorage.getItem('userMail');
    this.activityRecallReviseTaskComponentId = taskComponentId;
    if (item == 'Activity Recall') {
      data.push({
        type: 'Activity Recall',
        msg: 'This will recall the Activity from the approver and return the Activity to WIP Status.',
        requesterEmail: requesterEmail,
        taskComponentId: taskComponentId,
      });
    } else {
      data.push({
        type: 'Activity Revise',
        msg: 'This will revise the activity. A new version of the activity will be created.',
        requesterEmail: requesterEmail,
        taskComponentId: taskComponentId,
      });
    }

    const dialogRef = this.dialog.open(RecallReviseDialogComponent, {
      width: '50%',
      height: 'auto',
      maxWidth: this.screenWidth + 'px',
      maxHeight: this.screenHeight + 'px',
      data: data,
    });
    //console.log("dialogReg", dialogRef);
    dialogRef.afterClosed().subscribe(res => {
      if (res == 'successful') {
        //console.log("Result", res);
        this.recallReviseStatus = true;
      }
    });
  }

  openHistoryLogDialog(item) {
    let taskComponentId = item.content.taskComponentId;
    let maxHeight: any;
    maxHeight = screen.height;
    if (maxHeight < 768) {
      maxHeight = 400;
    } else {
      maxHeight = 700;
    }

    const dialogRef = this.dialog.open(ViewHistoryLogsComponent, {
      maxWidth: '850px',
      width: '100%',
      maxHeight: maxHeight,
      data: [
        {
          taskComponentId: taskComponentId,
          taskId: this.taskId,
          item: item,
        },
      ],
    });
  }

  uploadAttach(contentInfo, uploadCode, dCode) {
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
    this.selectedFileData.push(res);
    this.selectedFileData = this.selectedFileData.reverse();
    this.uploadDataReasonRisk(this.selectedFileData);
    let ddmFile = res.documentTitle;
    this.fileUploadData.push(ddmFile);
  }



  uploadDataReasonRisk(dataList:any) {
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
        if(element.documentTypeCode == 'SUPLD') {
          pushDataReasonDev.push(element);
        }
    });
    this.selectedContentStepDev = pushDataReasonDev;
   
  }

  viewAllDocuments(taskComponentId) {
    let filterData = this.fileData.filter(
      (item) => item.taskComponentId == taskComponentId
    );
    let fData = {
      ftData : filterData,
      documentTypeCode : 'SUPLD'
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
    return this.selectedFileData.filter((node: any) => {
      return node.taskComponentId == $arg;
    }).length;
  }

  getAllUploadedDocuments(itemArry, reset?: boolean) {
    // console.log("getAllUploadedDocuments", itemArry);
    this.taskId  &&  this.taskCrationPageService
      .getAllTaskExecutionUploadDetails(this.taskId, reset)
      .subscribe((item) => {
        this.fileData = item;
        this.selectedFileData = item;
        this.selectedFileData = this.selectedFileData.reverse();
        this.uploadDataReasonRisk(this.selectedFileData);
        itemArry.children &&
          itemArry.children.map((el) => {
            if (el.name == 'SP') {
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

  openSF(element, type:string) {
    let nodeData = element.content;
    //console.log("nodeData", nodeData);
    const pwStatus = 'published';
    sessionStorage.setItem('documentversion', nodeData.version ? nodeData.version : '1');
    sessionStorage.setItem('documentcontentType', element.name);
    sessionStorage.setItem('documentWorkFlowStatus', pwStatus);
    sessionStorage.setItem('documentcontentId', nodeData.OriginContentId);
    sessionStorage.setItem('documentcurrentUserEmail', element.createdUser);
    sessionStorage.setItem('contentNumber', nodeData.OriginContentId);
    sessionStorage.setItem('componentType', element.name);
    sessionStorage.setItem('redirectUrlPath', 'dashboard');
    // sessionStorage.setItem('sfcontentId', nodeData.OriginContentId);
    // sessionStorage.setItem('sfversion', nodeData.version  ? nodeData.version : '1');
    // sessionStorage.setItem('sfStatus', pwStatus); 

    let documentType = type == 'SP' ? 'SP': 'SF';
    window.open(
      documentPath.publishViewPath +
        '/' +
        documentType +
        '/' +
        nodeData.OriginContentId,
      '_blank'
    );
  }

  handleOnContentIDClick(item){
    let data = item.content;
    //console.log("handleOnContentIDClick", item);
    let element = item.content.contentId;
    let assetcode = element.split('-')
    let assettypecode = assetcode[1];
    let contentType = (assettypecode == "I") ? "WI" : (assettypecode == "G") ? "GB" : (assettypecode == "S") ? "DS" : (assettypecode == "A") ? "AP" : (assettypecode == "C") ? "CG" : (assettypecode == "K") ? "KP" : (assettypecode == "R") ? "RC" : (assettypecode == "T") ? "TOC" : '';
    sessionStorage.setItem('componentType', contentType);
    sessionStorage.setItem('contentNumber', data.contentId);
    sessionStorage.setItem('contentType', 'published');
    sessionStorage.setItem('redirectUrlPath', 'search');
    sessionStorage.setItem('statusCheck', 'true');

    if (assettypecode == 'I' || assettypecode == 'G' || assettypecode == 'S' || assettypecode == 'D') {
      window.open(documentPath.publishViewPath + '/' + data.contentId, '_blank');
    } else if (assettypecode === 'M' || assettypecode === 'Map') {
      this.router.navigate(['/process-maps/edit', data.id]);
    } else if (assettypecode === 'F' || assettypecode === 'SF') {
      this.router.navigate(['/process-maps/edit', data.id]);
    } else {
      var assetTypecode = (assettypecode === 'A') ? "AP" : (assettypecode === 'K') ? "KP" : (assettypecode === 'T') ? "TOC" : (assettypecode === 'R') ? "RC" : (assettypecode === 'C') ? "CG" : (assettypecode === 'F') ? "SF" : '';
    //  this.router.navigate([documentPath.publishViewPath, assetTypecode, data.assetContentId]);
     window.open(documentPath.publishViewPath + '/' + assetTypecode + '/' + data.contentId, '_blank');

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
        console.log("result", result);
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
        console.log("uploadDdmModel", this.uploadDdmModel);
        this.taskCrationPageService
          .uploadUpdateDDMWebLink(this.uploadDdmModel)
          .subscribe((res: any) => {     
            let resData:any = res;
            if(resData) {
              console.log("New::res", res);   
              this.isLoading = true;
              this.taskCrationPageService
                .getAllTaskExecutionUploadDetails(this.taskId, true)
                .subscribe((item) => {
                  this.fileData = item;
                  this.selectedFileData = item;
                  this.selectedFileData = this.selectedFileData.reverse();
                  this.uploadDataReasonRisk(this.selectedFileData);  
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
            console.log("deleteDDMWebLink", res);
            this.getAllUploadedDocuments(this.item, true);
            this.isLoading = false;
          },(error) => {
            this.isLoading = false;
            console.log(error.error);
          });
      }
    });
  }
}
