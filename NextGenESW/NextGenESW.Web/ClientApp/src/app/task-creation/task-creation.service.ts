import { Injectable } from '@angular/core';
import {
  HttpHeaders,
  HttpClient,
  HttpEvent,
  HttpEventType,
} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { HttpHelperService } from '@app/shared/http-helper.service';
import {
  CategoryList,
  CreateDocument,
} from '@app/create-document/create-document.model';
import { TaskCreationModel } from './task-creation.model';
import { shareReplay, tap } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';

//environment.taskAPI

@Injectable({
  providedIn: 'root',
})
export class TaskCrationPageService {
  private _autoRefresh$ = new Subject<void>();

  get autoRefresh$() {
    return this._autoRefresh$;
  }

  getIframeId() {
    throw new Error('Method not implemented.');
  }
  constructor(
    private http: HttpClient,
    private httpHelper: HttpHelperService
  ) {}
  //environment.taskAPI;

  ///api/taskmap/createtaskmap

  getalltaskmapsbytaskid($taskID) {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    return this.http.get(
      environment.taskAPI + 'task/getalltaskmapsbytaskid?taskId=' + $taskID,
      httpOptions
    );
  }


  GetCloseTasksConfirmation($ID){
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    return this.http.get(
      environment.taskAPI + 'task/GetCloseTasksConfirmation?taskId=' + $ID,
      httpOptions
    );

  }

 exeCloseTask(obj){

 


   
  const httpOptions = {
    headers: new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }),
  };

  return this.http.put(
    environment.taskAPI + 'task/CloseTask',
    obj,
    httpOptions
  );
 }

reopenTask(obj){

 


   
  const httpOptions = {
    headers: new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }),
  };

  return this.http.put(
    environment.taskAPI + 'task/reopenTask',  
    obj,
    httpOptions
  );
 }

  updatetaskcomponentinclusion(obj) {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    return this.http.put(
      environment.taskAPI + 'task/updatetaskcomponentinclusion',
      obj,
      httpOptions
    );
  }

  updateHighLight(obj) {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    return this.http.put(
      environment.taskAPI + 'task/updatetaskcomponentinclusionlist',
      obj,
      httpOptions
    );
  }

  gettaskstepflowbytaskid($taskID) {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    return this.http.get(
      environment.taskAPI + 'task/gettaskstepflowbytaskid?taskId=' + $taskID,
      httpOptions
    );
  }

  getAuthTaskUser(data) {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    return this.http.get(
      environment.taskAPI + 'usertask/IsAbleToCreateTask?userId=' + data,
      httpOptions
    );
  }

  GetTaskAuthorizations(id,data) {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    return this.http.get(
      environment.taskAPI +
        `usertask/GetTaskAuthorizations?taskId=${id}&userId=${data}`,
      httpOptions
    );
  }

  //https://ekstasks.azurewebsites.net/api/taskmap/deletetaskmap?taskMapId=41

  deletetaskmap($ID) {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    return this.http.delete(
      environment.taskAPI + 'taskmap/deletetaskmap?taskMapId=' + $ID,

      httpOptions
    );
  }

  //  "/api/taskmap/checktaskmapisabletodelete?taskMapId=194&contentId=FC-F-014485"

  checktaskmapisabletodelete($element) {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    return this.http.get(
      environment.taskAPI +
        `taskmap/checktaskmapisabletodelete?taskMapId=${$element.id}&contentId=${$element.contentId}`,
      httpOptions
    );
  }

  createtaskmap(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(
      environment.taskAPI + 'taskmap/createtaskmap',
      param,
      httpOptions
    );
  }

  addBrowseStepFlow(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(
      environment.taskAPI + 'taskmap/AddBrowseStepFlow',
      param,
      httpOptions
    );
  }



  releasependingitem(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(
      environment.taskAPI + 'taskcomponent/releasependingitem',
      param,
      httpOptions
    );
  }

  createspecificstepflow(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(
      environment.taskAPI + 'knowledgeassets/createspecificstepflow',
      param,
      httpOptions
    );
  }

  createspecificsteps(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(
      environment.taskAPI + 'knowledgeassets/createspecificsteps',
      param,
      httpOptions
    );
  }

  createspecificswimLanes(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(
      environment.taskAPI + 'swimlanes/createspecificswimLanes',
      param,
      httpOptions
    );
  }

  CreateNewProperties(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(
      environment.apiUrl + '/CriteriaGroup/CreateCriteriaGroup',
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
      environment.apiUrl + '/CriteriaGroup/UpdatePropertiesInCriteriaGroup',
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
  DeleteCriteria(id) {
    return this.http.delete(
      environment.apiUrl +
        `/CriteriaGroup/DeleteCriteriaGroupCriteria?criteriaGroupCriteriaId=${id}`
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

  createusertasks(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(
      environment.taskAPI + 'task/createusertasks',
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
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(
      environment.apiUrl + '/CriteriaGroup/UpdateCriteriaGroupNatureOfChange',
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
  getTaskCreation(): Observable<TaskCreationModel[]> {
    let url = '../../../assets/data/task-creation-list.json';
    return this.http.get<TaskCreationModel[]>(url);
  }

  getSearchPopupData(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Basic cmVhZF91c2VyOnJlYWRfdXNlcg==',
      }),
    };
    let url = `https://ekssearch.centralindia.cloudapp.azure.com:9200/knowledgeasset/_search?q=assettypecode:${param}&from=0&size=1000`;
    return this.http.get(url, httpOptions);
    //let quertyString = { "searchText": "q=assettypecode:" + param + "&from=0&size=1000" }
    //return this.http.post(environment.EKSInternalSearchAPI, quertyString);
  }

  /* Task Execution Statement Execution Functionality Start Here */
  addUpdateStatementExecution(param: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(
      environment.taskAPI + 'taskExecution/AddUpdateStatementExecution',
      param,
      httpOptions
    );
  }

  /* Task Execution Activity Block Result Entry Functionality Start Here */
  activityBlockResultEntryAsync(param: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    return this.http
      .post(
        environment.taskAPI + 'taskExecution/ActivityBlockResultEntryAsync',
        param,
        httpOptions
      )
      .pipe(
        tap(() => {
          this._autoRefresh$.next();
        })
      );
  }

  /* Task Execution Get All Activity API Integratin Start Here */
  getAllActivity(taskComponentId: number) {
    return this.http.get(
      environment.taskAPI +
        'taskExecution/GetAllActivity?' +
        'taskId=' +
        taskComponentId
    );
  }

  /* Task Execution Get Task Component Activity API Integratin Start Here */
  getTaskExecution() {
    let taskId = 376;
    let queryString = 'taskId=' + taskId;
    return this.http.get(
      environment.taskAPI + 'taskExecution/GetTaskComponent?' + queryString
    );
  }

  /* Task Execution Add Deviation Functionality Start Here */
  addDeviation(param: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(
      environment.taskAPI + 'taskExecution/AddEditDeviationAsync',
      param,
      httpOptions
    );
  }

  /* Task Execution Get All Activity API Integratin Start Here */
  addUpdateTaskExecutionExceptionsAsync(param: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(
      environment.taskAPI +
        'taskExecution/AddUpdateTaskExecutionExceptionsAsync',
      param,
      httpOptions
    );
  }

  /* Task Execution Get All Activity API Integratin Start Here */
  updateTaskExecutionStatusAsync(param: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    return this.http.put(
      environment.taskAPI + 'taskExecution/UpdateTaskExecutionStatusAsync',
      param,
      httpOptions
    );
  }

  /* Task Execution Get Execution Data API Integratin Start Here */
  getExecutionTaskStepFlowByTaskId(taskID: any) {
    return this.http.get(
      environment.taskAPI + 'task/gettaskstepflowbytaskid?taskId=' + taskID
    );
  }

  /* Task Execution Get All Critieria BP Data API Integratin Start Here */
  getAllCriteriaBPValues(taskID: any) {
    return this.http.get(
      environment.taskAPI +
        'taskExecution/GetAllCriteriaBPValues?taskId=' +
        taskID
    );
  }

  getTaskReminder(taskID: any) {
    return this.http.get(
      environment.taskAPI +
        'task/GetTaskReminder?taskId=' +
        taskID
    );
  }

  getTaskReminderUpdate(param: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    return this.http.put(
      environment.taskAPI + 'task/UpdateTaskReminder',
      param,
      httpOptions
    );
  }

  /* Task Execution Update Deviation Status API Integratin Start Here */
  updateDeviationStatusAsync(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };

    return this.http.put(
      environment.apiUrl + '/taskExecution/UpdateDeviationStatusAsync',
      param,
      httpOptions
    );
  }

  /* Task Execution Get All Activities Status API Integratin Start Here */
  getAllActivitiesStatus(taskId) {
    return this.http.get(
      environment.taskAPI +
        `taskExecution/GetAllActivitiesStatus?taskId=${taskId}`
    );
  }

  /* Task Execution Get All Activities API Integratin Start Here */
  getAllActivities(taskId: number, required: boolean, statusCode: string) {
    return this.http.get(
      environment.taskAPI +
        `task/GetActivitiesGroupByCurrentUser?taskId=${taskId}&isAllRequired=${required}&statusCode=${statusCode}`
    );
  }

  /* Task Execution Get Manager Name API Integratin Start Here */
  approvalManagerName() {
    let urlNew =
      environment.siteSecurityAPI +
      'userprofileprovider/GetUserList?eksGroup=' +
      environment.eksGroup;
    return this.http.get<string>(urlNew);
  }

  /* Task Execution Post Deviation Approval WF API Integratin Start Here */
  sendDeviationApproval(param: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(
      environment.taskAPI +
        'taskExecution/AddUpdateTaskExecutionExceptionsAsync',
      param,
      httpOptions
    );
  }

  /* Task Execution Post Activity Approval WF API Integratin Start Here */
  submissionForActivityApprovalWF(param: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(
      environment.taskAPI + 'taskExecution/SubmissionForActivityApprovalWF',
      param,
      httpOptions
    );
  }

  /* Task Execution Get Activities Group By Discipline API Integratin Start Here */
  getActivitiesGroupByDiscipline(taskId: any) {
    let queryString = 'taskId=' + taskId;
    return this.http.get(
      environment.taskAPI +
        'taskExecution/GetActivitiesGroupByDiscipline?' +
        queryString
    );
  }

  /* Task Execution Get Activities Group By Current User API Integratin Start Here */
  getActivitiesGroupByCurrentUser(taskId: any, isAllRequired: boolean) {
    let queryString = 'taskId=' + taskId + '&isAllRequired=' + isAllRequired;
    return this.http.get(
      environment.taskAPI +
        'task/GetActivitiesGroupByCurrentUser?' +
        queryString
    );
  }

  /* Task Execution Get All Completed Activity Group By Current User API Integratin Start Here */
  getAllCompletedActivity(taskId: any) {
    let queryString = 'taskId=' + taskId;
    return this.http.get(
      environment.taskAPI + 'task/GetAllCompletedActivity?' + queryString
    );
  }

  /* Task Execution Post Activity Approval WF API Integratin Start Here */
  submissionForApproveSendBackActivityWF(param: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(
      environment.taskAPI +
        'taskExecution/SubmissionForApproveSendBackActivityWF',
      param,
      httpOptions
    );
  }

  /* Upload ETFF API Integration*/

  uploadETFF(param: any) {
    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //   }),
    // };

    return this.http.post(environment.taskAPI + 'task/PwUploadToETFF', param, {
      reportProgress: true,
      observe: 'events',
    });
  }

  /* Task Execution Get Submitted Deviation Group By Current User API Integratin Start Here */
  getSubmittedDeviationsGroupByCurrentUser(
    taskId: any,
    isAllRequired: boolean
  ) {
    let queryString = 'taskId=' + taskId;
    return this.http.get(
      environment.taskAPI +
        'task/GetSubmittedDeviationsGroupByCurrentUserAsync?' +
        queryString
    );
  }

  /* Task Execution Get Deviation Approval Submit Approval WF API Integratin Start Here */
  submissionForDeviationApprovalWF(param: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(
      environment.taskAPI + 'taskExecution/SubmissionForDeviationApprovalWF',
      param,
      httpOptions
    );
  }

  /* Task Review Approval / Send Back Deviation WF API Integratin Start Here */
  submissionForApproveSendBackDeviationWF(param: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(
      environment.taskAPI +
        'taskExecution/SubmissionForApproveSendBackDeviationWF',
      param,
      httpOptions
    );
  }

  /* Task Execution Get Completed Deviations Group By Discipline API Integratin Start Here */
  getCompletedDeviationsGroupByDisciplineAsync(taskId: any) {
    let queryString = 'taskId=' + taskId;
    return this.http.get(
      environment.taskAPI +
        'taskExecution/GetCompletedDeviationsGroupByDisciplineAsync?' +
        queryString
    );
  }

  /* Upload DDM API Integration*/

  uploadDDM(param: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(
      environment.taskAPI + 'taskExecution/UploadDDM',
      param,
      httpOptions
    );
  }

  uploadUpdateDDMWebLink(param: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    return this.http.put(
      environment.taskAPI + 'taskExecution/UpdateTaskExecutionUpload',
      param,
      httpOptions
    );
  }

  deleteDDMWebLink(taskUploadId) {
    return this.http.delete(
      environment.taskAPI +
        'taskExecution/DeleteTaskExecutionUpload?taskExecutionUploadId='+taskUploadId
    );
  }

  uploadWebLink(param: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(
      environment.taskAPI + 'taskExecution/UploadWebLink',
      param,
      httpOptions
    );
  }

  deleteDeviationByNumber(deviationNumber, taskComponentId) {
    return this.http.delete(
      environment.taskAPI +
        'taskExecution/DeleteDeviationByNumberAsync?deviationNumber=' +
        deviationNumber +
        '&taskComponentId=' +
        taskComponentId
    );
  }

  isDeviationNumberExistsAsync(
    deviationNumber,
    taskComponentId,
    createdOrModifiedBy
  ) {
    return this.http.get(
      environment.taskAPI +
        'taskExecution/IsDeviationNumberExistsAsync?deviationNumber=' +
        deviationNumber +
        '&taskComponentId=' +
        taskComponentId +
        '&createdOrModifiedBy=' +
        createdOrModifiedBy
    );
  }

  deleteTaskExecutionExceptionAsyn(taskComponentId) {
    return this.http.delete(
      environment.taskAPI +
        'taskExecution/DeleteTaskExecutionExceptionAsync?taskComponentId=' +
        taskComponentId
    );
  }
  getREADetailsLocal(taskId: any) {
    let requiredParameter = 'taskId=' + taskId;
    return this.http.get(
      '../../assets/data/rea-data.json' + '?' + requiredParameter
    );
  }

  getREADetailsDev(taskId: any) {
    let requiredParameter = 'taskId=' + taskId;
    return this.http.get(
      environment.taskAPI + 'task/GetReaDetails?' + requiredParameter
    );
  }

  // getAllTaskExecutionUploadDetails(taskId: any) {
  //   let requiredParameter = 'taskId=' + taskId;
  //   return this.http.get(
  //     environment.taskAPI +
  //       'task/GetTaskExecutionUploadDetails?' +
  //       requiredParameter
  //   );
  // }

  getAllTaskExecutionUploadDetails$: any = {};

  getAllTaskExecutionUploadDetails(taskId: any, reset?: boolean) {
    let requiredParameter = 'taskId=' + taskId;
    if (reset) {
      this.getAllTaskExecutionUploadDetails$[taskId] = null;
    }
    if (!this.getAllTaskExecutionUploadDetails$[taskId]) {
      this.getAllTaskExecutionUploadDetails$[taskId] = this.http
        .get(
          environment.taskAPI +
            'task/GetTaskExecutionUploadDetails?' +
            requiredParameter
        )
        .pipe(shareReplay(1));
    }
    return this.getAllTaskExecutionUploadDetails$[taskId];
  }

  getAllDeivationStatus$: any = {};

  getAllDeviationStatusByTaskIdAsync(taskId: any) {
    let requiredParameter = 'taskId=' + taskId;
    if (!this.getAllDeivationStatus$[taskId]) {
      this.getAllDeivationStatus$[taskId] = this.http
        .get(
          environment.taskAPI +
            'taskExecution/GetAllDeviationStatusByTaskIdAsync?' +
            requiredParameter
        )
        .pipe(shareReplay(1));
    }
    return this.getAllDeivationStatus$[taskId];
  }

  getTaskWFAuditDetails(taskId: any, taskComponentId: any) {
    let requiredParameter =
      'taskId=' + taskId + '&taskComponentId=' + taskComponentId;
    return this.http.get(
      environment.taskAPI + 'task/GetTaskWFAuditDetails?' + requiredParameter
    );
  }

  invokeActivityWFRecall(param: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(
      environment.taskAPI + 'taskExecution/InvokeActivityWFRecall?',
      param,
      httpOptions
    );
  }

  recallDeviationAsync(param: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(
      environment.taskAPI + 'taskExecution/RecallDeviationAsync?',
      param,
      httpOptions
    );
  }

  invokeActivityWFRevise(param: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(
      environment.taskAPI + 'taskExecution/InvokeActivityWFRevise?',
      param,
      httpOptions
    );
  }

  invokeDeviationWFRevise(param: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(
      environment.taskAPI + 'taskExecution/InvokeDeviationWFRevise?',
      param,
      httpOptions
    );
  }

  createspecificactivity(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(
      environment.taskAPI + 'privateactivitypage/createspecificactivity',
      param,
      httpOptions
    );
  }

  createtaskspecificcontainer(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(
      environment.taskAPI + 'containeritems/createtaskspecificcontaineritems',
      param,
      httpOptions
    );
  }
}
