import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { environment } from '@environments/environment';
import { Constants, publishedContent, draftContent } from '@environments/constants'
import { SharedService } from '@app/shared/shared.service'
import { WIDocumentList } from '@app/create-document/create-document.model';

@Injectable({
  providedIn: 'root'
})
export class ContentCommonService {
  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  get<T>(url: any) {
    return this.httpClient.get<T>(`${environment.apiUrl}/${url}`);
  }

  post<T>(url: any, request: any) {
    return this.httpClient.post<T>(`${environment.apiUrl}/${url}`, request);
  }

  /*Function to get contentType data for all content*/
  getContentType(contentTypeId: number) {
    var contentType: string;
    if (contentTypeId == 1) {
      contentType = 'WI';
    } else if (contentTypeId == 2) {
      contentType = 'GB';
    } else if (contentTypeId == 6) {
      contentType = 'AP';
    } else if (contentTypeId == 5) {
      contentType = 'RD';
    } else if (contentTypeId == 9) {
      contentType = 'KP';
    } else if (contentTypeId == 10) {
      contentType = 'CG';
    } else if (contentTypeId == 11) {
      contentType = 'ToC';
    } else if (contentTypeId == 12) {
      contentType = 'RC';
    }
    return contentType;
  }

  /*Function to get user profile data in header*/
  getUserProfileData(userProfileDataObj) {
    var params = [];
    for (var key in userProfileDataObj) {
      if (userProfileDataObj.hasOwnProperty(key) && userProfileDataObj[key]) {
        params.push(userProfileDataObj[key])
      }
    }
    var headerRequestedData = params.join("<>");
    return headerRequestedData;
  }

  /*Function to pass userinfo data in header*/
  getHeaderOptionValue() {
    let userProfileDataObj = this.sharedService.getHeaderRequestedData();
    if (userProfileDataObj) {
      var headerRequestedData = this.getUserProfileData(userProfileDataObj);
    } else {
      let userProfileDataObj = JSON.parse(sessionStorage.getItem('userProfileData'));
      var headerRequestedData = this.getUserProfileData(userProfileDataObj);
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'userinfo': headerRequestedData
      }),
    };
    return httpOptions;
  }

  /*Function for get WI/GB/DS draft/publish mode data*/
  getDocumentConentData(contentIds: number, contentType: string, status: string, contentId: string, version: any, userEmail: string): Observable<WIDocumentList[]> {

    var httpOptions = this.getHeaderOptionValue();
    if (status === "draft" || status === "approve") {
      let queryString = `?id=${contentIds}&contentType=${contentType}&status=${status}&contentId=${contentId}&version=${version}&currentUserEmail=${userEmail}`
      let url = environment.apiUrl + (publishedContent.wigbdsContent + queryString)

      return this.httpClient.get<WIDocumentList[]>(url, httpOptions);
    }
    if (status === "published") {
      let queryString = `?id=0&contentType=&status=&contentId=${ contentId }&version=${ version }&currentUserEmail=${ userEmail }`;
      let url = environment.apiUrl + publishedContent.wigbdsContent + queryString;

      return this.httpClient.get<WIDocumentList[]>(url, httpOptions);
    }
  }

  /*Function for get Criteria Group draft / publish mode data*/
  getCriteriaGroupData(ID: number, contentType: string, status: string, contentId: any, version: any, currentUserEmail: string) {

    var httpOptions = this.getHeaderOptionValue();
    if (status != "published") {
      let querySring = "?id=" + ID + "&contentType=" + contentType + "&status=" + status + "&contentId=" + contentId + "&version=" + version + "&currentUserEmail=" + currentUserEmail;
      let url = environment.apiUrl + draftContent.criteriaGroup + querySring;

      return this.httpClient.get(url, httpOptions);
    } else {
      let querySring = "?id=0" + "&contentType=" + "&status=" + "&contentId=" + contentId + "&version=" + version + "&currentUserEmail=" + currentUserEmail;
      let url = environment.apiUrl + publishedContent.criteriaGroup + querySring;

      return this.httpClient.get(url, httpOptions);
    }

  }

  /*Function for get Activitiy Page draft / publish mode data*/
  getActivityPageData(ID: number, contentType: string, status: string, contentId: any, version: any, currentUserEmail: string) {
    var httpOptions = this.getHeaderOptionValue();
    if (status === "published") {
      let querySring = "?id=0" + "&contentType=" + "&status=" + "&contentId=" + contentId + "&version=" + version + "&currentUserEmail=" + currentUserEmail;
      let url = environment.apiUrl + publishedContent.activityPage + querySring;

      return this.httpClient.get(url, httpOptions);
    } else {
      let querySring = "?id=" + ID + "&contentType=" + contentType + "&status=" + status + "&contentId=" + contentId + "&version=" + version + "&currentUserEmail=" + currentUserEmail;
      let url = environment.apiUrl + draftContent.activityPage + querySring;

      return this.httpClient.get(url, httpOptions);
    }

  }

  /*Function for get Activitiy Page draft / publish mode data*/
  getKnowledgePageData(ID: number, contentType: string, status: string, contentId: any, version: any, currentUserEmail: string) {
    var httpOptions = this.getHeaderOptionValue();
    if (status === "published") {
      var querySring = "?id=0" + "&contentType=" + "&status=" + "&contentId=" + contentId + "&version=" + version + "&currentUserEmail=" + currentUserEmail;
    } else {
      var querySring = "?id=" + ID + "&contentType=" + contentType + "&status=" + status + "&contentId=" + contentId + "&version=" + version + "&currentUserEmail=" + currentUserEmail;
    }
    let url = environment.apiUrl + publishedContent.knowledgePack + querySring;
    return this.httpClient.get(url, httpOptions);
  }

  /*Function for get Table Of Content draft / publish mode data*/
  getTableOfContentData(ID: number, contentType: string, status: string, contentId: any, version: any, currentUserEmail: string) {
    var httpOptions = this.getHeaderOptionValue();
    if (status === "published") {
      let querySring = "?id=0" + "&contentType=" + "&status=" + "&contentId=" + contentId + "&version=" + version + "&currentUserEmail=" + currentUserEmail;
      let url = environment.apiUrl + publishedContent.tableOfContent + querySring;

      return this.httpClient.get(url, httpOptions);
    } else {
      let querySring = "?id=" + ID + "&contentType=" + contentType + "&status=" + status + "&contentId=" + contentId + "&version=" + version + "&currentUserEmail=" + currentUserEmail;
      let url = environment.apiUrl + draftContent.tableOfContent + querySring;

      return this.httpClient.get(url, httpOptions);
    }
  }

  /*Function for get Related Content draft / publish mode data*/
  getRelatedContentData(ID: number, contentType: string, status: string, contentId: any, version: any, currentUserEmail: string) {
    var httpOptions = this.getHeaderOptionValue();
    if (status === "published") {
      var querySring = "?id=0" + "&contentType=" + "&status=" + "&contentId=" + contentId + "&version=" + version + "&currentUserEmail=" + currentUserEmail;
      let url = environment.apiUrl + publishedContent.relatedContent + querySring;
      return this.httpClient.get(url, httpOptions);
    } else {
      var querySring = "?id=" + ID + "&contentType=" + contentType + "&status=" + status + "&contentId=" + contentId + "&version=" + version + "&currentUserEmail=" + currentUserEmail;
      let url = environment.apiUrl + draftContent.relatedContent + querySring;
      return this.httpClient.get(url, httpOptions);
    }
  }

}
