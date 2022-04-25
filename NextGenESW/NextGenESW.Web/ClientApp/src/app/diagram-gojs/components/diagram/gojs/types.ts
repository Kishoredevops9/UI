import * as go from 'gojs';
import { ActivityGroup, Connector, Phase } from '../../../../process-maps/process-maps.model';
import { LinkData, NodeCategory, NodeData } from '../../../types/node';
import { DiagramApi } from './api/types';

export type TemplateCreator<TTemplate> = {
  category: NodeCategory;
  template: TTemplate;
}

type BaseDialogBoxAction<TType = any, TPayload = any> = {
  type: TType;
  payload: TPayload;
};

export type InsertActivityDialogBoxAction = BaseDialogBoxAction<'InsertActivity', NodeData>;
export type UpdateActivityDialogBoxAction = BaseDialogBoxAction<'UpdateActivity', NodeData>;
export type InsertPhaseDialogBoxAction = BaseDialogBoxAction<'InsertPhase', void>;
export type UpdatePhaseDialogBoxAction = BaseDialogBoxAction<'UpdatePhase', NodeData>;
export type InsertSwimLaneDialogBoxAction = BaseDialogBoxAction<'InsertSwimLane', void>;
export type UpdateSwimLaneDialogBoxAction = BaseDialogBoxAction<'UpdateSwimLane', NodeData>;
export type InsertLinkDialogBoxAction = BaseDialogBoxAction<'InsertLink', LinkData>;
export type UpdateLinkDialogBoxAction = BaseDialogBoxAction<'UpdateLink', LinkData>;
export type ConfirmDeleteAction = BaseDialogBoxAction<'ConfirmDelete', void>;

export type DialogBoxAction =
  | InsertActivityDialogBoxAction
  | UpdateActivityDialogBoxAction
  | InsertPhaseDialogBoxAction
  | UpdatePhaseDialogBoxAction
  | InsertSwimLaneDialogBoxAction
  | UpdateSwimLaneDialogBoxAction
  | InsertLinkDialogBoxAction
  | UpdateLinkDialogBoxAction
  | ConfirmDeleteAction;

type BaseDialogBoxHandler<
  TAction extends DialogBoxAction,
  TResult = any
> = (action: TAction) => Promise<TResult>;

export type DialogBoxHandler =
  | BaseDialogBoxHandler<InsertActivityDialogBoxAction, NodeData>
  | BaseDialogBoxHandler<UpdateActivityDialogBoxAction, NodeData>
  | BaseDialogBoxHandler<InsertPhaseDialogBoxAction, Phase>
  | BaseDialogBoxHandler<UpdatePhaseDialogBoxAction, Phase>
  | BaseDialogBoxHandler<InsertSwimLaneDialogBoxAction, ActivityGroup>
  | BaseDialogBoxHandler<UpdateSwimLaneDialogBoxAction, ActivityGroup>
  | BaseDialogBoxHandler<InsertLinkDialogBoxAction, Connector>
  | BaseDialogBoxHandler<UpdateLinkDialogBoxAction, Connector>
  | BaseDialogBoxHandler<ConfirmDeleteAction, boolean>;

export type HttpActionHandler = (action: any) => Promise<any>;
export type HttpAction<TPayload = any> = {
  type: string;
  payload: TPayload;
}

export type SnackBarHandler = (message: string) => void;

export type Diagram =
  & go.Diagram
  & {
  api: DiagramApi;
  linksVisibility: boolean;
};
