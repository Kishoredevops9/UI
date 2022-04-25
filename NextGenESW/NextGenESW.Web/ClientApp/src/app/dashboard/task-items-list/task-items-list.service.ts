import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TaskItemsList } from '../task-items-list/task-items-list.model';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})


export class TaskItemsListService {

  constructor(private http: HttpClient) { }

  taskURL = environment.taskAPI;

  /*
  // Get call to load task items List
  getTaskList(): Observable<TaskItemsList[]> {
    let url = '../../../assets/data/task-items-list.json'
    return this.http.get<TaskItemsList[]>(url);
  }
  */

  // Get call to load task items List
  getTaskList(from = 0, size = 0): Observable<TaskItemsList[]> {
    const email = localStorage.getItem('logInUserEmail');
    return this.http.get<TaskItemsList[]>(`${ this.taskURL }task/gettasksbyuserid?userId=${ email }&from=${ from }&size=${ size }`);
  }

  getSearchTaskList($query, s, l): Observable<any> {
    return this.http.get(this.taskURL + `task/SearchTask?${$query}&from=${s}&size=${l}`);

  }

  getSearchTaskListByFilter(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
    };

    return this.http.post(
      this.taskURL + `task/SearchTask`,
      param,
      httpOptions
    );
  }




  removeTaskList(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
    };

    return this.http.put(
      this.taskURL + '/usertask/removebookmark',
      param,
      httpOptions
    );

  }



  addToBookmark(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
    };

    return this.http.post(
      this.taskURL + '/usertask/addbookmark',
      param,
      httpOptions
    );

  }


  getAllRp() {

    let email = sessionStorage.getItem('userMail');
    return this.http.get<TaskItemsList[]>(this.taskURL + `controllingprogram/GetRestrictingProgramsByUserId?userId=${email}`);

  }

  getTasksInUsed(contentId, version) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      })
    };

    return this.http.get(
      `${ this.taskURL }taskcomponent/GetTasksInUsed?contentId=${ contentId }&version=${ version }`,
      httpOptions
    );
  }

}
