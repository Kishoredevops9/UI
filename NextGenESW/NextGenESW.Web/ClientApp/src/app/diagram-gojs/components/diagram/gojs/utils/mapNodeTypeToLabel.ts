import { NodeType } from '../../../../types/node';

const nodeTypeLabelMap: Record<NodeType, string> = {
  [NodeType.ActivityBlock]: 'Activity Block',
  [NodeType.Data]: 'Data',
  [NodeType.Decision]: 'Decision',
  [NodeType.EmptyBlock]: 'Empty Block',
  [NodeType.End]: 'End',
  [NodeType.KPack]: 'K-Pack',
  [NodeType.Milestone]: 'Milestone',
  [NodeType.OffPageReference]: 'Off Page Reference',
  [NodeType.Start]: 'Start',
  [NodeType.Step]: 'Step',
  [NodeType.SubMapLink]: 'Sub Map Link',
  [NodeType.Terminator]: 'Terminator'
};

export const mapNodeTypeToLabel = (nodeType: NodeType) =>
  nodeTypeLabelMap[nodeType];
