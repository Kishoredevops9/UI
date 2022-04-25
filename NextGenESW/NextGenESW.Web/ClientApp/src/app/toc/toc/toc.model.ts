
export interface tocWICDdocList {
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

export interface ToCPageList {
  id: string,
  name: string,
  title: string,
  assetTypeId: number,
  assetStatusId: number,
  approvalRequirementId: number,
  disciplineId: number,
  disciplineCode: string,
  programControlled: boolean,
  confidentialityId: number,
  Outsourceable: number,
  usjurisdictionId: number,
  usclassificationId: number,
  classificationRequestNumber: number,
  revisionTypeId: number,
  version: number,
  createdDateTime: string,
  createdUser: string,
  purpose: string
}


export class WICDdocList {
  indexNo: string;
  contentId: number;
  contentUrl: string;
  createdDateTime: string;
  createdUser: string;
  effectiveFrom: string;
  effectiveTo: string;
  lastUpdateDateTime: string;
  lastUpdateUser: string;
  title: string;
  tableOfContentId: number;
  version: string;
  contentCode: string;
  isEdit: string;
  assetType: string;
  assetTypeId: string;
  tocid: string;
  tableOfContentTocid: number;
  parentTableOfContentTocid: number;
  toctype: boolean;
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

export const componentMessages = Object.freeze({
  deleteConfirmation : 'There are child associated with this component. Deleting the parent will delete all the child components.',
  deleteConfirmation1 : 'Are you sure you want to delete?'
})