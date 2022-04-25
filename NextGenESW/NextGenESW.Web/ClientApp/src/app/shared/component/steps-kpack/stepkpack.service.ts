


import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';


@Injectable({
  providedIn: 'root'
})
export class StepkpackService {

  constructor(public http: HttpClient) {


  }

  getKpack(from = 0, size = 5, extraOptions: any = {}) {
    const conditions: string[] = ["assettypecode:('K')", 'assetstatusid:1'];
    
    const { contentId, title, disciplineCode } = extraOptions;
    contentId && conditions.push(`(contentid:(${contentId}))`);
    title && conditions.push(`(title:(${title}))`);
    disciplineCode && conditions.push(`(disciplinecode:(${disciplineCode}))`);

    let quertyString = { "searchText": `q=${conditions.join(' AND ')}&from=${from}&size=${size}` }
    return this.http.post(environment.EKSInternalSearchAPI, quertyString);
  }

  addMultiKpack(quertyString) {
    return this.http.post(environment.processMapAPI + "kpack/addkpackmaps", quertyString);
  }

  kpackDelete(quertyString) {
    return this.http.delete(environment.processMapAPI + "kpack/deletekpackmap?id=" + quertyString);
  }

  getAddedallkpack(quertyString, version) {
    let $status = sessionStorage.getItem('sfStatus');
    if ($status == 'published') {
      return this.http.get(environment.processMapAPI + "kpack/getkpackmapbyparentcontentassetid?parentContentAssetId=" + quertyString + '&status=' + $status + '&version=' + version);
    } else {
      return this.http.get(environment.processMapAPI + "kpack/getkpackmapbyparentcontentassetid?parentContentAssetId=" + quertyString + '&version=' + version);
    }


  }


}
