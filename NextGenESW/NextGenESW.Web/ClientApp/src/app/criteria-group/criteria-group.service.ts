import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { publishedContent, createContent, updateContent, draftContent } from '../../environments/constants';
import { Observable } from 'rxjs';
import { ActivityPageList } from '@app/activity-page/activity-page.model';
import { HttpHelperService } from '@app/shared/http-helper.service';
import { CategoryList, CreateDocument } from '@app/create-document/create-document.model';
import { SharedService } from '@app/shared/shared.service';

@Injectable({
  providedIn: 'root',
})
export class CriteriaGroupPageService {
  getIframeId() {
    throw new Error('Method not implemented.');
  }
  constructor(
    private http: HttpClient,
    private httpHelper: HttpHelperService,
    private sharedService: SharedService
  ) { }

  CreateNewProperties(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(
      environment.apiUrl + createContent.CreateCriteriaGroup,
      param,
      httpOptions
    );
  }

  getCriteriaGroupPageList(id) {
    return this.http.get(
      environment.apiUrl + `/CriteriaGroup/GetCriteriaGroupById?id=${id}`
    );
  }

  getLessonLearnedAP(contentId: string): Observable<CreateDocument[]> {
    return this.httpHelper.get<CreateDocument[]>(
      `LessonsLearned?contentId=${contentId}`
    );
  }

  saveLessonLearned(lesson): Observable<CategoryList[]> {
    return this.httpHelper.post<CategoryList[]>(`LessonsLearned`, {
      title: lesson.title,
      description: lesson.description,
      linkNumber: lesson.linkNumber,
      contentId: lesson.contentId,
      contentType: lesson.contentType,
    });
  }

  UpdatePurposeInCriteriaGroup(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };

    return this.http.put(
      environment.apiUrl + '/CriteriaGroup/UpdatePurposeInCriteriaGroup',
      param,
      httpOptions
    );
  }
  UpdatePropertiesInCriteriaGroup(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };

    return this.http.put(
      environment.apiUrl + updateContent.UpdateCriteriaGroup, 
      param,
      httpOptions
    );
  }
  CreateCriteria(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(
      environment.apiUrl + '/CriteriaGroup/CreateCriteriaGroupCriteria',
      param,
      httpOptions
    );
  }
  UpdateCriteria(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };

    return this.http.put(
      environment.apiUrl + '/CriteriaGroup/UpdateCriteriaGroupCriteria',
      param,
      httpOptions
    );
  }
  DeleteCriteria(id,criteriaGroupId) {
    return this.http.delete(
      environment.apiUrl +
      `/CriteriaGroup/DeleteCriteriaGroupCriteria?criteriaGroupCriteriaId=${id}&criteriaGroupId=${criteriaGroupId}`
    );
  }
  DeleteDefinition(id) {
    return this.http.delete(
      environment.apiUrl +
      `/CriteriaGroup/DeleteCriteriaGroupDefinition?criteriaGroupDefinitionId=${id}`
    );
  }
  CreateDefinition(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(
      environment.apiUrl + '/CriteriaGroup/CreateCriteriaGroupDefinition',
      param,
      httpOptions
    );
  }
  updateDefinition(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    return this.http.put(
      environment.apiUrl + '/CriteriaGroup/UpdateCriteriaGroupDefinition',
      param,
      httpOptions
    );
  }
  UpdateIntentBasisValidation(criteriaGroupID, intent, validation, basis) {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };

    return this.http.put(
      environment.apiUrl + '/CriteriaGroup/UpdateIntentAndBasisInCriteriaGroup',
      {
        id: criteriaGroupID,
        intentOfCriteria: intent,
        validationOfCriteria: validation,
        basisOfCriteria: basis,
      },
      httpOptions
    );
  }
  UpdateReferences(
    criteriaGroupID,
    requiredReferences,
    informationalReferences
  ) {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };

    return this.http.put(
      environment.apiUrl + '/CriteriaGroup/UpdateReferencesInCriteriaGroup',
      {
        id: criteriaGroupID,
        requiredReferences: requiredReferences,
        informationalReferences: informationalReferences,
      },
      httpOptions
    );
  }
  CreateNatureOfChange(param) {
    param.createdUser = sessionStorage.getItem('userMail');
    param.effectiveFrom = param.createdDateTime;
    param.lastUpdateUser = param.createdUser;
    param.lastUpdateDateTime = param.createdDateTime;
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(
      environment.apiUrl + '/CriteriaGroup/AddCriteriaGroupNatureOfChange',
      param,
      httpOptions
    );
  }
  updateNatureOfChange(param) {
    // param.lastUpdateUser = sessionStorage.getItem('userMail');
    // param.lastUpdateDateTime = param.createdDateTime;
    // param.effectiveFrom = param.createdDateTime;
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    return this.http.put(
      environment.apiUrl + '/NatureOfChange/UpdateNatureOfChange',
      param,
      httpOptions
    );
  }
  getNatureOfChangeContent() {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    return this.http.get(
      environment.apiUrl + '/CriteriaGroup/GetAllCriteriaGroupNatureOfChange'
    );
  }
  DeleteNatureOfChange(id) {
    return this.http.delete(
      environment.apiUrl +
      `/CriteriaGroup/DeleteCriteriaGroupNatureOfChange?cgNatureOfChangeId=${id}`
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
      environment.apiUrl + '/CriteriaGroup/SaveAsCriteriaGroup',
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
      environment.apiUrl + '/CriteriaGroup/RevisionCriteriaGroup',
      param,
      httpOptions
    );
  }
  getNOCList(contentId, assetTypeId) {
    return this.http.get(
      environment.apiUrl + `/NatureOfChange/GetNatureOfChangeByContentId?contentId=${contentId}&assetTypeId=${assetTypeId}`
    );
  }

  // getPublishedCriteriaGroupPageList(contentId) {
  //   return this.http.get(
  //     environment.apiUrl + `/KnowledgeAsset/GetCriteriaGroupById?contentId=${contentId}`
  //   );
  // }

  getPublishedCriteriaGroupPageListNew(ID, contentType, status, contentId, version, currentUserEmail) {
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
    // return this.http.get(
    //   environment.apiUrl + `/KnowledgeAsset/GetCriteriaGroupById?id=${ID}&contentType=${contentType}&status=${status}&contentId=${contentId}&version=${version}&currentUserEmail=${currentUserEmail}`
    // );
    let url = environment.apiUrl + publishedContent.criteriaGroup + "?id=0" + "&contentType=" + "&status=" + "&contentId=" + contentId + "&version=0" + "&currentUserEmail=" + currentUserEmail;
    return this.http.get(url, httpOptions);
  }

  getCriteriaGroupPageListNew(ID, contentType, status, contentId, version, currentUserEmail) {
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
    // return this.http.get(
    //   environment.apiUrl + `/CriteriaGroup/GetCriteriaGroupById?id=${ID}&contentType=${contentType}&status=${status}&contentId=${contentId}&version=${version}&currentUserEmail=${currentUserEmail}`
    // );
    let url = environment.apiUrl + draftContent.criteriaGroup + ID + "&contentType=" + contentType + "&status=" + status + "&contentId=" + contentId + "&version=" + version + "&currentUserEmail=" + currentUserEmail;
    return this.http.get(url, httpOptions);
  }

}
