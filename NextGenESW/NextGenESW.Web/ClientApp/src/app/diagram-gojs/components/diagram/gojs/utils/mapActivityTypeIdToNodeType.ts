import { NodeType } from '../../../../types/node'

// const activityTypeIdNodeTypeMap = {
//   1: NodeType.Milestone,
//   2: NodeType.Decision,
//   3: NodeType.SubMapLink,
//   4: NodeType.Data,
//   5: NodeType.ActivityBlock,
//   6: NodeType.OffPageReference,
//   8: NodeType.Terminator,
//   9: NodeType.KPack,
//   10: NodeType.EmptyBlock,
//   11: NodeType.Start,
//   12: NodeType.End
// };

export const activityTypeIdNodeTypeMap = {
    1: NodeType.ActivityBlock,
    2: NodeType.Start,
    3: NodeType.End,
    4: NodeType.Decision,
    5: NodeType.Terminator,
    6: NodeType.Milestone,
    7: NodeType.EmptyBlock,
    8: NodeType.Step
};

export const mapActivityTypeIdToNodeType = (
  activityTypeId: number
): NodeType => activityTypeIdNodeTypeMap[activityTypeId];
