import { NodeType } from '../../../../types/node';

const pathPrefix = '/assets/palette-icons';
const nodeTypeIconFileMap: Record<NodeType, string> = {
  [NodeType.ActivityBlock]: 'activity-block',
  [NodeType.Data]: 'data',
  [NodeType.Decision]: 'decision',
  [NodeType.EmptyBlock]: 'empty-block',
  [NodeType.End]: 'end',
  [NodeType.KPack]: 'k-pack',
  [NodeType.Milestone]: 'milestone',
  [NodeType.OffPageReference]: 'off-page-reference',
  [NodeType.Start]: 'start',
  [NodeType.Step]: 'sub-map-link',
  [NodeType.SubMapLink]: 'sub-map-link',
  [NodeType.Terminator]: 'terminator'
};

export const mapNodeTypeToIconPath = (nodeType: NodeType) => {
  const fileName = nodeTypeIconFileMap[nodeType];
  if (!fileName) {
    return;
  }

  return `${pathPrefix}/${fileName}.png`;
};
