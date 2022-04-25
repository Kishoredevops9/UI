import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpHelperService } from '@app/shared/http-helper.service';
import { ExtractedDocument, ContentList } from './document-view.model';
import { Observable, of } from 'rxjs';
import { CreateDocument, WIDocumentList } from '@app/create-document/create-document.model';
import { environment } from '@environments/environment';
import { SharedService } from '@app/shared/shared.service';
import { publishedContent } from '@environments/constants';

@Injectable({
  providedIn: 'root',
})
export class DocumentViewService {
  constructor(
    private httpHelper: HttpHelperService,
    private http: HttpClient,
    private sharedService: SharedService
  ) { }

  url = 'https://contentcreationapi.azurewebsites.net/api/content/';

  // Api Call to get Extracted Documents
  getExtractedDocList(id: any, contentType: string): Observable<ExtractedDocument[]> {
    return this.httpHelper.get<ExtractedDocument[]>(`Extraction/${id}/${contentType}`);
  }

  // getExtractedWIDocList(id: any, contentType: string): Observable<ExtractedDocument[]> {
  //   return this.httpHelper.get<ExtractedDocument[]>('Extraction/GetPublishedExtractedDocumentList?contentId=' + id + '&contentType=' + contentType);
  // }
  getExtractedWIDocList(id: any, contentType: string, version:string): Observable<ExtractedDocument[]> {
    return this.httpHelper.get<ExtractedDocument[]>('Extraction/GetPublishedExtractedDocumentList?contentId=' + id + '&contentType=' + contentType + '&version=' + version);
  }

  // Api Call to Retrive Doc in Lib
  retrieveDocs() {
    return this.http.get<ContentList[]>(this.url + 'GetDocsInLib');
  }

  getDocumentPageList(contentIds: any, contentType: string, status: string, contentId: string, version: any, userEmail: string): Observable<WIDocumentList[]> {

    console.log("contentIds", contentIds);
    console.log("contentType", contentType);
    console.log("status", status);
    console.log("contentId", contentId);
    console.log("version", version);
    console.log("userEmail", userEmail);

    sessionStorage.removeItem('contentType');
    sessionStorage.removeItem('contentNumber');
    sessionStorage.removeItem('componentType');
    sessionStorage.removeItem('contentVersion');
    sessionStorage.removeItem('redirectUrlPath');

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

    if (status === "draft") {
      let queryString = `?id=${contentIds}&contentType=${contentType}&status=${status}&contentId=${contentId}&version=${version}&currentUserEmail=${userEmail}`
      let url = environment.apiUrl + (publishedContent.wigbdsContent + queryString)
      return this.http.get<WIDocumentList[]>(url, httpOptions);
    }

    if (status === "published") {
      let url = environment.apiUrl + publishedContent.wigbdsContent + "?id=0" + "&contentType=" + "&status=" + "&contentId=" + contentId + "&version=0" + "&currentUserEmail=" + userEmail;
      return this.http.get<WIDocumentList[]>(url, httpOptions);
    }

  }
  getLessonLearnedAP(contentId: string, contentType: string): Observable<CreateDocument[]> {
    return this.httpHelper.get<CreateDocument[]>(`LessonsLearned/${contentId}/${contentType}`);
  }

  previewContentType(contentId, contentType: string) {
    return this.httpHelper.get<any>(`PreviewDocument/${contentId}/${contentType}`);
  }

  previewExtraction(docUrl, title, documentType) {
    // return of(true);
    return this.httpHelper.post('PreviewDocument/Preview', {
      "SourceFilePath": docUrl,
      "FileName": title,
      "ContentType": documentType
    })
  }


  GetContentID(param) {
    param.AADid = sessionStorage.getItem('AADid');
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(
      environment.apiUrl + '/WorkInstruction/SaveAsSharePointContent',
      param,
      httpOptions
    );
  }

  reviseSharePointContent(param) {
    param.AADid = sessionStorage.getItem('AADid');
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(
      environment.apiUrl + '/WorkInstruction/ReviseSharePointContent',
      param,
      httpOptions
    );
  }
}
