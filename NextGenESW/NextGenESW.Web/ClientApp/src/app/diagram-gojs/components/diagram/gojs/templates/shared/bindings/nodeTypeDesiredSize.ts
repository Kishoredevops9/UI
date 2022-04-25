import * as go from 'gojs';

import { NodeType } from '../../../../../../types/node';

export const nodeTypeDesiredSizeMap: Record<NodeType, [number, number]> = {
  [NodeType.ActivityBlock]: [150, 100],
  [NodeType.Data]: [170, 80],
  [NodeType.Decision]: [80, 80],
  [NodeType.EmptyBlock]: [150, 80],
  [NodeType.KPack]: [150, 80],
  [NodeType.Milestone]: [80, 80],
  [NodeType.OffPageReference]: [80, 80],
  [NodeType.SubMapLink]: [150, 100],
  [NodeType.Terminator]: [100, 25],
  [NodeType.Start]: [100, 35],
  [NodeType.Step]: [150, 100],
  [NodeType.End]: [100, 35],
};

export const nodeTypeDesiredSizeBinding = () => new go.Binding(
  'desiredSize',
  'type',
  (type: NodeType) => {
    const [width, height] = nodeTypeDesiredSizeMap[type] || [50, 50];
    return new go.Size(width, height);
  }
);
