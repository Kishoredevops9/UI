import { BehaviorSubject } from 'rxjs';


import { Injectable } from '@angular/core';
import {
  HttpHeaders,
  HttpClient,
  HttpEvent,
  HttpEventType,
} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, ReplaySubject  } from 'rxjs';
import { HttpHelperService } from '@app/shared/http-helper.service';
import {
  CategoryList,
  CreateDocument,
} from '@app/create-document/create-document.model';
import { shareReplay, tap } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';


@Injectable({
  providedIn: 'root',
})
export class TaskRecordsService1 {
  geometries: any[]; 
  properties: any[];
//   broadCastMessageStart1: any = '';
//   private broadCastMessage1 = new BehaviorSubject<any>(
//     this.broadCastMessageStart1
//   );
//   broadcast = this.broadCastMessage1.asObservable();

//   constructor(private httpClient: HttpClient) {}

//   // For updating behavior subject through below method
//  // UpdateBroadcastMessage(newMessage: any) {

 
//     GetTaskAuthorizations(id,data) {
//       var abc:any;
//       const httpOptions = {
//         headers: new HttpHeaders({
//           Accept: 'application/json',
//           'Content-Type': 'application/json',
//         }),
//       };
//       return  this.httpClient.get(environment.taskAPI +`usertask/GetTaskAuthorizations?taskId=${id}&userId=${data}`,httpOptions).pipe(
//         tap(response => {
//           this.broadCastMessage1.next(
//             abc = response
//           );
          

//         })
//         );
//     }

//   //  this.broadCastMessage1.next(newMessage);
//  // }

private _earthquakeData$ = new ReplaySubject<any>(1,1);

  constructor(private readonly httpClient: HttpClient) {}

  getEarthquakeData(): Observable<any> {
    // return the subject here
    // subscribers will will notified when the data is refreshed
    return this._earthquakeData$.asObservable(); 
  }

  refreshEarthquakeData(id,data): Observable<any> {
      const httpOptions = {
        headers: new HttpHeaders({
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }),
      };
    return this.httpClient.get<any>(environment.taskAPI +`usertask/GetTaskAuthorizations?taskId=${id}&userId=${data}`,httpOptions).pipe(
      tap(response => {
        // notify all subscribers of new data
        this._earthquakeData$.next({response
          //geometries: response.map(x => x.geometry),
          //properties: response.map(x => x.properties)
        });
      })
    );
  }

}
