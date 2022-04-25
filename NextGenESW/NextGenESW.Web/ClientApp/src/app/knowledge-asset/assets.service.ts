import { HttpClient, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { knowledgeAsset } from './assets.model';

@Injectable({
  providedIn: 'root'
})
export class AssetsService {

  constructor(private http: HttpClient) { }

  baseUrl = environment.siteAdminAPI;
  baseAdminUrl = environment.siteAdminAPI;

  getAllKnowledgeAssets(): Observable<knowledgeAsset[]> {
    return this.http.get<knowledgeAsset[]>(this.baseAdminUrl + "featuredknowledgeasset/getfeaturedknowledgeasset");
  }

 


   //delete Assetes
   deleteAssets(id: number) {
    return this.http.delete<knowledgeAsset>(this.baseUrl + "featuredknowledgeasset/deletefeaturedknowledgeasset?id=" + id);
  }


  
  upload(file: File, model: knowledgeAsset): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    for (var key in model ) {
      formData.append( key, model[key]  );
  }
    formData.append('thumbnailUrl', file  );
    const req = new HttpRequest('POST', this.baseUrl + "featuredknowledgeasset/createfeaturedknowledgeassetwithupload", formData, {
      reportProgress: true,                                                           
      responseType: 'json'
    });

    return this.http.request(req);
  }
  updateKnowledgeAssets(model: knowledgeAsset): Observable<knowledgeAsset> {
    const formData: FormData = new FormData();
    for (var key in model ) {
      formData.append( key, model[key]  );
  }
    return this.http.put<knowledgeAsset>(this.baseUrl + "featuredknowledgeasset/updatefeaturedknowledgeassetwithupload", formData);
  }


  addKnowledgeAssets(model: knowledgeAsset): Observable<knowledgeAsset> {
    return this.http.post<knowledgeAsset>(this.baseUrl + "featuredknowledgeasset/createfeaturedknowledgeassetwithupload", model);
  }

  getFiles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/files`);
  }

}
