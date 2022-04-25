import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
@Injectable({
  providedIn: 'root'
})
export class FooterServiceService {
  baseUrl = environment.siteAdminAPI;
  constructor(private httpClient : HttpClient) { }
   
  
  getCommunities(): Observable<any>{
    return this.httpClient.get(this.baseUrl+'communities/getcommunities');
  }
  getToolbox(): Observable<any>{
    return this.httpClient.get(this.baseUrl+'toolbox/gettoolbox');
  }
  getEut(): Observable<any>{
    return this.httpClient.get(this.baseUrl+'Etu/getEtu');
  }
  getVideoData(): Observable<any>{
    return this.httpClient.get(this.baseUrl+'featuredknowledgeasset/getfeaturedknowledgeasset');
  }
}
