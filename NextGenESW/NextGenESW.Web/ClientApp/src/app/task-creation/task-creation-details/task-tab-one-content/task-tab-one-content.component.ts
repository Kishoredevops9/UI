import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { EngineModelGroupDropDownList, InitialEngineModelDropDownList, EngineSectionList } from './task-tab-one-content.model';
import { ActivityPageService } from '@app/activity-page/activity-page.service';
import { TabOneContentService } from '@app/task-creation/task-creation-details/task-tab-one-content/task-tab-one-content.service';
import { Subscription } from 'rxjs';
import { TagList, WiDropDownList, ExportAuthority, RestrictingProgram } from '@app/create-document/create-document.model';
import { TaskCreationState } from '@app/task-creation/task-creation.reducer';
import { addTaskCreation } from '@app/task-creation/task-creation.actions';
import { TaskCreationModel } from '@app/task-creation/task-creation.model';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateDocumentService } from '@app/create-document/create-document.service';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';
import { SharedService } from '@app/shared/shared.service';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { AddItemAction, DeleteItemAction } from "@app/task-creation/store/task.actions";
import { Title } from '@angular/platform-browser';
import { TaskCrationPageService } from '@app/task-creation/task-creation.service';
//import { TaskRecordsService1 } from '@app/shared/TaskRecords1.service';
import { takeUntil } from 'rxjs/operators';
import {
  selectEngineSectionList,
  selectExportAuthorityList,
  selectRestrictingProgramList,
  selectSetOfPhasesList
} from '@app/reducers/common-list.selector';
import { GlobalFormPopupComponent } from '@app/shared/component/global-form-popup/global-form-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { PlaceholderDict } from '@app/shared/utils/app-settings';
@Component({
  selector: 'app-task-tab-one-content',
  templateUrl: './task-tab-one-content.component.html',
  styleUrls: ['./task-tab-one-content.component.scss']
})
export class TabOneContentComponent implements OnInit {
  PlaceholderDict = PlaceholderDict;
  private destroyed$ = new Subject();
  broadCastMessage: any = [];

  @Input() contentType1: any;
  isActiveNOofCasesNo: boolean;
  AccessingTaskAuthorized:any;
  CreatingTaskAuthorized:any;
  ExecutingTaskAuthorized:any;
  AuthTaskUser1:any;
  showDropDown = false;
  dropdownEnabled = true;
  items: TreeviewItem[];
  values: number[];
  config = TreeviewConfig.create({
    hasAllCheckBox: false,
    hasFilter: false,
    hasCollapseExpand: false,
    decoupleChildFromParent: true,
    maxHeight: 400
  });
  onSelectedChange($event) {
    // console.log("onSelectedChange event", $event)
  }
  onFilterChange($event) {
    // console.log("onFilterChange event", $event)
  }
  taskCretionForm: FormGroup;
  titleAlert: string = 'This field is required';
  engineModelGroupDropDownList: EngineModelGroupDropDownList[];
  initialEngineModelDropDownList: InitialEngineModelDropDownList[];
  engineSectionList: EngineSectionList[];
  private subscription: Subscription;
  @Output() nextTab = new EventEmitter();
  @Output() titleOutput = new EventEmitter<any>();
  @Output() propertyOutput = new EventEmitter<any>();
  @Output() taskCreatedOutput = new EventEmitter<any>();
  @Input() contentType: string;
  @Output() getGlobalData = new EventEmitter<any>();
  @Output() newItemEvent = new EventEmitter<string>();
  restrictingProgramList: RestrictingProgram[];
  exportAuthorityList: ExportAuthority[];
  isProgramControlled: boolean = false;
  isOutsourceable: boolean = false;
  loggedInUserNationality;
  activityTabs;
  email: string = "";
  id;
  tagList: TagList[] = [];
  listOfTags: TagList[] = [];
  taskCreationModel$: Observable<TaskCreationModel[]>;
  taskCreationResponse: any[];
  taskCreationEngineModels: any[];
  taskCreationEngineModelChiild: any[];
  taskCreationPostModel: TaskCreationModel = new TaskCreationModel();
  toppings = new FormControl();
  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
  setOfPhasesList: WiDropDownList[];
  showTags = false;
  nodePathTag: any;
  SelectTag = 'Select Tag';
  nodeValue: any;
  chipValues: any = [];
  chipData: any = [];
  phasesData: any;
  phasesFinalValue;
  tagsFinalValue;
  eventsSubject: Subject<void> = new Subject<void>();
  TaskItems$: Observable<any>;
  planeObject: any = []
  existingTaskData;
  engineModelValueExisting;
  initialEngineModelValueExisting;
  engineSectionExisting;
  ReaTaskId: any;
  ReaTaskIdLength: number;
  existingReaData;
  engineModelREAExistingValue;
  initialEngineModelREAExistingValue;
  engineSectionREAExistingValue;
  hasExistingTask: boolean = false;
  reaNotExistMessage: boolean = false;
  disableSubmitButton: boolean = true;
  propertyEditable : boolean;
  dialogConfig:any;
  isLoading = false;
  constructor(private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private activityPageService: ActivityPageService,
    private tabOneContentService: TabOneContentService,
    private createDocumentService: CreateDocumentService,
    private router: Router,
    private ngxService: NgxUiLoaderService,
    private SharedService: SharedService,
    private taskstore: Store<any>,
    private store: Store<TaskCreationState>,
    private titleService: Title,
    private taskCrationPageService: TaskCrationPageService,
    public dialog: MatDialog,
    //private TaskRecordsService1: TaskRecordsService1,


  ) {
    this.loadDropDowndata();
    this.loadDropDowndataPhases();
    this.titleService.setTitle(`EKS | Create Task`);
  }
  ngOnInit() {
    this.TaskItems$ = this.taskstore.select(store => store.Task.property);
    this.taskCretionForm = this.formBuilder.group({
      'taskID': [null, Validators.required],
      'rea': [false],
      'title': [null, Validators.required],
      'ipt': [null],
      'engineModelTagId': [null, Validators.required],
      'initialEngineModelTagId': [null, Validators.required],
      'engineSectionId': [null, Validators.required],
      'fullEventDescription': [null],
      'desiredSolution': [null],
      'announcement' : [null],
      'programControlled': [false],
      'phasesTask': [null, Validators.required],
      'outsourceable': '',
      'exportAuthority': '',
      'restrictingProgram': ''
    });
    this.route.params.subscribe((param) => {
      this.id = parseInt(param['id']);
      this.hasExistingTask = (param['id'] && param['id'] > 0) ? true : false;
      //console.log("task-creation id", this.id)
    });
    if (this.id) {
      console.log("tabOneContentService:this.id", this.id);
      this.tabOneContentService.getTaskById(this.id).subscribe(
        (data) => {
          console.log("existingTaskData", data);
          this.existingTaskData = data;
          this.titleService.setTitle(`EKS | ${data['id']} | ${data['title']}`);
          // let TagIndex = this.existingTaskData.taskTags.map((node) => {
          //   // console.log(node);
          //   return node.tagId;
          // });
          // // console.log(TagIndex," ---- TagIndex");
          // let TagData = this.planeObject.filter((node) => {
          //   return TagIndex.indexOf(node.id) > -1
          // })
          // // console.log("TagData show here.....",TagData);
          // this.tagData(TagData)
          let PhaseIndex = this.existingTaskData.taskPhases.map((node) => { return node.phaseId })
          let PassData =  this.phasesData  && this.phasesData.filter((node) => {
            return PhaseIndex.indexOf(node.id) > -1
          })
          this.phaseSelection(PassData)

          // console.log("-----Data of Task ---------");
          // console.log(data);
          // console.log("-----Data of Task ---------");
          let TagIndex = this.existingTaskData.taskTags.map((node) => {
            // console.log(node);
            return node.tagId;
          });
          // console.log(TagIndex," ---- TagIndex");
          let TagData = this.planeObject.filter((node) => {
            return TagIndex.indexOf(node.id) > -1
          })
          // console.log("TagData show here.....",TagData);
          this.tagData(TagData)

          console.log("this.existingTaskData", this.existingTaskData);


          this.taskCretionForm.patchValue({
            taskID: this.existingTaskData.taskReaid,
            rea: this.existingTaskData.rea,
            title: this.existingTaskData.title,
            programControlled: this.existingTaskData.controllingProgramId > 0 ? true : false,
            ipt: this.existingTaskData.ipt,
            fullEventDescription: this.existingTaskData.fullEventDescription,
            desiredSolution: this.existingTaskData.desiredSolution,
            announcement: this.existingTaskData.announcement,
            restrictingProgram: this.existingTaskData.controllingProgramId,
            exportAuthority: this.existingTaskData.exportAuthorityId,
          });
          this.isProgramControlled = this.existingTaskData.controllingProgramId > 0 ? true : false;
          this.patchExistingValues();
          this.phasePatch();
          this.patchEngineSection();
          this.taskCreatedOutput.emit(true);
          this.propertyOutput.emit(this.existingTaskData)
          this.titleOutput.emit(this.existingTaskData.taskReaid + "-" + this.existingTaskData.title);
        }
      );
    }
    let userProfileDataObj = this.SharedService.getHeaderRequestedData();
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

        this.isActiveNOofCasesNo = true;
        let userProfileData1 = localStorage.getItem('logInUserEmail');



 this.getLocalhost().then(email=>{
  this.taskCrationPageService.GetTaskAuthorizations(this.id | 0,email).subscribe((data)=>{



      this.AuthTaskUser1 = data;
      this.AuthTaskUser1.taskId;
      this.AuthTaskUser1.isAccessingTaskAuthorized;
      this.AuthTaskUser1.isCreatingTaskAuthorized;
      this.AuthTaskUser1.isExecutingTaskAuthorized;
      this.newItemEvent.emit(this.AuthTaskUser1);



      if(this.AuthTaskUser1.isCreatingTaskAuthorized == false){
        this.disableSubmitButton = false;
        this.propertyEditable = false;
        this.isActiveNOofCasesNo = true;
      }
      else{
        this.disableSubmitButton = true;
        this.propertyEditable = true;
        this.isActiveNOofCasesNo = false;
      }
  })
 })

console.log("----")


        if (this.id) {

          // this.TaskRecordsService1.refreshEarthquakeData(this.id,userProfileData.userEmail).pipe(
          //   // it is now important to unsubscribe from the subject
          //   takeUntil(this.destroyed$)
          // ).subscribe(data => {
          //   console.log('--data one',data); // the latest data
          //   this.AuthTaskUser1 = data;
          //   console.log(' in task creation details component',this.AuthTaskUser1);
          //   this.AuthTaskUser1.taskId;
          //   this.AuthTaskUser1.isAccessingTaskAuthorized;
          //   this.AuthTaskUser1.isCreatingTaskAuthorized;
          //   this.AuthTaskUser1.isExecutingTaskAuthorized;
          //   console.log('-----------------1',this.AuthTaskUser1.taskId);
          //   console.log('----------------------2',this.AuthTaskUser1.isAccessingTaskAuthorized);
          //   console.log('-----------------------3',this.AuthTaskUser1.isCreatingTaskAuthorized);
          //   console.log('-------------------------4',this.AuthTaskUser1.isExecutingTaskAuthorized);
          //   this.newItemEvent.emit(this.AuthTaskUser1);

          //         //disableSubmitButton
          //   if(this.AuthTaskUser1.isCreatingTaskAuthorized == false){
          //     this.disableSubmitButton = false;
          //     this.isActiveNOofCasesNo = true;
          //   }
          //   else{
          //     this.disableSubmitButton = true;
          //     this.isActiveNOofCasesNo = false;
          //   }


          // });


        this.taskCrationPageService.GetTaskAuthorizations(this.id,userProfileData1).subscribe((data)=>{
        this.AuthTaskUser1 = data;
        console.log(' in task creation details component',this.AuthTaskUser1);
        this.AuthTaskUser1.taskId;
        this.AuthTaskUser1.isAccessingTaskAuthorized;
        this.AuthTaskUser1.isCreatingTaskAuthorized;
        this.AuthTaskUser1.isExecutingTaskAuthorized;
        this.newItemEvent.emit(this.AuthTaskUser1);
        //disableSubmitButton

          if(this.AuthTaskUser1.isCreatingTaskAuthorized == false){
            this.disableSubmitButton = false;
            this.isActiveNOofCasesNo = true;
          }
          else{
            this.disableSubmitButton = true;
            this.isActiveNOofCasesNo = false;
          }

      })

    }

  }

  getLocalhost(){


    return new Promise(resolve => {
      setInterval(() => {
      //  resolve(x);
      if (localStorage.getItem('logInUserEmail')){
        resolve(localStorage.getItem('logInUserEmail'));
      }

      }, 1000);
    });


  }

  patchExistingValues() {
    let count = 1;
    if (this.id && this.engineModelGroupDropDownList && this.existingTaskData) {
      this.engineModelValueExisting = this.engineModelGroupDropDownList.filter(
        (val1) => val1.id == this.existingTaskData.engineModelTagId
      );
      this.onEngineModelChangeEvent(this.engineModelValueExisting[0].id);
      this.initialEngineModelValueExisting = this.initialEngineModelDropDownList.filter(
        (val1) => val1.id == this.existingTaskData.initialEngineModelTagId
      );
      this.taskCretionForm.patchValue({
        initialEngineModelTagId: this.initialEngineModelValueExisting[0].id,
        engineModelTagId: this.engineModelValueExisting[0].id
      });
    }
  }
  phasePatch() {
    if (this.id && this.existingTaskData && this.phasesData) {
      let d1 = [];
      this.existingTaskData.taskPhases.forEach(ele => {
        d1.push({ 'phaseId': ele.phaseId });
      });
      let d2 = [];
      this.phasesData.filter(phase => {
        return d1.filter(PhaseId => {
          if (PhaseId.phaseId == phase.id) {
            d2.push(phase);
          }
        });
      });
      this.taskCretionForm.controls.phasesTask.setValue(d2);
    }
  }
  patchEngineSection() {
    if (this.id && this.engineSectionList && this.existingTaskData) {
      let currentEngineSectionId = this.existingTaskData.engineSectionId;
      let patchSecValue;
      this.engineSectionList.forEach((engSecList) => {
        if (engSecList.id == currentEngineSectionId) {
          patchSecValue = engSecList;
        }
      });
      this.taskCretionForm.controls.engineSectionId.setValue(patchSecValue.id);
    }
  }
  tagData($event) {
    this.chipData = $event;
    // console.log("Parameter of Tag Data", this.chipData);
    this.taskstore.dispatch(new AddItemAction(
      {
        data: this.chipData,
        type: 'property'
      }
    ));
  }
  objectToRoot($data) {
    let d = [];
    function inner($d) {
      $d.forEach(element => {
        d.push({
          "id": element.id,
          "name": element.name,
          "parentId": element.parentId
        })
        if (element.children) {
          inner(element.children)
        }
      });
    }
    inner($data)
    return d;
  }
  loadDropDowndata() {
    this.subscription = this.activityPageService
      .getTagList()
      .subscribe((res) => {
        this.taskCreationEngineModels = res.filter(x => x.name == 'Engine Models')
        this.engineModelGroupDropDownList = this.taskCreationEngineModels[0].children;
        this.tagList = res;
        this.planeObject = this.objectToRoot(this.tagList);
        this.patchExistingValues();
      });
    this.subscription = this.store.select(selectEngineSectionList)
      .subscribe((res) => {
        this.engineSectionList = res;
        this.patchEngineSection();
      });
    this.subscription = this.store.select(selectRestrictingProgramList)
      .subscribe((res) => {
        this.restrictingProgramList = res;
        this.bindRestrictProgramValue();
      });
      this.subscription = this.store.select(selectExportAuthorityList)
      .subscribe((res) => {
        this.exportAuthorityList =
          this.loggedInUserNationality?.toLowerCase() === 'canada'
            ? res.filter((x) => x.exportAuthorityCode === 'CA')
            : this.loggedInUserNationality?.toLowerCase() === 'foreign' ||
              this.loggedInUserNationality === 'NR'
              ? res.filter((x) => x.exportAuthorityCode === 'NR')
              : res;
        this.bindExportAuthorityValue();
      });
  }

  selectoutsourceable() {
    if (this.isOutsourceable) {
      this.isOutsourceable = false;
    } else {
      this.isOutsourceable = true;
    }
  }

  selectprogramControlled() {
    if (this.isProgramControlled) {
      this.isProgramControlled = false;
      this.disableSubmitButton = true;
    }
    else {
      this.isProgramControlled = true;
      if(!this.taskCretionForm.value.restrictingProgram){
        this.disableSubmitButton = false;
      } else if(this.taskCretionForm.value.restrictingProgram){
        this.disableSubmitButton = true;
      } else {
        this.disableSubmitButton = false;
      }
    }
  }

  bindRestrictProgramValue() {
    if (this.restrictingProgramList && this.activityTabs && this.activityTabs.controllingProgramId > 0) {
      let controllingProgram = this.restrictingProgramList.filter((data) => {
        if (data.controllingProgramId == this.activityTabs.controllingProgramId)
          return data;
      });
      this.activityTabs.restrictingProgram =
      (controllingProgram && controllingProgram.length > 0) ? controllingProgram[0]['name'] : '';
    }
  }

  bindExportAuthorityValue () {
    if (this.exportAuthorityList && this.activityTabs && this.activityTabs.exportAuthorityId > 0) {
      let exportAuthority = this.exportAuthorityList.filter((data) => {
        if (data.exportAuthorityId == this.activityTabs.exportAuthorityId)
          return data;
      });
      this.activityTabs.exportAuthorityValue =
      exportAuthority && exportAuthority.length > 0
          ? exportAuthority[0]['exportAuthorityCode']
          : '';
    }
  }
  loadDropDowndataPhases() {
    this.subscription = this.store.select(selectSetOfPhasesList).subscribe((res) => {
      this.setOfPhasesList = res;
    });
    this.subscription = this.activityPageService
      .getTagList()
      .subscribe((res) => {
        this.listOfTags = res;
      });
    this.subscription = this.tabOneContentService.getAllAssetPhases().subscribe(data => {
      this.phasesData = data;
      this.phasesData.map((node) => {
        node.name = node.description
      })
      this.phasePatch();
    });
  }
  removeChipData(delChip) {
    this.store.dispatch(new DeleteItemAction({
      data: delChip,
      type: "property"
    }));
    this.eventsSubject.next(delChip);
  }
  phaseSelection(phaseValues) {
    this.chipValues = phaseValues;
    let domObj = [];
    phaseValues.forEach((node: any) => {
      domObj.push({
        id: node.id,
        parentid: 'undefined',
        name: node.description
      })
    })
    this.taskstore.dispatch(new AddItemAction(
      {
        data: domObj,
        type: 'CHP'
      }
    ));
  }
  removeChip(chip) {
    let removeElement = chip
    this.chipValues = this.chipValues.filter(obj => obj !== removeElement);
    this.taskCretionForm.controls['phasesTask'].setValue(this.chipValues);
  }
  setNodeValuesForTags(value) {
    this.nodePathTag = value.nodePath;
    this.showTags = !this.showTags;
  }
  toggleTags() {
    this.showTags = !this.showTags;
  }
  getPlaceData() {
    if (this.chipData && this.chipData.length) {
      return this.chipData.length + " Tag Selected";
    } else {
      return "No Tag Selected";
    }
  }
  valueUpdates() {
    let phaseContent = this.taskCretionForm.controls.phasesTask.value;
    let tagsContent = this.chipData;
    let phase1 = [];
    let tag1 = [];
    if (phaseContent && phaseContent.length) {
      phaseContent.forEach(element => {
        phase1.push({ phaseId: element.id });
      });
    }
    if (tagsContent && tagsContent.length) {
      tagsContent.forEach(elem => {
        // console.log(elem);
        tag1.push({ tagId: elem.id, name: elem.name, parentTagsId: elem.parentId });
      });
    }
    this.phasesFinalValue = phase1;
    this.tagsFinalValue = tag1;
  }
  onEngineModelChangeEvent(event) {
    this.taskCreationEngineModelChiild = this.engineModelGroupDropDownList.filter(x => x.id == event);
    if (this.taskCreationEngineModelChiild && this.taskCreationEngineModelChiild[0]) {
      this.initialEngineModelDropDownList = this.taskCreationEngineModelChiild[0].children;
    }
  }

  onChangeProgramControl(e: any) {
    // if (
    //   this.existingTaskData.programControlled == true ||
    //   this.existingTaskData.programControlled == 'Yes'
    // ) {
    //   this.existingTaskData.programControlled = 'Yes';
    // } else {
    //   this.existingTaskData.programControlled = 'No';
    // }
    // this.existingTaskData.controllingProgramId =
    //   this.taskCretionForm.controls.restrictingProgram.value;
      this.disableSubmitButton = true;
  }

  onChangeExportAuthority(e: any) {
    // this.existingTaskData.exportAuthorityId =
    //   this.taskCretionForm.controls.exportAuthority.value;
  }


  onSubmit() {


    this.ngxService.startBackground();
    this.valueUpdates();
    if (this.id && this.existingTaskData) {
      this.taskCreationPostModel.id = this.existingTaskData.id;
    }
    this.taskCreationPostModel.taskReaid = this.taskCretionForm.controls.taskID.value;
    this.taskCreationPostModel.programControlledInd = this.taskCretionForm.controls.programControlled.value;
    this.taskCreationPostModel.rea = this.taskCretionForm.controls.rea.value;
    this.taskCreationPostModel.title = this.taskCretionForm.controls.title.value;
    this.taskCreationPostModel.ipt = this.taskCretionForm.controls.ipt.value;
    this.taskCreationPostModel.engineModelTagId = this.taskCretionForm.controls.engineModelTagId.value;
    this.taskCreationPostModel.initialEngineModelTagId = this.taskCretionForm.controls.initialEngineModelTagId.value;
    this.taskCreationPostModel.engineSectionId = this.taskCretionForm.controls.engineSectionId.value;
    this.taskCreationPostModel.fullEventDescription = this.taskCretionForm.controls.fullEventDescription.value;
    this.taskCreationPostModel.desiredSolution = this.taskCretionForm.controls.desiredSolution.value;
    this.taskCreationPostModel.announcement = this.taskCretionForm.controls.announcement.value;
   
    this.taskCreationPostModel.taskPhases = this.phasesFinalValue;
    this.taskCreationPostModel.taskTags = this.tagsFinalValue;
    this.taskCreationPostModel.createdUser = sessionStorage.getItem('userMail');
    this.taskCreationPostModel.exportAuthorityId = this.taskCretionForm.controls.exportAuthority.value;
    this.taskCreationPostModel.controllingProgramId = this.isProgramControlled && this.taskCretionForm.controls.restrictingProgram.value ? this.taskCretionForm.controls.restrictingProgram.value : '';

    console.log("this.taskCreationPostModel", this.taskCreationPostModel);
    if (this.id > 0) {
      this.tabOneContentService
        .updateTask(this.taskCreationPostModel)
        .subscribe((data) => {
          console.log("Response of ID-" + this.id + ":", data);
          let resonseData:any = data;
          this.propertyOutput.emit(data)


          this.taskCretionForm.patchValue({
              programControlled: resonseData.programControlledInd,
              restrictingProgram: resonseData.controllingProgramId,
              exportAuthority: resonseData.exportAuthorityId,
          });
          this.titleOutput.emit(this.taskCreationPostModel.taskReaid + "-" + this.taskCreationPostModel.title);
          //this.taskCreatedOutput.emit(true);
          this.nextTab.emit(false);
          this.ngxService.stopBackground();
        });

    } else {
      this.tabOneContentService
        .CreateNewTaskCreation(JSON.stringify(this.taskCreationPostModel))
        .subscribe((data) => {
          let TaskCreationModel = this.taskCreationPostModel;
          this.store.dispatch(
            addTaskCreation({ taskCreation: TaskCreationModel })
          );
          var res = JSON.parse(JSON.stringify(data));
          // console.log("server response", res);
          this.getGlobalData.emit(res);
          this.titleOutput.emit(this.taskCreationPostModel.taskID + "-" + this.taskCreationPostModel.title);
          this.taskCreatedOutput.emit(true);
          this.ngxService.stopBackground();

          // console.log(data);
          this.SharedService.sendMessage.emit({
            "time": 2500,
            "tabindex": 1
          })
          this.router.navigate(["/task/create-task/", data['id']]);
          //  this.nextTab.emit(false);
        });
    }
  }

  getReaDetailsOnToggle(event: any, reaFlag: any) {
    this.ReaTaskId = (this.taskCretionForm.controls.taskID.value && this.taskCretionForm.controls.taskID.value.length > 0) ? this.taskCretionForm.controls.taskID.value : '';
    this.ReaTaskIdLength = (this.ReaTaskId && this.ReaTaskId.length > 0) ? this.ReaTaskId.length : 0;
    if (event.checked && reaFlag === true && this.ReaTaskId && this.ReaTaskIdLength > 0) {
      this.isLoading = true;
      this.taskCrationPageService.getREADetailsDev(this.ReaTaskId).subscribe((response) => {
        //console.log("getReaDetailsOnToggle response", response);
        this.isLoading = false;
        this.existingReaData = response;
        console.log("existingReaData", response);
        if (this.ReaTaskId !== this.existingReaData.reaTaskNumberFromEKS) {
          this.taskCretionForm.patchValue({ rea: false });
          // this.reaNotExistMessage = true;
          this.dialogConfig = {
            header: 'REA?',
            action: 'errorPopup',
            message: {isError:true,errorMessage: (response['ReaResponse'] ? response['ReaResponse']: response['reaResponse'])}
          }
          const dialogRef = this.dialog.open(GlobalFormPopupComponent, {
            width: '300px',
            data: this.dialogConfig
          });
    
          dialogRef.afterClosed().subscribe((result) => {
    
          });

          // this.FadeREAMessage();
        } else {

          this.engineModelREAExistingValue = this.engineModelGroupDropDownList.filter(
            (engineModel) => engineModel.name === this.existingReaData.engineModelGroup
          );
          this.onEngineModelChangeEvent(this.engineModelREAExistingValue[0].id);
          this.initialEngineModelREAExistingValue = this.initialEngineModelDropDownList.filter(
            (intitialEngine) => intitialEngine.name == this.existingReaData.initialEngineModel
          );
          this.engineSectionList.forEach((engineSectionData) => {
            if (engineSectionData.description === this.existingReaData.engineSection) {
              this.engineSectionREAExistingValue = engineSectionData;
            }
          });
          if (this.existingReaData.engineModelGroup && this.engineModelREAExistingValue) {
            this.taskCretionForm.patchValue({
              engineModelTagId: (this.engineModelREAExistingValue && this.engineModelREAExistingValue[0]) ? this.engineModelREAExistingValue[0].id : ''
            });
          }
          if (this.existingReaData.initialEngineModel && this.initialEngineModelREAExistingValue) {
            this.taskCretionForm.patchValue({
              initialEngineModelTagId: (this.initialEngineModelREAExistingValue && this.initialEngineModelREAExistingValue[0]) ? this.initialEngineModelREAExistingValue[0].id : ''
            });
          }
          if (this.existingReaData.engineSection && this.engineSectionREAExistingValue) {
            this.taskCretionForm.patchValue({
              engineSectionId: (this.engineSectionREAExistingValue) ? this.engineSectionREAExistingValue.id : '',
            });
          }
          this.taskCretionForm.patchValue({
            title: (this.existingReaData.title) ? this.existingReaData.title : '',
            fullEventDescription: (this.existingReaData.fullEventDescription) ? this.existingReaData.fullEventDescription : '',
            desiredSolution: (this.existingReaData.desiredSolution) ? this.existingReaData.desiredSolution : '',
            taskID: (this.ReaTaskId) ? this.ReaTaskId : '',
            exportAuthority: (this.existingReaData.exportAuthorityId) ? this.existingReaData.exportAuthorityId : '',
            restrictingProgram: (this.existingReaData.controllingProgramId) ? this.existingReaData.controllingProgramId : '',
          });

        }

      },
      (error) => {
        this.isLoading = false;
        this.taskCretionForm.patchValue({ rea: false });
        console.log(error.error);
      });
    } else {
      this.taskCretionForm.patchValue({
        title: '',
        engineModelTagId: '',
        initialEngineModelTagId: '',
        engineSectionId: '',
        fullEventDescription: '',
        desiredSolution: '',
        rea: false,
        //taskID: (this.ReaTaskId) ? this.ReaTaskId : '',
      });
    }
  }

  FadeREAMessage() {
    setTimeout(() => {
      this.reaNotExistMessage = false;
    }, 3000);
  }

}
