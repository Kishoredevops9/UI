import * as go from 'gojs';

import { generateGeometryFromSvgPath } from '../../../utils/generateGeometryFromSvgPath';
import { NodeType } from '../../../../../../types/node';
import * as SHAPES from '../../../shapes/nodeShapes';

const nodeTypeShapeMap: Record<NodeType, string> = {
  [NodeType.ActivityBlock]: SHAPES.ACTIVITY_BLOCK,
  [NodeType.Data]: SHAPES.DATA,
  [NodeType.Decision]: SHAPES.DECISION,
  [NodeType.EmptyBlock]: SHAPES.EMPTY_BLOCK,
  [NodeType.KPack]: SHAPES.K_PACK,
  [NodeType.Milestone]: SHAPES.MILESTONE,
  [NodeType.OffPageReference]: SHAPES.OFF_PAGE_REFERENCE,
  [NodeType.SubMapLink]: SHAPES.SUB_MAP_LINK,
  [NodeType.Terminator]: SHAPES.TERMINATOR,
  [NodeType.Start]: SHAPES.TERMINATOR,
  [NodeType.Step]: SHAPES.SUB_MAP_LINK,
  [NodeType.End]: SHAPES.TERMINATOR
};

export const nodeTypeShapeBinding = () => new go.Binding(
  'geometry',
  'type',
  (type: NodeType) => {
    const geometryString = nodeTypeShapeMap[type];
    return generateGeometryFromSvgPath(geometryString);
  }
);
