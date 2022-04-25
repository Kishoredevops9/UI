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
  subSubSubDisciplineId: number;
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
  processMapId: number;
  sequenceNumber: number;
  color:any;
  borderColor:any;
  borderStyle:any;
  borderWidth:number;
  version:number;
  effectiveFrom: Date;
  effectiveTo: Date;
  createdDateTime: Date;
  createdUser: string;
  lastUpdateDateTime: string;
  lastUpdateUser: string ;
  disciplineId:number;
  protectedInd:true;
  requiredInd:true;
  size:string;
}


export class SwimLane {
  id:number = 0;
  name: string = "";
  description: string = "";
  label: string = "";
  processMapId: number;
  sequenceNumber: number;
  color: "#000000";
  backgroundColor: "#000000";
  borderColor:  "#cccccc";
  borderStyle:  "solid";
  borderWidth: 2;
  version: number;
  effectiveFrom: Date;
  effectiveTo: Date;
  createdDateTime: Date;
  createdUser: string = "";
  lastUpdateDateTime: string="";
  lastUpdateUser: string = "";
  location: string = "";
  disciplineId:0;
  protectedInd:true;
  requiredInd:true;
  // size:string = "";
  activityBlocks: ActivityBlocks[] = [];
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
  sequenceNumber: 0;
  color: "#000000";
  borderColor:  "#cccccc";
  borderStyle:  "solid";
  borderWidth: 2;
}
export class ActivityDocuments {
  id: number = 0;
  contentId: string = "";
  activityBlockId: number = 0;
  uri: string = "";
  type: string = "";
  version: number = 0;
  createdbyUserid: string = "";
  modifiedbyUserid: string = "";
  subProcessMapId: number = 0;
  activityPageId: number = 0;
  label: string = "";
}
export class ActivityBlocks {
  id: number = 0;
  swimLaneId: number = 0;
  activityTypeId: number = 0;
  reviewGate: string = "";
  name: string = "";
  description: string = "";
  label: string = "";
  sequenceNumber: number = 0;
  color: string = "";
  backgroundColor: string = "";
  borderColor: string = "";
  borderStyle: string = "";
  borderWidth: number = 0;
  version: number = 0;
  processMapId: number = 0;
  activityMeta: ActivityMeta[] = [];
  activityConnections: ActivityConnections[] = [];
  activityDocuments: ActivityDocuments[] = [];
}
export class ActivityMeta {
  id: number = 0;
  activityBlockId: number = 0;
  key: string = "";
  value: string = "";
  version: number = 0;
  createdUser: string = "";
  lastUpdateUser: string = "";
}
export class ActivityConnections {
  id: number = 0;
  activityBlockId: number = 0;
  previousActivityBlockId: number = 0;
  label: string = "";
  color: string = "";
  backgroundColor: string = "";
  borderColor: string = "";
  borderStyle: string = "";
  borderWidth: number = 0;
  version: number = 0;
  createdUser: string = "";
  lastUpdateUser: string = "";
}
export class PhaseModel {
  name: string = "phase1";
  caption: number = 0;
  size: string = "";
  processMapId: number = 0;
  sequenceNumber: number = 1;
}
export class ProcessMapDataModel {
  id: number;
  contentID: string = "";
  title: string = "";
  disciplineId: number;
  subDisciplineId: number;
  subSubDisciplineId: number;
  subSubSubDisciplineId: number;
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
  disciplineCodeId: number;
  disciplineCode: string;
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
  processMapMeta: ProcessMapMeta[] = [];


  contentPhase: Array<any>;
  contentExportCompliances: Array<any>;
  contentTag: Array<any>;
  //confidentialityLevel: string;
  tpmdate: Date;

  exportAuthorityId: number;
  confidentiality: boolean;
  author: string;
  keywords: string;
  keyword: string;

  editable: boolean;
  clockId : String = ''
}

export class SaveAsMapDataModel {
  id: number;
  contentID: string = "";
  title: string = "";
  disciplineId: number;
  subDisciplineId: number;
  subSubDisciplineId: number;
  subSubSubDisciplineId: number;
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
  disciplineCodeId: number;
  disciplineCode: string;
  createdUser: string = "";
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
  contentPhase: Array<any>;
  contentExportCompliances: Array<any>;
  contentTag: Array<any>;
  tpmdate: Date;
  exportAuthorityId: number;
  confidentiality: boolean;
  author: string;
  keywords: string;
  editable: boolean;
}

export class ExistingProcessMap {

  id: number;
  contentID: string = "";
  title: string = "";
  disciplineId: number;
  disciplineCodeId: number;
  disciplineCode: string;
  subDisciplineId: number;
  subSubDisciplineId: number;
  subSubSubDisciplineId: number;
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
  activityDocuments: ActivityDocuments[] = [];
  // processMapMeta: ProcessMapMeta[] = [];

  contentPhase: Array<any>;
  contentExportCompliances: Array<any>;
  contentTag: Array<any>;

  confidentiality: boolean;
  exportAuthorityId: number;
  tpmdate: Date;
  keywords: string;
  author: string;

  editable: boolean;

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
  controllingProgramId: number;
  ContentStatus: string;
  ContentTypeId: number;
  Scope: string;
  //SetofAuthors: string[] = [];
  //SetofClassifiers: string[] = [];
  //SetofSecurityAttributes: string[] = [];
}

export class DocumentPropertiesKPack {
  name: string;
  // Id:number = 0;
  title: string = "";
  assetTypeId: string;
  assetStatusId: string;
  approvalRequirementId: string;
  disciplineId: number;
  classifierId: number;
  //DisciplineCode:string = "";
  disciplineCode: number;
  programControlled: boolean;
  confidentialityId: number;
  outsourceable: boolean;
  //usjurisdictionId: string = "";
  // usclassificationId: string;
  //classificationRequestNumber: boolean;
  revisionTypeId: number;
  //version: string;
  //createdDateTime: Date;
  createdUser: string = "";
  contentOwnerId: number;
  contentExportCompliance: number[] = [];
  contentPhase: number[] = [];
}

export class UpdatePublishePropertiesForAll {
  id:number;
  contentId: string = '';
  assetKey: string = '';
  title: string = "";
  disciplineId: number;
  assetPhase: number[] = [];
  contentOwner: string = '';
  author: string;
  assetTag: number[] = [];
  version:string;
  LastUpdateUser:string;
  setOfCategories:string;
  SourceFileUrl:string;
}
export class DocumentPropertiesForAll {
  AssetTypeId: number = 0;
  DocumentType: number = 1;
  Keywords: string = '';
  CreatorClockId: string;
  Keyword: string = ''; ///WI/GB/DS
  clockId : String = ''

  documentType: number = 1;
  contentId: string = '';
  contentTypeId: number = 0; //WI/GB/DS
  keyword: string = '';
  keywords: string = '';
  title: string = "";
  disciplineId: number;
  subDisciplineId: number;
  subSubDisciplineId: number;
  subSubSubDisciplineId: number;
  disciplineCodeId: number;
  disciplineCode: string;
  contentPhase: number[] = [];
  contentOwnerId: string = '';
  classifierId: number;
  programControlled: boolean = false;
  outsourceable: boolean = false;
  confidentialityId: number;
  confidentiality: boolean = false;
  contentExportCompliance: number[] = [];
  revisionTypeId: number;
  creatorClockId: string;
  author: string;
  createdUser: string = '';
  contentTag: number[] = [];
  contentTags: number[] = [];
  id: number;
  knowledgePackId: number;
  controllingProgramId: number;
  exportAuthorityId: number;
  swimLanes: SwimLane[] = [];
  AADid: string;
  versionNumber: string;
  approvalRequirementsId: number;
  setOfCategories: number[] = [];
  //Keyword: string = "";
  //TagsCollection: number[] = [];
  //CoAuthor: string = "";
  //Confidentiality: boolean;
  //DisciplineCode:string = "";
  //exportComplianceTouchPoint: number[] = [];
  //CreatedUser:string ='';
  // authorId:number;
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

export class TagData {

  nodePath: string = '';
  disciplineId: number;
  subDisciplineId: number;
  subSubDisciplineId: number;
  subSubSubDisciplineId: number;
}

export class TagDataObject {
  id: number = 0;
  name: string = '';
  parentId: number = 0;
  parantName: string = '';
  subParantName: string = '';
}
