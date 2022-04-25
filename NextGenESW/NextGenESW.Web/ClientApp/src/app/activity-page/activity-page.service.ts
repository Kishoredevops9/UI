import { Injectable } from '@angular/core';
import { DisciplineCodeList, componentWICDdocList, ActivityPageList, activityCompnentIframe, contentCollaborationWithHistory } from './activity-page.model';
import { Observable } from 'rxjs';
import { HttpHelperService } from '@app/shared/http-helper.service';
//import { WiDropDownList } from '@app/create-document/create-document.model';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { map, shareReplay, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { createContent, updateContent } from '../../environments/constants';
import { publishedContent } from '../../environments/constants';
import { TagList, WiDropDownList } from '@app/create-document/create-document.model';
import { SharedService } from '@app/shared/shared.service';
import { addAttrToDescendants } from '@app/shared/utils/tree';

@Injectable({
  providedIn: 'root',
})
export class ActivityPageService {

  sharecomponentname: string;
  sharecomponentid: any;

  getIframeId() {
    throw new Error("Method not implemented.");
  }
  constructor(
    private httpHelper: HttpHelperService,
    private http: HttpClient,
    private sharedService: SharedService
  ) { }

  getActivityWICDDocList(): Observable<componentWICDdocList[]> {
    return this.httpHelper.get<componentWICDdocList[]>(`ActivityPage/GetAllWICDDocs`);
  }

  getEkssearchWICDDocList(contentid, componenttype, title, purpose): Observable<componentWICDdocList[]> {
    let url = 'assettypecode:' + componenttype;
    if (contentid) { url = url + ' AND contentid:' + contentid; }
    if (title) { url = url + ' AND title:' + title; }
    if (purpose) { url = url + ' AND purpose:' + purpose; }
    let quertyString = { "searchText": "q=" + url + "&from=0&size=1000" }
    return this.http.post<componentWICDdocList[]>(environment.EKSInternalSearchAPI, quertyString);
  }

  getDisciplineCodeList(): Observable<DisciplineCodeList[]> {
    return this.httpHelper.get<DisciplineCodeList[]>(
      'ActivityPage/GetAllDisciplineCode'
    );
  }

  getSubSubDisciplineList(): Observable<WiDropDownList[]> {
    return this.httpHelper.get<WiDropDownList[]>(
      'ActivityPage/GetAllSubSubDiscipline'
    );
  }

  getComponentIframeID(id: number): Observable<activityCompnentIframe[]> {
    //console.log("Iframe", id)
    return this.httpHelper.get<activityCompnentIframe[]>(`Extraction/${id}`);
  }

  CreateNewActivityPage(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
    };

    return this.http.post(
      environment.apiUrl + createContent.CreateActivityPage,
      param,
      httpOptions
    );

  }
  updateActivityList(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
    };

    return this.http.put(
      environment.apiUrl + '/ActivityPage/UpdateActivityContainerComponent',
      param,
      httpOptions
    );

  }

  CreateRelatedContent(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
    };

    return this.http.post(
      environment.apiUrl + createContent.CreateRelatedContent,
      param,
      httpOptions
    );

  }

  getContainerItems($id){

 //   $id = 1786;
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
    };

    return this.http.get(
      environment.taskAPI + 'containeritems/getcontaineritemsbyactivitypageid?activityPageId='+$id,

      httpOptions
    );

  }

  deleteContainerItems(id) {
    return this.http.delete(
      environment.taskAPI + `containeritems/deletecontaineritem?id=${id}`);
  }

  deleteRCItems(id) {
    return this.http.delete(
      environment.apiUrl + `/RelatedContent/DeleteRelatedContentAttachment?relatedContentInformationId=${id}`);
  }

 updatetaskspecificcontaineritems(param){
   ///api/containeritems/updatetaskspecificcontaineritems
   const httpOptions = {
    headers: new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }),
  };
  return this.http.put( environment.taskAPI + 'containeritems/updatetaskspecificcontaineritems',
  param,
  httpOptions)


  }

  //api/RelatedContent/CreateRelatedContent
  UpdatePurposeInActivityPage(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
    };

    return this.http.put(
      environment.apiUrl + '/ActivityPage/UpdatePurposeInActivityPage',
      param,
      httpOptions
    );

  }

  UpdatePurposeInRelatedContentPage(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
    };

    return this.http.put(
      environment.apiUrl + '/RelatedContent/UpdatePurposeInRelatedContent',
      param,
      httpOptions
    );

  }

 // /api/RelatedContent/UpdatePurposeInRelatedContent

  addComponent(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
    };

    return this.http.post(
      environment.apiUrl + '/ActivityContainer/AddActivityContainer',
      param,
      httpOptions
    );
    //console.log(param)
  }

  createComponent(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
    };

    return this.http.post(
      environment.apiUrl + '/ActivityContainer/CreateActivityContainer',
      param,
      httpOptions
    );
  }

  updateExternalLink(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
    };

    return this.http.put(
      environment.apiUrl + '/ActivityContainer/UpdateExternalLinkActivityContainer',
      param,
      httpOptions
    );
  }

  UpdateComponent(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
    };

    return this.http.put(
      environment.apiUrl + '/ActivityContainer/UpdateActivityContainer',
      param,
      httpOptions
    );

  }

  fetchDocumentDetails(id: number, contentType: string, contentNo: string, version: number): Observable<activityCompnentIframe[]> {
    return this.httpHelper.get<activityCompnentIframe[]>(`Extraction/${id}/${contentType}/${contentNo}/${version}`);
  }

  updateGuidance(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
    };

    return this.http.put(
      environment.apiUrl + '/ActivityContainer/UpdateGuidanceActivityContainer',
      param,
      httpOptions
    );
  }
  deleteComponent(id) {
    return this.http.delete(
      environment.apiUrl + `/ActivityContainer/DeleteActivityContainer?activityContainerId=${id}`);
  }


  getActivityPageList(id: number): Observable<ActivityPageList[]> {
    return this.httpHelper.get<ActivityPageList[]>(`ActivityPage/GetActivityPageById?id=${id}`)
  }

  getActivityPageListNew(ID,contentType,status,contentId,version,currentUserEmail) {
    //return this.httpHelper.get<ActivityPageList[]>(`ActivityPage/GetActivityPageById?id=${ID}&contentType=${contentType}&status=${status}&contentId=${contentId}&version=${version}&currentUserEmail=${currentUserEmail}`)
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
    let url = environment.apiUrl + "/ActivityPage/GetActivityPageById" + "?id=" + ID + "&contentType=" + contentType + "&status=" + status + "&contentId=" + contentId + "&version=" + version + "&currentUserEmail=" + currentUserEmail;
    return this.http.get(url, httpOptions);

  }

  getPublishedActivityGroupPageListNew(ID,contentType,status,contentId,version,currentUserEmail) {
    // return this.http.get(
    //   environment.apiUrl + `/KnowledgeAsset/GetActivityPageById?id=${ID}&contentType=${contentType}&status=${status}&contentId=${contentId}&version=${version}&currentUserEmail=${currentUserEmail}`
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
    let url = environment.apiUrl + "/KnowledgeAsset/GetActivityPageById" + "?id=0" + "&contentType=" + "&status=" + "&contentId=" + contentId + "&version=0" + "&currentUserEmail=" + currentUserEmail;
    return this.http.get(url, httpOptions);
  }

  UpdatePropertiesInActivityPage(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
    };

    return this.http.put(
      environment.apiUrl + updateContent.UpdateActivityPage,
      param,
      httpOptions
    );

  }

  UpdatePublishedContentProperties(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
    };

    return this.http.put(
      environment.apiUrl + '/KnowledgeAsset/UpdatePublishedContentProperties',
      param,
      httpOptions
    );

  }

  addContentCollaboration(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
    };

    return this.http.post(
      environment.apiUrl + '/ContentCollaboration/AddContentCollaboration',
      param,
      httpOptions
    );
  }

  updateContentCollaboration(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
    };

    return this.http.put(
      environment.apiUrl + '/ContentCollaboration/UpdateContentCollaborationHistory',
      param,
      httpOptions
    );
  }

  // getContentCollaboration(param): Observable<contentCollaborationWithHistory[]> {
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Accept': 'application/json',
  //       'Content-Type': 'application/json'
  //     }),
  //   };
  //   return this.http.post<contentCollaborationWithHistory[]>(environment.apiUrl + '/ContentCollaboration/GetContentCollaboration', param, httpOptions);
  // }

  taglist$ : any;
//
  getTagList(): Observable<TagList[]> {
      if ( !this.taglist$){
        this.taglist$ = this.http.get<TagList[]>(`${environment.apiUrl}/Properties/GetTagsById?id=0`).pipe(
          tap(() => console.log('config fetched')),
          // Add rootParentId to all descendants
          map((tagItems: TagList[]) => {
            tagItems.forEach(tagItem => {
              const attrName = 'rootParentId';
              const attrValue = tagItem.id;
              addAttrToDescendants(tagItem, attrName, attrValue);
            });
            return tagItems;
          }),
          shareReplay(1)
        );
      }
    return this.taglist$;
  }


  UploadFileRelatedContent(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
    };
    return this.http.post(
      environment.apiUrl + '/RelatedContent/UploadFileRelatedContent',
      param,
      httpOptions
    );

  }

  getUploadFileRelatedContent(createdUser: string): Observable<any[]> {
    return this.httpHelper.get<any[]>(`RelatedContent/GetFileRelatedContent?relatedContentId=${createdUser}`)
  }

  getTableOfconetentList(id: number): Observable<ActivityPageList[]> {
    return this.httpHelper.get<ActivityPageList[]>(`TableOfContent/GetTableOfContentById?id=${id}`)
  }

  // getRelatedContentById(id: number): Observable<ActivityPageList[]> {
  //   return this.httpHelper.get<ActivityPageList[]>(`RelatedContent/GetRelatedContentById?id=${id}`)
  // }

  downloadFile(url): Observable<any> {
    let encodedURL = encodeURIComponent(url);
    return this.http.get(environment.apiUrl + `/RelatedContent/DownloadDocuments?DocumentUrl=${encodedURL}`)
  }

  UpdatePropertiesForCG(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
    };

    return this.http.put(
      environment.apiUrl + '/CriteriaGroup/UpdatePropertiesInCriteriaGroup',
      param,
      httpOptions
    );

  }



  UpdatePropertiesForKP(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
    };

    return this.http.put(
      environment.apiUrl + '/CriteriaGroup/UpdatePropertiesInCriteriaGroup',
      param,
      httpOptions
    );

  }

  GateAPRecallData(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(
      environment.apiUrl + '/Workflow/RecallContent',
      param,
      httpOptions
    );
  }

  GateAPSaveAsData(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(
      environment.apiUrl + '/ActivityPage/SaveAsActivityPage',
      param,
      httpOptions
    );
  }

  GetAPRevisionData(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(
      environment.apiUrl + '/ActivityPage/RevisionActivityPage',
      param,
      httpOptions
    );
  }

  getPublishedActivityGroupPageList(contentId) {
    return this.http.get(
      environment.apiUrl + publishedContent.activityPage + `?contentId=${contentId}`
    );
  }

  // getPublishedRelatedContentGroupPageList(contentId) {
  //   return this.http.get(
  //     environment.apiUrl + `/KnowledgeAsset/GetRelatedContentById?contentId=${contentId}`
  //   );
  // }
  getCGDraft(id: number): Observable<activityCompnentIframe[]> {
    return this.httpHelper.get<activityCompnentIframe[]>(`CriteriaGroupExtraction/GetAllCriteriaGroupCriteriaByCriteriaGroupId?criteriaGroupCriteriaId=${id}`);
  }
  getExtractedWIDocList(id: any, contentType: string, version:string): Observable<activityCompnentIframe[]> {
    return this.httpHelper.get<activityCompnentIframe[]>('Extraction/GetPublishedExtractedDocumentList?contentId=' + id + '&contentType=' + contentType + '&version=' + version);
  }
  updateGuidanceComponent(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
    };

    return this.http.put(
      environment.apiUrl + '/ActivityPage/UpdateGuidanceTextInActivityPageAsync',
      param,
      httpOptions
    );

  }
}
