import { PersistanceService } from '@app/shared/persistance.service';
import { TodoItemsList } from './todo-items-list.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '@environments/environment';
import { editActivity } from '@app/process-maps/process-maps.actions';
import pwplayResponse from 'src/assets/data/pwplay.json';
import { delay } from 'rxjs/operators';

@Injectable()
export class TodoItemsListService {
  email;
  contentidname: any;
  componenttypename: string;
  text: any;
  suggest: any;

  constructor(
    private http: HttpClient,
    private UserProfile: PersistanceService
  ) { }

  // Get Task Items List
  getTaskItemsList(from = 0, size = 0): Observable<TodoItemsList[]> {
    this.email = localStorage.getItem('logInUserEmail');
    const url = `${ environment.apiUrl }/ToDoTask/GetAllToDoTaskList?userEmail=${ this.email }&from=${ from }&size=${ size }`;
    return this.http.get<TodoItemsList[]>(url);
  }

  //Add Activity to List
  updateTaskItemsList(param): Observable<any> {
    console.log(param);
    return this.http.put<any>(environment.apiUrl + '/ToDoTask/UpdateCollaborateToDoTask',
      {
        ToDoId: 12,
      }
    );
  }

  /*EKS Internal Search fetching post data*/
  getSearchTerm(param) {
    let quertyString = { "searchText": `source={"_source":["title"],"query":{"multi_match":{"query":"${param}","fields":["title"],"lenient":true}},"highlight":{"number_of_fragments":2,"fragment_size":150,"fields":{"body":{"pre_tags":[""],"post_tags":[""]},"purpose":{"number_of_fragments":2,"order":"score"}}},"suggest":{"title-suggest":{"text":"${param}","term":{"field":"title"}}}}&source_content_type=application/json&from=0&size=1000` }
    return this.http.post(environment.EKSInternalSearchAPI, quertyString);
  }

  /*EKS Internal Advance Search fetching post data*/
  getAdvanceSearchData(queryString,searchTerm?) {
    // let quertyString = { "searchText": "q=" + queryString + "&from=" + "0" + "&size=" + "500" }
    let quertyString = {"searchText": searchTerm,"tags":"","assetTypeCode":"","disciplineCode":"","contentOwnerId":"","phaseId":"","tagsId":"","version":0,"keywords":"","from":0,"size":500}
    return this.http.post(environment.EKSInternalSearchAPI2, quertyString);
  }

  /*EKS Internal Advance Search fetching post data*/
  getAdvanceSearchEncryptedData(queryString, fieldName: any) {
    let quertyString = { "searchText": "q=" + queryString + "&_source=" + fieldName + "&from=" + "0" + "&size=" + "500" }
    return this.http.post(environment.EKSInternalSearchAPI, quertyString);
  }

  /*EKS Internal Advance Search fetching post data*/
  getAdvanceSearchDataOnCall(queryString: any, startAt: number, pageSize: number) {
    let quertyString = { "searchText": "q=" + queryString + "&from=" + startAt + "&size=" + pageSize }
    console.log("getAdvanceSearchDataOnCall queryString", quertyString);
    return this.http.post(environment.EKSInternalSearchAPI, quertyString);
  }




  allSearch(Query) {

    Object.keys(Query).forEach(function(key) {
      if(Query[key] == 'null') {
        Query[key] = '';
        if (key=='version' && Query[key] == '' ){  Query[key] = 0 ; }
      }
  });
 
  Query['isObsolete'] = (Query.obsolete=='true')? true : false;

    return this.http.post(environment.EKSInternalSearchAPI2, Query);
  }



  /*EKS Global Search fetching get data*/
  getGlobalSearchDataOnCallLocal(searchTerm: any, startAt: number, endAt: number, pageSize: number) {
    let requiredParameter;
    if (environment.EKSGlobalSearchPaginationFlag) {
      requiredParameter = "Query=" + searchTerm + "&StartAt=" + startAt + "&MaxItems=" + pageSize + "&Fields=" + environment.EKSGloablSearchExternalAPIFields;
    } else {
      requiredParameter = "Query=" + searchTerm + "&StartAt=" + startAt + "&MaxItems=" + endAt + "&Fields=" + environment.EKSGloablSearchExternalAPIFields;
    }
    console.log("getGlobalSearchDataOnCall requiredParameter", requiredParameter);
    return this.http.get(environment.EKSGlobalSearchExternalAPI + "?" + requiredParameter);
  }

  /*EKS Internal Advance Search fetching post data*/
  getGlobalSearchData(searchTerm: any, startAt: number, endAt: number, pageSize: number) {
    let requiredParameter = { "Query": searchTerm, "StartAt": environment.EKSGlobalSearchExternalAPIStartAtValue, "MaxItems": environment.EKSGlobalSearchExternalAPIMaxItemsValue, "Fields": environment.EKSGloablSearchExternalAPIFields };
    return this.http.post(environment.EKSGloablSearchExternalAPIEndPoint, requiredParameter);
  }

  /*EKS Internal Advance Search fetching post data*/
  getGlobalSearchDataOnCall(searchTerm: any, startAt: number, endAt: number, pageSize: number) {
    let requiredParameter;
    if (environment.EKSGlobalSearchPaginationFlag) {
      requiredParameter = { "Query": searchTerm, "StartAt": startAt, "MaxItems": pageSize, "Fields": environment.EKSGloablSearchExternalAPIFields };
    } else {
      requiredParameter = { "Query": searchTerm, "StartAt": startAt, "MaxItems": endAt, "Fields": environment.EKSGloablSearchExternalAPIFields };
    }
    return this.http.post(environment.EKSGloablSearchExternalAPIEndPoint, requiredParameter);
  }

  /*EKS Global Search fetching get data from mocked json for local environment*/
  getPWPlayDataByJSONFile(searchTerm: any) {
    return this.http.get(environment.EKSPWPlayExternalAPI);
  }

  /*EKS Global Search fetching post data for production environment*/
  getPWPlayData(searchTerm: any) {
    let requiredParameter = {
      'Query': searchTerm,
      'StartAt': environment.EKSGlobalSearchExternalAPIStartAtValue,
      'MaxItems': environment.EKSGlobalSearchExternalAPIMaxItemsValue,
      'userName': sessionStorage.getItem('AADid')
    };
    return this.http.post(environment.EKSPWPlayExternalAPIEndpoint, requiredParameter);
  }

}
