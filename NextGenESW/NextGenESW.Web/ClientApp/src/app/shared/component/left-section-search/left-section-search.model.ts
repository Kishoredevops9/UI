export interface DisciplineCodeList {
  id: string;
  name: string;
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
  // processMapId: number;
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


export class SwimLane {
  id:number =0;
  name: string = "";
  description: string = "";
  label: string = "";
  processMapId: number =0;
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
  activityBlocks:ActivityBlocks[] = [];
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
export class ActivityDocuments{
  id: number=0;
  contentId:string = "";
  activityBlockId: number=0;
  uri: string = "";
  type: string = "";
  version: number=0;
  createdbyUserid: string = "";
  modifiedbyUserid: string = "";
  subProcessMapId: number=0;
  activityPageId: number=0;
  label: string = ""; 
}
export class ActivityBlocks {
      id: number= 0;
      swimLaneId: number= 0;
      activityTypeId: number= 0;
      reviewGate: string = "";
      name: string = "";
      description: string = "";
      label: string = "";
      sequenceNumber:number= 0;
      color: string = "";
      backgroundColor: string = "";
      borderColor: string = "";
      borderStyle: string = "";
      borderWidth: number= 0;
      version: number= 0;
      processMapId: number= 0;
      activityMeta:ActivityMeta[] = [];
      activityConnections:ActivityConnections[] = [];
      activityDocuments:ActivityDocuments[]=[];
}
export class ActivityMeta{
              id: number= 0;
              activityBlockId: number= 0;
              key: string = "";
              value: string = "";
              version: number= 0;
              createdUser: string = "";
              lastUpdateUser: string = "";
}
export class ActivityConnections{
  id: number= 0;
  activityBlockId: number= 0;
  previousActivityBlockId: number= 0;
  label: string = "";
  color: string = "";
  backgroundColor:string = "";
  borderColor: string = "";
  borderStyle: string = "";
  borderWidth: number= 0;
  version: number= 0;
  createdUser: string = "";
  lastUpdateUser: string = "";
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
export class ExistingProcessMap {

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
  swimLanes: SwimLane[] = [];
  processMapMeta: ProcessMapMeta[] = [];
  activityDocuments:ActivityDocuments[]=[];
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
 
  //DisciplineCode:string = "";
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



export class DocumentPropertiesForAP {
 // Id: number = 0;
  // Id:number = 0;
  DocumentType: string = "";
  ContentID: string = "";
  //DocumentName: string = "";
  title: string = "";
  disciplineId: number;
  subDisciplineId: number;
  subSubDisciplineId: number;
  subSubSubDisciplineId: number;
 
  //DisciplineCode:string = "";
  disciplineCodeId: number ;
  //Keyword: string = "";
  contentPhase: number[] = [];
  //TagsCollection: number[] = [];
  contentOwnerId: number ;
  //CoAuthor: string = "";
  classifierId: number;
  //Confidentiality: boolean;
  programControlled: string;
  outsourceable: string;
  confidentialityId: string;
  contentExportCompliance: number[] = [];
  revisionTypeId: number;
  CreatorClockId: string; 
  //PhaseIdCollection: string[] = [];

 
  //TPMDate: string = "";
  //DocumentType: string;   // 
  // logged user emailId

  //ClassifierId: string;
  //********************************************************** */
  // Not Use Now
 
  //SetofAuthors: string[] = [];
  //SetofClassifiers: string[] = [];
  //SetofSecurityAttributes: string[] = [];
}