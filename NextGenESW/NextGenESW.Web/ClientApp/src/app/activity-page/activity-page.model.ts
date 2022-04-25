export interface DisciplineCodeList {
  id: string;
  name: string;
}

export interface GetAllContentType2 {
  contentId: Number;
  contenttypename: string;
  DisciplineId: Number;
}
export interface recallModel {
  contentId: string;
  version: number;
  requestor: string;
}

export interface componentWICDdocList {
  contentId: number,
  title: string;
  contentTypeId: number,
  version: string,
  assetStatus:string,
  contentCode: string,
  guidance: string;
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

export class WICDdocList {
  contentId: number;
  title: string;
  assetStatus:string;
  assetContentId: any;
  contentTypeId: number;
  contentItemId: number;
  version: string;
  contentCode: string;
  contentNo: string;
  contentType: string;
  contentStatus: string;
  CreatedOn: string;
  guidance: string;
  CreatorClockId: string;
  ModifiedOn: string;
  ModifierClockId: string;
  ActivityPageId: string;
  activityContainerId: number;
  orderNo: number;
  parentActivityContainerId: number;
  uS_JC: string;
  url: string;
}

export interface reqCreateActivity {
  ActivityPageId: string,
  ContentId: number,
  Title: number,
  ContentTypeId: number,
  ContentNo: number,
  US_JC: number,
  Url: number,
  Version: number,
  parentActivityContainerId: number,
  OrderNo: number,
  CreatedOn: string,
  CreatorClockID: string,
  ModifiedOn: string,
  ModifierClockID: string
}

import * as uuid from 'uuid';

export class Item {
  name: string;
  content: WICDdocList;
  uId: string;
  children: Item[];
  id: string;
  assetStatus:string;
  
  constructor(options: {
    name: string,
    content: WICDdocList,
    children?: Item[]
  }) {
    this.name = options.name;
    this.content = options.content;
    this.uId = uuid.v4();
    this.id = this.uId;
    this.children = options.children || [];
  } 
}
export class dragItems {
  id: string;
  title:string;
  contentId:string;
  uId: string;
  children:[];
}


export const componentMessages = Object.freeze({
  deleteConfirmation : 'There are child associated with this component. Deleting the parent will delete all the child components. Are you sure you want to delete?',
  deleteConfirmation1 : 'Are you sure you want to delete?'
})