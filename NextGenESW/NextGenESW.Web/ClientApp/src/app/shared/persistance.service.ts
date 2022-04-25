import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PersistanceService {

  constructor(private http: HttpClient) { }

  private contentListSelected = new Subject<any>();
  private profileSource = new BehaviorSubject<any>("");
  currentProfile = this.profileSource.asObservable();


  getContentListSelected(): Observable<any> {
    return this.contentListSelected.asObservable();
  }

  setContentListSelected(state: any) {
    this.contentListSelected.next(state);
  }

  getProfileData(profile:any) {
    return this.profileSource.next(profile);
  }

  retrieveAssetStatus() {
    return this.http.get( environment.apiUrl + 'Properties/GetAllAssetStatus');
  }
}
