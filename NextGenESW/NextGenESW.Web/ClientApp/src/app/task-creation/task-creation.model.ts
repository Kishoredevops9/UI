// export interface TaskCreationModel {
//   ContentID: string;
//   ProgramControlled: boolean;
//   Title: string;
//   Outsourceable: boolean;
//   Keyword: string;
//   TagsCollection: string[];
//   ContentOwner: string;
//   Confidentiality: string;
//   CoAuthor: string;
//   RevisionType: string;
// }

export class TaskCreationModel {
  id: number;
  taskReaid: string;
  taskID: string;
  rea: string;
  title: string;
  programRestricted: string;
  ipt: string;
  engineModelTagId: number;
  initialEngineModelTagId: number;
  engineSectionId: number;
  fullEventDescription: string;
  desiredSolution: string;
  announcement : string;
  version: number;
  effectiveFrom: '';
  effectiveTo: '';
  createdDateTime: '';
  createdUser: string;
  lastUpdateDateTime: '';
  lastUpdateUser: string;
  phasesTask: Array<any>;
  tags: Array<any>;
  taskPhases: Array<any>;
  taskTags: Array<any>;
  programControlled: string;
  exportAuthorityId:number;
  controllingProgramId:number;
  programControlledInd: boolean;
}
export class WICDdocList {
  id: number;
  // type: string;
  taskComponentId: number;
  discipline1: string;
  discipline2: string;
  discipline3: string;
  assetTypeCode: string;
  title: string;
  contentId: string;
  OriginContentId: string;
  ReadyInd: boolean;
  disciplineId: number;
  // contentId: string;
  // name: string;
  // excludedInd: boolean;
  // protectedInd: boolean;
  AssetStatusId: number;
  AssetStatusName: string;
  contentCode: string;
  expanded: boolean;
  IncludedInd: boolean;
  actProtectedInd:boolean;
  assetVersion:number;
}

import { FormGroup } from '@angular/forms';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { AnyRecordWithTtl } from 'dns';
import * as uuid from 'uuid';
export class Item {
  name: string;
  content: WICDdocList;
  uId: string;
  children: Item[];
  cgCompletionStatus: boolean;
  disableWIToggler: boolean;
  selectedItem: [];
  criteriaBPData: [];
  cgActivityForm: [];
  disableBPToggler: boolean;
  WIToggler: boolean;
  BPToggler: boolean;
  panelOpenState: boolean;
  editResultsStatus: boolean;
  activityCriteriaChk: boolean;
  bestPractiseChk: boolean;
  taskREAId: string;
  constructor(options: {
    name: string;
    content: WICDdocList;
    children?: Item[];
    cgCompletionStatus: boolean;
    disableWIToggler: boolean;
    selectedItem: [];
    criteriaBPData: [];
    disableBPToggler: boolean;
    cgActivityForm: [];
    WIToggler: boolean;
    BPToggler: boolean;
    panelOpenState: boolean;
    editResultsStatus: boolean;
    activityCriteriaChk: boolean;
    bestPractiseChk: boolean;
    taskREAId: string;
  }) {
    this.name = options.name;
    this.content = options.content;
    this.uId = uuid.v4();
    this.children = options.children || [];
    this.cgCompletionStatus = options.cgCompletionStatus;
    this.disableWIToggler = options.disableWIToggler;
    this.selectedItem = options.selectedItem;
    this.criteriaBPData = options.criteriaBPData;
    this.disableBPToggler = options.disableBPToggler;
    this.cgActivityForm = options.cgActivityForm;
    this.WIToggler = options.WIToggler;
    this.BPToggler = options.BPToggler;
    this.panelOpenState = false;
    this.editResultsStatus = true;
    this.activityCriteriaChk = true;
    this.bestPractiseChk = true;
    this.taskREAId = options.taskREAId;
  }
}
export class FileUploadModel {
  fileName: string = '';
  fileType: string = '';
  UploadFile: any;
  createdUser: string = '';
  relatedContentId: number;
  contentId: string = '';
  constructor() { }
}
export class FileDetails {
  fileName: string = '';
  fileUrl: string = '';
  fileType: string = '';
  constructor() { }
}
export class statementExecutionModel {
  taskExecutionStatementEvaluationId: number;
  taskComponentId: number;
  statementEvaluationId: number;
  exceptionStatementEvaluationId: number;
  createdDateTime: '';
  createdUser: string;
  lastUpdateDateTime: '';
  lastUpdateUser: string;
  activityTaskComponentId: number;
}
export class activityBlockResultEntryModel {
  taskExecutionId: number;
  taskComponentId: number;
  executionStatusCode: any;
  completionInd: boolean;
  bestPracticesInd: boolean;
  createdDateTime: '';
  createdUser: string;
  lastUpdateDateTime: '';
  lastUpdateUser: string;
  completionFlag: boolean;
  userId: any;
}
export class addDeviationModel {
  taskComponentId: number;
  taskID: number;
  statementEvaluationId: number;
  existingDeviationInd: any;
  deviationId: number;
  deviationNumber: string;
  difference: string;
  reason: string;
  criteriaUpdateInd: boolean;
  criteriaUpdate: string;
  riskLevelCode: string;
  riskMitigationPlan: string;
  programRiskId: string;
  deviationStatusCode: string;
  createdDateTime: '';
  createdUser: string;
  lastUpdateDateTime: '';
  lastUpdateUser: string;
  taskExecutionDeviationId: number;
  taskExecutionUpload: [];
  complete: boolean;
}

export class taskExecutionUpload {
  taskExecutionUploadId: number;
  taskComponentId: number;
  documentTypeCode: string;
  documentTitle: string;
  documentReference: string;
  uploadDestinationCode: string;
  createdDateTime: string;
  createdUser: string;
  lastUpdateDateTime: string;
  lastUpdateUser: string;
}

export class addUpdateExceptionModel {
  taskExecutionExceptionId: number;
  taskComponentId: number;
  listAvailableInd: true;
  rationalAvailableInd: true;
  difference: string;
  reason: string;
  needUpdateInd: boolean;
  updateComment: string;
  createdDateTime: '';
  createdUser: string;
  lastUpdateDateTime: '';
  lastUpdateUser: string;
}
export class addUpdateDeviationStatusAsyncModel {
  deviationId: number;
  deviationStatusCode: string;
  lastUpdateDateTime: '';
  lastUpdateUser: string;
}
export class addUpdateTaskExecutionStatusAsyncModel {
  taskComponentId: number;
  executionStatusCode: string;
  lastUpdateDateTime: '';
  lastUpdateUser: string;
}
export class getAllActivitiesStatus {
  status: string;
  documentNo: number;
}
export class getAllActivities {
  sfContentId: string;
  sfusClassification: any;
  sfusJurisdiction: any;
  sfTitle: string;
  stepContentId: string;
  stepTitle: string;
  discipline1: string;
  discipline2: string;
  discipline3: any;
  taskComponentId: number;
  knowledgeAssetId: number;
  stepActivityBlockId: string;
  contentId: string;
  title: string;
  usClassification: string;
  usJurisdiction: string;
  containerItems: any;
  countBPs: number;
  countCs: number;
  countDeviations: number;
  countExceptions: number;
  activityStatus: string;
}

export class addDeviationApprovalModel {
  taskComponentId: number;
  deviationId: number;
  deviationNumber: string;
  createdDateTime: '';
  createdUser: string;
  lastUpdateDateTime: '';
  lastUpdateUser: string;
  taskExecutionDeviationId: number;
}

export class addActivityApprovalModel {
  taskComponentId: number;
  Requester_Name: string;
  Requestor_Email: any;
  Requester_AAID: any;
  Manager_Name: string;
  Manager_Email: any;
  Manager_AAID: any;
  Requestor_Comments: string;
  Manager_Comments: string;
  TaskURL: string;
  Activity_Id: number;
  Activity_Title: string;
}

export class aproveSendbackActivityModel {
  taskComponentId: number;
  isApprove: boolean;
  approver_Name: string;
  approver_Email: any;
  approver_AAID: any;
  Comments: any;
}

export class uploadETFF {
  fileData: string;
  taskId: string;
  revisionId: string;
  filePath: string;
  dataSetType: string;
  dataSetName: string;
  requester: string;
  taskComponentId: number;
  documentTypeCode: string;
  uploadFileType: string;
  uploadFileName: string;
}

export class aproveSendbackDeviationModel {
  deviationId: number;
  taskComponentId: number;
  isApprove: boolean;
  requester_Name: string;
  requester_Email: any;
  requester_AAID: any;
  approver_Role: string;
  approver_Name: string;
  approver_Email: any;
  approver_AAID: any;
  Comments:any;
}

export class submissionForDeviationApprovalModel {
  Deviation_ID: number;
  Deviation_Title: string;
  Supervisor_Name: string;
  Supervisor_Email: any;
  Supervisor_AAID: any;
  Requester_Comments: string;
  Discipline_Chief_Name: string;
  Discipline_Chief_Email: any;
  Discipline_Chief_AADID: any;
  CIPT_Lead_Name: string;
  CIPT_Lead_Email: any;
  CIPT_Lead_AADID: any;
  PCE_Approver_Name: string;
  PCE_Approver_Email: any;
  PCE_Approver_AADID: any;
  Requester_Name: string;
  Requester_Email: any;
  Requester_AADID: any;
  System_Risk: boolean;
  TaskComponentId: number;
}

export class uploadDDMModel {
  taskExecutionUploadId: number;
  taskComponentId: number;
  documentTypeCode: string;
  documentTitle: string;
  documentReference: string;
  uploadDestinationCode: string;
  createdDateTime: string;
  createdUser: string;
  lastUpdateDateTime: string;
  lastUpdateUser: string;
}

export class activityRecallRevise {
  taskComponentId: number;
  requesterEmail: string;
  comments: string;
}

export class deviationRecallRevise {
  taskId: number;
  taskComponentId: number;
  deviationNumber: string;
  deviationStatusCode: string;
  comments: string;
  requester: number;
}
