import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ContentList, User, UserList } from '../content-list.model';
import { HttpHelperService } from '@app/shared/http-helper.service';
import { map } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CollaborateDialogService {
  url = 'https://contentcreationapi.azurewebsites.net/api/content/';

  constructor(
    private http: HttpClient,
    private httpHelper: HttpHelperService
  ) { }

  retrieveDocs() {
    return this.http.get<ContentList[]>(this.url + 'GetDocsInLib');
  }

  retrieveUsers() {
    return this.httpHelper.get<User[]>('WorkInstruction/GetAllUser');
  }

  retrieveCoauthor(name, exportgroup, outsourcable) {
    let url = environment.apiUrl + `/UserCache/GetUsersAsync?displayName=${name}&exportGroup=${exportgroup}&outsourcable=${outsourcable}`;
    return this.http.get<string>(url);
  }

  /* shareDoc(json,dialog) {
    return this.http.post(this.url+'ShareDocument', json, {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT'
      })
    }).subscribe({
      next: data => {
        console.log('Success');
        dialog.close()
      },
      error: error => console.error('There was an error!', error)
    });
  } */

  shareDoc(data: any) {
    const collabUrl$ = this.http.post<any>(
      // `https://pwcontentmanagement.azurewebsites.net/api/ToDoTask/AddCollaborateToDoTask`,
      environment.apiUrl + '/ToDoTask/AddCollaborateToDoTask',
      data
    );
    return collabUrl$.pipe(map((data) => data));
  }

  shareWeb(data: any) {
    const collabUrl$ = this.http.post<any>(
      // `https://pwcontentmanagement.azurewebsites.net/api/ToDoTask/AddCollaborateToDoTask`,
      environment.apiUrl + '/ToDoTask/AddCollaborateToDoTaskWeb',
      data
    );
    return collabUrl$.pipe(map((data) => data));
  }

  askToCoAuthor(data: any) {
    const collabUrl$ = this.http.post<any>(
      environment.apiUrl + '/Workflow/AskToCoAuthor',
      data
    );
    return collabUrl$.pipe(map((data) => data));
  }

  getContentTypes() {
    return this.httpHelper.get(`ActivityPage/GetAllContentType`)
  }


  shareWebActiveDirectory(data) {
    const collabUrl$ = this.http.post<any>(
      // `https://pwcontentmanagement.azurewebsites.net/api/ToDoTask/AddCollaborateToDoTask`,
      environment.apiUrl + '/BreakPermission/SetPermission',
      data
    );
    return collabUrl$.pipe(map((data) => data));
  }

  updateUserPermission(param) {
    return this.http.put(
      environment.apiUrl + '/ToDoTask/UpdateColloborateToDoTaskWeb',
      param,
    );

  }

  deleteUserPermission(param) {
    return this.http.delete(
      environment.apiUrl + '/ToDoTask/DeleteToDoTask?toDoId=' + param.toDoId, {
        responseType: 'text'
      }
    );

  }

  deleteActiveDirectoryUserPermission(param) {
    return this.http.delete(
      environment.apiUrl + '/BreakPermission/DeleteUserPermissionOnItem?itemId=' + param.itemId + '&userEmail=' +
      param.userEmail + '&documentType=' + param.documentType + '&AADid=' +  param.AADid
    );

  }

  getUserLists(contentId: string, userEmail: string, userName: string, docId:number): Observable<UserList[]> {
    return this.httpHelper.get<UserList[]>(
      `ToDoTask/GetAllUserByContentId?contentId=${contentId}&userMail=${userEmail}&userName=${userName}&documentId=${docId}`
    );
  }

  getUserListsActiveDirectory(contentId: number, contentType: string): Observable<UserList[]> {
    return this.httpHelper.get<UserList[]>(
      `BreakPermission/GetItemPermission?itemId=${contentId}&documenttype=${contentType}`
    );
  }
}
