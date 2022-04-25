export interface ProcessMap {
  id: number;
  title: string;
  version: string;
  createdDateTime: string;
  assetStatusId?: number;
  assetStatus: string;
  createdUser: string;
  lastUpdateDateTime: string;
  lastUpdateUser: string;
  swimLanes: ActivityGroup[];
  processMapMeta: ProcessMapMetaData[];
  activityBlocks: Activity[];
  phases?: Phase[];
  contentOwnerId?: string;

}

export interface Phase {
  id: number;
  name: string;
  caption: string;
  sequenceNumber: number;
  processMapId: number;
  version?: number;
  size?: string;
  effectiveFrom?: string;
  effectiveTo?: string;
  createdDateTime?: string;
  createdUser?: string;
  lastUpdateDateTime?: string;
  lastUpdateUser?: string;
}

export interface Activity {
  id?: number;
  name: string;
  swimLaneId: number;
  previousActivityBlockId: number;
  activityTypeId: number;
  processMapId: number;
  createdUser: string;
  lastUpdateUser: string;
  phaseId?: number;
  activityMeta?: ActivityMeta[];
  activityConnections?: Connector[];
  color?: string;
  borderColor?: string;
  borderStyle?: string;
  borderWidth?: string;
  locationX?: string;
  locationY?: string;
  reviewGate?: string;
  assetContentId?: string;
}

export interface ActivityEdit {
  id: number;
  name: string;
  swimLaneId: number;
  previousActivityBlockId: number;
  activityTypeId: number;
  processMapId: number;
  createdUser: string;
  lastUpdateUser: string;
  activityMeta?: ActivityMeta[];
  activityConnections?: Connector[];
}

export interface ActivityMeta {
  id: number;
  activityBlockId: number;
  key: string;
  value: string;
  createdUser: string;
}

export interface ActivityGroup {
  id: number;
  disciplineText: string;
  color?: string;
  processMapId: number;
  version?: string;
  createdDateTime?: string;
  createdUser?: string;
  lastUpdateDateTime?: string;
  lastUpdateUser?: string;
  sequenceNumber: number;
  size?: string;
  location?: string;
  description?: string;
  borderColor?: string;
  borderStyle?: string;
  borderWidth?: string;
  disciplineId?: number;
  name?: string;
}

export interface EditActivityGroup {
  id: number;
  processMapId: number;
  name: string;
  sequenceNumber: number;
  description?: string;
  backgroundColor?: string;
  borderColor?: string;
  borderStyle?: string;
  borderWidth?: string;
}

export class ProcessMapMetaData {
  id: number;
  key: string;
  value: string;
  userID: number;
}

export interface Connector {
  id?: number;
  activityBlockId: number;
  previousActivityBlockId: number;
  captionMiddle?: string;
  captionStart?: string;
  captionEnd?: string;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  borderStyle?: string;
  borderWidth?: number;
  version?: number;
}
