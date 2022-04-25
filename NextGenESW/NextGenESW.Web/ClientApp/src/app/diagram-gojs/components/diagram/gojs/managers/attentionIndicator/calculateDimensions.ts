import * as go from 'gojs';

import { SHAPE_WIDTH, SHAPE_HEIGHT } from '../../templates/attentionIndicatorNode/consts';
import { indicatorMargin } from './consts';

export const calculateDimensions = (node: go.Node) => {
  const scale = node.diagram.scale;

  const {
    x: nodeX,
    y: nodeY,
    width: nodeWidth,
    height: nodeHeight
  } = node.actualBounds;

  const {
    x: diagramX,
    y: diagramY,
    width: diagramWidth,
    height: diagramHeight
  } = node.diagram.viewportBounds;

  const x = (nodeX - diagramX) * scale
    + (nodeWidth / 2) * (scale - 1)
    + (nodeWidth - SHAPE_WIDTH) / 2;
  const y = (nodeY - diagramY) * scale
    + (nodeHeight / 2) * (scale - 1)
    + (nodeHeight - SHAPE_WIDTH);
  const maxH = scale * (diagramWidth - SHAPE_WIDTH - indicatorMargin);
  const maxV = scale * (diagramHeight - SHAPE_HEIGHT - indicatorMargin);
  const minH = indicatorMargin;
  const minV = indicatorMargin;

  return { x, y, maxH, maxV, minH, minV };
};
