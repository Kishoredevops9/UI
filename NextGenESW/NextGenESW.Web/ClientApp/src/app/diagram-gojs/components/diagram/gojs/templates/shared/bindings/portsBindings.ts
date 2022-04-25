import * as go from 'gojs';

import { generateGeometryFromSvgPath } from '../../../utils/generateGeometryFromSvgPath';
import { NodeType } from '../../../../../../types/node';
import * as PORTS from '../../../shapes/portShapes';
import { MAIN_SHAPE_NAME } from '../../../consts';

const nodeTypePortShapeMap: Record<NodeType, string> = {
  [NodeType.ActivityBlock]: PORTS.ACTIVITY_BLOCK_PORTS,
  [NodeType.Data]: PORTS.DATA_PORTS,
  [NodeType.Decision]: PORTS.DECISION_PORTS,
  [NodeType.EmptyBlock]: PORTS.EMPTY_BLOCK_PORTS,
  [NodeType.KPack]: PORTS.K_PACK_PORTS,
  [NodeType.Milestone]: PORTS.MILESTONE_PORTS,
  [NodeType.OffPageReference]: PORTS.OFF_PAGE_REFERENCE_PORTS,
  [NodeType.SubMapLink]: PORTS.SUB_MAP_LINK_PORTS,
  [NodeType.Terminator]: PORTS.TERMINATOR_PORTS,
  [NodeType.Start]: PORTS.TERMINATOR_PORTS,
  [NodeType.Step]: PORTS.SUB_MAP_LINK_PORTS,
  [NodeType.End]: PORTS.TERMINATOR_PORTS,
};

export const outPortShapeBinding = () => new go.Binding(
  'geometry',
  'type',
  (type: NodeType) => {
    const geometryString = nodeTypePortShapeMap[type];
    return generateGeometryFromSvgPath(geometryString);
  }
);

export const inPortShapeBinding = () => new go.Binding('geometryString')
  .ofObject(MAIN_SHAPE_NAME);

export const inPortSizeBinding = () => new go.Binding('desiredSize')
  .ofObject(MAIN_SHAPE_NAME);
