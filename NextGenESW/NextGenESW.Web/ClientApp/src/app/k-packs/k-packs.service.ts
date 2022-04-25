import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { HttpHelperService } from '@app/shared/http-helper.service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { createContent, updateContent } from '../../environments/constants';
@Injectable({
  providedIn: 'root'
})
export class KPacksService {

  constructor(private httpHelper: HttpHelperService,
    private http: HttpClient) { }

  CreateNewKPacks(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
    };

    return this.http.post(
      environment.apiUrl + createContent.CreateKpack,
      param,
      httpOptions
    );

  }

  updateTitleDetails(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
    };
    return this.http.post(
      environment.apiUrl + '/KnowledgePack/UpdateTitleDetails',
      param,
      httpOptions
    );
  }

  createKPacksPurpose(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
    };

    return this.http.post(
      environment.apiUrl + '/KnowledgePack/CreatePurpose',
      param,
      httpOptions
    );

  }

  updateKPacksPurpose(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
    };

    return this.http.put(
      environment.apiUrl + '/KnowledgePack/UpdatePurpose',
      param,
      httpOptions
    );

  }

  createKPacksPurposeLayout(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
    };

    return this.http.post(
      environment.apiUrl + '/KnowledgePack/ContentForPurpose',
      param,
      httpOptions
    );

  }

  addKnowledgePackContent(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
    };

    return this.http.post(
      environment.apiUrl + '/KnowledgePackContent/AddKnowledgePackContent',
      param,
      httpOptions
    );

  }

  updateContentForPurpose(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
    };

    return this.http.put(
      environment.apiUrl + '/KnowledgePack/UpdateContentForPurpose',
      param,
      httpOptions
    );

  }

  deleteKPackPurpose(id) {
    return this.http.delete(environment.apiUrl + '/KnowledgePack/KnowledgePackContent/' + id);
  }

  deleteKPackPurposeOld(id) {
    return this.http.delete(
      environment.apiUrl + `/KnowledgePack/DeleteKpackContentPurpose?contentPurposeId=${id}`);
  }

  // getKPackProperties(id) {
  //   return this.http.get(
  //     environment.apiUrl + `/KnowledgePack/GetKnowledgePackProperties?knowledgePackId=${id}`);
  // }

  getKnowledgePackContent(id, tabCode) {
    return this.http.get(
      environment.apiUrl + `/KnowledgePackContent/GetKnowledgePackContent?knowledgePackId=${id}&tabCode=${tabCode}`);
  }

  getAllContentForPurposeOld(id) {
    return this.http.get(
      environment.apiUrl + `/KnowledgePack/GetAllContentForPurpose?purposeId=${id}`);
  }

  getPurposeData(id) {
    return this.http.get(
      environment.apiUrl + `/KnowledgePack/GetPurposeData?knowledgePackId=${id}`);
  }

  createKPackPhysics(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
    };

    return this.http.post(
      environment.apiUrl + '/KPackPhysics/CreateKPackPhysics',
      param,
      httpOptions
    );

  }

  getAllKPackPhysics(id) {
    return this.http.get(
      environment.apiUrl + `/KPackPhysics/GetAllKPackPhysics?kPackId=${id}`);
  }

  deleteKPackPhysics(id) {
    return this.http.delete(
      environment.apiUrl + `/KPackPhysics/?id=${id}`);
  }


  createKPackContent(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
    };

    return this.http.post(
      environment.apiUrl + '/KnowledgePackContent/AddKnowledgePackContent',
      param,
      httpOptions
    );

  }

  getAllKPackContent(id, tabCode) {
    return this.http.get(
      environment.apiUrl + `/KnowledgePackContent/GetKnowledgePackContent?knowledgePackId=${id}&tabCode=${tabCode}`);
  }

  deleteKPackContent(id) {
    return this.http.delete(
      environment.apiUrl + `/KnowledgePackContent/${id}`);
  }

  UpdatePropertiesInKP(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
    };
    return this.http.put(
      environment.apiUrl + updateContent.UpdateKpack,
      param,
      httpOptions
    );
  }

  copyKpack(param,currentUser) {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(
      environment.apiUrl + '/KnowledgePack/CopyKpack?knowledgePackId=' + param + '&currentUser=' + currentUser,
      httpOptions
    );
  }

  getRevisionData(param,currentUser) {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(
      environment.apiUrl + '/KnowledgePack/CreateKpackNewRevision?knowledgePackId=' + param + '&currentUser=' + currentUser,
      httpOptions
    );
  }

  // getPublishedKPackGroupPageList(contentId) {
  //   return this.http.get(
  //     environment.apiUrl + `/KnowledgeAsset/GetCriteriaGroupById?contentId=${contentId}`
  //   );
  // }

}
