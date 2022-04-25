import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { PersistanceService } from '@app/shared/persistance.service';
import {
  ApprovalRequirementIdList,
  CategoryList,
  ConfidentialitiesDropDownList,
  ExportAuthority,
  ExportComplianceList,
  GetClassifiersDropDownList,
  GetRevionType,
  RCCategoryList,
  RestrictingProgram,
  TagList,
  WiDisciplineDropDownList,
  WiDropDownList
} from '@app/create-document/create-document.model';
import { Tag } from '../../../create-document/create-document.model';

import { CreateDocumentService } from '@app/create-document/create-document.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { DisciplineCodeList } from '@app/activity-page/activity-page.model';
import { ActivityPageService } from '@app/activity-page/activity-page.service';
import { Store } from '@ngrx/store';
import { addProcessMap } from '@app/process-maps/process-maps.actions';
import { SharedService } from '@app/shared/shared.service';
import { CriteriaGroupPageService } from '@app/criteria-group/criteria-group.service';
import { KPacksService } from '@app/k-packs/k-packs.service';
import { DocumentViewService } from '@app/document-view/document-view.service';
import { TocService } from '@app/toc/toc.service';
import { map, pairwise, startWith } from 'rxjs/operators';
import {
  ActivityBlocks,
  DocumentProperties,
  DocumentPropertiesForAll,
  DocumentPropertiesKPack,
  ExistingProcessMap,
  PhaseModel,
  ProcessMapDataModel,
  ProcessMapDataModelServerReq,
  ProcessMapMeta,
  SaveAsMapDataModel,
  SwimLanes,
  TagData,
  TagDataObject,
  UpdatePublishePropertiesForAll
} from './properties.model';
// import { analyzeAndValidateNgModules } from '@angular/compiler';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { RelatedContentService } from '@app/related-content/related-content.service';
import { Title } from '@angular/platform-browser';
import { DeleteItemAction } from '@app/task-creation/store/task.actions';
import { RecordsService } from '../../records.service';
import { MatDialog } from '@angular/material/dialog';
import { ClassifierModalComponent } from './classifier-modal/classifier-modal.component';
import { ProcessMapsService } from '../../../process-maps/process-maps.service';
import { tagData } from '@environments/apidata';
import { ASSET_STATUSES, Constants, documentPath } from '@environments/constants';
import * as ContentDataActions from '@app/dashboard/content-list/shared/content-data.actions';
import {
  selectAllSetOfCategories,
  selectApprovalRequirement,
  selectCategoryList,
  selectClassifiersList,
  selectConfidentialitiesList,
  selectDisciplineCodeList,
  selectExportAuthorityList,
  selectMetaDataDisciplineCode,
  selectRestrictingProgramList,
  selectRevisionTypeList,
  selectSetOfPhasesList,
  selectUserList,
  selectWiDropdownList
} from '@app/reducers/common-list.selector';
import { compact } from 'lodash';
import { BaseComponent } from '@app/shared/component/base/base.component';

@Component({
  selector: 'app-properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.scss'],
})
export class PropertiesComponent extends BaseComponent implements OnInit {
  ASSET_STATUSES = ASSET_STATUSES;
  searchData: String;
  edpendData: number;
  masterFilterData: any = [];
  filterData: any;
  showMessage: any;
  displayName1:any;
  createdUser:any;
  saveAsBTN: boolean = false;
  hideSuccessMessage: boolean = false;
  length: any;
  loading = false;
  NewFormateData: any;
  existingMapDataObj: any;
  saveAsMapDataObj: any;
  classifiersname: any;
  sfConfidentialitylevel: any;
  stepflowConfidentialitylevel: any;
  publisheClassifier:any;
  // tagList: TagList[] = [];

  listOfTags: TagList[] = [];
  contentTypeValue;
  nodePath: string = '';
  isSelectedDicipline: boolean = false;
  ownerEditBTN:boolean = false;
  tagDataObj: TagData;
  // private taskstore: Store<any>;
  tagDataList: TagData[] = [];
  isConfidentiality: boolean = false;
  activityDisciplineCode = null;
  isProgramControlled: boolean = false;
  isOutsourceable: boolean = false;
  IsDCEnabled: boolean = false;
  nodeData: string = '';
  chipData: any[] = [];
  chipDisciplineData: any[] = [];
  chipDataUpdate: any[] = [];
  private chipContainer: any = [];
  chipDisciplineContainer: any = [];
  eventsSubject: Subject<void> = new Subject<void>();
  eventSubject: Subject<void> = new Subject<void>();
  eventsDiscipline: Subject<void> = new Subject<void>();
  TaskItems$: Observable<any>;
  showDropDown = false;
  showDisciplineDropDown = false;
  tagDataIds: number[] = [];
  tagDataObject: TagDataObject[] = [];
  tagDatanodes: string[] = [];
  nodePathTag: string = '';
  nodePathDiscipline: string = '';
  selectedDicipline: any;
  selectedTagData: any;
  nodeValue: string = '';
  DisciplineIdData: string = '';
  SubDisciplineIdData: string = '';
  SubSubDisciplineIdData: string = '';
  SubSubSubDisciplineIdData: string = '';
  selectedDisciplineCode: any;
  keyword: any;
  phaseListDisplay: any;
  selectedContentTags: any;
  DisciplineIdDataTag: string = '';
  SubDisciplineIdDataTag: string = '';
  SubSubDisciplineIdDataTag: string = '';
  SubSubSubDisciplineIdDataTag: string = '';
  steFlowContentType: string = 'SF';

  publishedKeyword: any;
  publishedTags: any;
  isContentStepFlow: boolean = false;

  @Input() contentType: string = '';
  @Input() docStatusM: any;
  activityTabs;
  draftViewData;
  id;
  userMail;
  userId;
  createdOn;
  activityPageId: number = 0;
  kPackId: number = 0;
  criteriaGroupPageId: number = 0;
  propertiesFormData: FormGroup;
  containerId;
  title;
  @Input() disableForm: boolean;
  @Output() nextTab = new EventEmitter();
  @Output() classifierDropDownList = new EventEmitter();
  @Input() globalData;
  @Input() updatedContentOwner;
  @Input() preview = false;
  tags: Tag[] = [];
  hideDiv: boolean = false;
  show = false;
  showTags = false;
  Select = 'Select Discipline';
  SelectTag = 'Select Tag';
  discipline: any;
  documentType: any;
  filteredCoauthorAndAuthor: Observable<any[]>;
  filteredCoauthorAndAuthorName: any;
  filteredCoAndAuthName: any;
  filteredCoauthor: Observable<any[]>;
  filteredCoauthorName: any;
  coauthors: any = [];
  contetOwnerEmailID: string = '';
  coAuthorResponse: any;
  contentId: number;

  restrictingProgramList: RestrictingProgram[];
  exportAuthorityList: ExportAuthority[];

  disciplineList: WiDropDownList[];
  subDisciplineList: WiDropDownList[];
  WIDisciplineCodeList: WiDisciplineDropDownList[];
  phaseList: WiDropDownList[];
  engineeringOrgList: WiDropDownList[];
  categoryList: CategoryList[];
  disciplineCodeList: DisciplineCodeList[];
  confidentialitiesList: ConfidentialitiesDropDownList[];
  classifiersDropDownList: GetClassifiersDropDownList[];
  filteredClassifers: GetClassifiersDropDownList[] = [];
  revionTypeList: GetRevionType[] = [];
  exportComplianceList: ExportComplianceList[];
  setOfPhasesList: any;
  approvalRequirementsIdList: ApprovalRequirementIdList[];
  tagList: TagList[] = [];
  tagListHirerachy = [];
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  isReadWriteMode: boolean = true;
  hasProperty: any = false;
  aptitle: string;
  @Output() titleOutput = new EventEmitter();
  @Output() updateContentOwnerValue = new EventEmitter();
  @Output() updateRequestAproval = new EventEmitter();
  docID;
  docClassification;
  docStatus;
  phasesNumbers;

  processMapDataModel: ProcessMapDataModel = new ProcessMapDataModel();
  existingProcessMap: ExistingProcessMap = new ExistingProcessMap();
  documentPropertiesForAll: DocumentPropertiesForAll =
    new DocumentPropertiesForAll();
  updatePublishePropertiesForAll: UpdatePublishePropertiesForAll = new UpdatePublishePropertiesForAll();
  processMapDataModelServerReq: ProcessMapDataModelServerReq;
  documentProperties: DocumentProperties = new DocumentProperties();
  documentPropertiesKPack: DocumentPropertiesKPack =
    new DocumentPropertiesKPack();
  swimLanes: SwimLanes[] = [];
  activityBlocks: ActivityBlocks[] = [];
  processMapMeta: ProcessMapMeta[] = [];
  Discipline: string = '';
  disciplineId: number;
  subDisciplineId: number;
  subSubDisciplineId: number;
  subSubSubDisciplineId: number;
  sDisciplineId: any;
  subSDisciplineId: any;
  subSubSDisciplineId: any;
  email: string = '';
  defaultEmail = sessionStorage.getItem('userMail');
  displayName: string = '';
  contentOwner1: any ='';
  temp: string = '';
  assetStatus = ASSET_STATUSES.DRAFT;
  contentStatus: number = 1;
  contentOwnerId:any;
  isUpdateFormForRevision: boolean = false;
  isUpdateFormStatus: boolean = false;
  disableDiscipline: boolean = false;
  isDCEnabled: boolean = true;
  reviseVersion:number;
  checkFlag: number = 0;
  checkFlagChanged: number = 0;
  titleName;
  objTag: object[] = [
    { id: 544, name: 'Flaps', parentId: 18 },
    { id: 349, name: 'Actuation Links & Mechs', parentId: 18 },
  ];

  broadCastMessage: string = 'false';
  private subscription: Subscription;
  //hasChanged: any = false;
  //hasChangedRrogramControl: any = false;
  selectedClassifier: any;
  exportComplianceField = [];
  phaseField = [];
  tagDataMap: any = [];
  phaseModel: PhaseModel = new PhaseModel();
  loadingImg: boolean = true;
  saveAsMapDataModel: SaveAsMapDataModel = new SaveAsMapDataModel();
  tagsField = [];
  tagValues;
  existingTagValue = [];
  mapDatas;
  existingMapsId;
  loggedInUserNationality;
  DisciplineTag = 0;
  tagNameSF = "";
  rcCategoryList: RCCategoryList[];
  revisionTypeListCopy: GetRevionType[] = [];
  @ViewChild('menu') menu: ElementRef;
  @ViewChild('toggleButton') toggleButton: ElementRef;

  @ViewChild('menu1') menu1: ElementRef;
  @ViewChild('toggleButton1') toggleButton1: ElementRef;
  disableSubmitButton: boolean = false;
  allPhaseSelected = false;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private taskstore: Store<any>,
    private profileData: PersistanceService,
    private createDocumentService: CreateDocumentService,
    private activityPageService: ActivityPageService,
    private relatedContentService: RelatedContentService,
    private store: Store<any>,
    private router: Router,
    private ngxService: NgxUiLoaderService,
    private sharedService: SharedService,
    private criteriaGroupPageService: CriteriaGroupPageService,
    private documentView: DocumentViewService,
    private tocService: TocService,
    private titleService: Title,
    private kPacksService: KPacksService,
    private dialog: MatDialog,
    private rservice: RecordsService,
    private processMapService: ProcessMapsService,
    private renderer: Renderer2
  ) {
    super();
    this.sharedService.titleName.subscribe((tname) => {
      this.titleName = tname;
    });
    this.route.params.subscribe((param) => {
      this.id = param['id']
        ? param['id']
        : param['contentId']
          ? param['contentId']
          : '';
    });
    this.getDisplayClassifier = this.getDisplayClassifier.bind(this);

    this.propertiesFormData = this.fb.group({
      contentID: '',
      title:['',[Validators.required,Validators.pattern(/^[^#%\*\:\<\>\?\/\\\|]*$/),]],
      keyword: '',
      phases: '',
      tags: '',
      disciplineCode: '',
      confidentiality: '',
      programControlled: '',
      outsourceable: '',
      contentOwner: '',
      classifier: [''],
      confidentialityLevel: '',
      authors: '',
      exportComplianceTouchPoint: '',
      revisionType: '',
      tpmDate: '',
      restrictingProgram: '',
      exportAuthority: '',
      contentOwnerName: '',
      clockId : ''
    });
    this.loadDropDowndata();
  }
  checkFocusOut(){
    this.isUpdateFormStatus = false;
      this.rservice.UpdateBroadcastMessage('false');
  }


  ngOnChanges(event) {

    if (typeof this.globalData !== 'undefined') {
      this.rservice.UpdateBroadcastMessage('false');
      this.loadDropDowndata();
    }
    //check for any change for saved to saving
    if (this.propertiesFormData) {


      // this.propertiesFormData.valueChanges.subscribe(selectedValue  => {
      //   this.checkFlag = this.checkFlag + 1;
      //   console.log('this.checkFlag',this.checkFlag);
      //   console.log('form value changed');
      //   console.log(selectedValue);
      //   this.checkFlagChanged;
      // })



    this.propertiesFormData.valueChanges

        .pipe(pairwise())
        .subscribe(([prev, next]: [any, any]) => {
          //console.log('PREV1', prev);
          //console.log('NEXT1', next);

          if (typeof next.keyword !== 'undefined') {
            if (typeof prev.keyword !== 'undefined') {
            if ((prev.keyword != next.keyword)) {
              //alert('value changed');
              this.isUpdateFormStatus = true;
              if (this.isUpdateFormStatus == true) {
                this.rservice.UpdateBroadcastMessage('true');
              }
            } else {
              //alert('nochange');
              this.isUpdateFormStatus = false;
              this.rservice.UpdateBroadcastMessage('false');

              if (
                (prev.classifier != next.classifier) || (prev.confidentiality != next.confidentiality)
                || (prev.confidentialityLevel != next.confidentialityLevel) || (prev.contentOwner != next.contentOwner)
                || (prev.contentOwnerName != next.contentOwnerName) || (prev.disciplineCode != next.disciplineCode)
                || (prev.exportAuthority != next.exportAuthority) || (prev.outsourceable != next.outsourceable)
                || (prev.programControlled != next.programControlled) || (prev.restrictingProgram != next.restrictingProgram)
                || (prev.revisionType != next.revisionType) || (prev.title != next.title) || (prev.phases != next.phases)
                || (prev.tags != next.tags) || (prev.exportComplianceTouchPoint != next.exportComplianceTouchPoint)
                //||(prev.relatedContentCategory != next.relatedContentCategory)
              ) {
                //alert('value changed');
                this.isUpdateFormStatus = true;
                if (this.isUpdateFormStatus == true) {
                  this.rservice.UpdateBroadcastMessage('true');
                }
              }
              else {
                //alert('nochange');
                this.isUpdateFormStatus = false;
                this.rservice.UpdateBroadcastMessage('false');
              }

            }

          }
          }
          else{
            if (
              (prev.classifier != next.classifier) || (prev.confidentiality != next.confidentiality)
              || (prev.confidentialityLevel != next.confidentialityLevel) || (prev.contentOwner != next.contentOwner)
              || (prev.contentOwnerName != next.contentOwnerName) || (prev.disciplineCode != next.disciplineCode)
              || (prev.exportAuthority != next.exportAuthority) || (prev.outsourceable != next.outsourceable)
              || (prev.programControlled != next.programControlled) || (prev.restrictingProgram != next.restrictingProgram)
              || (prev.revisionType != next.revisionType) || (prev.title != next.title) || (prev.phases != next.phases)
              || (prev.tags != next.tags) || (prev.exportComplianceTouchPoint != next.exportComplianceTouchPoint)
              //||(prev.relatedContentCategory != next.relatedContentCategory)
            ) {

              //alert('value changed');
              this.isUpdateFormStatus = true;
              if (this.isUpdateFormStatus == true) {
                this.rservice.UpdateBroadcastMessage('true');
              }

            }
            else {
              //alert('nochange');
              this.isUpdateFormStatus = false;
              this.rservice.UpdateBroadcastMessage('false');

            }

          }

        });
      // phases: '',
      // tags: '',
      // exportComplianceTouchPoint: '',
      // tpmDate: '',

      // this.propertiesFormData
      // .valueChanges
      // .pipe(pairwise())
      // .subscribe(([prev, next]: [any, any]) => {
      //   console.log('PREV1', prev);
      //   console.log('NEXT1', next);
      //               if(prev.value == next.value){
      //                 alert('nochange')
      //                 this.rservice.UpdateBroadcastMessage('false');

      //               }
      //               else if (prev.value != next.value){
      //                 this.isUpdateFormStatus = true;
      //                 if (this.isUpdateFormStatus == true) {
      //                   this.rservice.UpdateBroadcastMessage('true');
      //                 }
      //               }
      // });


      // this.propertiesFormData.valueChanges.subscribe((data) => {
      //   this.checkFlag = this.checkFlag + 1;
      //   if (this.checkFlag > 2) {
      //     this.isUpdateFormStatus = true;
      //     if (this.isUpdateFormStatus == true) {
      //       this.rservice.UpdateBroadcastMessage('true');
      //     }
      //   }
      // });
    }
    if (
      event.updatedContentOwner &&
      event.updatedContentOwner.currentValue &&
      event.updatedContentOwner.previousValue !=
      event.updatedContentOwner.currentValue
    ) {
      this.updateContentOwner(event.updatedContentOwner.currentValue);
    }

    if (
      event.globalData &&
      event.globalData.currentValue &&
      event.globalData.previousValue != event.globalData.currentValue
    ) {
      if (!(Object.keys(this.globalData).length === 0)) {
        this.bindContentOwnerAndAuthorName(); // Bind content owner and author name
        //this.loadDropDowndata();
        this.isUpdateFormStatus == false;
        this.checkFlag = 0;
        // this.assetStatus = this.globalData.assetStatusId;
        this.assetStatus = this.globalData.assetStatus;
        this.contentStatus = this.globalData.contentStatus;
        this.contentOwnerId = this.globalData.contentOwnerId;
        this.displayName1 = sessionStorage.getItem('userMail');
        this.createdUser = sessionStorage.getItem('userMail');

        this.subscription = this.createDocumentService
          .getAllMetaDiscipline()
          .subscribe((res) => {
              this.activityTabs = {...this.globalData};
              console.log('this.activityTabs', this.activityTabs);
              this.draftViewData = {...this.globalData};
              this.discipline = res;
              this.disciplineId = this.activityTabs.disciplineId;
              this.subDisciplineId = this.activityTabs.subDisciplineId;
              this.subSubDisciplineId = this.activityTabs.subSubDisciplineId;
              this.subSubSubDisciplineId =
                this.activityTabs.subSubSubDisciplineId;
              this.mapDisciplanPatch();
            setTimeout(() => {
              if ( this.propertiesFormData && this.globalData ) {
                this.patchValueForBinding(this.globalData); // draft view
                this.dataBindForDraftMode(this.globalData); // draft mode
                //if (this.globalData.assetStatusId !== 1) {
                this.dataBindForPublishMode(); // publish mode
                // }
              }
            });
          });
        this.loading = false;
      }
    }

    console.log('GGG', this.globalData)
    if(this.globalData){
      this.reviseVersion = this.globalData.version ? this.globalData.version :'0';
      this.isDCEnabled = this.globalData.isDCEnabled;
      console.log('VVV1', this.reviseVersion)
    // if(this.reviseVersion && this.reviseVersion <= 1 && this.reviseVersion < 1){
    //   this.disableDiscipline = false;
    //   console.log('2',this.disableDiscipline)
    // }
    // else{
    //   this.disableDiscipline =true;
    // }
  }

  }

  ngOnInit(): void {
    console.log(this.globalData, 'globalData')
    this.sharedService.ownerEditBTN.pipe(
      this.unsubsribeOnDestroy
    ).subscribe(EditValue => {
      this.ownerEditBTN = EditValue;
    });
  console.log('ddddddd', this.globalData);
    //this.displayName1 = sessionStorage.getItem('displayName');
    //console.log(' displayName',sessionStorage.getItem('displayName'));

    console.log(' userMail',sessionStorage.getItem('userMail'));
    console.log('2',this.disableDiscipline)
    console.log("getProcessMap-list");
    this.renderer.listen('window', 'click', (e: Event) => {
      if (
        e.target['parentElement'] &&
        e.target['parentElement'].id == 'btnId2'
      ) {
        this.DisciplineTag = 0;
        this.DisciplineTag = this.DisciplineTag + 1;
        this.showDisciplineDropDown = false;
      } else if (
        e.target['parentElement'] &&
        e.target['parentElement'].id == 'btnId'
      ) {
        this.DisciplineTag = 0;
        this.DisciplineTag = this.DisciplineTag - 1;
        this.showDropDown = false;
      }

      if (this.DisciplineTag < 0) {
        if (typeof this.toggleButton !== 'undefined') {
          this.showDropDown = false;
          if (e.target['parentElement'] !== this.toggleButton.nativeElement) {
            if (e.target['parentElement'].className == 'mat-tree cdk-tree') {
              this.showDisciplineDropDown = true;
            } else if (
              e.target['parentElement'].className == 'mat-checkbox-layout'
            ) {
              this.showDisciplineDropDown = true;
            } else if (
              e.target['parentElement'].className == 'mat-button-wrapper' || (e?.target as any)?.classList?.contains('discipline-search')
            ) {
              this.showDisciplineDropDown = true;
            } else {
              this.showDisciplineDropDown = false;
            }
          }
        }
      }
      if (this.DisciplineTag > 0) {
        if (typeof this.toggleButton1 !== 'undefined') {
          this.showDisciplineDropDown = false;
          if (e.target['parentElement'] !== this.toggleButton1.nativeElement) {
            if (e.target['parentElement'].className == 'mat-tree cdk-tree') {
              this.showDropDown = true;
            } else if (
              e.target['parentElement'].className == 'mat-checkbox-layout'
            ) {
              this.showDropDown = true;
            } else if (
              e.target['parentElement'].className == 'mat-button-wrapper'
            ) {
              this.showDropDown = true;
            } else {
              this.showDropDown = false;
            }
          }
        }
      }
    });

    this.filterCoauthorName();
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
    //this.hasChanged = false;
    //this.hasChangedRrogramControl = false;
    if (this.isUpdateFormStatus) {
      this.isUpdateFormStatus = false;
    }
    // initialising  record service for saved-saving button
    this.rservice.broadcast.subscribe(
      (broadCastMessage) => (this.broadCastMessage = broadCastMessage)
    );
    if (typeof this.globalData !== 'undefined') {
      this.rservice.UpdateBroadcastMessage(this.broadCastMessage);
      this.rservice.UpdateBroadcastMessage('false');
    }
    if (this.id && this.id.length > 0) {
      this.isSelectedDicipline = false;
      this.existingMapDataObj = this.sharedService.getExistingMapData()
        ? this.sharedService.getExistingMapData()
        : this.sharedService.getSaveASMapData();
    } else {
      this.isSelectedDicipline = true;
    }
    //this.isSelectedDicipline = false;
    // this.chipData = this.objTag;
    this.TaskItems$ = this.taskstore.select((store) => store.Task.property);
    this.displayName = sessionStorage.getItem('displayName');
    this.titleService.setTitle(`EKS | ${this.contentType}`);
    this.propertiesFormData.statusChanges.subscribe(status => {
      if(status.toLowerCase() == 'invalid') {
        this.updateRequestAproval.emit(true);
      } else {
        this.updateRequestAproval.emit(false);
      }
   });
    if (!this.discipline) {
      this.subscription = this.createDocumentService
        .getAllMetaDiscipline()
        .subscribe((res) => {
          this.discipline = res;
          this.mapDisciplanPatch();
        });
    }

    if (this.id && this.id.length > 0) {
      this.titleService.setTitle(`EKS | ${this.contentType} | ${this.id}`);
    }

    this.propertiesFormData.patchValue({
      authors: this.displayName,
    });
    if( this.contentType && !this.id) {
      this.contentType == 'AP' ? this.propertiesFormData.addControl('approvalRequirementsId', this.fb.control('')) :  this.propertiesFormData.addControl('relatedContentCategory', this.fb.control(''));
    }
    if(this.propertiesFormData && this.globalData) {
      this.patchValueForBinding(this.globalData); // draft view old
      this.bindClassifiersDropDownValue();
      this.dataBindForDraftMode(this.globalData); // draft mode
      //if (this.globalData.assetStatusId !== 1) {
      this.dataBindForPublishMode(); // publish mode
      //}
    }
    //this.email = sessionStorage.getItem('userMail');
  }


  dataBindForDraftMode(res: any) {
    //console.log('res',res);
    this.displayName1 = sessionStorage.getItem('userMail');
    this.createdUser = res.createdUser;
    this.contentOwner1 = res.contentOwnerId;
    //console.log(' contentType. in draft',this.contentType);
    //console.log(' globaldata.contentType in draft',this.globalData.contentType);
    if (typeof this.globalData !== 'undefined') {
      this.rservice.UpdateBroadcastMessage('false');
    }
    //this.displayName = sessionStorage.getItem('displayName');
    this.displayName = res.author;
    this.draftViewData = this.draftViewData || { ...this.globalData };
    this.draftViewData.contentId = res['contentId'] ? res['contentId'] : '';
    this.draftViewData.title = res['title'] ? res['title'].toString() : '';
    this.draftViewData.keyword = res['keyword'] || res['keywords'] || '';
    this.draftViewData.classifierId = res['classifierId']
      ? res['classifierId']
      : this.publisheClassifier;
    this.draftViewData.contentPhase = res['contentPhase']
      ? res['contentPhase']
      : '';
    this.draftViewData.disciplineCodeId = res['disciplineCodeId']
      ? res['disciplineCodeId']
      : '';
    this.draftViewData.contentExportCompliance = res['contentExportCompliance']
      ? res['contentExportCompliance']
      : '';
    this.draftViewData.outsourceable =
      res['outsourceable'] &&
        (res['outsourceable'] == true || res['outsourceable'] == 'Yes')
        ? true
        : false;
    this.draftViewData.confidentiality =
      res['confidentiality'] &&
        (res['confidentiality'] == true || res['confidentiality'] == 'Yes')
        ? true
        : false;
    this.draftViewData.programControlled =
      res['programControlled'] &&
        (res['programControlled'] == true || res['programControlled'] == 'Yes')
        ? true
        : false;
    this.draftViewData.confidentialityId = res['confidentialityId']
      ? res['confidentialityId']
      : '';
    this.draftViewData.controllingProgramId = res['controllingProgramId']
      ? res['controllingProgramId']
      : '';
    this.draftViewData.exportAuthorityId = res['exportAuthorityId']
      ? res['exportAuthorityId']
      : '';
    // this.draftViewData.revisionTypeId = res['revisionTypeId']
    //   ? res['revisionTypeId']
    //   : '';
    this.isProgramControlled =
      res['programControlled'] == true || res['programControlled'] == 'Yes'
        ? true
        : false;
    this.isOutsourceable =
      res['outsourceable'] == true || res['outsourceable'] == 'Yes'
        ? true
        : false;
    this.isConfidentiality =
      res['confidentiality'] == true || res['confidentiality'] == 'Yes'
        ? true
        : false;
    this.masterFilterData.push(this.draftViewData.keyword);
    this.propertiesFormData.patchValue({
      contentID: this.draftViewData.contentId,
      title: this.draftViewData.title,
      keyword: this.draftViewData.keyword,
      classifier: this.draftViewData.classifierId,
      phases: this.draftViewData.contentPhase,
      disciplineCode: res['disciplineCode'] ? res['disciplineCode'] : this.draftViewData.disciplineCodeId,
      confidentiality: this.draftViewData.confidentiality,
      programControlled: this.draftViewData.programControlled,
      outsourceable: this.draftViewData.outsourceable,
      contentOwner: this.filteredCoAndAuthName
        ? this.filteredCoAndAuthName
        : res['contentOwnerId']
          ? res['contentOwnerId']
          : '',
      confidentialityLevel: this.draftViewData.confidentialityId,
      authors: res['author'] ? res['author'] : sessionStorage.getItem('displayName'),
      exportComplianceTouchPoint: this.draftViewData.contentExportCompliance,
      //revisionType: this.draftViewData.revisionTypeId,
      restrictingProgram: this.draftViewData.controllingProgramId,
      exportAuthority: this.draftViewData.exportAuthorityId,
    });
    this.allPhaseSelected = this.draftViewData.contentPhase.length === this.setOfPhasesList.length;

    // this.contentOwner1 = this.propertiesFormData.patchValue({ contentOwner: this.filteredCoAndAuthName
    //   ? this.filteredCoAndAuthName
    //   : res['contentOwnerId']
    //     ? res['contentOwnerId']
    //     : '',
    //    });
       //console.log(' content owner in draft',this.contentOwner1);
       //console.log(' GGG', this.globalData)

      // console.log(' displayName1',this.displayName1);
      // console.log(' contentOwner1',this.contentOwner1);

  }

  removeDisciplineChip1(keyword) {
    this.keyword = '';

  }

  // initialising  messageHandlerKeyword method for input changes through behavior subject
  messageHandlerKeyword(input: any) {
    // if(event.keyCode === 13) {
    // console.log('--- .value',event.keyCode);
    // this.keyword = input.value;
    // }
    // else{
    //   this.keyword = input.value;
    // }
    this.keyword = input.value;

    if (typeof this.globalData !== 'undefined') {
      this.activityTabs.keyword = this.propertiesFormData.controls.keyword.value;
    }

    if (this.keyword && this.keyword.length) {
      this.masterFilterData.push(this.keyword);
      this.edpendData = 1;
      let tempData = JSON.parse(JSON.stringify(this.masterFilterData));
      // tempData.map((node) => {
      //   node['expend'] = true;
      //   node.children = node.children.filter((val) => {
      //     return val.name.toLowerCase().includes(this.keyword.toLowerCase());
      //   });
      // });
    //   console.log(typeof tempData);
    //   if(typeof tempData === 'string') {
    //     console.log(typeof tempData);
    // }

      // tempData.forEach((elem) => {
      //    elem.filter((val) => {
      //     return val.toLowerCase().includes(this.keyword.toLowerCase());
      //   });
      // });

      tempData.forEach((elem) => {
        //elem.filter((val) => {
         return elem.toLowerCase().includes(this.keyword.toLowerCase());
      // });
     });

      this.filterData = tempData.filter((e) => {
        return e.length;
      });
    } else {
      this.edpendData = 2;
      this.filterData = [...this.masterFilterData];
    }
  }

  // initialising  messageHandlerContentOwner method for input changes through behavior subject
  messageHandlerContentOwner(val: any) {
    if (typeof this.globalData !== 'undefined') {
      this.activityTabs.contentOwnerId =
        this.propertiesFormData.controls.contentOwner.value;
    }
  }

  // initialising  onChangeNewDisciplineCode method for dropdown changes through behavior subject
  onChangeNewDisciplineCode(input: any) {
    if (typeof this.globalData !== 'undefined') {
      this.activityTabs.disciplineCodeId =
        this.propertiesFormData.controls.disciplineCode.value;
      this.draftViewData.disciplineCodeId =
        this.propertiesFormData.controls.disciplineCode.value;
    }
  }

  // initialising  onChangePhase method for dropdown changes
  onChangePhase(input: any) {
    if (typeof this.globalData !== 'undefined') {
      this.activityTabs.contentPhase =
        this.propertiesFormData.controls.phases.value;
      this.draftViewData.contentPhase =
        this.propertiesFormData.controls.phases.value;
      this.globalData.contentPhase =
        this.propertiesFormData.controls.phases.value;
    }
  }

  // initialising  onChangeNewClassifierCode method for dropdown changes through behavior subject
  onChangeNewClassifierCode(input: any) {
    if (typeof this.globalData !== 'undefined') {
      this.activityTabs.classifierId =
        this.propertiesFormData.controls.classifier.value;
    }
  }

  onChangeNewRevisionType(input: any) {
    if (typeof this.globalData !== 'undefined') {
      this.activityTabs.revisionTypeId =
        this.propertiesFormData.controls.revisionType.value;
        this.globalData.revisionTypeId = this.activityTabs.revisionTypeId;
    }
    if(input) {
      this.disableSubmitButton = false;
    }
  }

  onSearchChangeTitle(val: any) {
    if (typeof this.globalData !== 'undefined') {
      this.activityTabs.title = this.propertiesFormData.controls.title.value;
      this.draftViewData.title = this.propertiesFormData.controls.title.value;
    }
    this.processMapDataModel.editable = true;
  }

  mapDisciplanPatch() {
    // this.discipline;
    if (this.existingMapDataObj) {
      this.discipline.forEach((node) => {
        if (node.id == this.existingMapDataObj.disciplineId) {
          this.checkAllParentsSelectionForBind();
        }
      });

      this.disciplineId = this.existingMapDataObj['disciplineId'];
      this.subDisciplineId = this.existingMapDataObj['subDisciplineId'];
      this.subSubDisciplineId = this.existingMapDataObj['subSubDisciplineId'];
      this.subSubSubDisciplineId =
        this.existingMapDataObj['subSubSubDisciplineId'];
      this.checkAllParentsSelectionForBind();
      let disciplineData =
        this.SubDisciplineIdData +
        ' > ' +
        this.SubSubDisciplineIdData +
        ' > ' +
        this.SubSubSubDisciplineIdData;
      this.nodePath = disciplineData;
      let disciplineObj: object = {};
      disciplineObj['disciplineId'] =
        this.existingMapDataObj['subDisciplineId'];
      disciplineObj['nodePath'] = disciplineData;
      disciplineObj['subDisciplineId'] =
        this.existingMapDataObj['subSubDisciplineId'];
      disciplineObj['subSubDisciplineId'] =
        this.existingMapDataObj['subSubSubDisciplineId'];
      this.selectedDicipline = disciplineObj;
    }
  }

  setTitle(title) {
    this.titleOutput.emit(title);
  }

  toggleDiscipline() {
    this.show = !this.show;
  }
  toggleTags() {
    this.showTags = !this.showTags;
  }

  setUserData(email, currentDateTime) {
    if (this.id && this.id.length > 0) this.activityPageId = this.id;

    if (this.contentType == 'AP') {
      this.contentTypeValue = 6;
    } else if (this.contentType == 'WI') {
      this.contentTypeValue = 1;
    } else if (this.contentType == 'DS') {
      this.contentTypeValue = 3;
    } else if (this.contentType == 'GB') {
      this.contentTypeValue = 2;
    } else if (this.contentType == 'CG') {
      this.contentTypeValue = 10;
    } else if (this.contentType == 'ToC' || this.contentType == 'TOC') {
      this.contentTypeValue = 11;
    } else if (this.contentType == 'SF') {
      this.contentTypeValue = 13;
      //console.log("Maps Value Logged ", this.docStatus, this.contentType, this.contentTypeValue);
    } else if (this.contentType == 'SP') {
      this.contentTypeValue = 14;
    } else {
      this.documentType = '2';
    }
  }
  loadDropDowndata() {
    this.subscription = this.store.select(selectRestrictingProgramList)
      .subscribe((res) => {
        this.restrictingProgramList = res;
        this.globalData && this.bindRestrictProgramValue();
      });

    this.subscription = this.store.select(selectExportAuthorityList)
      .subscribe((res) => {
        this.getUserInfo();
        this.exportAuthorityList =
          this.loggedInUserNationality?.toLowerCase() === 'canada'
            ? res.filter((x) => x.exportAuthorityCode === 'CA')
            : this.loggedInUserNationality?.toLowerCase() === 'foreign' ||
              this.loggedInUserNationality === 'NR'
              ? res.filter((x) => x.exportAuthorityCode === 'NR')
              : res;
        this.globalData && this.bindExportAuthorityValue();
      });

    this.subscription = this.store.select(selectWiDropdownList('GetAllSubDiscipline'))
      .subscribe((res) => {
        this.subDisciplineList = res;
      });

    this.subscription = this.store.select(selectWiDropdownList('GetAllPhase'))
      .subscribe((res) => {
        this.phaseList = res;
      });

    this.subscription = this.store.select(selectWiDropdownList('GetAllEngineeringOrg'))
      .subscribe((res) => {
        this.engineeringOrgList = res;
      });

    this.subscription = this.store.select(selectConfidentialitiesList)
      .subscribe((res) => {
        this.confidentialitiesList = res;
        this.bindConfidentialityValue();
      });

    this.subscription = this.store.select(selectSetOfPhasesList).subscribe((res) => {
        this.setOfPhasesList = res;
        this.globalData && this.bindSetOfPhaseList();
      });

    this.subscription = this.store.select(selectApprovalRequirement)
      .subscribe((res) => {
        this.approvalRequirementsIdList = res;
        this.globalData && this.bindApprovalRequirementValue();
      });

    // This api block discused by Jone
    /* this.subscription = this.createDocumentService
       .getExportComplianceList()
       .subscribe((res) => {
         this.exportComplianceList = res;
       });*/

    this.subscription = this.store.select(selectClassifiersList)
      .subscribe((res) => {
        let classifiersList = Object.assign([], res);

        this.classifiersDropDownList = classifiersList.sort((a, b) => {
          if ( a.lastName < b.lastName ) {
            return -1;
          }
          if ( a.lastName > b.lastName ) {
            return 1;
          }
        });
        this.filteredClassifers = this.classifiersDropDownList;
        this.classifierDropDownList.emit(this.classifiersDropDownList);
        this.globalData && this.bindClassifiersDropDownValue();
      });

    this.subscription = this.store.select(selectRevisionTypeList)
      .subscribe((res) => {
        setTimeout(() => {
          // const revisionTypeIdRemove = 2;
          // const filteredRevisionId = res.filter((item) => item.revisionTypeId !== revisionTypeIdRemove);
          const filteredRevisionId = res;
          this.revisionTypeListCopy = filteredRevisionId;
          this.globalData && this.bindRevisionTypeValue();
        });
      });
    this.subscription = this.store.select(selectCategoryList)
      .subscribe((res) => {
        this.categoryList = res;
      });

    this.subscription = this.store.select(selectDisciplineCodeList)
      .subscribe((res) => {
        this.disciplineCodeList = res;
      });

    this.subscription = this.store
      .select(selectMetaDataDisciplineCode)
      .subscribe((res) => {
        this.WIDisciplineCodeList = res;
      });

    this.subscription = this.activityPageService
      .getTagList()
      .subscribe((res) => {
        this.tagList = res;
        this.tagListHirerachy = res;
        this.bindContentTagValue();
      });

    this.subscription = this.store.select(selectAllSetOfCategories)
      .subscribe((res) => {
        this.rcCategoryList = res;
        this.globalData && this.bindRelatedContentValue();
      });
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.tags.push({ name: value.trim() });
    }

    if (input) {
      input.value = '';
    }
  }

  remove(fruit: Tag): void {
    const index = this.tags.indexOf(fruit);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }
  outsourcable(value) {
    this.propertiesFormData.patchValue({
      Outsourceable: value,
    });
  }

  filterCoauthorName() {
    this.store.select(selectUserList).subscribe((response) => {
      this.filteredCoauthorName = response;
    });
  }

  filterCoauthor(name) {
    if (name && name.length >= 3) {
      this.filteredCoauthor = this.filteredCoauthorName && this.filteredCoauthorName.filter((node) => {
        return new RegExp(name.toLocaleLowerCase()).test(
          node.displayName.toLocaleLowerCase()
        );
      });
    } else {
      this.filteredCoauthor = null;
    }
  }

  filterAuthor(name) {
    this.filteredCoauthorAndAuthor = this.filteredCoauthorName.filter(
      (node) => {
        if (
          new RegExp(name.toLocaleLowerCase()).test(
            node.email.toLocaleLowerCase()
          )
        ) {
          this.filteredCoauthorAndAuthorName = node.displayName;
        }
        return this.filteredCoauthorAndAuthorName;
      }
    );
  }

  filterCOAuthor(name) {
    this.filteredCoauthorAndAuthor = this.filteredCoauthorName.filter(
      (node) => {
        if (
          new RegExp(name.toLocaleLowerCase()).test(
            node.email.toLocaleLowerCase()
          )
        ) {
          this.filteredCoAndAuthName = node.displayName;
        }
        return this.filteredCoAndAuthName;
      }
    );
  }

  loadServices() {
    if (typeof this.globalData !== 'undefined') {
      this.filteredCoauthor =
        this.propertiesFormData.controls.Authors.valueChanges;
    }
    this.filteredCoauthor.pipe(
      startWith(''),
      map((coauthor) =>
        coauthor ? this.filterCoauthor(coauthor) : this.coauthors.slice()
      )
    );
  }

  equals(objOne, objTwo) {
    if (typeof objOne !== 'undefined' && typeof objTwo !== 'undefined') {
      return objOne.id === objTwo.id;
    }
  }

  displayCoAuthor(coAuthor?: string) {
    return coAuthor ? coAuthor : '';
  }

  setNodeValues(value) {
    if ( this.activityDisciplineCode ) {
      this.activityDisciplineCode = null;
      return;
    }
    if(this.isDCEnabled == true){
    this.createDocumentService.getDisciplineCode(value).subscribe((res) => {
      this.selectedDisciplineCode = res;
      //this.logNode();
      // this.propertiesFormData.controls.disciplineCode.value = this.selectedDisciplineCode;
      this.propertiesFormData.patchValue({
        disciplineCode: this.selectedDisciplineCode.code,
      });
    });
  }
  }

  // logNode() {
  //   this.rservice.UpdateBroadcastMessage('true');
  // }
  setNodeValuesForTags(value) {
    this.tagDataObj = new TagData();

    this.tagDataObj.nodePath = value.nodePath;
    this.tagDataObj.disciplineId = value.disciplineId;
    this.tagDataObj.subDisciplineId = value.subDisciplineId;
    this.tagDataObj.subSubDisciplineId = value.subSubDisciplineId;

    let flag = this.tagDataList.some((tag) => tag.nodePath === value.nodePath);
    if (flag) {
      this.tagDataList = this.tagDataList.filter(
        (tag) => tag.nodePath !== value.nodePath
      );
    } else {
      this.tagDataList.push(this.tagDataObj);
    }

    let nodePathArry: string[] = [];
    this.nodePathTag = ' ';
    this.nodePathDiscipline = ' ';
    this.tagDataList.forEach((element) => {
      if (element) {
        nodePathArry.push(element.nodePath);
      }
    });
    this.nodePathTag = nodePathArry.join(', ');

    this.nodePathTag = this.nodePathTag.substring(
      0,
      this.nodePathTag.length - 1
    );

    //this.logNode();
  }

  hideDiscipline(hide) {
    if (hide) {
      this.hideDiv = true;
    } else {
      this.hideDiv = false;
    }
  }

  dataManupulationPOST() {
    let exportCompliances;
    let PhasesValues;
    let contentTagValues;
    let contentTagData;
    this.phaseField = [];
    this.exportComplianceField = [];
    this.tagsField = [];
    //console.log(this.tagValues, "this.tagValues");
    exportCompliances =
      this.propertiesFormData.controls.exportComplianceTouchPoint?.value;
    PhasesValues = this.propertiesFormData.controls.phases?.value;
    contentTagValues = this.existingTagValue;
    //console.log(contentTagValues);
    if (this.mapDatas) {
      //console.log("mapDatas Available");
      contentTagData = this.tagValues;
    } else {
      //console.log("mapDatas Not Found");
      contentTagData = this.tagValues;
    }

    if (exportCompliances && exportCompliances.length > 0) {
      exportCompliances?.forEach((element) => {
        this.exportComplianceField.push({
          typeId: 4,
          exportComplianceId: element,
        });
      });
    }

    PhasesValues?.forEach((ele) => {
      this.phaseField.push({
        typeId: 4,
        phaseId: ele,
      });
    });

    contentTagValues?.forEach((ele) => {
      this.tagsField.push({
        typeId: 4,
        tagId: ele,
      });
    });
  }
  onSubmitPublished(){
    this.disableSubmitButton = true;
    this.rservice.UpdateBroadcastMessage('false');
    this.loading = true;
    this.propertiesFormDataSet();
    const contentTags = this.documentPropertiesForAll?.contentTag?.length ? this.documentPropertiesForAll?.contentTag : this.documentPropertiesForAll?.contentTags;

    this.updatePublishePropertiesForAll.id = this.globalData.id;
    this.updatePublishePropertiesForAll.contentId = this.documentPropertiesForAll.contentId;
    this.updatePublishePropertiesForAll.author = this.documentPropertiesForAll.author;
    this.updatePublishePropertiesForAll.contentOwner = this.documentPropertiesForAll.contentOwnerId;
    this.updatePublishePropertiesForAll.assetPhase = this.documentPropertiesForAll.contentPhase;
    this.updatePublishePropertiesForAll.assetTag = contentTags;
    this.updatePublishePropertiesForAll.disciplineId = this.documentPropertiesForAll.disciplineId;
    this.updatePublishePropertiesForAll.assetKey = this.documentPropertiesForAll.keyword;
    this.updatePublishePropertiesForAll.SourceFileUrl = this.globalData.sourceDocUrl ? this.globalData.sourceDocUrl :'';
    this.updatePublishePropertiesForAll.title = this.documentPropertiesForAll.title;
    this.updatePublishePropertiesForAll.version = this.globalData.version || this.globalData.versionNumber || sessionStorage.getItem('version');
    this.updatePublishePropertiesForAll.LastUpdateUser = sessionStorage.getItem('userMail');
    this.updatePublishePropertiesForAll.setOfCategories = this.propertiesFormData.value.relatedContentCategory;

    // const newObject = Object.assign(this.updatePublishePropertiesForAll, this.documentPropertiesForAll);
    // console.log(newObject);
    this.loading = true;
    this.ngxService.startBackground();
    this.activityPageService
    .UpdatePublishedContentProperties(this.updatePublishePropertiesForAll)
    .subscribe((data) => {
      this.globalData.title = this.propertiesFormData.controls.title.value;
      const updateValue = {
        contentOwnerId: this.updatePublishePropertiesForAll.contentOwner,
        revisionTypeId: this.documentPropertiesForAll.revisionTypeId,
        title: this.propertiesFormData.controls.title.value
      }
      this.updateContentOwnerValue.emit(JSON.stringify(updateValue));
      this.dataBindForPublishMode(); // publish mode
      // this.globalData.approvalRequirementsId = this.updatePublishePropertiesForAll.approvalRequirementsId;
      this.ngxService.stopBackground();
      this.loading = false;
      this.disableSubmitButton = false;
      this.sharedService.ownerCanEdit(false);
      this.filterTagData()
      console.log('this.globalData',this.globalData);
      this.ngxService.stopBackground();
    }, ()=>{
      this.loading = false;
      this.ngxService.stopBackground();
    })
    console.log('this.globalData',this.globalData);
  }

  onSubmit() {

    this.disableSubmitButton = true;
    this.rservice.UpdateBroadcastMessage('false');
    // this.dataBindForPublishMode();
    this.loading = true;
    this.ngxService.startBackground();
    //this.dataManupulationPOST();
    if (this.contentType == 'AP') {
      this.propertiesFormDataSet();
      this.bindApprovalRequirementDropdownValue('bindApprovalId');
      if (this.id && this.id.length > 0) {
        this.documentPropertiesForAll.AssetTypeId = this.contentTypeValue;
        this.documentPropertiesForAll.id =
          this.globalData && this.globalData.id > 0
            ? this.globalData.id
            : this.id;
        this.activityPageService
          .UpdatePropertiesInActivityPage(this.documentPropertiesForAll)
          .subscribe((data) => {
            const updateValue = {
              contentOwnerId: this.documentPropertiesForAll.contentOwnerId,
              revisionTypeId: this.documentPropertiesForAll.revisionTypeId
            }
            this.updateContentOwnerValue.emit(JSON.stringify(updateValue));
            this.globalData.approvalRequirementsId = this.documentPropertiesForAll.approvalRequirementsId;
            this.filterTagData();
            this.globalData.title = this.propertiesFormData.controls.title.value;
            this.updateGlobalData(data);
            this.ngxService.stopBackground();
            this.loading = false;
            this.disableSubmitButton = false;
          });
      } else {
        this.activityPageService
          .CreateNewActivityPage(this.documentPropertiesForAll)
          .subscribe((data) => {
            var res = JSON.parse(JSON.stringify(data));
            this.activityPageId = res.id;
            this.nextTab.emit(true);
            this.router.navigate(['/activity-page/' + this.activityPageId]);
            this.ngxService.stopBackground();
            this.loading = false;
            this.disableSubmitButton = false;
            this.store.dispatch(ContentDataActions.resetContentData());
          });
      }
    } else if (
      this.contentType == 'WI' ||
      this.contentType == 'GB' ||
      this.contentType == 'DS'
    ) {
      //  this.loading = true;
      console.log('data111',this.documentPropertiesForAll);
      this.propertiesFormDataSet();
      //console.log("WI GB DS this.globalData.id", this.globalData.id);
      if (this.contentType == 'WI') {
        this.documentPropertiesForAll.documentType = 1;
      } else if (this.contentType == 'GB') {
        this.documentPropertiesForAll.documentType = 2;
      } else if (this.contentType == 'DS') {
        this.documentPropertiesForAll.documentType = 3;
      }
      this.documentPropertiesForAll.AADid = sessionStorage.getItem('AADid');
      if (this.id > 0 || this.id.length > 0) {
        console.log('data',this.documentPropertiesForAll);
        let newfield = { processInstId: this.globalData.processInstId, customId: this.globalData.customId };
        let documentProperties = this.documentPropertiesForAll;
        this.documentPropertiesForAll = {...documentProperties, ...newfield}

        this.documentPropertiesForAll.versionNumber = this.globalData.versionNumber || '';
        this.documentPropertiesForAll.id =
          this.globalData && this.globalData.id > 0
            ? this.globalData.id
            : this.id;
            console.log('data222',this.documentPropertiesForAll);
        this.createDocumentService
          .UpdateWordBasedPropertiesInfo(
            JSON.stringify(this.documentPropertiesForAll)
          )
          .subscribe((data) => {
            // this.globalData = JSON.parse(JSON.stringify(data));
            // this.activityTabs = this.globalData;
            // this.dataBindForPublishMode(); // publish mode
            const updateValue = {
              contentOwnerId: this.documentPropertiesForAll.contentOwnerId,
              revisionTypeId: this.documentPropertiesForAll.revisionTypeId
            }
            this.globalData.title = this.propertiesFormData.controls.title.value;
            this.updateGlobalData(data);
            this.updateContentOwnerValue.emit(JSON.stringify(updateValue));
            this.filterTagData();
            this.ngxService.stopBackground();
            this.loading = false;
            this.disableSubmitButton = false;
          }),
          (error) => {
            this.loading = false;
            this.disableSubmitButton = false;
          };
      } else {
        //this.propertiesFormDataSet();
        this.createDocumentService
          .CreateNewWorkInstruction(
            JSON.stringify(this.documentPropertiesForAll)
          )
          .subscribe((data) => {
            var res = JSON.parse(JSON.stringify(data));
            sessionStorage.setItem('ResponseData', res);
            let documentType =
              res.documentType == 1
                ? 'WI'
                : res.documentType == 2
                  ? 'GB'
                  : res.documentType == 3
                    ? 'DS'
                    : '';
            let docUrl = res.sourceDocUrl;
            sessionStorage.setItem('docUrl', docUrl);
            if (docUrl != '') {
              var url = 'ms-word:ofe|u|' + docUrl;
              window.location.href = url;
            }
            this.router.navigate([
              documentPath.draftViewPath,
              documentType,
              res.id,
            ], {
              queryParams: {
                contentType: this.contentType
              }
            });
            this.loading = false;
            this.ngxService.stopBackground();
            this.disableSubmitButton = false;
            this.store.dispatch(ContentDataActions.resetContentData());
          }),
          (error) => {
            this.loading = false;
            this.disableSubmitButton = false;
          };
      }
    } else if (this.contentType == 'KP') {
      this.propertiesFormDataSet();
      //console.log("KP this.globalData", this.globalData.knowledgePackId);
      if (this.id > 0 || this.id.length > 0) {
        this.documentPropertiesForAll.AssetTypeId = this.contentTypeValue;
        this.documentPropertiesForAll.knowledgePackId =
          this.globalData && this.globalData.knowledgePackId > 0
            ? this.globalData.knowledgePackId
            : this.id;
        this.documentPropertiesForAll['purposeTitle'] = this.globalData.purposeTitle;
        this.documentPropertiesForAll['purposeDescription'] = this.globalData.purposeDescription;
        this.kPacksService
          .UpdatePropertiesInKP(this.documentPropertiesForAll)
          .subscribe((data) => {
            // this.globalData = JSON.parse(JSON.stringify(data));
            // this.activityTabs = this.globalData;
            // this.dataBindForPublishMode(); // publish mode
            const updateValue = {
              contentOwnerId: this.documentPropertiesForAll.contentOwnerId,
              revisionTypeId: this.documentPropertiesForAll.revisionTypeId,
              title: this.propertiesFormData.controls.title.value
            }
            this.updateContentOwnerValue.emit(JSON.stringify(updateValue));
            this.filterTagData();
            this.ngxService.stopBackground();
            this.loading = false;
            this.disableSubmitButton = false;
          });
      } else {
        sessionStorage.setItem('KPTitle', this.documentPropertiesForAll.title);
        this.kPacksService
          .CreateNewKPacks(this.documentPropertiesForAll)
          .subscribe((data) => {
            var res = JSON.parse(JSON.stringify(data));
            this.kPackId = res.knowledgePackId;
            this.nextTab.emit(true);
            this.router.navigate(['/k-pack/' + this.kPackId]);
            this.loading = false;
            this.ngxService.stopBackground();
            this.disableSubmitButton = false;
            this.store.dispatch(ContentDataActions.resetContentData());
          });
      }
    } else if (this.contentType == 'CG') {
      // this.loading = true;
      //console.log("CG this.globalData.id", this.globalData.id);
      this.propertiesFormDataSet();
      if (this.id > 0 || this.id.length > 0) {
        this.documentPropertiesForAll.contentTypeId = this.contentTypeValue;
        this.documentPropertiesForAll.AssetTypeId =
          this.globalData.assetStatusId;
        this.documentPropertiesForAll.id =
          this.globalData && this.globalData.id > 0
            ? this.globalData.id
            : this.id;
        this.criteriaGroupPageService
          .UpdatePropertiesInCriteriaGroup(
            JSON.stringify(this.documentPropertiesForAll)
          )
          .subscribe((data) => {
            if (data) {
              this.hideSuccessMessage = true;
              this.FadeOutSuccessMsg();
              const updateValue = {
                contentOwnerId: this.documentPropertiesForAll.contentOwnerId,
                revisionTypeId: this.documentPropertiesForAll.revisionTypeId
              }
              this.updateContentOwnerValue.emit(JSON.stringify(updateValue));
              this.filterTagData();
            }
            this.globalData.title = this.propertiesFormData.controls.title.value;
            this.updateGlobalData(data);
            this.loading = false;
            this.ngxService.stopBackground();
            this.disableSubmitButton = false;
          });
      } else {
        this.criteriaGroupPageService
          .CreateNewProperties(JSON.stringify(this.documentPropertiesForAll))
          .subscribe((data) => {
            var res = JSON.parse(JSON.stringify(data));
            this.router.navigate(['/criteria-group/' + res.id]);
            this.nextTab.emit(true);
            this.loading = false;
            this.ngxService.stopBackground();
            this.disableSubmitButton = false;
            this.store.dispatch(ContentDataActions.resetContentData());
          });
      }
    } else if (this.contentType == 'ToC' || this.contentType == 'TOC') {
      this.propertiesFormDataSet();
      //console.log("TOC this.globalData.id", this.globalData.id);
      if (this.id > 0 || this.id.length > 0) {
        this.documentPropertiesForAll.contentTypeId = this.contentTypeValue;
        this.documentPropertiesForAll.id =
          this.globalData && this.globalData.id > 0
            ? this.globalData.id
            : this.id;
        this.tocService
          .UpdatePropertiesToc(this.documentPropertiesForAll)
          .subscribe((data) => {
            // this.globalData = JSON.parse(JSON.stringify(data));
            // this.activityTabs = this.globalData;
            // this.dataBindForPublishMode(); // publish mode
            const updateValue = {
              contentOwnerId: this.documentPropertiesForAll.contentOwnerId,
              revisionTypeId: this.documentPropertiesForAll.revisionTypeId
            }
            this.updateContentOwnerValue.emit(JSON.stringify(updateValue));
            this.filterTagData();
            this.globalData.title = this.propertiesFormData.controls.title.value;
            this.updateGlobalData(data);
            this.nextTab.emit(0);
            this.loading = false;
            this.ngxService.stopBackground();
            this.disableSubmitButton = false;
          });
      } else {
        this.tocService
          .addTableOfContent(JSON.stringify(this.documentPropertiesForAll))
          .subscribe((data) => {
            var res = JSON.parse(JSON.stringify(data));
            this.nextTab.emit(true);
            this.router.navigate(['/toc/' + res.id]);
            this.loading = false;
            this.ngxService.stopBackground();
            this.disableSubmitButton = false;
            this.store.dispatch(ContentDataActions.resetContentData());
          });
      }
    } else if (this.contentType == 'SF') {
      //this.propertiesFormDataSet();
      // if (this.id > 0) {
      //   this.existingMapDataObj = this.sharedService.getExistingMapData() ? this.sharedService.getExistingMapData() : this.sharedService.getSaveASMapData();
      // }
      let ContentTagData = [];
      if (this.chipData && this.chipData.length) {
        this.chipData.forEach((node) => {
          ContentTagData.push(node.id);
        });
      }
      if (this.id && this.id > 0) {
        this.loading = true;
        let existingStepfloeData = this.globalData;
        this.loading = true;
        existingStepfloeData.title =
          this.propertiesFormData.controls.title.value;
        existingStepfloeData.disciplineId = this.disciplineId;
        existingStepfloeData.disciplineCode =
          this.propertiesFormData.controls.disciplineCode.value;
        existingStepfloeData.contentOwnerId = this.contetOwnerEmailID
          ? this.contetOwnerEmailID
          : this.propertiesFormData.controls.contentOwner.value
            ? this.propertiesFormData.controls.contentOwner.value
            : '';

        existingStepfloeData.classifierId = parseInt(
          this.propertiesFormData.controls.classifier.value
        );
        existingStepfloeData.programControlled =
          this.propertiesFormData.controls.programControlled.value;
        // existingStepfloeData.outsourceable = this.propertiesFormData.controls.outsourceable.value;
        existingStepfloeData.outsourceable =
          sessionStorage.getItem('EKSContractor') == 'true'
            ? 'true'
            : this.propertiesFormData.controls.outsourceable.value == 'Yes'
              ? true
              : this.propertiesFormData.controls.outsourceable.value == 'No'
                ? false
                : this.propertiesFormData.controls.outsourceable.value != ''
                  ? this.propertiesFormData.controls.outsourceable.value
                  : 'false';

        existingStepfloeData.revisionTypeId = parseInt(
          this.propertiesFormData.controls.revisionType.value
        );
        existingStepfloeData.subDisciplineId = this.subDisciplineId;
        existingStepfloeData.subSubDisciplineId = this.subSubDisciplineId;
        existingStepfloeData.subSubSubDisciplineId = this.subSubSubDisciplineId;
        existingStepfloeData.createdUser = this.email || this.defaultEmail;

        existingStepfloeData.confidentiality =
          this.propertiesFormData.controls.confidentiality.value;

        existingStepfloeData.confidentialityId =
          this.propertiesFormData.controls?.confidentialityLevel?.value;
        existingStepfloeData.tpmdate =
          this.propertiesFormData.controls.tpmDate?.value;
        existingStepfloeData.exportAuthorityId =
          this.propertiesFormData.controls.exportAuthority.value;
        existingStepfloeData.controllingProgramId =
          this.propertiesFormData.controls?.restrictingProgram.value;
        existingStepfloeData.keywords = this.propertiesFormData.controls.keyword.value;
        existingStepfloeData.keyword = this.propertiesFormData.controls.keyword.value;


        if (
          existingStepfloeData.swimLanes &&
          existingStepfloeData.swimLanes.length
        ) {
          // existingStepfloeData.id = this.existingMapDataObj.id;
          // existingStepfloeData.swimLanes = this.globalData.swimLanes;
          this.createDocumentService
            //.createfromExistingProcessMap(JSON.stringify(this.existingProcessMap))
            .UpdateMap(JSON.stringify(existingStepfloeData))
            .subscribe((data) => {
              let processMap = this.propertiesFormData.value;
              this.store.dispatch(addProcessMap({ processMap: processMap }));
              var res = JSON.parse(JSON.stringify(data));
              this.disableSubmitButton = false;
              // this.sharedService.setNextTab(true);
              this.router.navigate([
                '/process-maps/create-progressmap/' + res.id,
              ],{
                queryParams: {
                  status: 'draft',
                  contentId: res.contentId,
                  contentType: 'SF',
                  version: res.version
                }
              });
              this.filterTagData();
              // this.propertiesFormData.reset();
              this.ngxService.stopBackground();
              // this.sharedService.setStepflowtitle(res.title);
              console.log('SF-Update', res);
              // sessionStorage.setItem('sfID', res.stepFlowId);
              // sessionStorage.setItem('sfcontentId', res.contentId);
              // sessionStorage.setItem('sfStatus', 'draft');
              // sessionStorage.setItem('sfversion', res.version);
              // sessionStorage.setItem('sfcontentType', 'SF');
              // this.processMapAddComponent.changeStepFlowTitle(res.title);
              this.nextTab.emit(true);
              this.loading = false;

            });
        } else {
          let swimLanesData: SwimLanes = new SwimLanes();
          let processMapMetaData: ProcessMapMeta = new ProcessMapMeta();
          // swimLanesData.description = this.nodeValue;
          // swimLanesData.label = this.nodeValue;
          // swimLanesData.name = this.nodeValue;
          this.swimLanes.push(swimLanesData);
          this.processMapMeta.push(processMapMetaData);
        }
      } else {
        this.loading = true;

        this.processMapDataModel.assetTypeId = 13;

        this.processMapDataModel.title =
          this.propertiesFormData.controls.title.value;
        this.processMapDataModel.disciplineId = this.disciplineId;
        this.processMapDataModel.disciplineCode =
          this.propertiesFormData.controls.disciplineCode.value;
        this.processMapDataModel.contentOwnerId = this.contetOwnerEmailID
          ? this.contetOwnerEmailID
          : this.propertiesFormData.controls.contentOwner.value
            ? this.propertiesFormData.controls.contentOwner.value
            : '';

        this.processMapDataModel.classifierId = parseInt(
          this.propertiesFormData.controls.classifier.value
        );

        this.processMapDataModel.clockId =   this.classifierIdToClockid( this.classifiersDropDownList   ,  this.processMapDataModel.classifierId  )

        this.processMapDataModel.programControlled =
          this.propertiesFormData.controls.programControlled.value;
        // this.processMapDataModel.outsourceable = this.propertiesFormData.controls.outsourceable.value;
        this.processMapDataModel.outsourceable =
          sessionStorage.getItem('EKSContractor') == 'true'
            ? 'true'
            : this.propertiesFormData.controls.outsourceable.value == 'Yes'
              ? true
              : this.propertiesFormData.controls.outsourceable.value == 'No'
                ? false
                : this.propertiesFormData.controls.outsourceable.value != ''
                  ? this.propertiesFormData.controls.outsourceable.value
                  : 'false';

        this.processMapDataModel.revisionTypeId = parseInt(
          this.propertiesFormData.controls.revisionType.value
        );
        this.processMapDataModel.subDisciplineId = this.subDisciplineId;
        this.processMapDataModel.subSubDisciplineId = this.subSubDisciplineId;
        this.processMapDataModel.subSubSubDisciplineId =
          this.subSubSubDisciplineId;
        this.processMapDataModel.createdUser = this.email || this.defaultEmail;

        this.processMapDataModel.confidentiality =
          this.propertiesFormData.controls.confidentiality.value;

        this.processMapDataModel.confidentialityId =
          this.propertiesFormData.controls?.confidentialityLevel?.value;
        this.processMapDataModel.tpmdate =
          this.propertiesFormData.controls.tpmDate?.value;
          this.processMapDataModel.clockId = this.classifierIdToClockid( this.classifiersDropDownList   , this.propertiesFormData.controls.classifier.value )


        this.processMapDataModel.contentExportCompliances =
          this.exportComplianceField;
        this.chipData.map((node) => {
          delete node.name;
          node.typeId = 4;
          // node.typeId = node.parentId;
          delete node.parentId;
          node.tagId = node.id;
          delete node.id;
        });
        this.tagDataMap = this.chipData;

        this.processMapDataModel.controllingProgramId =
          this.propertiesFormData.controls?.restrictingProgram?.value;
        this.processMapDataModel.exportAuthorityId =
          this.propertiesFormData.controls?.exportAuthority?.value;

        this.processMapDataModel.keywords = this.propertiesFormData.controls?.keyword?.value;
        this.processMapDataModel.keyword = this.propertiesFormData.controls?.keyword?.value;
        // this.processMapDataModel.author =
        //   this.propertiesFormData.controls?.authors?.value;
        this.processMapDataModel.author = this.email || this.defaultEmail;
        this.processMapDataModel.contentTag = ContentTagData;
        this.processMapDataModel.contentPhase =
          this.propertiesFormData.controls.phases.value;

        let swimLanesData: SwimLanes = new SwimLanes();
        let processMapMetaData: ProcessMapMeta = new ProcessMapMeta();
        // swimLanesData.description = this.nodeValue;
        // swimLanesData.label = this.nodeValue;
        // swimLanesData.name = this.nodeValue;
        swimLanesData.sequenceNumber = 0;
        swimLanesData.color = '#ffffff';
        swimLanesData.borderColor = '#cccccc';
        swimLanesData.borderStyle = 'solid';
        swimLanesData.borderWidth = 2;
        this.swimLanes.push(swimLanesData);
        this.processMapMeta.push(processMapMetaData);
        this.processMapDataModel.swimLanes.push(swimLanesData);


        //console.log('new map', this.processMapDataModel);

        this.createDocumentService
          .CreateNewMap(JSON.stringify(this.processMapDataModel))
          .subscribe((data) => {
            this.disableSubmitButton = false;
            console.log('SF-Add', data);
            this.sharedService.setContentId(data);
            let processMap = this.propertiesFormData.value;
            this.store.dispatch(addProcessMap({ processMap: processMap }));
            var res = JSON.parse(JSON.stringify(data));
            // sessionStorage.setItem('sfID', res.stepFlowId);
            // sessionStorage.setItem('sfcontentId', res.contentId);
            // sessionStorage.setItem('sfStatus', 'draft');
            // sessionStorage.setItem('sfversion', res.version);
            // sessionStorage.setItem('sfcontentType', 'SF');
            //console.log('hellooooo', res);
            this.phaseModel.processMapId = res.id;
            if (res.length != 0) {
              this.createDocumentService
                .CreatePhase(JSON.stringify(this.phaseModel))
                .subscribe((data) => {
                  this.loadingImg = false;
                  this.nextTab.emit(true);
                  this.sharedService.setNextTab(true);
                  this.router.navigate([
                    '/process-maps/create-progressmap/' + res.stepFlowId,
                  ], {
                    queryParams: {
                      status: 'draft',
                      contentId: res.contentId,
                      contentType: 'SF',
                      version: res.version
                    }
                  });
                  this.nextTab.emit(true);
                  this.ngxService.stopBackground();
                  this.store.dispatch(ContentDataActions.resetContentData());
                });
            }
          });
      }
    } else if (this.contentType == 'SP') {
      let ContentTagData = [];
      if (this.chipData && this.chipData.length) {
        this.chipData.forEach((node) => {
          ContentTagData.push(node.id);
        });
      }
      if (this.id && this.id > 0) {
        this.loading = true;
        let existingStepfloeData = this.globalData;
        this.loading = true;
        existingStepfloeData.title =
          this.propertiesFormData.controls.title.value;
        existingStepfloeData.disciplineId = this.disciplineId;
        existingStepfloeData.disciplineCode =
          this.propertiesFormData.controls.disciplineCode.value;
        existingStepfloeData.contentOwnerId = this.contetOwnerEmailID
          ? this.contetOwnerEmailID
          : this.propertiesFormData.controls.contentOwner.value
            ? this.propertiesFormData.controls.contentOwner.value
            : '';

        existingStepfloeData.classifierId = parseInt(
          this.propertiesFormData.controls.classifier.value
        );
        existingStepfloeData.programControlled =
          this.propertiesFormData.controls.programControlled.value;


          existingStepfloeData.clockId = this.classifierIdToClockid( this.classifiersDropDownList   , this.propertiesFormData.controls.classifier.value )


        // existingStepfloeData.outsourceable = this.propertiesFormData.controls.outsourceable.value;
        existingStepfloeData.outsourceable =
          sessionStorage.getItem('EKSContractor') == 'true'
            ? 'true'
            : this.propertiesFormData.controls.outsourceable.value == 'Yes'
              ? true
              : this.propertiesFormData.controls.outsourceable.value == 'No'
                ? false
                : this.propertiesFormData.controls.outsourceable.value != ''
                  ? this.propertiesFormData.controls.outsourceable.value
                  : 'false';

        existingStepfloeData.revisionTypeId = parseInt(
          this.propertiesFormData.controls.revisionType.value
        );
        existingStepfloeData.subDisciplineId = this.subDisciplineId;
        existingStepfloeData.subSubDisciplineId = this.subSubDisciplineId;
        existingStepfloeData.subSubSubDisciplineId = this.subSubSubDisciplineId;
        existingStepfloeData.createdUser = this.email || this.defaultEmail;

        existingStepfloeData.confidentiality =
          this.propertiesFormData.controls.confidentiality.value;

        existingStepfloeData.confidentialityId =
          this.propertiesFormData.controls?.confidentialityLevel?.value;
        existingStepfloeData.tpmdate =
          this.propertiesFormData.controls.tpmDate?.value;
        existingStepfloeData.exportAuthorityId =
          this.propertiesFormData.controls.exportAuthority.value;
        existingStepfloeData.controllingProgramId =
          this.propertiesFormData.controls?.restrictingProgram.value;
        existingStepfloeData.keywords = this.propertiesFormData.controls.keyword.value;
        existingStepfloeData.keyword = this.propertiesFormData.controls.keyword.value;
          // existingStepfloeData.id = this.existingMapDataObj.id;
          // existingStepfloeData.swimLanes = this.globalData.swimLanes;
          this.createDocumentService
            //.createfromExistingProcessMap(JSON.stringify(this.existingProcessMap))
            .UpdateMap(JSON.stringify(existingStepfloeData))
            .subscribe((data) => {
              this.disableSubmitButton = false;
              let processMap = this.propertiesFormData.value;
              this.store.dispatch(addProcessMap({ processMap: processMap }));
              var res = JSON.parse(JSON.stringify(data));
              console.log('Step data', res);
              // this.sharedService.setNextTab(true);
              this.router.navigate([
                '/process-maps/SP/' + res.id,
              ],{
                queryParams: {
                  status: 'draft',
                  contentId: res.contentId,
                  contentType: 'SP',
                  version: res.version
                }
              });
              this.filterTagData();
              this.filterTagData();
              // this.propertiesFormData.reset();
              this.ngxService.stopBackground();
              // this.sharedService.setStepflowtitle(res.title);
              console.log('SF-Update', res);
              // sessionStorage.setItem('sfID', res.stepFlowId);
              // sessionStorage.setItem('sfcontentId', res.contentId);
              // sessionStorage.setItem('sfStatus', 'draft');
              // sessionStorage.setItem('sfversion', res.version);
              // sessionStorage.setItem('sfcontentType', 'SP');
              // this.processMapAddComponent.changeStepFlowTitle(res.title);
              this.nextTab.emit(true);
              this.loading = false;
            });

          // let swimLanesData: SwimLanes = new SwimLanes();
          // let processMapMetaData: ProcessMapMeta = new ProcessMapMeta();
          // swimLanesData.description = this.nodeValue;
          // swimLanesData.label = this.nodeValue;
          // swimLanesData.name = this.nodeValue;
          // this.swimLanes.push(swimLanesData);
          // this.processMapMeta.push(processMapMetaData);

      } else {
        this.loading = true;

        this.processMapDataModel.assetTypeId = 14;

        this.processMapDataModel.title =
          this.propertiesFormData.controls.title.value;
        this.processMapDataModel.disciplineId = this.disciplineId;
        this.processMapDataModel.disciplineCode =
          this.propertiesFormData.controls.disciplineCode.value;
        this.processMapDataModel.contentOwnerId = this.contetOwnerEmailID
          ? this.contetOwnerEmailID
          : this.propertiesFormData.controls.contentOwner.value
            ? this.propertiesFormData.controls.contentOwner.value
            : '';

        this.processMapDataModel.classifierId = parseInt(
          this.propertiesFormData.controls.classifier.value
        );
        this.processMapDataModel.clockId =   this.classifierIdToClockid( this.classifiersDropDownList   ,  this.processMapDataModel.classifierId  )

        this.processMapDataModel.programControlled =
          this.propertiesFormData.controls.programControlled.value;
        // this.processMapDataModel.outsourceable = this.propertiesFormData.controls.outsourceable.value;
        this.processMapDataModel.outsourceable =
          sessionStorage.getItem('EKSContractor') == 'true'
            ? 'true'
            : this.propertiesFormData.controls.outsourceable.value == 'Yes'
              ? true
              : this.propertiesFormData.controls.outsourceable.value == 'No'
                ? false
                : this.propertiesFormData.controls.outsourceable.value != ''
                  ? this.propertiesFormData.controls.outsourceable.value
                  : 'false';

        this.processMapDataModel.revisionTypeId = parseInt(
          this.propertiesFormData.controls.revisionType.value
        );
        this.processMapDataModel.subDisciplineId = this.subDisciplineId;
        this.processMapDataModel.subSubDisciplineId = this.subSubDisciplineId;
        this.processMapDataModel.subSubSubDisciplineId =
          this.subSubSubDisciplineId;
        this.processMapDataModel.createdUser = this.email || this.defaultEmail;

        this.processMapDataModel.confidentiality =
          this.propertiesFormData.controls.confidentiality.value;

        this.processMapDataModel.confidentialityId =
          this.propertiesFormData.controls?.confidentialityLevel?.value;
        this.processMapDataModel.tpmdate =
          this.propertiesFormData.controls.tpmDate?.value;

        this.processMapDataModel.contentExportCompliances =
          this.exportComplianceField;
        this.chipData.map((node) => {
          delete node.name;
          node.typeId = 4;
          // node.typeId = node.parentId;
          delete node.parentId;
          node.tagId = node.id;
          delete node.id;
        });
        this.tagDataMap = this.chipData;

        this.processMapDataModel.controllingProgramId =
          this.propertiesFormData.controls?.restrictingProgram?.value;
        this.processMapDataModel.exportAuthorityId =
          this.propertiesFormData.controls?.exportAuthority?.value;

        this.processMapDataModel.keywords = this.propertiesFormData.controls?.keyword?.value;
        this.processMapDataModel.keyword = this.propertiesFormData.controls?.keyword?.value;
        // this.processMapDataModel.author =
        //   this.propertiesFormData.controls?.authors?.value;
        this.processMapDataModel.author = this.email || this.defaultEmail;
        this.processMapDataModel.contentTag = ContentTagData;
        this.processMapDataModel.contentPhase =
          this.propertiesFormData.controls.phases.value;

        // let swimLanesData: SwimLanes = new SwimLanes();
        // let processMapMetaData: ProcessMapMeta = new ProcessMapMeta();
        // swimLanesData.description = this.nodeValue;
        // swimLanesData.label = this.nodeValue;
        // swimLanesData.name = this.nodeValue;
        // swimLanesData.sequenceNumber = 0;
        // swimLanesData.color = '#ffffff';
        // swimLanesData.borderColor = '#cccccc';
        // swimLanesData.borderStyle = 'solid';
        // swimLanesData.borderWidth = 2;
        // this.swimLanes.push(swimLanesData);
        // this.processMapMeta.push(processMapMetaData);
        // this.processMapDataModel.swimLanes.push(swimLanesData);
        //console.log('new map', this.processMapDataModel);

        this.createDocumentService
          .CreatePublicStep(JSON.stringify(this.processMapDataModel))
          .subscribe((data) => {
            this.disableSubmitButton = false;
            console.log('SP-Add', data);
            this.sharedService.setContentId(data);
            let processMap = this.propertiesFormData.value;
            this.store.dispatch(addProcessMap({ processMap: processMap }));
            var res = JSON.parse(JSON.stringify(data));
            // sessionStorage.setItem('sfID', res.id);
            // sessionStorage.setItem('sfcontentId', res.contentId);
            // sessionStorage.setItem('sfStatus', 'draft');
            // sessionStorage.setItem('sfversion', res.version);
            // sessionStorage.setItem('sfcontentType', 'SP');
            //console.log('hellooooo', res);
            this.phaseModel.processMapId = res.id;
            // if (res.length != 0) {
            //   this.createDocumentService
            //     .CreatePhase(JSON.stringify(this.phaseModel))
            //     .subscribe((data) => {
            //       this.loadingImg = false;
            //       this.nextTab.emit(true);
            //       this.sharedService.setNextTab(true);
            //       this.router.navigate([
            //         '/process-maps/SP/' + res.id,
            //       ]);
            //       this.nextTab.emit(true);
            //       this.ngxService.stopBackground();
            //     });
            // }

            this.loadingImg = false;
            this.nextTab.emit(true);
            this.sharedService.setNextTab(true);
            this.router.navigate([
              '/process-maps/SP/' + res.id,
            ],{
              queryParams: {
                status: 'draft',
                contentId: res.contentId,
                contentType: 'SP',
                version: res.version
              }
            });
            this.nextTab.emit(true);
            this.ngxService.stopBackground();
            this.store.dispatch(ContentDataActions.resetContentData());
          });
      }
    }else if (this.contentType == 'RC') {
      // this.loading = true;
      this.documentPropertiesForAll.AADid = sessionStorage.getItem('AADid');
      this.propertiesFormDataSet();
      this.documentPropertiesForAll.setOfCategories = this.propertiesFormData.value.relatedContentCategory;
      //console.log("RC this.globalData.id", this.globalData.id);


      if (this.id > 0 || this.id.length > 0) {
        this.documentPropertiesForAll.AssetTypeId = this.contentTypeValue;
        this.documentPropertiesForAll.id =
          this.globalData && this.globalData.id > 0
            ? this.globalData.id
            : this.id;
        this.relatedContentService
          .UpdatePropertiesInRelatedContent(this.documentPropertiesForAll)
          .subscribe((data) => {
            // this.globalData = JSON.parse(JSON.stringify(data));
            // this.activityTabs = this.globalData;
            // this.dataBindForPublishMode(); // publish mode
            const updateValue = {
              contentOwnerId: this.documentPropertiesForAll.contentOwnerId,
              revisionTypeId: this.documentPropertiesForAll.revisionTypeId
            }
            this.updateContentOwnerValue.emit(JSON.stringify(updateValue));
            this.globalData.title = this.propertiesFormData.controls.title.value;
            this.updateGlobalData(data);
            this.filterTagData();
            this.ngxService.stopBackground();
            this.loading = false;
            this.disableSubmitButton = false;
          });
      } else {
        sessionStorage.setItem(
          'title',
          this.propertiesFormData.controls.title.value
        );
        this.activityPageService
          .CreateRelatedContent(this.documentPropertiesForAll)
          .subscribe((data) => {
            var res = JSON.parse(JSON.stringify(data));
            sessionStorage.setItem('RCID', res.id);
            this.sharedService.setNextTab(true);
            this.router.navigate(['/related-content/' + res.id]);
            this.loading = false;
            this.ngxService.stopBackground();
            this.disableSubmitButton = false;
            this.store.dispatch(ContentDataActions.resetContentData());
          });
      }
    }
  }

  FadeOutSuccessMsg() {
    setTimeout(() => {
      this.hideSuccessMessage = false;
    }, 3000);
  }

  patchValueForBinding(res: any) {
    //console.log(' contentType in pathval',this.contentType);
    //console.log(' globaldata.contentType in pathval',this.globalData.contentType);
    this.isUpdateFormStatus == false;
    this.checkFlag = 0;
    if (typeof this.globalData !== 'undefined') {
      this.rservice.UpdateBroadcastMessage('false');
    }
    this.isSelectedDicipline = true;
    if (this.contentType == 'WI' || this.contentType == 'GB' || this.contentType == 'DS') {
      this.tagDataIds = res['contentTags'];
    } else {
      this.tagDataIds = res['contentTag'];
    }
    //console.log("patchValueForBinding contentTags tagDataIds", this.tagDataIds);
    const status = 'draft';
    this.isReadWriteMode = this.docStatus == status;

    this.disciplineId = res['disciplineId'];
    this.subDisciplineId = res['subDisciplineId'];
    this.subSubDisciplineId = res['subSubDisciplineId'];
    this.subSubSubDisciplineId = res['subSubSubDisciplineId'];
    this.checkAllParentsSelectionForBind();
    let disciplineData =
      this.DisciplineIdData +
      ' > ' +
      this.SubDisciplineIdData +
      ' > ' +
      this.SubSubDisciplineIdData;
    this.nodePath = disciplineData;
    let disciplineObj: object = {};
    disciplineObj['disciplineId'] = res['disciplineId'];
    disciplineObj['nodePath'] = disciplineData;
    disciplineObj['subDisciplineId'] = res['subDisciplineId'];
    disciplineObj['subSubDisciplineId'] = res['subSubDisciplineId'];
    this.selectedDicipline = disciplineObj;
    this.activityDisciplineCode = res['disciplineCode'];
    this.keyword = res['keywords'] || res['keyword'];
    this.chipContainer = res.contentTag?.map(id => this.getDisplayContentTag(this.tagList, id)) || [];

    if (this.disciplineId) {
      this.checkAllParentsSelectionForBindDiscipline();
    }

    if (this.tagDataIds) {
      this.checkAllParentsSelectionForBindTag();
      this.chipData = Object.assign([], this.chipDataUpdate);
      this.chipDataUpdate = [];
      this.eventsSubject.next(null);
      this.chipData.forEach((node) => {
        this.eventsSubject.next(node);
      });
      this.chipDisciplineContainer.forEach((node) => {
        this.eventsDiscipline.next(node);
      });
      let disciplineDataTag =
        this.DisciplineIdDataTag +
        ' > ' +
        this.SubDisciplineIdDataTag +
        ' > ' +
        this.SubSubDisciplineIdDataTag +
        ' > ' +
        this.SubSubSubDisciplineIdDataTag;
      if (this.nodePathTag) {
        this.nodePathTag = this.nodePathTag.substring(
          0,
          this.nodePathTag.length - 1
        );
      }
      let disciplineObjTag: object = {};
      disciplineObjTag['disciplineId'] = this.tagDataIds[0];
      disciplineObjTag['nodePath'] = disciplineDataTag;
      disciplineObjTag['subDisciplineId'] = this.tagDataIds[1];
      disciplineObjTag['subSubDisciplineId'] = this.tagDataIds[2];
      disciplineObjTag['subSubSubDisciplineId'] = this.tagDataIds[3];
      this.selectedTagData = disciplineObjTag;
      this.tagDataObj = new TagData();
      let nodePath1 =
        this.DisciplineIdDataTag +
        ' > ' +
        this.SubDisciplineIdDataTag +
        ' > ' +
        this.SubSubDisciplineIdDataTag;
      this.tagDataObj.disciplineId = this.tagDataIds[0];
      this.tagDataObj.nodePath = nodePath1;
      this.tagDataObj.subDisciplineId = this.tagDataIds[1];
      this.tagDataObj.subSubDisciplineId = this.tagDataIds[2];
      this.tagDataList.push(this.tagDataObj);
      this.tagDataObj = new TagData();
      let nodePath2 =
        this.DisciplineIdDataTag +
        ' > ' +
        this.SubDisciplineIdDataTag +
        ' > ' +
        this.SubSubSubDisciplineIdDataTag;
      this.tagDataObj.disciplineId = this.tagDataIds[0];
      this.tagDataObj.nodePath = nodePath2;
      this.tagDataObj.subDisciplineId = this.tagDataIds[1];
      this.tagDataObj.subSubDisciplineId = this.tagDataIds[3];
      this.tagDataList.push(this.tagDataObj);
    }
  }

  selectAllNodesForBind(node) {
    if (node.id == this.disciplineId) {
      this.DisciplineIdData = node.name;
      if (node.children.length) {
        node.children.forEach((c1) => {
          if (c1.id == this.subDisciplineId) {
            this.SubDisciplineIdData = c1.name;
            if (c1.children.length) {
              c1.children.forEach((c2) => {
                if (c2.id == this.subSubDisciplineId) {
                  this.SubSubDisciplineIdData = c2.name;
                  if (c2.children.length) {
                    c2.children.forEach((c3) => {
                      if (c3.id == this.subSubSubDisciplineId) {
                        this.SubSubSubDisciplineIdData = c3.name;
                      }
                    });
                  }
                }
              });
            } else {
              c1.selected = true;
            }
          }
        });
      } else {
        node.selected = true;
      }
    }
  }

  selectAllNodesForBindTag(node) {
    //console.log("selectAllNodesForBindTag this.tagDataIds",this.tagDataIds);
    if ( this.tagDataIds.length > 0 && Array.isArray(this.tagDataIds) ) {
      this.tagDataIds.forEach(nodeId => {
        const findingNode = this.findTagName(node, nodeId);
        if ( findingNode ) {
          this.nodePathTag = this.nodePathTag + ',' + findingNode.name;
          this.chipDataUpdate.push(findingNode);
        }
      });
    }
  }

  findTagName(node, tagId) {
    if ( !node ) {
      return null;
    }

    if ( `${ node.id }` === `${ tagId }` ) {
      return node;
    }

    const findingChildren = compact(node.children?.map(item => this.findTagName(item, tagId)));

    return findingChildren.length ? findingChildren[0] : null;
  }

  findNodeDisciplineHirerachical(node, disciplineId,  prefix = '') {
    if ( !node ) {
      return null;
    }

    if ( `${ node.rowNo }` === `${ disciplineId }` ) {
      return {
        name: `${ prefix }${ prefix ? ' > ' : '' }${ node.name }`,
        rowNo: node.rowNo
      };
    }

    const findingChildren = compact(node.children?.map(item => this.findNodeDisciplineHirerachical(item, disciplineId, `${ prefix }${ prefix ? ' > ' : '' }${ item.name }`)));

    return findingChildren.length ? findingChildren[0] : null;
  }

  selectAllNodesForBindDiscipline(node) {
    const findingNode = this.findNodeDisciplineHirerachical(node, this.disciplineId);
    if ( findingNode ) {
      this.chipDisciplineContainer.push(findingNode);
    }
  }

  findNodeHirerachical(nodeArray, nodeId,  prefix = '') {
    if ( !nodeArray ) {
      return null;
    }
    const findingNode = nodeArray.find(node => `${ node.id }` === `${ nodeId }`);
    if ( findingNode ) {
      return {
        name: `${ prefix }${ prefix ? ' > ' : '' }${ findingNode.name }`,
        id: findingNode.id
      };
    }

    const findingChildren = compact(nodeArray.map(item => this.findNodeHirerachical(item.children, nodeId, `${ prefix }${ prefix ? ' > ' : '' }${ item.name }`)));

    return findingChildren.length ? findingChildren[0] : null;
  }

  setTagHirerachy(node) {
    const findingNode = this.findNodeHirerachical(tagData, node.id);
    if ( findingNode ) {
      this.chipContainer.push(findingNode);
    }
  }

  setDisciplineHirerachy(node) {
    // this.disciplineId = node.rowNo;
    this.chipDisciplineContainer = [];
    if ( this.discipline.length > 0 ) {
      [].push.apply(this.chipDisciplineContainer, compact(this.discipline?.map(n => this.findNodeDisciplineHirerachical(n, node.rowNo))));
    }
  }

  checkAllParentsSelectionForBind() {
    if (this.discipline) {
      this.discipline.forEach((node) => {
        this.selectAllNodesForBind(node);
      });
    }
  }

  checkAllParentsSelectionForBindTag() {
    if (this.tagDataIds) {
      tagData.forEach((node) => {
        //console.log("checkAllParentSelectionForBindTag node",node);
        this.selectAllNodesForBindTag(node);
      });
    }
  }

  checkAllParentsSelectionForBindDiscipline() {
    if (this.discipline && this.disciplineId) {
      this.chipDisciplineContainer = [];
      this.discipline.forEach((node) => {
        this.selectAllNodesForBindDiscipline(node);
      });
    }
  }

  classifierIdToClockid($D , $id){
    let val = $D.find(( node ) =>{
      return   node.classifiersId == $id
      })
     return val?.clockId;
  }


  propertiesFormDataSet() {
    let ContentTagData = [];
    if (this.chipData && this.chipData.length) {
      this.chipData.forEach((node) => {
        ContentTagData.push(node.id);
      });
    }
    this.documentPropertiesForAll.contentTags = ContentTagData;
    this.documentPropertiesForAll.contentTag = ContentTagData;
    this.documentPropertiesForAll.keyword = this.propertiesFormData.controls.keyword.value;
    this.documentPropertiesForAll.keywords = this.propertiesFormData.controls.keyword.value;
    this.masterFilterData.push(this.propertiesFormData.controls.keyword.value);
    this.documentPropertiesForAll.contentId =
      this.propertiesFormData.controls.contentID.value;
    this.documentPropertiesForAll.title =
      this.propertiesFormData.controls.title.value;
    this.documentPropertiesForAll.contentPhase =
      this.propertiesFormData.controls.phases.value;
    this.documentPropertiesForAll.author = this.email || this.defaultEmail;
    this.documentPropertiesForAll.contentOwnerId = this.contetOwnerEmailID
      ? this.contetOwnerEmailID
      : this.propertiesFormData.controls.contentOwner.value
        ? this.propertiesFormData.controls.contentOwner.value
        : '';
    this.documentPropertiesForAll.confidentialityId =
      this.propertiesFormData.controls.confidentialityLevel.value;
    this.documentPropertiesForAll.programControlled =
      this.propertiesFormData.controls.programControlled.value == 'Yes'
        ? true
        : this.propertiesFormData.controls.programControlled.value == 'No'
          ? false
          : this.propertiesFormData.controls.programControlled.value != ''
            ? this.propertiesFormData.controls.programControlled.value
            : 'false';
    this.documentPropertiesForAll.confidentiality =
      this.propertiesFormData.controls.confidentiality.value == 'Yes'
        ? true
        : this.propertiesFormData.controls.confidentiality.value == 'No'
          ? false
          : this.propertiesFormData.controls.confidentiality.value != ''
            ? this.propertiesFormData.controls.confidentiality.value
            : 'false';
    this.documentPropertiesForAll.contentExportCompliance =
      this.propertiesFormData.controls.exportComplianceTouchPoint.value;
    this.documentPropertiesForAll.classifierId =
      this.propertiesFormData.controls.classifier.value;

      this.documentPropertiesForAll.clockId = this.classifierIdToClockid( this.classifiersDropDownList   , this.propertiesFormData.controls.classifier.value )


    this.documentPropertiesForAll.revisionTypeId =
      this.propertiesFormData.controls.revisionType.value;
    this.documentPropertiesForAll.disciplineId = this.disciplineId;
    this.documentPropertiesForAll.subDisciplineId = this.subDisciplineId;
    this.documentPropertiesForAll.subSubDisciplineId = this.subSubDisciplineId;
    this.documentPropertiesForAll.subSubSubDisciplineId =
      this.subSubSubDisciplineId;
    this.documentPropertiesForAll.disciplineCode =
      this.propertiesFormData.controls.disciplineCode.value;
    this.documentPropertiesForAll.disciplineCodeId = 1;
    this.documentPropertiesForAll.controllingProgramId =
      this.propertiesFormData.controls.restrictingProgram.value;
    this.documentPropertiesForAll.exportAuthorityId =
      this.propertiesFormData.controls.exportAuthority.value;
    this.documentPropertiesForAll.creatorClockId = this.email || this.defaultEmail;
    this.documentPropertiesForAll.CreatorClockId = this.email || this.defaultEmail;
    this.documentPropertiesForAll.createdUser = this.email || this.defaultEmail;
    /*Adding authoring condition if user is contractor then outsourable value should be true*/
    this.documentPropertiesForAll.outsourceable =
      sessionStorage.getItem('EKSContractor') == 'true'
        ? 'true'
        : this.propertiesFormData.controls.outsourceable.value == 'Yes'
          ? true
          : this.propertiesFormData.controls.outsourceable.value == 'No'
            ? false
            : this.propertiesFormData.controls.outsourceable.value != ''
              ? this.propertiesFormData.controls.outsourceable.value
              : 'false';

  }

  getUnique(array): any {
    var uniqueArray = [];
    for (let i = 0; i < array.length; i++) {
      if (uniqueArray.indexOf(array[i]) === -1) {
        uniqueArray.push(array[i]);
      }
    }
    return uniqueArray;
  }

  onChangeProgramControl(e: any) {
    this.isSelectedDicipline = true;
    //this.hasChangedRrogramControl = true;
    if (typeof this.globalData !== 'undefined') {
      this.activityTabs.programControlled =
        this.propertiesFormData.controls.programControlled.value;
      //for Program Controlled
      if (
        this.activityTabs.programControlled == true ||
        this.activityTabs.programControlled == 'Yes'
      ) {
        this.activityTabs.programControlled = 'Yes';
      } else {
        this.activityTabs.programControlled = 'No';
      }
      this.activityTabs.controllingProgramId =
        this.propertiesFormData.controls.restrictingProgram.value;
    }
  }

  onChangeExportAuthority(e: any) {
    if (typeof this.globalData !== 'undefined') {
      this.activityTabs.outsourceable =
        this.propertiesFormData.controls.outsourceable.value;
      //for outsourceable
      if (
        this.activityTabs.outsourceable == true ||
        this.activityTabs.outsourceable == 'Yes'
      ) {
        this.activityTabs.outsourceable = 'Yes';
      } else {
        this.activityTabs.outsourceable = 'No';
      }
      this.activityTabs.exportAuthorityId =
        this.propertiesFormData.controls.exportAuthority.value;
    }
  }

  onChangeisConfidentiality(e: any) {
    this.isSelectedDicipline = true;
    //this.hasChanged = true;
    if (typeof this.globalData !== 'undefined') {
      this.activityTabs.confidentiality =
        this.propertiesFormData.controls.confidentiality.value;
      //for Confidentiality
      if (
        this.activityTabs.confidentiality == true ||
        this.activityTabs.confidentiality == 'Yes'
      ) {
        this.activityTabs.confidentiality = 'Yes';
      } else {
        this.activityTabs.confidentiality = 'No';
      }

      this.activityTabs.confidentialityId =
        this.propertiesFormData.controls.confidentialityLevel.value;
      //for Confidentiality level
      // if (this.activityTabs.confidentialityId == true) {
      //   this.activityTabs.confidentialityId = 'Yes';
      // } else if (this.activityTabs.confidentialityId == 0) {
      //   this.activityTabs.confidentialityId = '';
      // } else if (this.activityTabs.confidentialityId == false) {
      //   this.activityTabs.confidentialityId = 'No';
      // }
    }
  }

  selectConfidentiality() {
    if (this.isConfidentiality) {
      this.isConfidentiality = false;
      this.isSelectedDicipline = true;
    } else {
      /* else if (this.isConfidentiality == false && this.hasChanged == false) {
         this.isConfidentiality = true;
         this.isSelectedDicipline = false;
       }
       else if (this.isConfidentiality == false && this.hasChanged == true) {
         this.isConfidentiality = true;
         this.isSelectedDicipline = true;
       }*/
      this.isConfidentiality = true;
      this.isSelectedDicipline = false;
    }
  }

  selectprogramControlled() {
    if (this.isProgramControlled) {
      this.isProgramControlled = false;
      this.isSelectedDicipline = true;
    }
    // else if (this.isProgramControlled == false && this.hasChangedRrogramControl == false) {
    //   this.isProgramControlled = true;
    //   this.isSelectedDicipline = false;
    // }
    // else if (this.isProgramControlled == false && this.hasChangedRrogramControl == true) {
    //   this.isProgramControlled = true;
    //   this.isSelectedDicipline = true;
    // }
    else {
      this.isProgramControlled = true;
      if(!this.propertiesFormData.value.restrictingProgram){
      this.isSelectedDicipline = false;
      }
    }
  }

  selectoutsourceable() {
    if (this.isOutsourceable) {
      this.isOutsourceable = false;
    } else {
      this.isOutsourceable = true;
    }
  }

  removeChipData(delChip) {
    this.store.dispatch(
      new DeleteItemAction({
        data: delChip,
        type: 'property',
      })
    );
    this.eventsSubject.next(delChip);
  }

  removeChip(chip) {
    let removeElement = chip.id;
    this.chipContainer = this.chipContainer.filter(
      (obj) => obj.id != removeElement
    );
    chip.isUnchecked = true;
    this.eventsSubject.next(chip);
    // this.tagData(this.chipContainer);
    // this.taskCretionForm.controls['phasesTask'].setValue(this.chipValues);
  }

  removeDisciplineChip(chip) {
    let removeElement = chip.rowNo;
    this.chipDisciplineContainer = this.chipDisciplineContainer.filter(
      (obj) => obj.rowNo !== removeElement
    );
    //this.tagData(this.chipContainer);
    chip.isUnchecked = true;
    this.eventsDiscipline.next(chip);
    // this.taskCretionForm.controls['phasesTask'].setValue(this.chipValues);
  }

  filterTagData(){
    let tagName = [];
    let tagIds = [];
    if (this.chipData && this.chipData.length > 0) {
      this.chipContainer = [];
      this.chipData.forEach((node) => {
        this.setTagHirerachy(node);
        tagName.push(node.name);
        tagIds.push(node.id);
      });
    }
    let tagArray = [];
    let tagNew;
    this.chipContainer.forEach((node) => {
      tagArray.push(node.name);
    });
    tagNew = tagArray.toString();
    if (typeof this.globalData !== 'undefined') {
      this.globalData.contentTagName = (tagName && tagName.length > 0) ? tagName : tagNew;
    }
  }

  tagData($event) {
    this.chipData = $event;
    let tagName = [];
    let tagIds = [];
    this.chipContainer = [];
    if (this.chipData && this.chipData.length > 0) {
      this.chipData.forEach((node) => {
        this.setTagHirerachy(node);
        tagName.push(node.name);
        tagIds.push(node.id);
      });
    }
    let tagArray = [];
    let tagNew;
    this.chipContainer.forEach((node) => {
      tagArray.push(node.name);
    });
    tagNew = tagArray.toString();
    if (typeof this.globalData !== 'undefined') {
      this.activityTabs.contentTagName = (tagName && tagName.length > 0) ? tagName : tagNew;
    }
    this.globalData.contentTags = tagIds;
    this.globalData.contentTag = tagIds;
  }

  setDisciplineData($event) {
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
    if (this.chipDisciplineData && this.chipDisciplineData.length > 0) {
      // this.removeDisciplineChip(this.chipDisciplineContainer);
      this.chipDisciplineData.forEach((node) => {
        this.setDisciplineHirerachy(node);
      });
    }
  }

  dataBindForPublishMode() {
    //console.log(' contentType in publish',this.contentType);
    //console.log(' globaldata.contentType in publish',this.globalData.contentType);
    let disciplineData;
    if (this.activityTabs.subSubSubDisciplineName != null) {
      disciplineData =
        this.activityTabs.disciplineName +
        ' > ' +
        this.activityTabs.subDisciplineName +
        ' > ' +
        this.activityTabs.subSubDisciplineName +
        ' > ' +
        this.activityTabs.subSubSubDisciplineName;
    } else if (this.activityTabs.subSubDisciplineName != null) {
      disciplineData =
        this.activityTabs.disciplineName +
        ' > ' +
        this.activityTabs.subDisciplineName +
        ' > ' +
        this.activityTabs.subSubDisciplineName;
    } else if (this.activityTabs.subDisciplineName != null) {
      disciplineData =
        this.activityTabs.disciplineName +
        ' > ' +
        this.activityTabs.subDisciplineName;
    } else {
      disciplineData = this.activityTabs.disciplineName;
    }

    this.activityTabs.disciplineIds =
      this.chipDisciplineContainer[0] && this.chipDisciplineContainer[0].name
        ? this.chipDisciplineContainer[0].name
        : '';

    let DiciplineCode;
    if (this.disciplineCodeList) {
      DiciplineCode = this.disciplineCodeList.filter((data) => {
        if (data.id == this.activityTabs.disciplineCodeId) return data;
      });
    }
    if (DiciplineCode) {
      if (DiciplineCode.length > 0) {
        this.activityTabs.disciplineCodeId = DiciplineCode[0]['code'];
      }
    }

    //Phase
    if ( this.activityTabs.contentPhase ) {
      this.activityTabs.contentPhaseName = this.activityTabs.contentPhase.map(phaseId => {
        return this.setOfPhasesList.find(phase => phase.id === phaseId)?.name;
      }).join(',');
    }

    // End of Phase


    this.activityTabs.contentTagName = (this.activityTabs.contentTagName && this.activityTabs.contentTagName != null) ? this.activityTabs.contentTagName : 'NA';
    //console.log("publish mode contentTagName", this.activityTabs.contentTagName);
    this.activityTabs.keyword =this.activityTabs.keyword || this.activityTabs.keywords
    //this.activityTabs.contentPhaseName = phaseList;

    //ClassifierName
    // this.bindClassifiersDropDownValue();

    // ApprovalRequirement
    this.bindApprovalRequirementValue();




    //for outsourceable
    if (
      this.activityTabs.outsourceable == true ||
      this.activityTabs.outsourceable == 'Yes'
    ) {
      this.activityTabs.outsourceable = 'Yes';
    } else {
      this.activityTabs.outsourceable = 'No';
    }

    //for Confidentiality
    this.bindConfidentialityValue();
    //for Confidentiality

    //for Program Controlled
    if (
      this.activityTabs.programControlled == true ||
      this.activityTabs.programControlled == 'Yes'
    ) {
      this.activityTabs.programControlled = 'Yes';
    } else {
      this.activityTabs.programControlled = 'No';
    }
    //Restricting Program
    this.bindRestrictProgramValue();

    //for Revision Type
    this.bindRevisionTypeValue();

    //for Export Group
    this.bindExportAuthorityValue();

    //for Content Tag
    this.bindContentTagValue();

    //for RelatedContent
    this.bindRelatedContentValue();

    if( this.globalData.contentTagName && this.globalData.contentTagName.length > 0 && (this.globalData.assetTypeId == 13 || this.globalData.assetTypeId == 14) ){
      if(this.globalData.contentTag && this.globalData.contentTag.length > 0){
        // console.log("Content Tag Id is found...");
      }else{
        this.tagNameSF = "";
        // console.log("Tag Id is not found ......", this.globalData.contentTagName);
        // console.log(this.chipContainer);
        const currentContentTags = this.globalData.contentTags?.map(id => this.getDisplayContentTag(this.tagList, id));
        this.chipContainer = currentContentTags || [];
        let fullTagData: string;
        let tagOrders = [];
        fullTagData = this.globalData.contentTagName;
        fullTagData = fullTagData + '';
        tagOrders = fullTagData.split(" > ");
        // console.log(tagOrders,"tagorders");
        let len: any;
        len = tagOrders.length;
        this.tagNameSF = tagOrders[(len-1)];
      }
    }

    if (this.contentType == 'SF') {
      this.isContentStepFlow = true;
      // console.log("this.isContentStepFlow = true;", this.isContentStepFlow);
    }
    this.activityTabs.author = this.globalData?.author;
  }

  tagNameSelects(tags, currentTagId) {
    let counters = 0;
    let tagCount = 0;
    tags.forEach((element) => {
      tagCount = tagCount + 1;
      if (element.id == currentTagId) {
        counters = counters + 1;
        // console.log(element, "Found Data Value ");
        this.selectedContentTags = element;
      }
    });

    if (tagCount == tags.length && counters == 0) {
      // console.log("Inside tagCounts ", tagCount, tags.length, counters);
      tags.forEach((elem) => {
        if (elem.children && elem.children.length > 0) {
          // console.log(elem);
          this.tagNameSelects(elem.children, currentTagId);
        }
      });
    }
  }

  selectContentOwner(item) {
    const selectedAuthor = this.filteredCoauthorName.find(author => author.displayName === item.option.value);
    this.contetOwnerEmailID = selectedAuthor?.email;
  }

  openClassifierModal() {
    const dialogRef = this.dialog.open(ClassifierModalComponent, {
      width: '550px',
      minHeight: 'auto',
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.selectedClassifier = data;
        this.propertiesFormData.patchValue({ classifier: data });
      }
    });
  }
  updateContentOwner(value) {
    this.propertiesFormData.patchValue({
      contentOwner: value,
    });
    this.bindContentOwnerAndAuthorName();
  }
  bindApprovalRequirementDropdownValue(value) {
    this.approvalRequirementsIdList && this.approvalRequirementsIdList.length > 0 && this.approvalRequirementsIdList.filter(item => {
      if(value == 'bindApprovalId' && item.name == this.propertiesFormData.value.approvalRequirementsId) { // Bind Id to the payload
        this.documentPropertiesForAll.approvalRequirementsId = item.approvalRequirementId;
      } else if(value == 'bindApprovalName' && item.approvalRequirementId == this.globalData.approvalRequirementsId) { // Bind Name to the for control
        this.propertiesFormData.patchValue({
          approvalRequirementsId: item.name,
        })
      }
    })
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
  bindConfidentialityValue () {
    if (this.globalData && this.globalData.assetTypeId == 13) {
      let sf1 = this.propertiesFormData.controls.confidentialityLevel.value;
      this.sfConfidentialitylevel = this.confidentialitiesList && this.confidentialitiesList.filter(
        (data) => {
          if (data.confidentialityId == sf1) return data;
        }
      );
      if (this.sfConfidentialitylevel && this.sfConfidentialitylevel.length > 0) {
        this.stepflowConfidentialitylevel =
          this.sfConfidentialitylevel[0]['name'];
      }
    }
    if (
      this.activityTabs && (this.activityTabs.confidentiality == true ||
      this.activityTabs.confidentiality == 'Yes')
    ) {
      this.activityTabs.confidentiality = 'Yes';
    } else if(this.activityTabs){
      this.activityTabs.confidentiality = 'No';
    }
    if (
      this.activityTabs && this.activityTabs.confidentialityId != null &&
      this.activityTabs.confidentialityId > 0 &&
      this.confidentialitiesList
    ) {
      let Confidentialitylevel = this.confidentialitiesList.filter((data) => {
        if (data.confidentialityId == this.activityTabs.confidentialityId)
          return data;
      });
      this.activityTabs.confidentialityName =
      (Confidentialitylevel && Confidentialitylevel.length > 0) ? Confidentialitylevel[0]['name'] : '';
    }
  }
  bindSetOfPhaseList() {
    let phaseList = '';
    if (
      this.globalData && this.globalData.contentPhase &&
      this.globalData.contentPhase.length > 0
    ) {

      if ( this.globalData  && this.globalData.contentPhase && this.setOfPhasesList){
        this.globalData.contentPhase.forEach((element, index) => {
          if (index !== this.globalData.contentPhase.length - 1) {
            phaseList = phaseList + this.setOfPhasesList[element - 1].name + ', ';
          } else {
            phaseList = phaseList + this.setOfPhasesList[element - 1].name;
          }
        });
      }
    }
    if ( !this.activityTabs ) {
      this.activityTabs = { ...this.globalData };
    }
    if ( this.activityTabs ) {
      this.globalData.contentPhaseName = this.activityTabs.contentPhaseName =
        phaseList && phaseList.length > 0
          ? phaseList
          : this.activityTabs.contentPhaseName &&
          this.activityTabs.contentPhaseName.length > 0
            ? this.activityTabs.contentPhaseName
            : phaseList;
      this.globalData.contentPhaseDisplay = this.activityTabs.contentPhaseDisplay = phaseList;
    }
  }
  bindClassifiersDropDownValue () {
    if (this.activityTabs && (this.activityTabs.classifierId > 0 || this.activityTabs.classifierName) && this.classifiersDropDownList) {
      this.classifiersname = this.classifiersDropDownList.filter((data) => {
        if (data.classifiersId == this.activityTabs.classifierId || data.name.toLocaleLowerCase().trim() == this.activityTabs.classifierName?.toLocaleLowerCase().trim()) return data;
      });
      if(this.classifiersname?.length){
        this.publisheClassifier = this.classifiersname[0].classifiersId
      }
      this.activityTabs.classifierName =
      this.classifiersname && this.classifiersname.length > 0 ? this.classifiersname[0]['name'] : '';
    }
  }
  bindRevisionTypeValue () {
    if (this.revisionTypeListCopy && this.globalData && this.revionTypeList.length == 0) {
      if (
        (this.globalData.version != null && this.globalData.version > 1) ||
        (Number(this.globalData.versionNumber) != null &&
          Number(this.globalData.versionNumber) > 1)
      ) {
        this.isUpdateFormForRevision = true;
        this.revionTypeList = this.revisionTypeListCopy && this.revisionTypeListCopy.slice(1);
        if(this.globalData.revisionTypeId && (this.globalData.revisionTypeId == 1 || this.globalData.revisionTypeId == 0)) {
          this.disableSubmitButton = true;
        }
      } else {
        this.isUpdateFormForRevision = false;
        this.revionTypeList = this.revisionTypeListCopy;
      }
      let revisionType = this.revisionTypeListCopy.filter((data) => {
        if (data.revisionTypeId == this.globalData.revisionTypeId)
          return data;
      });
      if(revisionType.length > 0 && (this.globalData.version != 1 || this.globalData.versionNumber != 1) && this.globalData.revisionTypeId != 1){
        this.activityTabs.revisionTypeId = revisionType[0]['revisionTypeCode'];
        this.propertiesFormData.patchValue({
          revisionType: this.globalData.revisionTypeId
        })
      }
    }
  }
  bindContentTagValue () {
    const contentTags = this.globalData?.contentTag?.length ? this.globalData?.contentTag : this.globalData?.contentTags;
    if (contentTags?.length) {
      let currentTagId = contentTags[0];
      if (
        contentTags &&
        contentTags.length > 0 &&
        this.tagList &&
        this.tagList.length > 0
      ) {
        this.tagNameSelects(this.tagList, currentTagId);
      }
      if(!this.globalData.contentTagName?.length){

        const currentContentTags = contentTags.map(id => this.getDisplayContentTag(this.tagList, id));
        this.globalData.contentTagName = currentContentTags.map(tag => tag?.name);
        contentTags.forEach(id => {
          this.setTagHirerachy({ id });
        });
      }
    }
  }

  getDisplayContentTag(tagList, id) {
    if(!tagList?.length){
      return null;
    }

    const findList = tagList.find(item => `${ item.id }` === `${ id }`);

    if ( findList ) {
      return findList;
    }

    const findingChildren = compact(tagList.map(item => this.getDisplayContentTag(item.children, id)));

    return findingChildren.length ? findingChildren[0] : null;
  }

  bindApprovalRequirementValue () {
    if(this.propertiesFormData && this.globalData && this.globalData.assetTypeId == 6) {
      this.propertiesFormData.addControl('approvalRequirementsId', this.fb.control(''));
      if(this.globalData.assetStatus === ASSET_STATUSES.PUBLISHED || this.globalData.assetStatus === ASSET_STATUSES.CURRENT && this.globalData.approvalRequirementsName) {
        this.propertiesFormData.patchValue({
          approvalRequirementsId: this.globalData.approvalRequirementsName, //In published use case directly bind the name from the response to the form control
        })
      } else {
        this.bindApprovalRequirementDropdownValue('bindApprovalName'); //In Draft use case get the id from the response and map to its respective name
      }
    }
  }
  bindRelatedContentValue () {
    if(this.propertiesFormData && this.globalData && this.globalData.assetTypeId == 12) {
      this.propertiesFormData.addControl('relatedContentCategory', this.fb.control(''));
      this.globalData.computedRelatedContentCategoryName = '';
      if ( this.rcCategoryList && this.globalData.setOfCategories ) {
        this.globalData.computedRelatedContentCategoryName = this.globalData.setOfCategories.map((id) => {
          const findingCategory = this.rcCategoryList.find(item => item.categoryId === id);
          return findingCategory?.description;
        }).join(',');
        this.propertiesFormData.patchValue({
          relatedContentCategory: this.globalData.setOfCategories
        })
      }
    }
  }
  bindContentOwnerAndAuthorName() {
    if(this.globalData.contentOwnerId && this.globalData.contentOwnerId.includes('@')) {
    this.sharedService
    .getUserProfileByEmail(
      this.globalData.contentOwnerId,
      Constants.apiQueryString
    )
    .subscribe(
      (userProfileData) => {
        this.propertiesFormData.patchValue({
          contentOwnerName: userProfileData['displayName']
        })
        if(this.activityTabs) {
          this.activityTabs.contentOwnerId = userProfileData['displayName'];
        }
        //this.contentOwner1 =  this.activityTabs.contentOwnerId;
        //console.log('content owner in global data',this.contentOwner1);
      },
      (error) => {
        console.error('There was an error!', error);
      }
    );
    }
    if(this.globalData.author && this.globalData.author.includes('@')) {
      this.sharedService
      .getUserProfileByEmail(
        this.globalData.author,
        Constants.apiQueryString
      )
      .subscribe(
        (userProfileData) => {
          this.email = userProfileData['email'];
          this.propertiesFormData.patchValue({
            authors: userProfileData['displayName']
          })
          if(this.activityTabs) {
            this.activityTabs.author = userProfileData['displayName'];
          }
        },
        (error) => {
          console.error('There was an error!', error);
        }
      );
      }
  }

  filterClassifers(name) {
    if ( name?.length ) {
      this.filteredClassifers = this.classifiersDropDownList?.filter((node) => {
        return new RegExp(name.toLocaleLowerCase()).test(
          node.description.toLocaleLowerCase()
        );
      });
    }

  }

  getDisplayClassifier(val) {
    return this.classifiersDropDownList?.find(classifier => classifier.classifiersId === val)?.description;
  }
  getUserInfo(){
    let userProfileData = this.sharedService.getHeaderRequestedData();

    if ( !userProfileData ) {
      userProfileData = JSON.parse(
        sessionStorage.getItem('userProfileData')
      );
    }
    this.loggedInUserNationality = userProfileData?.nationality || '';
  }

  updateGlobalData(data) {
    if ( data.contentId ) {
      this.globalData.contentId = data.contentId;
    }
  }

  toggleAllSelection(select) {
    if ( this.allPhaseSelected ) {
      select.options.forEach(item => item.select());
    } else {
      select.options.forEach(item  => item.deselect());
    }
  }

  onPhaseOptionClicked(select) {
    this.allPhaseSelected = select?.value?.length === this.setOfPhasesList.length;
  }

  get currentLoginUser(){
    return sessionStorage.getItem('userMail');
  }

  get isTocDocument(){
    return this.contentType?.toLowerCase() === 'toc';
  }

  get isEditableMode() {
    return this.globalData?.assetStatus !== ASSET_STATUSES.PUBLISHED && this.globalData?.assetStatus !== ASSET_STATUSES.CURRENT && this.globalData?.assetStatus !== ASSET_STATUSES.OBSOLETE && this.globalData?.assetStatus !== ASSET_STATUSES.ARCHIVED && (this.globalData?.assetStatus !== ASSET_STATUSES.SUBMITTED_FOR_APPROVAL || this.isContentOwner);
  }

  get isContentOwner() {
    return this.globalData?.contentOwnerId === sessionStorage.getItem('userMail');
  }
}
