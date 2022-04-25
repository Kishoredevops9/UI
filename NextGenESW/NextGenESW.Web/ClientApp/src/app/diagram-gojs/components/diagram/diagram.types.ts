import { LinkData, NodeData } from '../../types/node';
import { HttpAction } from './gojs/types';

export type DiagramModel = {
  nodes: NodeData[];
  links: LinkData[];
  skipsDiagramUpdate?: boolean;
  apiChanges: HttpAction[];
};

export type DiagramConfiguration = {
  automaticallyCreateConnectors?: boolean;
  viewOnly?: boolean;
  isBlankMap?: boolean;
  isTaskMap?: boolean;
  showStatusIndicator?: boolean;
  isStepFlowMap?: boolean;
  isStepMap?: boolean;
  isTaskExecutionMap?: boolean;
  isTaskExecutionStepMap?: boolean;
};
