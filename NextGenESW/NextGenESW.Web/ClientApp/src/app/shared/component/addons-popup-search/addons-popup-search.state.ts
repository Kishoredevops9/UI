export interface InternalSearchQueryObject {
  searchText?: string,
  assetTypeCode?: string,
  phaseId?: string,
  tagsId?: string,
  phaseNames?: string,
  tags?: string,
  size?: number,
  from?: number,
  assetStatusId?: number,
  version?: number,
  isObsolete?: boolean,
  keywords?: string,
  contentOwnerId?: string,
  disciplineCode?: string,
  onAdvancedSearch?: boolean,
  user?: string,
}

export interface GlobalQueryObject {
  query?: string,
  startAt?: number,
  maxItems?: number,
  fields?: string[],
  modifiedDate?: string,
}

export interface PwPlayQueryObject {
  query?: string,
  startAt?: number,
  maxItems?: number,
  userName?: string,
  onlyActive?: boolean, 
}
export interface AddonsPopupState {
  eksQueryObject: InternalSearchQueryObject,
  globalQueryObject: GlobalQueryObject,
  pwPlayQueryObject: PwPlayQueryObject,
  eksSearchResult: ESKSearchResult,
  globalSearchResult: GlobalSearchResult,
  pwPlaySearchResult: PwPlaySearchResult,
  advancedSearchEnabled: boolean,
  searchText: string,
  onLoadingEskItems: boolean,
  onLoadingGlobalItems: boolean,
  onLoadingPwPlayItems: boolean,
  sltEksResultItems: EksDetailItem[],
  excludedTypes: string[],
}

export const initEksQueryObject = {
  searchText: '',
    assetTypeCode: '',
    phaseId: '',
    tagsId: '',
    phaseNames: '',
    tags: '',
    size: 10,
    from: 0,
    assetStatusId: 1,
    version: 0,
    disciplineCode: '',
    contentOwnerId: '',
    keywords: '',
    isObsolete: false,
    onAdvancedSearch: false
}

export const initAddonPopupState: AddonsPopupState = {
  eksQueryObject: initEksQueryObject,
  searchText: '',
  globalQueryObject: {},
  pwPlayQueryObject: {
    onlyActive: false
  },
  eksSearchResult: {},
  globalSearchResult: {},
  pwPlaySearchResult: {},
  onLoadingEskItems: false,
  onLoadingGlobalItems: false,
  onLoadingPwPlayItems: false,
  advancedSearchEnabled: false,
  sltEksResultItems: [],
  excludedTypes: []
}

export interface RawAggregationItem {
  buckets: {
    key: string,
    doc_count: number
  }[],
  doc_count_error_upper_bound: 0,
  sum_other_doc_count: 0
}

export interface FieldResultItem {
  key: string,
  count: number
}

export interface ESKSearchResult {
  subEksItems?: EksDetailItem[],
  totalResult?: number,
  assetTypeItems?: FieldResultItem[],
  phaseItems?: FieldResultItem[],
  tagItems?: FieldResultItem[]
}

export interface RawESKInternalSearchResponse {
  aggregations: {
    assettypecode: RawAggregationItem,
    phasenames: RawAggregationItem,
    tags: RawAggregationItem
  },
  hits: {
    total: {
      value: number,
      relation: string
    },
    max_score: number,
    hits: {
      _id: number,
      _index: number,
      _score: number,
      _source: any,
      _type: string
    }[]
  },
  timed_out: boolean,
  took: number,
  _shards: {
    total: number,
    successful: number,
    failed: number,
    skipped: number
  }
}

export interface EksDetailItem {
  assetstatus: string;
  assetstatusid: number;
  assettypecode: string;
  assettypelongcode: string;
  authorsnames: string;
  classificationdate: string;
  classificationrequestnumber: number;
  classifiersglobaluids: string;
  classifiersnames: string;
  contentauthorid: string;
  contentid: string;
  contentnumber: string;
  contentownerid: string;
  contentownersnames: string;
  contenttypename: string;
  disciplinecode: string;
  disciplinename: string;
  effectivefrom: string;
  effectiveto: string;
  exportauthoritycode: string;
  jc: string;
  keywords: string;
  lastupdatedatetime: string;
  outsourceable: true
  phasecodes: string;
  phaseid: string;
  phasenames: string;
  programcontrolledind: string;
  programname: string;
  purpose: string;
  relatedcontentcategories: string;
  relatedcontentcategorycodes: string;
  revisiontypedescription: string;
  revisiontypeid: string;
  tags: string;
  tagsid: string;
  title: string;
  tpmdate: string;
  usclassificationgroup: string;
  usjurisdiction: string;
  usjurisdictionid: number;
  version: number;
}

export const EksDetailField = {
  Assetstatus: 'assetstatus',
  Assetstatusid: 'assetstatusid',
  Assettypecode: 'assettypecode',
  Assettypelongcode: 'assettypelongcode',
  Authorsnames: 'authorsnames',
  Classificationdate: 'classificationdate',
  Classificationrequestnumber: 'classificationrequestnumber',
  Classifiersglobaluids: 'classifiersglobaluids',
  Classifiersnames: 'classifiersnames',
  Contentauthorid: 'contentauthorid',
  Contentid: 'contentid',
  Contentnumber: 'contentnumber',
  Contentownerid: 'contentownerid',
  Contentownersnames: 'contentownersnames',
  Contenttypename: 'contenttypename',
  Disciplinecode: 'disciplinecode',
  Disciplinename: 'disciplinename',
  Effectivefrom: 'effectivefrom',
  Effectiveto: 'effectiveto',
  Exportauthoritycode: 'exportauthoritycode',
  Jc: 'jc',
  Keywords: 'keywords',
  Lastupdatedatetime: 'lastupdatedatetime',
  Outsourceable: 'outsourceable',
  Phasecodes: 'phasecodes',
  Phaseid: 'phaseid',
  Phasenames: 'phasenames',
  Programcontrolledind: 'programcontrolledind',
  Programname: 'programname',
  Purpose: 'purpose',
  Relatedcontentcategories: 'relatedcontentcategories',
  Relatedcontentcategorycodes: 'relatedcontentcategorycodes',
  Revisiontypedescription: 'revisiontypedescription',
  Revisiontypeid: 'revisiontypeid',
  Tags: 'tags',
  Tagsid: 'tagsid',
  Title: 'title',
  Tpmdate: 'tpmdate',
  Usclassificationgroup: 'usclassificationgroup',
  Usjurisdiction: 'usjurisdiction',
  Usjurisdictionid: 'usjurisdictionid',
  Version: 'version',
}

export interface GlobalDetailItem {
  attachments_num: string,
  bodytype_phrase: string,
  book: string,
  created_date: string,
  created_month: string,
  created_time: string,
  created_week: string,
  created_year: string,
  creator: string,
  creator_phrase: string,
  digest: string,
  expert: string,
  hash0: string,
  hash1: string,
  id: string,
  key: string,
  link: string,
  link0: string,
  link1: string,
  link2: string,
  modified_date: string,
  modified_month: string,
  modified_time: string,
  modified_week: string,
  modified_year: string,
  modifier: string,
  modifier_phrase: string,
  name: string,
  name_phrase: string,
  needs_deep_crawl1_flag: string,
  needs_deep_crawl1_flag_phrase: string,
  needs_deep_crawl2_flag: string,
  needs_deep_crawl2_flag_phrase: string,
  parent_keys: string,
  parent_pages_num: string,
  score: number,
  sequence: number,
  space: string,
  space_key: string,
  space_key_phrase: string,
  space_phrase: string,
  summary: string,
  tag_comment_text: string,
  title: string,
  title_phrase: string,
  type: string,
  type_phrase: string,
  uid: string,
  url: string,
  version: number,
  whenindexed_timestamp: string,
  whenindexed_timestampdate: string,
  whenindexed_timestamptime: string,
}

export const GlobalDetailField = {
  AttachmentsNum: 'attachments_num',
  BodytypePhrase: 'bodytype_phrase',
  Book: 'book',
  CreatedDate: 'created_date',
  CreatedMonth: 'created_month',
  CreatedTime: 'created_time',
  CreatedWeek: 'created_week',
  CreatedYear: 'created_year',
  Creator: 'creator',
  CreatorPhrase: 'creator_phrase',
  Digest: 'digest',
  Expert: 'expert',
  Hash0: 'hash0',
  Hash1: 'hash1',
  Id: 'id',
  Key: 'key',
  Link: 'link',
  Link0: 'link0',
  Link1: 'link1',
  Link2: 'link2',
  ModifiedDate: 'modified_date',
  ModifiedMonth: 'modified_month',
  ModifiedTime: 'modified_time',
  ModifiedWeek: 'modified_week',
  ModifiedYear: 'modified_year',
  Modifier: 'modifier',
  ModifierPhrase: 'modifier_phrase',
  Name: 'name',
  NamePhrase: 'name_phrase',
  NeedsDeepCrawl1Flag: 'needs_deep_crawl1_flag',
  NeedsDeepCrawl1FlagPhrase: 'needs_deep_crawl1_flag_phrase',
  NeedsDeepCrawl2Flag: 'needs_deep_crawl2_flag',
  NeedsDeepCrawl2FlagPhrase: 'needs_deep_crawl2_flag_phrase',
  ParentKeys: 'parent_keys',
  ParentPagesNum: 'parent_pages_num',
  Score: 'score',
  Sequence: 'sequence',
  Space: 'space',
  SpaceKey: 'space_key',
  SpaceKeyPhrase: 'space_key_phrase',
  SpacePhrase: 'space_phrase',
  Summary: 'summary',
  TagCommentText: 'tag_comment_text',
  Title: 'title',
  TitlePhrase: 'title_phrase',
  Type: 'type',
  TypePhrase: 'type_phrase',
  Uid: 'uid',
  Url: 'url',
  Version: 'version',
  WhenindexedTimestamp: 'whenindexed_timestamp',
  WhenindexedTimestampdate: 'whenindexed_timestampdate',
  WhenindexedTimestamptime: 'whenindexed_timestamptime'
}

export interface GlobalSearchResult {
  totalResult?: number,
  globalDetailItems?: GlobalDetailItem[],
  startAt?: number,
  endAt?: number
}

export interface RawGlobalSearchResponse {
  end_at: number,
  realm_id: number,
  realm_name: string,
  results: GlobalDetailItem[],
  results_hash0: string,
  results_hash1: string,
  start_at: 0,
  total_possible: 410,
  total_results: 66
}

export interface PwPlayItem {
  id: string,
  title: string,
  description: string,
  categories: string[],
  tags: string[],
  thumbnailUrl: string,
  playbackUrl: string,
  duration: string,
  viewCount: number,
  status: string,
  approvalStatus: string,
  ApprovalProcessName: string,
  ApprovalProcessStepName: string,
  ApprovalProcessStepNumber: number,
  ApprovalProcessStepsCount: number,
  uploader: string,
  uploadedBy: string,
  whenUploaded: Date | string,
  lastViewed: Date | string,
  averageRating: number,
  ratingsCount: number,
  speechResult: {
    time: string,
    text: string
  }[],
  unlisted: boolean,
  whenModified: Date | string,
  whenPublished: Date | string,
  commentCount: number,
  score: number
}

export interface RawPwPlaySearchResponse {
  videos: PwPlayItem[],
  totalVideos: number,
  scrollId: number,
  statusCode: number,
  statusDescription: string
}

export interface PwPlaySearchResult {
  pwPlayItems?: PwPlayItem[],
  totalResult?: number,
  scrollId?: number,
  statusCode?: number,
  statusDescription?: string
}

export const PwPlayField = {
  Id: 'id',
  Title: 'title',
  Description: 'description',
  Categories: 'categories',
  Tags: 'tags',
  ThumbnailUrl: 'thumbnailUrl',
  PlaybackUrl: 'playbackUrl',
  Duration: 'duration',
  ViewCount: 'viewCount',
  Status: 'status',
  ApprovalStatus: 'approvalStatus',
  ApprovalProcessName: 'ApprovalProcessName',
  ApprovalProcessStepName: 'ApprovalProcessStepName',
  ApprovalProcessStepNumber: 'ApprovalProcessStepNumber',
  ApprovalProcessStepsCount: 'ApprovalProcessStepsCount',
  Uploader: 'uploader',
  UploadedBy: 'uploadedBy',
  WhenUploaded: 'whenUploaded',
  LastViewed: 'lastViewed',
  AverageRating: 'averageRating',
  RatingsCount: 'ratingsCount',
  SpeechResult: 'speechResult',
  Unlisted: 'unlisted',
  WhenModified: 'whenModified',
  WhenPublished: 'whenPublished',
  CommentCount: 'commentCount',
  Score: 'score',
}
