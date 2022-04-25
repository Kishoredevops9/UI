import { Injectable } from '@angular/core';
import { LobbyHomeModel } from './lobby-home.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LobbyHomeService {
  baseUrl = environment.siteAdminAPI;
  constructor(private httpClient: HttpClient) {}

  // Get Request for lobby home 
  getLobbyHome(): Observable<LobbyHomeModel[]> {   
    //return this.httpClient.get<LobbyHomeModel[]>(this.baseUrl+'communities/getcommunities');
    let url = '../../../assets/data/lobby-home-list.json';    
    return this.httpClient.get<LobbyHomeModel[]>(url);
  }

  getAllBrowseManuals(){
    return this.httpClient.get(this.baseUrl+"EKSManuals/GetAllManuals");
  }

  getAllUserGuides(){
    return this.httpClient.get(this.baseUrl+"eksuserguides/geteksuserguides");
  }

  postFeedbacks(feedbackData){
    return this.httpClient.post(this.baseUrl+"eksfeedbacks/createeksfeedbacks", feedbackData);
  }

  addManuals(addManualsElement){
    return this.httpClient.post(this.baseUrl+"EKSManuals/CreateManual", addManualsElement);
  }

  removeManuals(removeManualsElement){
    return this.httpClient.delete(this.baseUrl+`EKSManuals/DeleteManual?id=${removeManualsElement}`);
  }
  
  updateManuals(updateManualElement){
    return this.httpClient.put(this.baseUrl+"EKSManuals/UpdateManual", updateManualElement);
  }

  getAllFooterLinks(){
    return this.httpClient.get(this.baseUrl+"EKSFooter/GetAllFooters");
  }

  removeFooterLinks(removeFooterElement){
    return this.httpClient.put(this.baseUrl+`EKSFooter/DeleteFooter?id=${removeFooterElement}`, removeFooterElement);
  }

  updateFooterLinks(updateFooterElement){
    return this.httpClient.put(this.baseUrl+`EKSFooter/UpdateFooter`, updateFooterElement);
  }
  
}
