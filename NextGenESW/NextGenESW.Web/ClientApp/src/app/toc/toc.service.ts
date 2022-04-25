import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { publishedContent, createContent, updateContent } from '../../environments/constants';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHelperService } from '@app/shared/http-helper.service';
import { ToCPageList } from '@app/toc/toc.model';
import { SharedService } from '@app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class TocService {

  constructor(private httpHelper: HttpHelperService,
    private http: HttpClient, private sharedService: SharedService) { }

  UpdatePurposeInActivityPage(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
    };
    return this.http.put(
      environment.apiUrl + '/TableOfContent/UpdatePurposeInTableOfContent',
      param,
      httpOptions
    );
  }

  CreateNewToc(param) {
    return this.http.post(
      environment.apiUrl + '/TableOfContent/CreateTableOfContentTOC',
      param
    );
  }

  UpdatePropertiesToc(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
    };
    return this.http.put(
      environment.apiUrl + updateContent.UpdateTableOfContent,
      param,
      httpOptions
    );
  }

  getTocPageList(id: number): Observable<ToCPageList[]> {
    return this.httpHelper.get<ToCPageList[]>(`TableOfContent/GetTableOfContentById?id=${id}`)
  }

  getContentTypes() {
    return this.httpHelper.get<ToCPageList[]>(`ActivityPage/GetAllContentType`)
  }

  addTableOfContent(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
    };
    return this.http.post(
      environment.apiUrl + createContent.CreateTableOfContent,
      param,
      httpOptions
    );
  }

  updateTableOfContent(param) {
    return this.http.put(
      environment.apiUrl + '/TableOfContent/UpdateTableOfContentTOC',
      param
    );
  }

  deleteTableOfContent(id) {
    return this.http.delete(
      environment.apiUrl + `/TableOfContent/DeleteTableOfContentToc?id=${id}`);
  }

  updateHeaderTOC(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
    };

    return this.http.put(
      environment.apiUrl + '/TableOfContent/UpdateHeaderTableOfContentTOC',
      param,
      httpOptions
    );

  }


  GetContentID(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(
      environment.apiUrl + '/TableOfContent/SaveAsTableOfContent',
      param,
      httpOptions
    );
  }

  GetRevisionData(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(
      environment.apiUrl + '/TableOfContent/RevisionTableOfContent',
      param,
      httpOptions
    );
  }

  // getPublishedTOCGroupPageList(contentId) {
  //   return this.http.get(
  //     environment.apiUrl + `/KnowledgeAsset/GetTableOfContentById?contentId=${contentId}`
  //   );
  // }

  getPublishedTOCGroupPageList(ID, contentType, status, contentId, version, currentUserEmail) {
    // return this.http.get(
    //   environment.apiUrl + `/KnowledgeAsset/GetTableOfContentById?id=${ID}&contentType=${contentType}&status=${status}&contentId=${contentId}&version=${version}&currentUserEmail=${currentUserEmail}`
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

    let url = environment.apiUrl + publishedContent.tableOfContent + "?id=0" + "&contentType=" + "&status=" + "&contentId=" + contentId + "&version=0" + "&currentUserEmail=" + currentUserEmail;
    return this.http.get(url, httpOptions);
  }

  getTocPageListNew(ID, contentType, status, contentId, version, currentUserEmail) {
    //   return this.httpHelper.get<ToCPageList[]>(`TableOfContent/GetTableOfContentById?id=${ID}&contentType=${contentType}&status=${status}&contentId=${contentId}&version=${version}&currentUserEmail=${currentUserEmail}`)

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

    // let url = environment.apiUrl + "/CriteriaGroup/GetTableOfContentById?id=" + ID + "&contentType=" + contentType + "&status=" + status + "&contentId=" + contentId + "&version=" + version + "&currentUserEmail=" + currentUserEmail;
    let url = environment.apiUrl + "/TableOfContent/GetTableOfContentById?id=" + ID + "&contentType=" + contentType + "&status=" + status + "&contentId=" + contentId + "&version=" + version + "&currentUserEmail=" + currentUserEmail;
    return this.http.get(url, httpOptions);
  }
}
