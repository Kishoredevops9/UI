import { Injectable } from '@angular/core';
import { DisciplineCodeList, componentWICDdocList, ActivityPageList, activityCompnentIframe, contentCollaborationWithHistory } from '@app/activity-page/activity-page.model';
import { Observable } from 'rxjs';
import { HttpHelperService } from '@app/shared/http-helper.service';
import { WiDropDownList } from '@app/create-document/create-document.model';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { EngineModelGroupDropDownList, InitialEngineModelDropDownList, EngineSectionDropDownList, EngineSectionList, TagSearchViewData } from './task-tab-one-content.model';
import { T } from '@angular/cdk/keycodes';
import { shareReplay, tap } from 'rxjs/operators';
import { SharedService } from '@app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class TabOneContentService {
  getIframeId() {
    throw new Error("Method not implemented.");
  }
  constructor(
    private httpHelper: HttpHelperService,
    private http: HttpClient,
    private sharedService: SharedService
  ) { }

  taskURL = environment.taskAPI;

  getActivityWICDDocList(): Observable<componentWICDdocList[]> {
    return this.httpHelper.get<componentWICDdocList[]>(`ActivityPage/GetAllWICDDocs`);
  }

  getDisciplineCodeList(): Observable<DisciplineCodeList[]> {
    return this.httpHelper.get<DisciplineCodeList[]>(
      'ActivityPage/GetAllDisciplineCode'
    );
  }

  getSubSubDisciplineList(): Observable<WiDropDownList[]> {
    return this.httpHelper.get<WiDropDownList[]>(
      'ActivityPage/GetAllSubSubDiscipline'
    );
  }

  getComponentIframeID(id: number): Observable<activityCompnentIframe[]> {
    console.log("Iframe", id)
    return this.httpHelper.get<activityCompnentIframe[]>(`Extraction/${id}`);
  }

  CreateNewActivityPage(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
    };

    return this.http.post(
      // 'https://pwcontentmanagement.azurewebsites.net/api/ActivityPage/CreateActivityPage',
      environment.apiUrl + 'ActivityPage/CreateActivityPage',
      param,
      httpOptions
    );

  }

  UpdatePurposeInActivityPage(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
    };

    return this.http.put(
      // 'https://pwcontentmanagement.azurewebsites.net/api/ActivityPage/UpdatePurposeInActivityPage',
      environment.apiUrl + '/ActivityPage/UpdatePurposeInActivityPage',
      param,
      httpOptions
    );

  }


  addComponent(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
    };

    return this.http.post(
      // 'https://pwcontentmanagement.azurewebsites.net/api/ActivityContainer/AddActivityContainer',
      environment.apiUrl + '/ActivityContainer/AddActivityContainer',
      param,
      httpOptions
    );
    console.log(param)
  }

  UpdateComponent(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
    };

    return this.http.put(
      // 'https://pwcontentmanagement.azurewebsites.net/api/ActivityContainer/UpdateActivityContainer',
      environment.apiUrl + '/ActivityContainer/UpdateActivityContainer',
      param,
      httpOptions
    );

  }

  deleteComponent(id) {
    return this.http.delete(
      // `https://pwcontentmanagement.azurewebsites.net/api/ActivityContainer/DeleteActivityContainer?activityContainerId=${id}`);
      environment.apiUrl + 'ActivityContainer/DeleteActivityContainer?activityContainerId=${id}');
  }


  getActivityPageList(id: number): Observable<ActivityPageList[]> {
    return this.httpHelper.get<ActivityPageList[]>(`ActivityPage/GetActivityPageById?id=${id}`)
  }

  UpdatePropertiesInActivityPage(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
    };

    return this.http.put(
      // 'https://pwcontentmanagement.azurewebsites.net/api/ActivityPage/UpdatePropertiesInActivityPage',
      environment.apiUrl + '/ActivityPage/UpdatePropertiesInActivityPage',
      param,
      httpOptions
    );

  }

  addContentCollaboration(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
    };

    return this.http.post(
      environment.apiUrl + '/ContentCollaboration/AddContentCollaboration',
      param,
      httpOptions
    );
  }

  updateContentCollaboration(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
    };

    return this.http.put(
      environment.apiUrl + '/ContentCollaboration/UpdateContentCollaborationHistory',
      param,
      httpOptions
    );
  }

  // getContentCollaboration(param): Observable<contentCollaborationWithHistory[]> {
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Accept': 'application/json',
  //       'Content-Type': 'application/json'
  //     }),
  //   };
  //   return this.http.post<contentCollaborationWithHistory[]>(environment.apiUrl + '/ContentCollaboration/GetContentCollaboration', param, httpOptions);
  // }

  CreateNewWorkInstruction(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
    };

    return this.http.post(
      environment.apiUrl + '/WorkInstruction/CreateNewWorkInstruction',
      param,
      httpOptions
    );
  }

  getEngineModelGroupDropDownList(dropdownType: string): Observable<EngineModelGroupDropDownList[]> {
    return this.httpHelper.get<EngineModelGroupDropDownList[]>(`MetaDataDiscipline/${dropdownType}`);
  }

  getInitialEngineModelDropDownList(): Observable<InitialEngineModelDropDownList[]> {
    return this.httpHelper.get<InitialEngineModelDropDownList[]>(
      'ActivityPage/GetAllDisciplineCode'
    );
  }

  getEngineSectionList(): Observable<EngineSectionList[]> {
    return this.http.get<EngineSectionList[]>(this.taskURL + "taskmetadata/getallenginesection");
  }

  UpdatePropertiesInTaskCreation(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };

    return this.http.put(
      environment.apiUrl + '/CriteriaGroup/UpdatePropertiesInCriteriaGroup',
      param,
      httpOptions
    );
  }

  CreateNewTaskCreation(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(this.taskURL + 'task/createtasks',
      param,
      httpOptions
    );
  }

  getTaskSearchViewListData(tagId: any, phaseId: any, titleId: any): Observable<TagSearchViewData[]> {

    if (tagId == 0) {
      tagId = "";
    }
    if (phaseId == 0) {
      phaseId = "";
    }
    if (titleId == "") {
      titleId = "";
    }

    if (titleId != "" && phaseId == 0 && tagId == 0) {
      var queryString = "(" + titleId + ")";
    } else if (phaseId != "" && titleId == 0 && tagId == 0) {
      var queryString = "(" + phaseId + ")";
    } else if (tagId != "" && titleId == 0 && phaseId == 0) {
      var queryString = "(" + tagId + ")";
    } else if (titleId != "" && phaseId != 0) {
      var queryString = "(" + titleId + "AND" + phaseId + ")";
    } else if (titleId != "" && tagId != 0) {
      var queryString = "(" + titleId + "AND" + tagId + ")";
    } else if (phaseId != "" && tagId != 0) {
      var queryString = "(" + phaseId + "AND" + tagId + ")";
    } else if (titleId != "" && phaseId != 0 && tagId != 0) {
      var queryString = "(" + titleId + "AND" + phaseId + "AND" + tagId + ")";
    } else {
      var queryString = "";
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Basic cmVhZF91c2VyOnJlYWRfdXNlcg=='
      }),
    };

    let quertyString = { "searchText": "q=" + queryString + "&from=0&size=1000" }
    return this.http.post<TagSearchViewData[]>(environment.EKSInternalSearchAPI, quertyString);
  }

  allPhases$ : any;

  getAllAssetPhases() {  
    if (!this.allPhases$){        
     let phasesURL = this.taskURL + "taskmetadata/getallassetphases";
     this.allPhases$ = this.http.get(phasesURL).pipe(
      tap(() => console.log('config fetched')),
      shareReplay(1)
    );
    }
    return this.allPhases$;  

  }

  /************************ Get Request for Build Task Tree ****************************/
  getBuildTaskMapTreeData() {
    let mapDataUrl = '../../../assets/data/task-map-tree-list.json';
    return this.http.get(mapDataUrl);
  }

  addBlankMap() {
    let mapDataUrl = '../../../assets/data/blank-map-list.json';
    return this.http.get(mapDataUrl);
  }

  getTaskById(taskId) {
    var httpOptions = this.getHeaderOptionValue();
    let url = this.taskURL + "task/gettasksbyid?id=" + taskId
    return this.http.get(url, httpOptions);
  }

  updateTask(params) {
    return this.http.put(this.taskURL + "task/updatetasks", params);
  }

  getKnowledgeTaskSearchViewListData(queryString: any): Observable<TagSearchViewData[]> {
    let quertyString = { "searchText": "q=" + queryString + "&from=0&size=1000" }
    return this.http.post<TagSearchViewData[]>(environment.EKSInternalSearchAPI, quertyString);
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


  /*Function to get user profile data in header*/  
  getUserProfileData(userProfileDataObj) {
    var params = [];
    for (var key in userProfileDataObj) {
      if (userProfileDataObj.hasOwnProperty(key) && userProfileDataObj[key]) {
        params.push(userProfileDataObj[key])
      }
    }
    var headerRequestedData = params.join("<>");
    return headerRequestedData;
  }

}

