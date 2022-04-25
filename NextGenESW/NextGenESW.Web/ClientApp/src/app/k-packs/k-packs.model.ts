
export class kPackPurpose {
  PurposeId: number;
  ContentForPurposeId: number;
  ContentId: number;
  LayoutId: number;
  LayoutType: string;
  Title: string;
  Description: string;
  TabID: string;
  ContentHTML1: string;
  ContentHTML2: string;
  ContentHTML3: string;
  LinkHTML1: object[];
  LinkHTML2: object[];
  LinkHTML3: object[];
  Order: number;
  KnowledgePackId: number;
  purposeTitle: string;
  PurposeDescription: string;
  KnowledgePackContentId: number;
  TabCode: string;
  ContentFirst: string;
  ContentSecond: string;
  ContentThird: string;
}

export class kPackPhysics {
  KnowledgePackId: number;
  knowledgePackContentId: number;
  KnowledgePackContentId: number;
  ContentId: number;
  TabCode: string;
  Title: string;
  Description: string;
  LayoutId: number;
  layoutType: string;
  contentFirst: string;
  contentSecond: string;
  contentThird: string;
  LinkHTML1: object[];
  LinkHTML2: object[];
  LinkHTML3: object[];
  Order: number;
  CreatedDateTime: Date;
  LastUpdateDateTime: Date;
  FrameNumber: number;
  FrameType: string;
  Heading: string;
}




export const componentMessages = Object.freeze({
  deleteConfirmation: 'There are child associated with this component. Deleting the parent will delete all the child components. Are you sure you want to delete?'
})