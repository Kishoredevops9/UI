import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { stringToKeyValue } from '@angular/flex-layout/extended/typings/style/style-transforms';

@Injectable({
  providedIn: 'root'
})
export class HttpHelperService {
  constructor(private http: HttpClient) { }

  get<T>(url) {
    return this.http.get<T>(`${environment.apiUrl}/${url}`);
  }

  post<T>(url, request) {
    return this.http.post<T>(`${environment.apiUrl}/${url}`, request);
  }

  getContentType(contentTypeId: number){
    var contentType;
    if(contentTypeId == 1){
      contentType = 'WI'
    } else if(contentTypeId == 6){
      contentType = 'A'
    }else{
      contentType = 'CG'
    }
    return contentType;
  }


}
