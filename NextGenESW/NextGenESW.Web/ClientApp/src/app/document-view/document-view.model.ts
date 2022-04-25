export interface ExtractedDocument {
  id: number;
  sourceId: number;
  sourceUrl: string;
  displayTab: string;
  extractDocName: number;
  uniqueGuid: string;
  extractedDocUrl?: string;
  status?: number;
}

export interface ContentList {
  documentType: string;
  id: number;
  name: string;
  pwStatus: string;
  jc: string;
  comments: number;
  updated: string;
  docUrl?: string;
  title?: string;
  worddocurl?: string;
}
