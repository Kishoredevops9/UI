import * as go from 'gojs';

import { MAIN_SHAPE_NAME } from '../../consts';
import { calculatePoint } from './calculatePoint';
import { enlargeContainingGroup } from './enlargeContainingGroup';

export const nodeDragComputation = (part: go.Part, point: go.Point) => {
  const group = part.containingGroup;
  const shape = group?.findObject(MAIN_SHAPE_NAME) as go.Shape;

  if (!shape || part.diagram.lastInput.shift) {
    return point;
  }

  const { width, height } = part.actualBounds;
  const { strokeWidth } = shape;
  const { x: groupLeft, y: groupTop } = shape.getDocumentPoint(go.Spot.TopLeft);
  const { x: groupRight, y: groupBottom } = shape.getDocumentPoint(go.Spot.BottomRight);
  const { rightShift, bottomShift } = enlargeContainingGroup(group, part, point);

  return new go.Point(
    calculatePoint(
      groupLeft + strokeWidth,
      groupRight - strokeWidth,
      point.x,
      width
    ) + rightShift,
    calculatePoint(
      groupTop + strokeWidth,
      groupBottom - strokeWidth,
      point.y,
      height
    ) + bottomShift
  );
};
