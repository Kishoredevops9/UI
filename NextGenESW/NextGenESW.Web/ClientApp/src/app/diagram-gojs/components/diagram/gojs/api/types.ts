import * as go from 'gojs';

import { LANE_HEADER_NAME, LANE_PLUS_BUTTON, PHASE_HEADER_NAME } from '../consts';
import { NodeCategory, NodeData } from '../../../../types/node';
import { createApi } from './api';

export type Position = {
  top: number;
  left: number;
};

export type DiagramApi = ReturnType<typeof createApi>;

export type ContextMenuTarget = Exclude<NodeCategory, NodeCategory.Lane | NodeCategory.AttentionIndicator | NodeCategory.Title>
  | 'Diagram'
  | 'Link'
  | typeof LANE_PLUS_BUTTON
  | typeof LANE_HEADER_NAME
  | typeof PHASE_HEADER_NAME;

export type ContextMenuModel =
  | {
    target: ContextMenuTarget;
    data?: NodeData;
    position: Position;
  }
  | null;

export type SeeThroughModel =
  | {
    position: Position;
    data?: any;
  }
  | null;
