import { Injectable } from '@angular/core';
import { DisciplineCodeList, componentWICDdocList, ActivityPageList, activityCompnentIframe, contentCollaborationWithHistory } from './activity-page.model';
import { Observable } from 'rxjs';
import { HttpHelperService } from '@app/shared/http-helper.service';
import { WiDropDownList } from '@app/create-document/create-document.model';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { environment } from '@environments/environment';


@Injectable({
  providedIn: 'root'
})
export class LeftSectionSearchService {
  getIframeId() {
    throw new Error("Method not implemented.");
  }
  constructor(
    private httpHelper: HttpHelperService,
    private http: HttpClient
  ) { }


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
}

