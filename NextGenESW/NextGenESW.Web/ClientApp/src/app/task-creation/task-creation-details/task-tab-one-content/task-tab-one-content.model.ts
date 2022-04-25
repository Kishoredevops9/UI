export interface DisciplineCodeList {
  id: string;
  name: string;
}

export interface EngineModelGroupDropDownList {
  id: string;
  name: string;
}

export interface InitialEngineModelDropDownList {
  id: string;
  name: string;
}

export interface EngineSectionDropDownList {
  id: string;
  name: string;
}

export interface EngineSectionList {
  engineSectionCode: string;
  description: string;
  id: number;
  version: number;
}

export interface componentWICDdocList {
  contentId: number,
  title: string;
  contentTypeId: number,
  version: string,
  contentCode: string,
  contentNo: string,
  contentType: string,
  contentStatus: string,
  CreatedOn: string,
  CreatorClockId: string,
  ModifiedOn: string,
  ModifierClockId: string,
  ActivityPageId: string,
  activityContainerId: number,
  orderId: number,
}

export interface ActivityPageList {
  Title: string,
  DisciplineCodeId: number,
  DisciplineId: number,
  SubDisciplineId: number,
  SubSubDisciplineId: number,
  PhaseId: number,
  EngineeringOrganizationId: number,
  DfdisciplineId: number,
  DfsubDisciplineId: number,
  CategoryId: number,
  Outsourceable: string,
  CreatedOn: string,
  CreatorClockId: string,
  purpose: string,
  contentType: string
}

export interface activityCompnentIframe {
  id: number,
  sourceId: number,
  sourceUrl: string,
  displayTab: string,
  extractDocName: string,
  uniqueGuid: string,
  extractedDocUrl: string
}

export interface ComponentActivityPage {
  activitPageId: ''
}

export interface contentCollaborationWithHistory {
  contentCollaboration: {
    resourceType: string,
    resourceId: string,
    checkedOutOn: string,
    checkedOutBy: string
  },
  contentCollaborationHistory: {
    resourceType: string,
    resourceId: string,
    checkedOutOn: string,
    checkedOutBy: string
  },
  validationMessage: string
}


export const TREE_DATA: FoodNode[] = [
  {
    name: "Fruit", id: 1, parentid: 0,
    children: [
      { name: "Apple", id: 1, parentid: 1 },
      { name: "Banana", id: 2, parentid: 1 },
      { name: "Fruit loops", id: 3, parentid: 1 }
    ]
  },
  {
    name: "Vegetables", id: 2, parentid: 1,
    children: [
      {
        name: "Green", id: 3, parentid: 1,
        children: [
          { name: "Broccoli", id: 4, parentid: 1 },
          { name: "Brussel sprouts", id: 5, parentid: 1 }
        ]
      },
      {
        name: "Orange", id: 4, parentid: 1,
        children: [{ name: "Pumpkins", id: 6, parentid: 1 }, { name: "Carrots", id: 7, parentid: 1 }]
      }
    ]
  }
];
export interface FoodNode {
  name: string;
  // status: string;
  // createdOn: string;
  // creatorClockId: string;
  // modifiedOn: string;
  // modifierClockId: string;
  parentid?: number;
  id?: number;
  selected?: boolean;
  disabled?: boolean;
  indeterminate?: boolean;
  children?: FoodNode[];
}


export class ProcessMapDataModelServerReq {

  processMapDataModel: ProcessMapDataModel;
  swimLanes: SwimLanes[] = [];
  processMapMeta: ProcessMapMeta[] = [];

}

export class SwimLanes {
  // id:number = 1;
  name: string = "";
  description: string = "";
  label: string = "";
  processMapId: number;
  sequenceNumber: number;
  color: string = "";
  backgroundColor: string = "";
  borderColor: string = "";
  borderStyle: string = "";
  borderWidth: number;
  version: number;
  //effectiveFrom: Date;DisciplineCode
  //effectiveTo: Date;
  //createdDateTime: Date;
  createdUser: string = "";
  //lastUpdateDateTime: string="";
  lastUpdateUser: string = "";
  location: string = "";
}

export class ProcessMapMeta {
  // id: number;
  processMapId: number;
  key: string = "";
  value: string = "";
  version: string = "";
  createdon: string = "";
  createdbyUserid: string = "";
  modifiedon: string = "";
  modifiedbyUserid: string = "";
}

export class ProcessMapDataModel {

  //id: number =0;
  contentID: string = "";
  title: string = "";
  disciplineId: number;
  // disciplineCodeId: number;
  subDisciplineId: number;
  subSubDisciplineId: number;
  assetTypeId: number;
  assetStatusId: number;
  approvalRequirementId: number;
  classifierId: number;
  phaseId: number;

  confidentialityId: number;
  controllingProgramId: number;
  exportComplianceTouchPointId: number;
  revisionTypeId: number;
  contentOwnerId: number;
  programControlled: boolean;
  outsourceable: boolean;
  tagId: number;
  version: number;
  //effectiveFrom: Date;
  //effectiveTo: Date;
  //createdDateTime: Date;
  createdUser: string = "";
  //lastUpdateDateTime: string="";
  lastUpdateUser: string = "";
  firstPublicationDateTime: string = "";
  usjurisdictionId: number;
  usclassificationId: number;
  classificationRequestNumber: number;
  classificationDate: string = "";
  securityAttributesId: number;
  exportComplianceTouchPointComments: string = "";
  assetHandleId: number;
  sourceAssetHandleId: number;
  scopeId: number;
  assetClassId: number;
  swimLanes: SwimLanes[] = [];
  // processMapMeta: ProcessMapMeta[] = [];

}


export class DocumentProperties {
  Id: number = 0;
  // Id:number = 0;
  DocumentType: string = "";
  ContentID: string = "";
  DocumentName: string = "";
  Title: string = "";
  DisciplineId: string;
  SubDisciplineId: string;
  SubSubDisciplineId: string;
  SubSubSubDisciplineId: string;
  DisciplineIdNum: number;
  SubDisciplineIdNum: number;
  SubSubDisciplineIdNum: number;
  SubSubSubDisciplineIdNum: number;
  DisciplineCodeId: string = "";
  Keyword: string = "";
  PhaseIdCollection: string[] = [];
  TagsCollection: string[] = [];
  ContentOwner: string = "";
  CoAuthor: string = "";
  ClassifierId: string;
  Confidentiality: boolean;
  ProgramControlled: boolean;
  Outsourceable: boolean
  ConfidentialityId: string;
  ExportComplienceTouchPointCollection: string[] = [];
  //PhaseIdCollection: string[] = [];

  RevisionType: string = "";
  TPMDate: string = "";
  //DocumentType: string;   // 
  CreatorClockId: string; // logged user emailId

  //ClassifierId: string;
  //********************************************************** */
  // Not Use Now
  ControllingProgramId: number;
  ContentStatus: string;
  ContentTypeId: number;
  Scope: string;
  //SetofAuthors: string[] = [];
  //SetofClassifiers: string[] = [];
  //SetofSecurityAttributes: string[] = [];
}

export class TaskCreationProperties {
  ContentID: string = "";
  ProgramControlled: boolean;
  Title: string = "";
  Outsourceable: boolean;
  Keyword: string = "";
  TagsCollection: string[] = [];
  ContentOwner: string = "";
  Confidentiality: string = "";
  CoAuthor: string = "";
  RevisionType: string = "";
}


export class TaskCreationPostModel {
  taskID: string;
  rea: string;
  title: string;
  programRestricted: string;
  ipt: string;
  engineModelTagId: number;
  initialEngineModelTagId: number;
  engineSectionCode: string;
  fullEventDescription: string;
  desiredSolution: string;
  version: number;
  effectiveFrom: "2021-02-05T12:33:06.902Z";
  effectiveTo: "2021-02-05T12:33:06.902Z";
  createdDateTime: "2021-02-05T12:33:06.902Z";
  createdUser: string;
  lastUpdateDateTime: "2021-02-05T12:33:06.902Z";
  lastUpdateUser: string;

  //   {
  //     "title": "Test Tasks",
  //     "rea": "Test REA",
  //     "engineModelTagId": 6,
  //     "engineSectionCode": "AIR",
  //     "ipt": "Test IPT",
  //     "fullEventDescription": "For test task creation",
  //     "desiredSolution": "Test ds",
  //     "version": 0,
  //     "effectiveFrom": "2021-02-05T09:36:03.761Z",
  //     "effectiveTo": "2021-02-05T09:36:03.761Z",
  //     "createdDateTime": "2021-02-05T09:36:03.761Z",
  //     "createdUser": "pwesw1@pwesw2.onmicrosoft.com",
  //     "lastUpdateDateTime": "2021-02-05T09:36:03.761Z",
  //     "lastUpdateUser": "pwesw1@pwesw2.onmicrosoft.com",
  //     "initialEngineModelTagId": 6
  // }

}

export interface TagSearchViewData {
  contentid: number;
  contentname: string;
  contentno: number;
  contenttypeid: number;
  contenttypename: string;
  tagname: string;
  tagsid: number;
}