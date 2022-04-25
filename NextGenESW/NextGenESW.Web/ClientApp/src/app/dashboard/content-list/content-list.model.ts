// Content List Model
export interface ContentList {
  rowNumber: number;
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

// Model -  DialogData
export interface DialogData {
  model: any;
  users: User[];
  doc: { id: number; title: string; url: string, documentType: string, contentType: string, outsourceable: any, exportAuthorityId: string, contentData: any};
}

// Model - User
export interface User {
  userName: string;
  userEmail: string;
}

// Model - Document
export interface Doc {
  type?: any;
  id: number;
  name: string;
  status?: any;
  jc?: any;
  comments?: string[];
  updated?: Date;
  docUrl: string;
}

export interface UserList {
  userName: string;
  userEmail: string;
  permission: string;
}
