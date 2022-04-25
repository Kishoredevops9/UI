export class Constants {
  public static apiQueryString = 'globalUId';
}

// Publish content type endpoint
export const publishedContent = {
  wigbdsContent: '/WorkInstruction/GetWIMetaData',
  knowledgePack: '/KnowledgePack/GetKnowledgePackProperties',
  criteriaGroup: '/KnowledgeAsset/GetCriteriaGroupById',
  activityPage: '/KnowledgeAsset/GetActivityPageById',
  tableOfContent: '/KnowledgeAsset/GetTableOfContentById',
  relatedContent: '/KnowledgeAsset/GetRelatedContentById',
};

// Draft content type endpoint
export const draftContent = {
  criteriaGroup: '/CriteriaGroup/GetCriteriaGroupById',
  activityPage: '/ActivityPage/GetActivityPageById',
  tableOfContent: '/TableOfContent/GetTableOfContentById',
  relatedContent: '/RelatedContent/GetRelatedContentById',
};

// Create content type endpoint
export const createContent = {
  CreateActivityPage: '/ActivityPage/CreateActivityPage',
  CreateCriteriaGroup: '/CriteriaGroup/CreateCriteriaGroup',
  CreateKpack: '/KnowledgePack/CreateKpack',
  CreateRelatedContent: '/RelatedContent/CreateRelatedContent',
  CreateTableOfContent: '/TableOfContent/CreateTableOfContent',
  CreateNewWorkInstruction: '/WorkInstruction/CreateNewWorkInstruction',
};

// Update content type endpoint
export const updateContent = {
  UpdateActivityPage: '/ActivityPage/UpdatePropertiesInActivityPage',
  UpdateCriteriaGroup: '/CriteriaGroup/UpdatePropertiesInCriteriaGroup',
  UpdateKpack: '/KnowledgePack/UpdatePropertiesInKnowledgePack',
  UpdateRelatedContent: '/RelatedContent/UpdatePropertiesInRelatedContent',
  UpdateTableOfContent: '/TableOfContent/UpdatePropertiesInTableOfContent',
  UpdateWorkInstruction: '/WorkInstruction/UpdateMetaData',
};

export const launchXClass = {
  XClassLaunchURL: "https://www.google.com/",
};

export const allEKSCollection = [
  {
    name: 'Work Instructions',
    code: 'WI',
    keyword: 'I',
    class: 'EKS_btns_wi',
    value: 1,
    checked: false
  },
  {
    name: 'Guide Books',
    code: 'GB',
    keyword: 'G',
    class: 'EKS_btns_gb',
    value: 2,
    checked: false
  },
  {
    name: 'Design Standard',
    code: 'DS',
    keyword: 'S',
    class: 'EKS_btns_ds',
    value: 3,
    checked: false
  },
  {
    name: 'STEP Flow',
    code: 'SF',
    keyword: 'F',
    class: 'EKS_btns_sf',
    value: 4,
    checked: false
  },
  {
    name: 'Activity Pages',
    code: 'AP',
    keyword: 'A',
    class: 'EKS_btns_ap',
    value: 6,
    checked: false
  },
  {
    name: 'Knowledge Pack',
    code: 'KP',
    keyword: 'K',
    class: 'EKS_btns_kp',
    value: 9,
    checked: false
  },
  {
    name: 'Criteria Groups',
    code: 'CG',
    keyword: 'C',
    class: 'EKS_btns_cg',
    value: 10,
    checked: false
  },
  {
    name: 'Table of Content',
    code: 'TOC',
    keyword: 'T',
    class: 'EKS_btns_toc',
    value: 11,
    checked: false
  },
  {
    name: 'Related Content',
    code: 'RC',
    keyword: 'R',
    class: 'EKS_btns_rc',
    value: 12,
    checked: false
  },
  {
    name: 'STEP',
    code: 'SP',
    keyword: 'P',
    class: 'EKS_btns_sp',
    value: 13,
    checked: false
  }
];

// Content type new
export const contentTypeCode = {
  workInstruction: 'I',
  designStandardOld: 'D',
  designStandard: 'S',
  guideBook: 'G',
  activityPage: 'A',
  criteriaGroup: 'C',
  knowledgePack: 'K',
  relatedContent: 'R',
  tableOfContent: 'ToC',
  map: 'M',
  stepFlow: 'F',
  publicStep: 'S',
  step: 'Step',
};

// Content type old
export const oldContentTypeCode = {
  workInstruction: 'WI',
  designStandard: 'DS',
  guideBook: 'GB',
  activityPage: 'AP',
  criteriaGroup: 'CG',
  knowledgePack: 'KP',
  relatedContent: 'RC',
  tableOfContent: 'TOC',
  map: 'M',
  stepFlow: 'SF',
  publicStep: 'SP',
  step: 'step',
};

export const documentPath = {
  publishViewPath: 'view-document',
  draftViewPath: 'view-document',
  stepDraft: 'process-maps',
  stepflowDraft : 'process-maps/create-progressmap'



};

export function assetTypeConstantValue(value) {
  let contentTypeValue;
  switch (value) {
    case 'I':
    case 'WI':
      contentTypeValue = 'WI';
      break;
    case 'G':
    case 'GB':
      contentTypeValue = 'GB';
      break;
    case 'S':
    case 'DS':
      contentTypeValue = 'DS';
      break;
    case 'C':
    case 'CG':
      contentTypeValue = 'CG';
      break;
    case 'A':
    case 'AP':
      contentTypeValue = 'AP';
      break;
    case 'K':
    case 'KP':
      contentTypeValue = 'KP';
      break;
    case 'R':
    case 'RC':
      contentTypeValue = 'RC';
      break;
    case 'T':
    case 'TOC':
      contentTypeValue = 'TOC';
      break;
    case 'M':
    case 'MAP':
      contentTypeValue = 'M';
      break;
    case 'F':
    case 'SF':
      contentTypeValue = 'SF';
      break;
    case 'step':
      contentTypeValue = 'step';
      break;
    case 'P':
    case 'SP':
      contentTypeValue = 'SP';
      break;
  }
  return contentTypeValue;
}

export const taskExecutionCollection = [
  {
    name: 'Work Instructions',
    code: 'WI',
    keyword: 'WI',
    checked: false
  },
  {
    name: 'STEP Flow',
    code: 'Steps',
    keyword: 'S',
    checked: false
  },
  {
    name: 'Activity Pages',
    code: 'AP',
    keyword: 'A',
    checked: false
  },
  {
    name: 'Criteria Groups',
    code: 'CG',
    keyword: 'CG',
    checked: false
  }
];

export const DATE_FORMAT = {
  DISPLAY_DATE: 'yyyy-MM-dd'
};

export const ASSET_STATUSES = {
  DRAFT: 'Draft',
  PUBLISHED: 'Published',
  SUBMITTED_FOR_APPROVAL: 'Submitted for Approval',
  APPROVED_WAITING_FOR_JC: 'Approved, Waiting for JC',
  CURRENT: 'Current',
  OBSOLETE: 'Obsolete',
  ARCHIVED  : 'Archived'
};
