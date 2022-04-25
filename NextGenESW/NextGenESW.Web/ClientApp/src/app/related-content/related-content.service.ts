import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { publishedContent, updateContent } from '../../environments/constants';
import { Observable } from 'rxjs';
import { ActivityPageList } from '@app/activity-page/activity-page.model';
import { HttpHelperService } from '@app/shared/http-helper.service';
import {
  CategoryList,
  CreateDocument,
} from '@app/create-document/create-document.model';
import { SharedService } from '@app/shared/shared.service';



@Injectable({
  providedIn: 'root',
})
export class RelatedContentService {
  constructor( private http: HttpClient,
    private httpHelper: HttpHelperService,
    private sharedService: SharedService) {}


  UpdatePropertiesInRelatedContent(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
    };

    return this.http.put(      
      environment.apiUrl + updateContent.UpdateRelatedContent,
      param,
      httpOptions
    );

  }
  GetRelatedContentID(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(
      environment.apiUrl + '/RelatedContent/SaveAsRelatedContent',
      param,
      httpOptions
    );
  }
  GetRelatedContentRevisionData(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(
      environment.apiUrl + '/RelatedContent/RevisionRelatedContent',
      param,
      httpOptions
    );
  }

  // getPublishedRelatedContentGroupPageList(contentId) {
  //   return this.http.get(
  //     environment.apiUrl + `/KnowledgeAsset/GetRelatedContentById?contentId=${contentId}`
  //   );
  // }

  getPublishedRelatedContentGroupPageList(ID,contentType,status,contentId,version,currentUserEmail) {
    // return this.http.get(
    //   environment.apiUrl + `/KnowledgeAsset/GetRelatedContentById?id=${ID}&contentType=${contentType}&status=${status}&contentId=${contentId}&version=${version}&currentUserEmail=${currentUserEmail}`
    // );
    let userProfileDataObj = this.sharedService.getHeaderRequestedData();
    if (userProfileDataObj) {
      var params = [];
      for (var key in userProfileDataObj) {
        if (userProfileDataObj.hasOwnProperty(key) && userProfileDataObj[key]) {
          params.push(userProfileDataObj[key])
        }
      }
      var headerRequestedData = params.join("<>");
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'userinfo': headerRequestedData
      }),
    };
    let url = environment.apiUrl + publishedContent.relatedContent + "?id=0" + "&contentType=" + "&status=" + "&contentId=" + contentId + "&version=0" + "&currentUserEmail=" + currentUserEmail;
    return this.http.get(url, httpOptions);
  }

  // getRelatedContentById(id: number): Observable<ActivityPageList[]> {
  //   return this.httpHelper.get<ActivityPageList[]>(`RelatedContent/GetRelatedContentById?id=${id}`)
  // }

  getRelatedContentById(ID,contentType,status,contentId,version,currentUserEmail) {
    //return this.httpHelper.get<ActivityPageList[]>(`RelatedContent/GetRelatedContentById?id=${ID}&contentType=${contentType}&status=${status}&contentId=${contentId}&version=${version}&currentUserEmail=${currentUserEmail}`)
    let userProfileDataObj = this.sharedService.getHeaderRequestedData();
    if (userProfileDataObj) {
      var params = [];
      for (var key in userProfileDataObj) {
        if (userProfileDataObj.hasOwnProperty(key) && userProfileDataObj[key]) {
          params.push(userProfileDataObj[key])
        }
      }
      var headerRequestedData = params.join("<>");
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'userinfo': headerRequestedData
      }),
    };
    // let url = environment.apiUrl + "/CriteriaGroup/GetRelatedContentById?id=" + ID + "&contentType=" + contentType + "&status=" + status + "&contentId=" + contentId + "&version=" + version + "&currentUserEmail=" + currentUserEmail;
    let url = environment.apiUrl + "/RelatedContent/GetRelatedContentById" + "?id=" + ID + "&contentType=" + contentType + "&status=" + status + "&contentId=" + contentId + "&version=" + version + "&currentUserEmail=" + currentUserEmail;
    return this.http.get(url, httpOptions);
  }

}
