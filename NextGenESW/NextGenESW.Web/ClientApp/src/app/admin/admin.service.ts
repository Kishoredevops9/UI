import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { shareReplay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'  
})
export class AdminService {
  baseUrl = environment.siteAdminAPI;
  constructor( private httpClient: HttpClient ) { }

  getDisciplines(){   
    return this.httpClient.get(this.baseUrl+'eksdisciplines/geteksdisciplinesmap');     
  }

 



  addDisciplines(addDisciplinesElement){
    return this.httpClient.post(this.baseUrl+"eksdisciplines/createeksdiscipline", addDisciplinesElement);
  }

  removeDisciplines(id){
    return this.httpClient.delete(this.baseUrl+`eksdisciplines/deleteeksdiscipline?id=${id}`);
  }

  updateDisciplines(updateManualElement){
    return this.httpClient.put(this.baseUrl+"eksdisciplines/updateeksdiscipline", updateManualElement);
  }

  updateMultipleDisciplines(updateManualElement){
    return this.httpClient.put(this.baseUrl+"eksdisciplines/updatemultipleeksdiscipline", updateManualElement);
  }

  getMaps(){   
    return this.httpClient.get(this.baseUrl+'eksbrowsemap/geteksbrowsemap');     
  }

  addMaps(addDisciplinesElement){
    return this.httpClient.post(this.baseUrl+"eksbrowsemap/createeksbrowsemap", addDisciplinesElement);
  }

  removeMaps(id){
    return this.httpClient.delete(this.baseUrl+`eksbrowsemap/deleteeksbrowsemap?id=${id}`);
  }

  removeMultipleMaps(id){
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
      body: id,
    };
    return this.httpClient.delete(this.baseUrl+`eksbrowsemap/deletebulkeksbrowsemap`, httpOptions);
  }
  
  updateMaps(updateManualElement){
    return this.httpClient.put(this.baseUrl+"eksbrowsemap/updateeksbrowsemap", updateManualElement);
  }

  updateMultipleMaps(updateManualElement){
    return this.httpClient.put(this.baseUrl+"eksbrowsemap/updatemultipleeksbrowsemap", updateManualElement);
  }

  getAnnouncements(){   
    return this.httpClient.get(this.baseUrl+'eksannouncements/getalleksannouncements');     
  }

  getAnnouncementsType(){   
    return this.httpClient.get(this.baseUrl+'eksannouncementstypes/getalleksannouncementstypes');     
  }

  addAnnouncements(addAnnouncementsElement){
    return this.httpClient.post(this.baseUrl+"eksannouncements/createeksannouncements", addAnnouncementsElement);
  }

  removeAnnouncements(id){
    return this.httpClient.delete(this.baseUrl+`eksannouncements/deleteannouncements?id=${id}`);
  }

  updateAnnouncements(updateElement){
    return this.httpClient.put(this.baseUrl+"eksannouncements/updateeksannouncements", updateElement);
  }

  
  getAllEKSFeedbacks(){
    return this.httpClient.get(this.baseUrl+'eksfeedbacks/getalleksfeedbacks');     
  }

  removeEKSFeedbacks(feedbackElementId){
    return this.httpClient.delete(this.baseUrl+`eksfeedbacks/deleteeksfeedbacks?id=${feedbackElementId}`);
  }

  updateEKSFeedbck(updateFeedbackData){
    return this.httpClient.put(this.baseUrl+`eksfeedbacks/updateeksfeedbacks`,updateFeedbackData);
  }

  getAllUserGuides(){
    return this.httpClient.get(this.baseUrl+"eksuserguides/geteksuserguides");
  }

  createUserGuides(createUserGuideItem){
    return this.httpClient.post(this.baseUrl+`eksuserguides/CreateEksUserGuide`,createUserGuideItem);
  }

  updateUserGuides(updateUserGuideItem){
    return this.httpClient.put(this.baseUrl+`eksuserguides/UpdateEksUserGuide`,updateUserGuideItem);
  }

  deleteUserGuides(deleteUserGuideId){
    return this.httpClient.delete(this.baseUrl+`eksuserguides/DeleteEKSUserGuide?id=${deleteUserGuideId}`);
  }

  
  UpdateAllEksUserGuide(updatemultipleEksUserGuides){
    return this.httpClient.put(this.baseUrl+"eksuserguides/UpdateAllEksUserGuide", updatemultipleEksUserGuides);
  }

  getAllEKSHelp(){
    return this.httpClient.get(this.baseUrl+`EKSHelp/GetAllHelps`);
  }

  createEKSHelp(createHelpItem){
    return this.httpClient.post(this.baseUrl+`EKSHelp/CreateHelp`,createHelpItem);
  }

  updateEKSHelp(updateHelpItem){
    return this.httpClient.put(this.baseUrl+`EKSHelp/UpdateHelp`, updateHelpItem);
  }
  
  deleteEKSHelp(deleteHelpId){
    return this.httpClient.delete(this.baseUrl+`EKSHelp/DeleteHelp?id=${deleteHelpId}`);
  }

  
  
  // getAllToolTip(){
  //   return this.httpClient.get(this.baseUrl+`ekstooltips/getallekstooltips`);
  // }

  allTooltip$ : any;

  getAllToolTip() {  
    if (!this.allTooltip$){        
   
     this.allTooltip$ =   this.httpClient.get(this.baseUrl+`ekstooltips/getallekstooltips`).pipe(
      tap(() => console.log('Tooltip fetched')),
      shareReplay(1)
    );
    }
    return this.allTooltip$;  

  }


  

  updateTooltip($item){
    return this.httpClient.put(this.baseUrl+`ekstooltips/updateekstooltips`, $item );
  }
  




  upload(file: File, model, urls): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    for (var key in model ) {
      formData.append( key, model[key]  );
    }
    formData.append('thumbnailUrl', file  );
    const req = new HttpRequest('POST', this.baseUrl + urls, formData, {
      reportProgress: true,                                                           
      responseType: 'json'
    });
 
    return this.httpClient.request(req);
  }

  updateAssetsWithUpload(file: File, model, urlPath): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    for (var key in model ) {
      formData.append( key, model[key]  );
    }
    formData.append('thumbnailUrl', file  );
    const req = new HttpRequest('PUT', this.baseUrl + urlPath, formData, {
      reportProgress: true,                                                           
      responseType: 'json'
    });
 
    return this.httpClient.request(req);
  }

  
  getFiles(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/files`);
  }

  getAllUserProfile(){   
    return this.httpClient.get(this.baseUrl+'userprofile/getalluserprofile');     
  }

  getUserProfileExportXls(id: number):any{
    return this.httpClient.get(this.baseUrl+"userprofile/ExportUserProfileToExcel?commaSeparatedIDs=" + id, {responseType: 'blob'});
  }

  getAllEKSHelpPage(){
    return this.httpClient.get(this.baseUrl+`ekshelppage/getallekshelppage`);
  }

}
