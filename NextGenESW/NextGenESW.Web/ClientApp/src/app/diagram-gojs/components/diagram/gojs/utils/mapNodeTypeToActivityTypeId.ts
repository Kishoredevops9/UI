import * as _ from 'lodash/fp';

import { activityTypeIdNodeTypeMap } from './mapActivityTypeIdToNodeType';
import { NodeType } from '../../../../types/node';

// const nodeTypeActivityTypeIdMap: Record<NodeType, number> = {
//   [NodeType.ActivityBlock]: 5,
//   [NodeType.Data]: 4,
//   [NodeType.Decision]: 2,
//   [NodeType.EmptyBlock]: 10,
//   [NodeType.End]: 12,
//   [NodeType.KPack]: 9,
//   [NodeType.Milestone]: 1,
//   [NodeType.OffPageReference]: 6,
//   [NodeType.Start]: 11,
//   [NodeType.SubMapLink]: 3,
//   [NodeType.Terminator]: 8,
// };

export const nodeTypeActivityTypeIdMap = {
  [NodeType.ActivityBlock]: 1,
  [NodeType.Start]: 2,
  [NodeType.End]: 3,
  [NodeType.Decision]: 4,
  [NodeType.Terminator]: 5,
  [NodeType.Milestone]: 6,
  [NodeType.EmptyBlock]: 7,
  [NodeType.Step]: 8
};

export const mapNodeTypeToActivityTypeId = (nodeType: NodeType) =>
  nodeTypeActivityTypeIdMap[nodeType];
