import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, pipe } from 'rxjs';
import { Injectable } from '@angular/core';
import { ProcessMap, Activity, ActivityEdit, ActivityGroup, ProcessMapMetaData, ActivityMeta, Connector, Phase, EditActivityGroup } from './process-maps.model';
import { environment } from '@environments/environment';
import { ProcessMapDataModelServerReq } from '@app/shared/component/properties/properties.model';
import { SharedService } from '@app/shared/shared.service'
import { shareReplay, tap } from 'rxjs/operators';
import { RecordsService } from '@app/shared/records.service';

@Injectable({
  providedIn: 'root'
})
export class ProcessMapsService {

  constructor(private http: HttpClient, private sharedService: SharedService, private rservice: RecordsService,
  ) { }

  baseUrl = environment.processMapAPI;
  apiurl = environment.apiUrl;

  //baseUrl = "http://activitymaps.azurewebsites.net/api/";

  //Load Activity Map List
  getProcessMaps(): Observable<ProcessMap[]> {
    return this.http.get<ProcessMap[]>(this.baseUrl + "processmaps/getallprocessmaps");
  }


  getactivityDetailByID(id: number): Observable<ProcessMap> {
    return this.http.get<ProcessMap>(this.apiurl + "/ActivityPage/GetActivityPageById?id=" + id);
  }
  getMapIdByVcid(version, contentid) {

    return this.http.get(`${this.baseUrl}processmaps/GetProcessMapIdByContentIdAndVersion?contentId=${contentid}&version=${version}`);


  }






  /*Function to get user profile data in header*/
  getUserProfileData(userProfileDataObj) {
    var params = [];
    for (var key in userProfileDataObj) {
      if (userProfileDataObj.hasOwnProperty(key) && userProfileDataObj[key]) {
        params.push(userProfileDataObj[key])
      }
    }
    var headerRequestedData = params.join(":");
    return headerRequestedData;
  }

  /*Function to pass userinfo data in header*/
  getHeaderOptionValue() {
    let userProfileDataObj = this.sharedService.getHeaderRequestedData();
    if (userProfileDataObj) {
      var headerRequestedData = this.getUserProfileData(userProfileDataObj);
    } else {
      let userProfileDataObj = JSON.parse(sessionStorage.getItem('userProfileData'));
      var headerRequestedData = this.getUserProfileData(userProfileDataObj);
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'userinfo': headerRequestedData
      }),
    };
    return httpOptions;
  }

  getProcessMapbyID(mapId: any, routeData:any): any{    
    const userEmail = sessionStorage.getItem('userMail');
    const status = routeData ? routeData : 'published';
    const version = sessionStorage.getItem('sfversion') ? sessionStorage.getItem('sfversion') : '0';
    const contentType = sessionStorage.getItem('sfcontentType') ? sessionStorage.getItem('sfcontentType') : 'SF';
    return this.http.get<ProcessMap>(`${this.baseUrl}processmaps/getprocessmapsbyid?id=${mapId}&contentType=${contentType}&status=${status}&currentUserEmail=${userEmail}`);

  }


  getProcessMapbycontentID(mapId: any, contentType: any , version:any, Cstatus?: any): any{
    version = version || 1;
    let status = sessionStorage.getItem('contentType') ? sessionStorage.getItem('contentType') : Cstatus;
    const userEmail = sessionStorage.getItem('userMail');
    // const version =( sessionStorage.getItem('sfversion') && sessionStorage.getItem('sfversion')!= 'undefined' )? sessionStorage.getItem('sfversion') : '0';
    return this.http.get<ProcessMap>(`${this.baseUrl}processmaps/getprocessmapsbyid?contentId=${mapId}&contentType=${contentType}&status=published&version=${version}&currentUserEmail=${userEmail}`);
  }







  //Load Selected Product

  private config$:  any = {} ;

  getProcessMap(mapId: any, contentId?: any, contentType?: any, status?: any, versionNo?: any): Observable<ProcessMap> {
    var httpOptions = this.getHeaderOptionValue();
    const userEmail = sessionStorage.getItem('userMail');
    const version = versionNo ? versionNo : '0';
    if(contentId){
      return this.http.get<ProcessMap>(`${ this.baseUrl }processmaps/getprocessmapsbyid?id=${ mapId }&contentId=${ contentId }&contentType=${ contentType }&status=${ status }&version=${ version }&currentUserEmail=${ userEmail }`, httpOptions)
    }
    else{
      return this.http.get<ProcessMap>(`${ this.baseUrl }processmaps/getprocessmapsbyid?id=${ mapId }&contentType=${ contentType }&status=${ status }&version=${ version }&currentUserEmail=${ userEmail }`, httpOptions)
    }

  }


  // getExportXls(mapId: number): Observable<ProcessMap> {
  //   return this.http.get<ProcessMap>(this.baseUrl + "processmaps/exportprocessmaptoexcel?id=" + mapId);
  // }

  getExportXls(id: number, url): any {
    return this.http.get(
      environment.processMapAPI + "processmaps/exportprocessmaptoexcel?id=" + id +"&url=" +url, { responseType: 'blob' });
  }

  getExportoXlsSF(id: number,url): any {
    return this.http.get(
      this.baseUrl + "processmaps/exportstepflowtoexcel?id=" + id +"&url=" +url, { responseType: 'blob' });
  }
  getExportoXlsStep(id: number,url): any {
    return this.http.get(
      this.baseUrl + "processmaps/exportsteptoexcel?id=" + id +"&url=" +url, { responseType: 'blob' });
  }



  getActivitiesByProcessmapID(mapId: number): Observable<ProcessMap> {
    //8day back  https://eksprocessmap.azurewebsites.net/api/activityblocks/getactivityblocksbyprocessmap?processMapId=11
    return this.http.get<ProcessMap>(this.baseUrl + "activityblocks/getactivityblocksbyprocessmap?processMapId=" + mapId);
  }




  //Add Process Map to List
  addProcessMap(model: ProcessMap): Observable<ProcessMap> {
    return this.http.post<ProcessMap>(this.baseUrl + "process-maps/", model);
  }
  //Copy from exitsing process map
  copyProcessMap(mapId: number | string): Observable<ProcessMap> {
    return this.http.post<ProcessMap>(this.baseUrl + "process-maps/createfrom/" + mapId, '');
  }
  //Update Process Map
  editProcessMap(mapId: string | number, changes: Partial<ProcessMap>): Observable<ProcessMap> {
    return this.http.put<ProcessMap>(this.baseUrl + "process-maps/" + mapId, changes);
  }


  editProcessMapUpAndDown(data) {

    return this.http.put(this.baseUrl + "processmaps/updateprocessmapspurpose", data);
  }
  updatePurposepublicStep(data) {
    return this.http.put(this.baseUrl + "publicsteps/updatepublicstepspurpose", data);
  }
  //Add Activity to List

  //   "activityDocuments": [
  //     {
  //       "id": 0,
  //       "contentId": "string",
  //       "activityBlockId": 0,
  //       "uri": "string",
  //       "type": "string",
  //       "version": 0,
  //       "createdon": "2021-01-08T11:51:10.075Z",
  //       "createdbyUserid": "string",
  //       "modifiedon": "2021-01-08T11:51:10.075Z",
  //       "modifiedbyUserid": "string",
  //       "subProcessMapId": 0,
  //       "activityPageId": 0,
  //       "label": "string"
  //     }
  //   ]
  // }

  addActivity(mapId: number, model: Activity): Observable<Activity> {
    this.rservice.UpdateBroadcastMessage('true');
    let modelValue = { ...model }                     // need to change ANUPAM
    modelValue['processMapId'] = mapId;
    return this.http.post<Activity>(this.baseUrl + "activityblocks/createactivityblocks", modelValue).pipe(
      tap(() => this.rservice.UpdateBroadcastMessage('false'))
    );
  }
  addStepActivity(modelValue): Observable<Activity> {
    // let modelValue = { ...model }                     // need to change ANUPAM
    // modelValue['processMapId'] = mapId;
    // modelValue['version'] = 1;
    return this.http.post<Activity>(this.baseUrl + "activityblocks/createactivityblocks", modelValue);
  }

  //edit activity
  editActivity(activity: any): Observable<Activity> {
    return this.http.put<Activity>(this.baseUrl + "activityblocks/updateactivityblocks", activity);
  }

  //Add Group to List
  addGroup(mapId: number, model: ActivityGroup): Observable<ActivityGroup> {

    var modelValue = { ...model }                     // need to change ANUPAM
    modelValue['processMapId'] = mapId;

    return this.http.post<ActivityGroup>(this.baseUrl + "swimlanes/createswimlanes", modelValue);
  }


  createSwimlane(data) {
    return this.http.post(this.baseUrl + "swimlanes/createswimlanes", data);
  }




  updateGroup(group: ActivityGroup) {
    return this.http.put<ActivityGroup>(
      `${this.baseUrl}swimlanes/updateswimlanes`,
      group
    );
  }


  updateMapGroup(group: any): Observable<ActivityGroup> {
    return this.http.put<ActivityGroup>(`${this.baseUrl}swimlanes/updateswimlanes`, group);
  }

  //delete Group to List
  deleteProcessMapGroup(mapId: number, groupId: number) {
    return this.http.delete<ActivityGroup>(this.baseUrl + "process-maps/" + mapId + "/activity-groups/" + groupId);
  }

  //delete Swimalne
  deleteSwimlane(id: number) {
    return this.http.delete<ActivityGroup>(this.baseUrl + "swimlanes/deleteswimlanes?id=" + id);
  }
  //Update Group to Process Map
  editProcessMapGroup(mapId: number, groupId: string | number, changes: Partial<ActivityGroup>): Observable<ActivityGroup> {
    return this.http.put<ActivityGroup>(this.baseUrl + "process-maps/" + mapId + "/activity-groups/" + groupId, changes);
  }

  editProcessMapGroups(mapId: number, changes: Partial<ActivityGroup[]>): Observable<ActivityGroup[]> {
    return this.http.put<ActivityGroup[]>(this.baseUrl + "process-maps/" + mapId + "/activity-groups/", changes);
  }

  //Update Activity Map
  // editProcessMapActvity(activityId: string | number, changes: Partial<Activity>): Observable<Activity> {
  //   return this.http.put<Activity>(this.baseUrl + "activities/" + activityId, changes);
  // }

  //Delete Process Map to List
  deleteProcessMap(mapId: string) {
    return this.http.delete<ProcessMap[]>(this.baseUrl + "processmaps/deleteprocessmaps?id=" + mapId);
  }

  deleteProcessMapActivity(activityId: string) {
    return this.http.delete<Activity[]>(this.baseUrl + 'activityblocks/deleteactivityblocks?id=' + activityId);
  }

  //Manage Meta Data

  //Add Meta Data to Process Map
  addProcessMapMetaData(mapId: number, model: ProcessMapMetaData): Observable<ProcessMapMetaData> {
    return this.http.post<ProcessMapMetaData>(this.baseUrl + "process-maps/" + mapId + "/metadata/", model);
  }

  //Delete Meta Data to Process Map
  deleteProcessMapMetaData(mapId: number, metaDataId: number) {
    return this.http.delete<ProcessMapMetaData>(this.baseUrl + "process-maps/" + mapId + "/metadata/" + metaDataId);
  }


  //Add Meta Data to Activities
  addActivitiesMetaData(activityId: number, model: ActivityMeta): Observable<ActivityMeta> {
    return this.http.post<ActivityMeta>(this.baseUrl + "activities/" + activityId + "/metadata/", model);
  }

  //Delete Meta Data to Activities
  deleteActivitiesMetaData(activityId: number, activityMeta: number) {
    return this.http.delete<ActivityMeta>(this.baseUrl + "activities/metadata/" + activityMeta);
  }

  postActivityConnector(activityId: number, model: Connector): Observable<Connector> {
    return this.http.post<Connector>(this.baseUrl + "activityconnections/createactivityconnections", model);
  }

  updateActivityConnector(connectorId: number, changes: Partial<Connector>) {
    return this.http.put<Connector>(this.baseUrl + 'activityconnections/updateactivityconnections', changes);
  }

  deleteActivityConnector(connector: number) {
    return this.http.delete<ActivityMeta>(this.baseUrl + "activityconnections/deleteactivityconnections?id=" + connector);
  }


  //Load All Activity Pages
  getAllActivityPages(): Observable<any> {

    //  return this.http.get(this.baseUrl + "ActivityPages/getallactivitypages");


    let quertyString = { "searchText": "q=assettypecode:('A') AND assetstatusid:(1)&from=0&size=1000" }
    return this.http.post(environment.EKSInternalSearchAPI, quertyString);

  }
  getAllStepPages(): Observable<any> {

    //  return this.http.get(this.baseUrl + "ActivityPages/getallactivitypages");


    let quertyString = { "searchText": "q=assettypecode:('P') AND assetstatusid:(1)&from=0&size=1000" }
    return this.http.post(environment.EKSInternalSearchAPI, quertyString);

  }

  getAllStepFlowPages(): Observable<any> {

    //  return this.http.get(this.baseUrl + "ActivityPages/getallactivitypages");


    let quertyString = { "searchText": "q=assettypecode:('F') AND assetstatusid:(1)&from=0&size=1000" }
    return this.http.post(environment.EKSInternalSearchAPI, quertyString);

  }



  //Load Activity Map List
  getAllProcessMap(): Observable<ProcessMap[]> {
    return this.http.get<any[]>(this.baseUrl + "processmaps/getallprocessmaps");
  }

  GetAllPhases(id: any): Observable<any> {
    return this.http.get<any[]>(this.baseUrl + "phases/getphasesbymapid?processMapId=" + id)
  }
  GetAllActivity(): Observable<any> {
    return this.http.get<any[]>(this.baseUrl + "activityblocktypes/getallactivityblocktypes")
  }

  createProcessMapPhase(param: Partial<Phase>): Observable<Phase> {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post<Phase>(
      this.baseUrl + 'phases/createphases',
      param,
      httpOptions
    );
  }

  CreateProcessMapConnector(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(this.baseUrl + 'activityconnections/createactivityconnections',
      param,
      httpOptions
    );
  }

  deleteProcessMapPhase(phaseId: number): Observable<boolean> {
    return this.http.delete<boolean>(this.baseUrl + 'phases/deletephases?id=' + phaseId);
  }

  updateProcessMapPhase(phase: Partial<Phase>): Observable<Phase> {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };

    return this.http.put<Phase>(
      `${this.baseUrl}phases/updatephases`,
      phase,
      httpOptions
    );
  }

  updateProcessMapData(data) {
    return this.http.put(this.baseUrl + "processmaps/updateprocessmapspurpose", data);
  }

  // Save As API
  // saveAsStepflow(stepflowId:number|string): Observable<ProcessMap> {
  //   return this.http.post<ProcessMap>(this.baseUrl + "processmaps/saveasstepflow/"+stepflowId,'');
  // }

  saveAsStepflow(param) {
  const params = {
    ...param,
    createdUser: sessionStorage.getItem('userMail')
  };
    // param.AADid = sessionStorage.getItem('AADid');
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(
      this.baseUrl + 'processmaps/saveasstepflow',
      params,
      httpOptions
    );
  }
  saveAsStep(param) {
    const params = {
      ...param,
      createdUser: sessionStorage.getItem('userMail')
    };
    // param.AADid = sessionStorage.getItem('AADid');
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(
      this.baseUrl + 'processmaps/saveasstep',
      params,
      httpOptions
    );
  }



  // Revise API
  reviseStepflow(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    const params = {
      ...param,
      createdUser: sessionStorage.getItem('userMail')
    };
    return this.http.post(
      this.baseUrl + 'processmaps/revisestepflow',
      params,
      httpOptions
    );
  }
  reviseStep(param) {
    const params = {
      ...param,
      createdUser: sessionStorage.getItem('userMail')
    };
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(
      this.baseUrl + 'processmaps/revisestep',
      params,
      httpOptions
    );
  }

  updateActivityBlockSequence(activityBlockData) {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    return this.http.put(
      this.baseUrl + 'activityblocks/updateactivityblockssequence',
      activityBlockData,
      httpOptions
    );
  }

  updateDisciplinesSequence(disciplineDatas) {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    return this.http.put(
      this.baseUrl + 'swimlanes/updateswimlanessequence',
      disciplineDatas,
      httpOptions
    );
  }

  // GetStepFlowByContentId(ContentId: number,version: number): Observable<ProcessMap> {
  //   return this.http.get<ProcessMap>(this.baseUrl + "processmaps/GetStepByIdOrContentId?contentId=" + ContentId);
  // }

  deleteStep(stepId: number) {
    return this.http.delete(`${this.baseUrl}processmaps/DeleteStep?id=${stepId}`);
  }

  getProcessMapIdByContentIdAndVersion(contentId: string, version: number = 1) {
    return this.http.get<number>(
      `${this.baseUrl}/processmaps/GetProcessMapIdByContentIdAndVersion?contentId=${contentId}&version=${version}`
    );
  }

  getProcessMapForTaskExecution(contentId: string, version: number = 1) {
    const userEmail = sessionStorage.getItem('userMail');
    return this.http.get<ProcessMap>(
      `${this.baseUrl}processmaps/getprocessmapsbyid?contentId=${contentId}&contentType=SF&status=published&version=${version}&currentUserEmail=${userEmail}`,
    );
  }

}
