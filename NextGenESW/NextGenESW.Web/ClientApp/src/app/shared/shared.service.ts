import { EventEmitter, Injectable } from '@angular/core';
import { of, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { shareReplay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private userProfileByEmail = {};
  private opened: any;
  private loading: any;
  private ctype: any;
  private contenID: any;
  private nTab: any;
  private data: any;
  private preview: any;
  public existingMapData: any;
  private blankMapData: any;
  private Docstatus: any;
  stepStatus: any;
  bachToPreview: any;
  isStepPublished: any;

  public SaveASMapData: any;
  public SaveASFileData: any;
  private editActivityData: any;
  private phase: any;
  private tags: any;
  private Stepflowtitle: any;
  baseUrl = environment.siteAdminAPI;
  baseUrlSecurity = environment.siteSecurityAPI;
  private activityTaskComponentId;

  chipmessage = new EventEmitter();
  sendMessage = new EventEmitter();
  resiveMessage = new EventEmitter();
  activeSw = new EventEmitter();
  taskSearch = new EventEmitter();

  electedEKSreload = new EventEmitter();
  eksLoadAll  = new EventEmitter();

    initSelectedBuildTask = new EventEmitter();

  private _dataValues = new Subject<boolean>();
  dataValues$ = this._dataValues.asObservable();

  private _loadingValue = new Subject<boolean>();
  loadingValues$ = this._loadingValue.asObservable();

  private _preview = new Subject<boolean>();
  preview$ = this._preview.asObservable();

  private _publish = new Subject<boolean>();
  publish$ = this._publish.asObservable();
  private requestedHeaderData: any;
  counter = 0;
  collectionCounter = [];
  EKSCollectionCounter = [];
  FilterCollectionCounter = [];
  count: BehaviorSubject<number>;
  collection: BehaviorSubject<any>;
  EKSCollection: BehaviorSubject<any>;
  FilterCollection: BehaviorSubject<any>;
  searchTerm: BehaviorSubject<any>;
  dragDropAP:BehaviorSubject<any>;
  statusTerm: BehaviorSubject<any>;
  stepflowID: BehaviorSubject<any>;
  ownerEditBTN: BehaviorSubject<any>;
  publishedDrgDrp: BehaviorSubject<any>;
  stepflowPublished: BehaviorSubject<any>;
  backToStep: BehaviorSubject<any>;
  docValue: BehaviorSubject<any>;
  BackToPriviewValue: BehaviorSubject<any>;
  sharedStepPublished: BehaviorSubject<any>;

  searchTermValue: '';
  dragDropActivity:'';
  stepflowIDValue: '';
  stepflowPublishedValue: '';
  backToStepValue: '';
  assestStatusValue: '';
  backToPriviewMode: '';
  assestStatusPublishedValue: '';
  statusTermValue: '';
  ownerEditBtn:'';
  publishedDD:'';

  constructor(private httpClient: HttpClient) {
    this.opened = true;
    this.loading = false;
    this.count = new BehaviorSubject(this.counter);
    this.collection = new BehaviorSubject(this.collectionCounter);
    this.searchTerm = new BehaviorSubject(this.searchTermValue);
    this.dragDropAP = new BehaviorSubject(this.dragDropActivity);
    this.statusTerm = new BehaviorSubject(this.statusTermValue);
    this.stepflowID = new BehaviorSubject(this.searchTermValue);
    this.ownerEditBTN = new BehaviorSubject(this.ownerEditBtn);
    this.publishedDrgDrp = new BehaviorSubject(this.publishedDD);
    this.docValue = new BehaviorSubject(this.stepflowIDValue);
    this.stepflowPublished = new BehaviorSubject(this.stepflowPublishedValue);
    this.BackToPriviewValue = new BehaviorSubject(this.backToPriviewMode);
    this.sharedStepPublished = new BehaviorSubject(
      this.assestStatusPublishedValue
    );
    this.backToStep = new BehaviorSubject(this.backToStepValue);
    this.EKSCollection = new BehaviorSubject(this.EKSCollectionCounter);
    this.FilterCollection = new BehaviorSubject(this.FilterCollectionCounter);

    this.sendMessage.subscribe((data) => {
      console.clear();
      console.log(data);
      setTimeout(() => {
        this.resiveMessage.emit(data.tabindex);
      }, data.time);
    });
  }
  titleName = new BehaviorSubject('');
  publishedDrag(publishedDrgDrp) {
    console.log('publishedDrgDrp',publishedDrgDrp);
    this.publishedDrgDrp.next(publishedDrgDrp);
  }
  ownerCanEdit(ownerEditBTN) {
    this.ownerEditBTN.next(ownerEditBTN);
  }

  backToStepflowShared(backToStepData) {
    this.backToStep.next(backToStepData);
  }

  nextSearchTerm(searchTerm) {
    this.searchTerm.next(searchTerm);
  }

  apDragDropData(dragDropAP) {
    this.dragDropAP.next(dragDropAP);
  }

  stepflowGlobalData(stepflowID) {
    this.stepflowID.next(stepflowID);
  }
  stepflowpublishData(stepflowPublished) {
    this.stepflowPublished.next(stepflowPublished);
  }
  backToStepflowPreview(backToPriviewData) {
    this.bachToPreview = backToPriviewData;
    this.BackToPriviewValue.next(backToPriviewData);
  }

  nextRecallStatus(statusTerm) {
    this.statusTerm.next(statusTerm);
  }

  nextDocStatus(docStatusValue) {
    this.stepStatus = docStatusValue;
    this.docValue.next(docStatusValue);
    console.log(this.docValue, this.assestStatusValue);
  }

  nextStepPublishedData(stepStatusValue) {
    this.isStepPublished = stepStatusValue;
    this.sharedStepPublished.next(stepStatusValue);
    console.log(this.sharedStepPublished);
  }

  nextCollection(collection, param) {
    if (collection && collection.length > 0) {
      this.collection.next(param);
    } else {
      this.collection.next(param);
    }
  }

  nextEKSCollection(EKSCollection, param) {
    if (EKSCollection && EKSCollection.length > 0) {
      this.EKSCollection.next(param);
    } else {
      this.EKSCollection.next(param);
    }
  }

  nextFilterCollection(FilterCollection, param) {
    if (FilterCollection && FilterCollection.length > 0) {
      this.FilterCollection.next(param);
    } else {
      this.FilterCollection.next(param);
    }
  }

  setContentId(value: any) {
    this.contenID = value;
  }
  getContentId(): any {
    return this.contenID;
  }

  set isLoading(value: any) {
    this.loading = value;
  }
  get isLoading(): any {
    return this.loading;
  }

  set contentType(value: any) {
    this.ctype = value;
  }
  get contentType(): any {
    return this.ctype;
  }

  setStepflowtitle(value: any) {
    this.Stepflowtitle = value;
  }
  getStepflowtitle() {
    return this.Stepflowtitle;
  }
  setNextTab(value: any) {
    this.nTab = value;
  }
  getNextTab(): any {
    return this.nTab;
  }

  setData(value: any) {
    this.data = value;
  }
  getData(): any {
    return this.data;
  }

  setPreviewVal(value: any) {
    this.preview = value;
  }
  getPreviewVal(): any {
    return this.preview;
  }

  sendValue(values: boolean) {
    this._dataValues.next(values);
  }

  setLoading(value: boolean) {
    this._loadingValue.next(value);
  }

  setPreview(value: boolean) {
    this._preview.next(value);
  }

  setExistingMapData(processMap: any) {
    this.existingMapData = processMap;
  }

  getExistingMapData() {
    return this.existingMapData;
  }

  setBlankMapData(blankMap: any) {
    this.blankMapData = blankMap;
  }

  getBlankMapData() {
    return this.blankMapData;
  }

  setSaveASMapData(processMap: any) {
    this.SaveASMapData = processMap;
  }

  getSaveASMapData() {
    return this.SaveASMapData;
  }

  setFileUploadData(fileData: any) {
    this.SaveASFileData = fileData;
  }

  getFileUploadData() {
    return this.SaveASFileData;
  }

  setEditActivityData(aditActivity: any) {
    this.editActivityData = aditActivity;
  }

  getEditActivityData() {
    return this.editActivityData;
  }

  setPublish(value: boolean) {
    this._publish.next(value);
  }

  getDisciplineDynamicMenuListData() {
    return this.httpClient.get(
      this.baseUrl + 'eksdisciplines/geteksdisciplinesmap'
    );
  }

  getAllHelps() {
    return this.httpClient.get(this.baseUrl + 'EKSHelp/GetAllHelps');
  }

  getUserProfileByEmail(
    email: string,
    apiQueryString: string
  ): Observable<any> {
    const queryString = `${ apiQueryString }=${ email }`;

    if ( this.userProfileByEmail[queryString] ) {
      return this.userProfileByEmail[queryString];
    }

    return this.userProfileByEmail[queryString] = this.httpClient.get<any>(
      this.baseUrlSecurity +
      `UserProfileProvider/GetUserProfile?${ queryString }`
    ).pipe(
      tap(response => this.userProfileByEmail[queryString] = of(response)),
      shareReplay(1)
    );
  }

  setHeaderRequestedData(requestObject: any) {
    //console.log("setHeaderRequestedData requestObject",requestObject);
    this.requestedHeaderData = requestObject;
  }

  getHeaderRequestedData() {
    return this.requestedHeaderData;
    //console.log("getHeaderRequestedData",this.requestedHeaderData);
  }
  getActivitytaskComponentId() {
    return this.activityTaskComponentId;
  }

  setActivitytaskComponentId(activityTaskCID: any) {
    this.activityTaskComponentId = activityTaskCID;
  }
}
