import { startWith, map, elementAt, max } from 'rxjs/operators';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Item, WICDdocList } from '@app/task-creation/task-creation.model';
import { TaskCrationPageService } from '../../../task-creation/task-creation.service';
import { TaskApprovalWorkflowComponent } from './task-approval-workflow/task-approval-workflow.component';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { taskExecutionCollection } from '@environments/constants';
import { assignFieldValue } from '@ngx-formly/core/lib/utils';
import { SharedService } from '@app/shared/shared.service';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
import { UploadWeblinkDialogComponent } from './upload-weblink-dialog/upload-weblink-dialog.component'
interface TreeNode {
  name: string;
  children?: TreeNode[];
}

@Component({
  selector: 'app-task-tab-five-content',
  templateUrl: './task-tab-five-content.component.html',
  styleUrls: ['./task-tab-five-content.component.scss'],
})
export class TabFiveContentComponent implements OnInit {
  isActiveNOofCasesNo: boolean;
  AuthTaskUser:any;
  AccessingTaskAuthorized:any;
  CreatingTaskAuthorized:any;
  ExecutingTaskAuthorized:any;
  executionData: any;
  panelOpenState = false;
  public parentItem: Item;
  public taskExecutionData: Item;
  @Input() contentType1: any;
  @Input() globalData: any;
  @Input() isChecked: any;
  @Input() titleData;
  @Input() closeStatus : boolean;
  taskGlobalData;
  toggle: boolean = true;
  showContent: boolean = false;
  taskId: number;
  criteriaAndBPData: any;
  criteriaBPData: any;
  filterTask = [];
  contentInfo: any;
  loading: boolean = false;
  taskExecutionCollection;
  filteredTaskData = [];
  contentTypeContentData = [];
  filterObject: any;
  @Output()
  openListView = new EventEmitter();
  selectedStepFlows: any = [];
  treeControl = new NestedTreeControl<TreeNode>((node) => node.children);
  dataSource = new MatTreeNestedDataSource<TreeNode>();
  showDisciplineDropDown = false;
  selectedBox: any = {};
  disciplineListData: any;
  disciplineCodeSelected: number = 0;
  defaultDiscipline: boolean = false;

  cgForm = this.fb.group({
    taskExecutionStatementEvaluationId: 0,
    deviation: this.fb.group({
      taskExecutionDeviationId: 0,
      statementEvaluationId: '',
      existingDeviationInd: '',
      deviationNumber: '',
      deviationId: '',
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
      taskExecutionUpload: [],
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
  disciplineForm: FormGroup;
  dialogConfig:any;
  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private taskCreationPageService: TaskCrationPageService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private SharedService: SharedService
  ) {
    const wICDdocList = new WICDdocList();
    wICDdocList.title = '';
    this.getParentItemData();
    this.SharedService.chipmessage.subscribe((node) => {
      if (node.hasOwnProperty('tabindex')) {
        if (node['tabindex'].index == 4) {
          this.getParentItemData();
          this.executionStepFlowData();
        }
      }
    });
  }

  getParentItemData() {
    this.parentItem = new Item({
      name: 'T',
      content: {
        title: '',
        contentId: '',
        OriginContentId: '',
        ReadyInd: false,
        id: 1,
        taskComponentId: 2,
        discipline1: '',
        discipline2: '',
        discipline3: '',
        disciplineId: 0,
        contentCode: '',
        AssetStatusId: 1,
        assetTypeCode: '',
        expanded: false,
        IncludedInd: false,
        actProtectedInd:false,
        AssetStatusName: '',
        assetVersion: 0,
      },
      cgCompletionStatus: false,
      disableWIToggler: true,
      selectedItem: [],
      criteriaBPData: [],
      disableBPToggler: true,
      cgActivityForm: [],
      WIToggler: false,
      BPToggler: false,
      panelOpenState: false,
      editResultsStatus: true,
      activityCriteriaChk:true,
      bestPractiseChk: true,
      taskREAId: '',
    });
    this.taskExecutionData = new Item({
      name: 'T',
      content: {
        title: '',
        contentId: '',
        OriginContentId: '',
        ReadyInd: false,
        id: 1,
        taskComponentId: 2,
        discipline1: '',
        discipline2: '',
        discipline3: '',
        disciplineId: 0,
        contentCode: '',
        AssetStatusId: 1,
        assetTypeCode: '',
        expanded: false,
        IncludedInd: false,
        actProtectedInd:false,
        AssetStatusName: '',
        assetVersion: 0,
      },
      cgCompletionStatus: false,
      disableWIToggler: true,
      selectedItem: [],
      criteriaBPData: [],
      disableBPToggler: true,
      cgActivityForm: [],
      WIToggler: false,
      BPToggler: false,
      panelOpenState: false,
      editResultsStatus: true,
      activityCriteriaChk:true,
      bestPractiseChk: true,
      taskREAId: '',
    });
  }

  public get connectedDropListsIds(): string[] {
    return this.getIdsRecursive(this.parentItem).reverse();
  }

  getIdsRecursive(item: Item): string[] {
    let ids = [item.uId];
    if (item.children) {
      item.children.forEach((childItem) => {
        ids = ids.concat(this.getIdsRecursive(childItem));
      });
    }
    return ids;
  }
  ngOnChanges(event) {
    if (
      event.globalData &&
      event.globalData.currentValue &&
      event.globalData.previousValue != event.globalData.currentValue
    ) {
      if (!(Object.keys(this.globalData).length === 0)) {
        this.taskGlobalData = event.globalData.currentValue;
      }
    }
    if (
      event.isChecked &&
      event.isChecked.previousValue != event.isChecked.currentValue
    ) {
      this.showContent = event.isChecked.currentValue;
    }
  }
  ngOnInit(): void {

    console.log(this.closeStatus);

    this.isActiveNOofCasesNo = true;
    console.log(' in task tab two',this.contentType1);


    let userProfileData = localStorage.getItem('logInUserEmail');;

    if (this.contentType1) {
    this.taskCreationPageService.GetTaskAuthorizations(this.contentType1,userProfileData).subscribe((data)=>{
      console.log("c");
      this.AuthTaskUser = data;
    console.log('in task tab5 component',this.AuthTaskUser);
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

    }
    else{
      this.CreatingTaskAuthorized = true;
    }

    if(this.AuthTaskUser.isExecutingTaskAuthorized == false){
      this.ExecutingTaskAuthorized = false;
      this.isActiveNOofCasesNo = true;
    }
    else{
      this.ExecutingTaskAuthorized = true;
      this.isActiveNOofCasesNo = false;
    }

   })

  }

    this.disciplineForm = this.formBuilder.group({
      'disciplineAll': [null]
    });
    this.taskExecutionCollection = taskExecutionCollection;
    this.route.params.subscribe((param) => {
      this.taskId = param['id'] ? param['id'] : 0;
    });
    sessionStorage.removeItem('parentObj');
    const wICDdocList = new WICDdocList();
    wICDdocList.contentCode = '';
    wICDdocList.title = '';
    //this.executionStepFlowData();
  }


  reminderPopupEnable() {
    this.dialogConfig = {
      action: 'reminderPopup',
      editData: 'uploadData'
    }
    const dialogRef = this.dialog.open(UploadWeblinkDialogComponent, {
      data: this.dialogConfig
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("deleteDDMWebLink::result", result);
      if(result == "Yes") {
        let taskUpdate = {
          "taskId": this.taskId,
          "reminder": false
        }
        this.taskCreationPageService
          .getTaskReminderUpdate(taskUpdate)
          .subscribe((data) => {
            console.log("getTaskReminderUpdate", data);
          })
      } else {
        let tabName =  localStorage.getItem('previewTab');
        for (
          let i = 0;
          i < document.querySelectorAll('.mat-tab-label-content').length;
          i++
        ) {
          if (
            (<HTMLElement>document.querySelectorAll('.mat-tab-label-content')[i])
              .innerText == tabName
          ) {
            (<HTMLElement>document.querySelectorAll('.mat-tab-label')[i]).click();
          }
        }
      }
    });
  }

  executionStepFlowData() {
    this.taskCreationPageService
            .getTaskReminder(this.taskId)
            .subscribe((res) => {
              console.log("getTaskReminder", res);
              if(res['reminder']) {
                this.reminderPopupEnable();
              }
            })
    if (this.taskId > 0) {
      this.loading = true;
      this.taskCreationPageService
        .getAllActivity(this.taskId)
        .subscribe((res) => {
          let activityResult = res;
          this.taskCreationPageService
            .getAllCriteriaBPValues(this.taskId)
            .subscribe((res) => {
              const criteriaAndBPData = JSON.parse(JSON.stringify(res));
              this.criteriaBPData = criteriaAndBPData;
              this.taskCreationPageService
                .gettaskstepflowbytaskid(this.taskId)
                .subscribe((res) => {
                  //this.taskCreationPageService.getTaskExecution().subscribe((res) => {
                  this.selectedStepFlows = res['Tasks'][0]['StepFlows'];
                  // console.log("getExecutionTaskStepFlowByTaskId", res);
                  this.executionData = res;
                  this.loading = false;
                  this.filteredDisciplineData(this.selectedStepFlows);
                  var a =
                    this.executionData.Tasks &&
                    this.executionData.Tasks[0].StepFlows &&
                    this.executionData.Tasks[0].StepFlows.map(
                      (stepFlow, sfIndex) => {

                        let wICDdocList = new WICDdocList();
                        wICDdocList = this.renderItem(wICDdocList, stepFlow);
                        this.parentItem.children.push(
                          new Item({
                            name: 'SF',
                            content: wICDdocList,
                            cgCompletionStatus: false,
                            disableWIToggler: true,
                            selectedItem: [],
                            criteriaBPData: this.criteriaBPData,
                            disableBPToggler: true,
                            cgActivityForm: [],
                            WIToggler: false,
                            BPToggler: false,
                            panelOpenState: false,
                            editResultsStatus: true,
                            activityCriteriaChk:true,
                            bestPractiseChk: true,
                            taskREAId: this.executionData.Tasks[0].TaskREAId,
                          })
                        );
                        this.taskExecutionData.children.push(
                          new Item({
                            name: 'SF',
                            content: wICDdocList,
                            cgCompletionStatus: false,
                            disableWIToggler: true,
                            selectedItem: [],
                            criteriaBPData: this.criteriaBPData,
                            disableBPToggler: true,
                            cgActivityForm: [],
                            WIToggler: false,
                            BPToggler: false,
                            panelOpenState: false,
                            editResultsStatus: true,
                            activityCriteriaChk:true,
                            bestPractiseChk: true,
                            taskREAId: this.executionData.Tasks[0].TaskREAId,
                          })
                        );

                        stepFlow.Steps &&
                          stepFlow.Steps.forEach((step, stepIndex) => {
                            let wICDdocList = new WICDdocList();
                            wICDdocList = this.renderItem(wICDdocList, step);

                            this.parentItem.children[sfIndex].children.push(
                              new Item({
                                name: 'SP',
                                content: wICDdocList,
                                children: [],
                                cgCompletionStatus: false,
                                disableWIToggler: true,
                                selectedItem: [],
                                criteriaBPData: this.criteriaBPData,
                                disableBPToggler: true,
                                cgActivityForm: [],
                                WIToggler: false,
                                BPToggler: false,
                                panelOpenState: false,
                                editResultsStatus: true,
                                activityCriteriaChk:true,
                                bestPractiseChk: true,
                                taskREAId: this.executionData.Tasks[0].TaskREAId,
                              })
                            );
                            this.taskExecutionData.children[
                              sfIndex
                            ].children.push(
                              new Item({
                                name: 'SP',
                                content: wICDdocList,
                                children: [],
                                cgCompletionStatus: false,
                                disableWIToggler: true,
                                selectedItem: [],
                                criteriaBPData: this.criteriaBPData,
                                disableBPToggler: true,
                                cgActivityForm: [],
                                WIToggler: false,
                                BPToggler: false,
                                panelOpenState: false,
                                editResultsStatus: true,
                                activityCriteriaChk:true,
                                bestPractiseChk: true,
                                taskREAId: this.executionData.Tasks[0].TaskREAId,
                              })
                            );

                            step.Disciplines &&
                              step.Disciplines.forEach(
                                (discipline, disciplineIndex) => {
                                  let wICDdocList = new WICDdocList();
                                  wICDdocList = this.renderItem(
                                    wICDdocList,
                                    discipline
                                  );

                                  this.parentItem.children[sfIndex].children[
                                    stepIndex
                                  ].children.push(
                                    new Item({
                                      name: 'D',
                                      content: wICDdocList,
                                      children: [],
                                      cgCompletionStatus: false,
                                      disableWIToggler: true,
                                      selectedItem: [],
                                      criteriaBPData: this.criteriaBPData,
                                      disableBPToggler: true,
                                      cgActivityForm: [],
                                      WIToggler: false,
                                      BPToggler: false,
                                      panelOpenState: false,
                                      editResultsStatus: true,
                                      activityCriteriaChk:true,
                                      bestPractiseChk: true,
                                      taskREAId: this.executionData.Tasks[0].TaskREAId,
                                    })
                                  );
                                  this.taskExecutionData.children[
                                    sfIndex
                                  ].children[stepIndex].children.push(
                                    new Item({
                                      name: 'D',
                                      content: wICDdocList,
                                      children: [],
                                      cgCompletionStatus: false,
                                      disableWIToggler: true,
                                      selectedItem: [],
                                      criteriaBPData: this.criteriaBPData,
                                      disableBPToggler: true,
                                      cgActivityForm: [],
                                      WIToggler: false,
                                      BPToggler: false,
                                      panelOpenState: false,
                                      editResultsStatus: true,
                                      activityCriteriaChk:true,
                                      bestPractiseChk: true,
                                      taskREAId: this.executionData.Tasks[0].TaskREAId,
                                    })
                                  );

                                  discipline.Activities &&
                                    discipline.Activities.forEach(
                                      (activity, activityIndex) => {
                                        let wICDdocList = new WICDdocList();
                                        wICDdocList = this.renderItem(
                                          wICDdocList,
                                          activity
                                        );
                                        this.parentItem.children[
                                          sfIndex
                                        ].children[stepIndex].children[
                                          disciplineIndex
                                        ].children.push(
                                          new Item({
                                            name: 'A',
                                            content: wICDdocList,
                                            children: [],
                                            cgCompletionStatus: false,
                                            disableWIToggler: true,
                                            selectedItem: [],
                                            criteriaBPData: this.criteriaBPData,
                                            disableBPToggler: true,
                                            cgActivityForm: [],
                                            WIToggler: false,
                                            BPToggler: false,
                                            panelOpenState: false,
                                            editResultsStatus: true,
                                            activityCriteriaChk:true,
                                            bestPractiseChk: true,
                                            taskREAId: this.executionData.Tasks[0].TaskREAId,
                                          })
                                        );
                                        this.taskExecutionData.children[
                                          sfIndex
                                        ].children[stepIndex].children[
                                          disciplineIndex
                                        ].children.push(
                                          new Item({
                                            name: 'A',
                                            content: wICDdocList,
                                            children: [],
                                            cgCompletionStatus: false,
                                            disableWIToggler: true,
                                            selectedItem: [],
                                            criteriaBPData: this.criteriaBPData,
                                            disableBPToggler: true,
                                            cgActivityForm: [],
                                            WIToggler: false,
                                            BPToggler: false,
                                            panelOpenState: false,
                                            editResultsStatus: true,
                                            activityCriteriaChk:true,
                                            bestPractiseChk: true,
                                            taskREAId: this.executionData.Tasks[0].TaskREAId,
                                          })
                                        );
                                        this.bindActivityValues(
                                          this.parentItem.children[sfIndex]
                                            .children[stepIndex].children[
                                            disciplineIndex
                                          ].children,
                                          activityResult
                                        );
                                        this.bindActivityValues(
                                          this.taskExecutionData.children[
                                            sfIndex
                                          ].children[stepIndex].children[
                                            disciplineIndex
                                          ].children,
                                          activityResult
                                        );
                                        activity.ContainerItems &&
                                          activity.ContainerItems.forEach(
                                            (container, containerIndex) => {
                                              let wICDdocList =
                                                new WICDdocList();
                                              wICDdocList = this.renderItem(
                                                wICDdocList,
                                                container
                                              );
                                              this.parentItem.children[
                                                sfIndex
                                              ].children[stepIndex].children[
                                                disciplineIndex
                                              ].children[
                                                activityIndex
                                              ].children.push(
                                                new Item({
                                                  name: container.AssetTypeCode,
                                                  content: wICDdocList,
                                                  children: [],
                                                  cgCompletionStatus: false,
                                                  disableWIToggler: true,
                                                  selectedItem: [],
                                                  criteriaBPData: this.criteriaBPData,
                                                  disableBPToggler: true,
                                                  cgActivityForm:
                                                    container.AssetStatements,
                                                  WIToggler: false,
                                                  BPToggler: false,
                                                  panelOpenState: false,
                                                  editResultsStatus: true,
                                                  activityCriteriaChk:true,
                                                  bestPractiseChk: true,
                                                  taskREAId: this.executionData.Tasks[0].TaskREAId,
                                                })
                                              );
                                              this.taskExecutionData.children[
                                                sfIndex
                                              ].children[stepIndex].children[
                                                disciplineIndex
                                              ].children[
                                                activityIndex
                                              ].children.push(
                                                new Item({
                                                  name: container.AssetTypeCode,
                                                  content: wICDdocList,
                                                  children: [],
                                                  cgCompletionStatus: false,
                                                  disableWIToggler: true,
                                                  selectedItem: [],
                                                  criteriaBPData: this.criteriaBPData,
                                                  disableBPToggler: true,
                                                  cgActivityForm:
                                                    container.AssetStatements,
                                                  WIToggler: false,
                                                  BPToggler: false,
                                                  panelOpenState: false,
                                                  editResultsStatus: true,
                                                  activityCriteriaChk:true,
                                                  bestPractiseChk: true,
                                                  taskREAId: this.executionData.Tasks[0].TaskREAId,
                                                })
                                              );
                                              this.bindData(
                                                this.parentItem.children[
                                                  sfIndex
                                                ].children[stepIndex].children[
                                                  disciplineIndex
                                                ].children[activityIndex]
                                                  .children,
                                                this.parentItem.children[
                                                  sfIndex
                                                ].children[stepIndex].children[
                                                  disciplineIndex
                                                ].children[activityIndex],
                                                criteriaAndBPData
                                              );
                                              this.bindData(
                                                this.taskExecutionData.children[
                                                  sfIndex
                                                ].children[stepIndex].children[
                                                  disciplineIndex
                                                ].children[activityIndex]
                                                  .children,
                                                this.taskExecutionData.children[
                                                  sfIndex
                                                ].children[stepIndex].children[
                                                  disciplineIndex
                                                ].children[activityIndex],
                                                criteriaAndBPData
                                              );
                                            }
                                          );
                                      }
                                    );
                                }
                              );
                          });
                      }
                    );
                });
            });
        });
    }
  }

  renderItem(wICDdocList, element) {
    // console.log("renderItem:element", element);
    let actProtectedInd:boolean;
    if( element.ContentId) {
      let actsplit = element.ContentId.split("-");
      let actsplice = actsplit.slice(-1)[0];
      actProtectedInd = actsplice.length <=6 ? true : false;
    }
    wICDdocList.title = element.Title;
    wICDdocList.taskComponentId = element.TaskComponentId;
    wICDdocList.discipline1 = element.Discipline1;
    wICDdocList.discipline2 = element.Discipline2;
    wICDdocList.discipline3 = element.Discipline3;
    wICDdocList.disciplineId = element.DisciplineId;
    wICDdocList.AssetStatusId = element.AssetStatusId;
    wICDdocList.AssetStatusName = element.AssetStatusName;
    wICDdocList.assetVersion = element.version
    wICDdocList.assetTypeCode = element.AssetTypeCode;
    wICDdocList.contentId = element.ContentId;
    wICDdocList.OriginContentId = element.OriginContentId;
    wICDdocList.ReadyInd = element.ReadyInd;
    wICDdocList.IncludedInd = element.IncludedInd;
    wICDdocList.expanded = false;
    wICDdocList.actProtectedInd = actProtectedInd;
    // wICDdocList.activityContainerId = element.activityContainerId;
    // wICDdocList.ActivityPageId = element.activityPageId;
    // wICDdocList.contentItemId = element.contentItemId;
    // wICDdocList.contentNo = element.assetContentId;
    // wICDdocList.contentTypeId = element.contentTypeId;
    // wICDdocList.CreatedOn = element.createdOn;
    // wICDdocList.guidance = element.guidance;
    // wICDdocList.CreatorClockId = element.creatorClockId;
    // wICDdocList.ModifiedOn = element.modifiedOn;
    // wICDdocList.ModifierClockId = element.modifierClockId;
    // wICDdocList.orderNo = element.orderNo;
    // wICDdocList.parentActivityContainerId = element.parentActivityContainerId;
    // wICDdocList.title = element.title;
    // wICDdocList.uS_JC = element.uS_JC;
    // wICDdocList.url = element.url;
    // wICDdocList.version = element.version;
    return wICDdocList;
  }

  openDeviationModal(isDeviation) {
    console.log("openDeviationModal",isDeviation);
    let maxHeight: any;
    maxHeight = screen.height;
    if (maxHeight < 768) {
      maxHeight = 400;
    } else {
      maxHeight = 700;
    }

    const deviationDialog = this.dialog.open(TaskApprovalWorkflowComponent, {
      maxWidth: '690px',
      width: '100%',
      maxHeight: maxHeight,
      disableClose: true,
      data: {
        isDeviation: isDeviation,
        title: this.taskGlobalData ? this.taskGlobalData.title : '',
        taskReaid: this.taskGlobalData ? this.taskGlobalData.taskReaid : '',
        item: this.parentItem,
        taskTitle: this.titleData,
      },
    });

    deviationDialog.afterClosed().subscribe((result) => {
      if(result) {
        this.getParentItemData();
        this.executionStepFlowData();
      }
    });
  }
  bindData(childItem, parentItem, criteriaAndBPData) {
    let activityWIStatus = true;
    let activityBPStatus = false;
    childItem.forEach((child) => {
      if (child.cgActivityForm) {
        child.cgActivityForm.forEach((item) => {
          if (!item.cgForm) {
            item.cgForm = this.fb.group({
              taskExecutionStatementEvaluationId: 0,
              deviation: this.fb.group({
                taskExecutionDeviationId: 0,
                statementEvaluationId: '',
                existingDeviationInd: '',
                deviationNumber: '',
                deviationId: '',
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
                editResultsStatus: true,
                taskExecutionUpload: [],
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
                editResultsStatus: true,
              }),
            });
          }
          item['criteriaFormValid'] = true;
          item['BPFormValid'] = true;
          if (criteriaAndBPData) {
            criteriaAndBPData.forEach((content) => {
              if (content.taskComponentId == item.TaskComponentId) {
                if (item.AssetStatementTypeCode == 'C') {
                  // console.log("criteriaAndBPData", item);
                  const existingDeviation =
                    content.statementEvaluationId == 2 &&
                    content.deviation.existingDeviationInd == true &&
                    content.deviation.deviationNumber != '';
                  const savedDeviation =
                    content.statementEvaluationId == 2 &&
                    content.deviation.existingDeviationInd == false &&
                    content.deviation.deviationStatusCode == 'Submitted';
                  if (!item.cgForm) {
                    item.cgForm = this.fb.group({
                      taskExecutionStatementEvaluationId: 0,
                      deviation: this.fb.group({
                        taskExecutionDeviationId: 0,
                        statementEvaluationId: '',
                        existingDeviationInd: '',
                        deviationNumber: '',
                        deviationId: '',
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
                        editResultsStatus: true,
                        taskExecutionUpload: [],
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
                        editResultsStatus: true,
                      }),
                    });
                  }
                  item.cgForm.controls.deviation.patchValue({
                    statementEvaluationId:
                      content.statementEvaluationId.toString(),
                    existingDeviationInd:
                      content.deviation.existingDeviationInd == true
                        ? 'yes'
                        : 'no',
                    deviationNumber: content.deviation.deviationNumber,
                    deviationId: content.deviation.deviationId,
                    difference: content.deviation.difference,
                    reason: content.deviation.reason,
                    criteriaUpdateInd:
                      content.deviation.criteriaUpdateInd == true
                        ? 'true'
                        : 'false',
                    riskLevelCode: content.deviation.riskLevelCode,
                    riskMitigationPlan: content.deviation.riskMitigationPlan,
                    programRiskId: content.deviation.programRiskId,
                    deviationStatusCode:
                      content.deviation.deviationStatusCode == ''
                        ? 'WIP'
                        : content.deviation.deviationStatusCode == 'COMP'
                          ? 'Completed'
                          : content.deviation.deviationStatusCode,
                    taskExecutionUpload: content.deviation.taskExecutionUpload,
                    taskComponentId: content.deviation.taskComponentId,
                    complete:
                      content.deviation.deviationStatusCode == 'COMP' ||
                        content.deviation.deviationStatusCode == 'Completed'
                        ? true
                        : false,
                    isValid:
                      existingDeviation == true ||
                      savedDeviation == true ||
                      content.statementEvaluationId == 1,
                  });
                  item['criteriaFormValid'] =
                    item.cgForm.value.deviation.isValid;
                }
                if (item.AssetStatementTypeCode == 'B') {
                  const existingBP =
                    content.statementEvaluationId == 2 &&
                    content.exception.difference != '' &&
                    content.exception.reason != '' &&
                    (content.exception.needUpdateInd == false ||
                      (content.exception.needUpdateInd == true &&
                        content.exception.updateComment != ''));
                  if (!item.cgForm) {
                    item.cgForm = this.fb.group({
                      taskExecutionStatementEvaluationId: 0,
                      deviation: this.fb.group({
                        taskExecutionDeviationId: 0,
                        statementEvaluationId: '',
                        existingDeviationInd: '',
                        deviationNumber: '',
                        deviationId: '',
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
                        editResultsStatus: true,
                        taskExecutionUpload: [],
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
                        editResultsStatus: true,
                      }),
                    });
                  }
                  item.cgForm.controls.exception.patchValue({
                    taskExecutionExceptionId:
                      content.exception.taskExecutionExceptionId,
                    taskComponentId: content.exception.taskComponentId,
                    difference: content.exception.difference,
                    reason: content.exception.reason,
                    needUpdateInd: content.exception.needUpdateInd,
                    statementEvaluationId:
                      content.statementEvaluationId.toString(),
                    updateComment: content.exception.updateComment,
                    isValid:
                      existingBP == true ||
                      content.statementEvaluationId == 1 ||
                      content.statementEvaluationId == 3,
                  });
                  item['BPFormValid'] = item.cgForm.value.exception.isValid;
                }
              }
            });
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
    parentItem.disableWIToggler = activityWIStatus;
    parentItem.disableBPToggler = activityBPStatus;
    // parentItem.WIToggler = false;
    // parentItem.BPToggler = false;
  }

  currentSelected(isChecked: any, element: string) {
    let taskCollectionId = [];
    if (isChecked) {
      this.filterTask.push(element);
    } else {
      this.filterTask = this.filterTask.filter(function (el) {
        return el != element;
      });
    }
    if (this.filterTask && this.filterTask.length) {
      this.filterTask.forEach((elem) => {
        taskCollectionId.push(elem);
      });
    }

    if (taskCollectionId && taskCollectionId.length > 0) {
      taskCollectionId.map((task) => {
        if (task === 'A' || task === 'CG' || task === 'S') {
          this.parentItem.children.map((item) => {
            item.children.map((step) => {
              if (task === 'S') {
                this.filterData(this.parentItem.children, step);
              } else {
                step.children.map((item) => {
                  item.children.map((ap) => {
                    if (task === 'A') {
                      this.filterData(this.parentItem.children, ap);
                    } else if (task === 'CG') {
                      ap.children.map((cg) => {
                        this.filterData(this.parentItem.children, cg);
                      });
                    }
                  });
                });
              }
            });
          });
        }
      });
    } else {
      taskCollectionId.map((task) => {
        if ((task === 'A' || task === 'CG' || task === 'S') && !isChecked) {
          this.parentItem.children.map((item) => {
            item.children.map((el) => {
              if (task === 'S') {
                this.parentItem.children = [];
              } else {
                el.children.map((item) => {
                  item.children.map((ap) => {
                    if (task === 'A') {
                      this.parentItem.children = [];
                    } else if (task === 'CG') {
                      ap.children.map((cg) => {
                        this.parentItem.children = [];
                      });
                    }
                  });
                });
              }
            });
          });
        }
      });
      this.parentItem = { ...this.taskExecutionData };
    }
  }

  currentSelectedDiscipline(event: any, element: number) {

    console.log("currentSelectedDiscipline event", event);
    console.log("currentSelectedDiscipline element", element);
    //console.log("event", event);
    this.defaultDiscipline = event;
    // if (this.defaultDiscipline) {
    //   this.disciplineForm.patchValue({
    //     disciplineAll: 0
    //   });
    // } else {
    //   this.disciplineForm.patchValue({});
    // }

    this.disciplineListData.forEach((disciplineCode: any) => {
      if (element === disciplineCode.rowNo) {
        this.disciplineCodeSelected = disciplineCode.rowNo;
      }
    })

    if (event && element === 0) {
      if (this.defaultDiscipline) {
        this.disciplineForm.patchValue({
          disciplineAll: 0
        });
      }

      this.parentItem = { ...this.taskExecutionData };
      this.parentItem.children.map((item) => {
        item.children.map((step) => {
          step.children.map((discipline) => {
            //console.log("disciplien", discipline);
            this.filterData(this.parentItem.children, discipline);
          });
        });
      });
    } else if (element && element > 0 && element === this.disciplineCodeSelected) {
      this.parentItem = { ...this.taskExecutionData };
      this.parentItem.children.map((item) => {
        item.children.map((step) => {
          step.children.map((discipline) => {
            const disciplineIdData = discipline.content.disciplineId;
            if (element && element > 0 && element === disciplineIdData) {
              this.filterData(this.parentItem.children, discipline);
            }
          });
        });
      });
    } else {
      this.parentItem = { ...this.taskExecutionData };
    }
  }

  filterData(parentItem, item) {
    parentItem.map((item) => {
      if (item.name == 'SF') {
        this.parentItem.children = [];
      }
    });
    this.parentItem.children.push(item);
  }

  bindFilterData() {
    this.parentItem.children.map((item) => {
      item.children.map((stepData) => {
        this.parentItem.children.push(stepData);
        stepData.children.map((item) => {
          item.children.map((apData) => {
            this.parentItem.children.push(apData);
            apData.children.map((cgData) => {
              this.parentItem.children.push(cgData);
            });
          });
        });
      });
    });
    return this.parentItem.children;
  }

  bindActivityValues(result, activityResult) {
    result.forEach((item) => {
      if (item.name == 'A') {
        item['docStatus'] = 'Not Started';
        activityResult.forEach((el) => {
          if (el.taskComponentId == item.content.taskComponentId) {
            item.BPToggler = el.completionInd;
            el.executionStatusCode != 'WIP' ? (item.WIToggler = true) : false;
            //item.WIToggler = el.bestPracticesInd;
            item['docStatus'] = el.executionStatusCode;
          }
        });
      }
    });
  }

  filteredDisciplineData(stepFlowData: any) {
    //console.log('stepFlowData', stepFlowData);
    let disciplinedData: any = [];
    if (stepFlowData && stepFlowData.length > 0) {
      stepFlowData.forEach(function (item: any) {
        let Steps = item.Steps;
        if (Steps) {
          Steps.forEach(function (item: any, index: number) {
            let Disciplines = item.Disciplines;
            if (Disciplines) {
              Disciplines.forEach(function (itemData: any, index: number) {
                let swimLaneTitle;

                if (itemData.Discipline1) {
                  swimLaneTitle = itemData.Discipline1;
                }

                if (itemData.Discipline2) {
                  swimLaneTitle = '';
                  swimLaneTitle =
                    itemData.Discipline1 + ' > ' + itemData.Discipline2;
                }

                if (itemData.Discipline3) {
                  swimLaneTitle = '';
                  swimLaneTitle =
                    itemData.Discipline1 +
                    ' > ' +
                    itemData.Discipline2 +
                    ' > ' +
                    itemData.Discipline3;
                }

                if (itemData.Discipline4) {
                  swimLaneTitle = '';
                  swimLaneTitle =
                    itemData.Discipline1 +
                    ' > ' +
                    itemData.Discipline2 +
                    ' > ' +
                    itemData.Discipline3 +
                    ' > ' +
                    itemData.Discipline4;
                }

                let tableModel: any = {
                  name: swimLaneTitle,
                  rowNo: itemData.DisciplineId,
                };
                disciplinedData.push(tableModel);
              });
            }
          });
        }
      });

      const disciplineFilterData = disciplinedData;
      const objIds = disciplineFilterData.reduce((a, { rowNo, name }) => {
        a[rowNo] = a[rowNo] || { rowNo, name };
        return { ...a, ...{ [rowNo]: { rowNo, name } } };
      }, {});
      const disciplineList: any = Object.values(objIds);
      this.disciplineListData = disciplineList;
      this.disciplineListData.unshift({ rowNo: 0, name: "Discipline" });
    }
    //console.log('filteredDisciplineData', this.disciplineListData);
  }
}
