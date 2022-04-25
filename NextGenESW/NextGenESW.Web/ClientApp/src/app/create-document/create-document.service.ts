import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  WiDropDownList,
  EngineFamilyList,
  CategoryList,
  CreateDocument,
  ExportAuthority,
  WiDisciplineDropDownList, ExportComplianceList,
  ConfidentialitiesDropDownList, ApprovalRequirementIdList, GetClassifiersDropDownList, GetRevionType, RestrictingProgram, RCCategoryList
} from './create-document.model';
import { HttpHelperService } from '@app/shared/http-helper.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { catchError, shareReplay, tap } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { createContent, updateContent } from '@environments/constants';
import { EngineModelGroupDropDownList, InitialEngineModelDropDownList, EngineSectionDropDownList, DisciplineCodeList, DocumentProperties, ProcessMapDataModel, ProcessMapDataModelServerReq, ProcessMapMeta, SwimLanes, TaskCreationProperties } from '@app/task-creation/task-creation-details/task-tab-one-content/task-tab-one-content.model';




@Injectable({
  providedIn: 'root',
})
export class CreateDocumentService {
  constructor(
    private httpHerper: HttpHelperService,
    private http: HttpClient
  ) {}

  baseUrl = environment.processMapAPI;
  baseUrlSecurity = environment.siteSecurityAPI;
  eksGroup = environment.eksGroup;


  getWiDropDownList(dropdownType: string): Observable<WiDropDownList[]> {
    return this.httpHerper.get<WiDropDownList[]>(`WIMetaData/${dropdownType}`);
  }
  getWIDisciplineDropDownList(dropdownType: string): Observable<WiDisciplineDropDownList[]> {
    return this.httpHerper.get<WiDisciplineDropDownList[]>(`MetaDataDiscipline/${dropdownType}`);
  }

  getMappedWiDropDownList(dropdownType: string, id: string): Observable<WiDropDownList[]> {
    return this.httpHerper.get<WiDropDownList[]>(`WIMetaData/${dropdownType}?disciplineCodeId=${id}`);
  }

  getEngineFamilyList(): Observable<EngineFamilyList[]> {
    return this.httpHerper.get<EngineFamilyList[]>(
      `WIMetaData/GetAllEngineFamily`
    );
  }

  getCategoryList(): Observable<CategoryList[]> {
    return this.httpHerper.get<CategoryList[]>(`WIMetaData/GetAllCategory`);
  }

  getLessonLearned(): Observable<CreateDocument[]> {
    return this.httpHerper.get<CreateDocument[]>(`LessonsLearned`);
  }

  getLessonLearnedAP(contentId: string, contentType: string): Observable<CreateDocument[]> {
    return this.httpHerper.get<CreateDocument[]>(`LessonsLearned/${contentId}/${contentType}`);
  }

  $GetAllDisciplineData  :   any ;


  getAllMetaDiscipline(): Observable<CreateDocument[]> {

if ( !this.$GetAllDisciplineData  ){

  this.$GetAllDisciplineData  =   this.httpHerper.get<CreateDocument[]>(`MetaDataDiscipline/GetAllDisciplineData`).pipe(
    tap(() => console.log('config fetched')),
    shareReplay(1)
  );

}


    return this.$GetAllDisciplineData;

  }

  $GetAllDisciplineDataStep  :   any ;

  getAllMetaDisciplineStep(): Observable<CreateDocument[]> {

    if ( !this.$GetAllDisciplineDataStep  ){

      this.$GetAllDisciplineDataStep  =   this.httpHerper.get<CreateDocument[]>(`MetaDataDiscipline/GetAllDisciplineDataForStep`).pipe(
        tap(() => console.log('config fetched')),
        shareReplay(1)
      );

    }


        return this.$GetAllDisciplineDataStep;

      }

  getAllMetaDisciplineMap(): Observable<CreateDocument[]> {
    return this.httpHerper.get<CreateDocument[]>(`MetaDataDiscipline/GetAllDiscipline`);
  }

  getDisciplineCode(disciplineId): Observable<CreateDocument[]> {
    return this.httpHerper.get<CreateDocument[]>(`MetaDataDiscipline/GetDisciplineCodeByDisciplineId?disciplineId=${disciplineId}`);
  }

  getDisciplineCodeMap(disciplineId, subDisciplineId, subSubDisciplineId, subSubSubDisciplineId): Observable<CreateDocument[]> {
    let req = `disciplineId=${disciplineId}`;
    if (subDisciplineId) {
    req = req + `&subDisciplineId=${subDisciplineId}`;
    }
    if (subSubDisciplineId) {
    req = req + `&subSubDisciplineId=${subSubDisciplineId}`;
    }
    if (subSubSubDisciplineId) {
    req = req + `&subSubSubDisciplineId=${subSubSubDisciplineId}`;
    }
    return this.httpHerper.get<CreateDocument[]>(`MetaDataDiscipline/GetAllDisciplineCodeData?${req}`);
    }

  saveLessonLearned(lesson): Observable<CategoryList[]> {
    return this.httpHerper.post<CategoryList[]>(`LessonsLearned`, {
      title: lesson.title,
      description: lesson.description,
      linkNumber: lesson.linkNumber,
      contentId: lesson.contentId,
      contentType: lesson.contentType
    });
  }

  CreateNewWorkInstruction(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
      'Content-Type': 'application/json'
      }),
    };

    return this.http.post(
      environment.apiUrl + createContent.CreateNewWorkInstruction,
       //'http://localhost:56931/api/WorkInstruction/CreateNewWorkInstruction',
      param,
      httpOptions
    );
  }

  getConfidentialitiesList(): Observable<ConfidentialitiesDropDownList[]> {
    return this.httpHerper.get<ConfidentialitiesDropDownList[]>(`Properties/GetConfidentialities`);
  }

  getAllSetOfPhasesList(): Observable<WiDropDownList[]> {
    return this.httpHerper.get<WiDropDownList[]>(`Properties/GetAllSetOfPhases`);
  }

  getAllEngineSection(): Observable<EngineSectionDropDownList[]> {
    return this.http.get<EngineSectionDropDownList[]>(`Properties/GetAllSetOfPhases`);
  }

  getAllApprovalRequirementList(): Observable<ApprovalRequirementIdList[]> {
    return this.httpHerper.get<ApprovalRequirementIdList[]>(`Properties/GetAllApprovalRequirement`);
  }

  getExportComplianceList(): Observable<ExportComplianceList[]> {
    return this.httpHerper.get<ExportComplianceList[]>(`Properties/GetExportCompliance`);
  }

  getClassifiersList(): Observable<GetClassifiersDropDownList[]> {
    return this.httpHerper.get<GetClassifiersDropDownList[]>(`Properties/GetClassifiers`);
  }

  getRevisionTypeList(): Observable<GetRevionType[]> {
    return this.httpHerper.get<GetRevionType[]>(`Properties/GetAllRevisionTypes`);
  }

  retrieveCoauthor(name) {
    let url =`https://graph.microsoft.com/v1.0/me/people?$Select=displayname,userPrincipalName&$search=${name}`;
    return this.http.get<string>(url);
  }


  retrieveCoauthorName() {
    let urlNew = this.baseUrlSecurity + "userprofileprovider/GetUserList?eksGroup=" + this.eksGroup;
    return this.http.get<string>(urlNew);
  }

  retrieveClassifierName() {
    let urlNew = environment.apiUrl + "/Properties/GetClassifiers";
    return this.http.get<string>(urlNew);
  }

  UpdateMap(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
      'Content-Type': 'application/json'
      }),
    };

    return this.http.put(
    this.baseUrl +'processmaps/UpdatePropertiesInProcessMap',
       //'http://localhost:56931/api/WorkInstruction/CreateNewWorkInstruction',
      param,
      httpOptions
    );
  }

  CreateNewMap(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
      'Content-Type': 'application/json'
      }),
    };

    return this.http.post(
    this.baseUrl +'processmaps/createprocessmaps',
       //'http://localhost:56931/api/WorkInstruction/CreateNewWorkInstruction',
      param,
      httpOptions
    );
  }
  CreatePublicStep(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
      'Content-Type': 'application/json'
      }),
    };

    return this.http.post(
    this.baseUrl +'publicsteps/createpublicsteps',
       //'http://localhost:56931/api/WorkInstruction/CreateNewWorkInstruction',
      param,
      httpOptions
    );
  }

  CreateNewStep(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
      'Content-Type': 'application/json'
      }),
    };

    return this.http.post(
    this.baseUrl +'processmaps/CreateStep',
       //'http://localhost:56931/api/WorkInstruction/CreateNewWorkInstruction',
      param,
      httpOptions
    );
  }



  UpdateNewMap(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
      'Content-Type': 'application/json'
      }),
    };

    return this.http.put(
    this.baseUrl +'processmaps/updateprocessmaps',
       //'http://localhost:56931/api/WorkInstruction/CreateNewWorkInstruction',
      param,
      httpOptions
    );
  }

  CreatePhase(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
      'Content-Type': 'application/json'
      }),
    };

    return this.http.post(
    this.baseUrl +'phases/createphases',
      param,
      httpOptions
    );
  }


  createfromExistingProcessMap(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
      'Content-Type': 'application/json'
      }),
    };

    return this.http.post(
     this.baseUrl+'processmaps/createfromexistingprocessmaps',
       //'http://localhost:56931/api/WorkInstruction/CreateNewWorkInstruction',
      param,
      httpOptions
    );
  }
  GetAllRestrictingProgramList(): Observable<RestrictingProgram[]> {
    return this.httpHerper.get<RestrictingProgram[]>(`Properties/GetAllRestrictingProgram`);
  }

  getAllExportAuthorityList(): Observable<ExportAuthority[]> {
    return this.httpHerper.get<ExportAuthority[]>(`Properties/GetAllExportAuthority`);
  }

  UpdateWordBasedPropertiesInfo(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
    };

    return this.http.put(
      environment.apiUrl + updateContent.UpdateWorkInstruction,
      param,
      httpOptions
    );

  }

  getRCCategoryList(): Observable<RCCategoryList[]> {
    return this.httpHerper.get<RCCategoryList[]>(`Properties/GetAllSetOfCategories`);
  }
}

