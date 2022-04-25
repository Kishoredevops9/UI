import * as go from 'gojs';

import { animate } from '../../utils/animate';
import { enlargeGroup } from './enlargeGroup';
import { runWithoutLayoutAnimation } from '../../listeners/runWithoutLayoutAnimation';

const calculatePartShift = (group: go.Group, partBounds: go.Rect) => {
  const topShift = group.actualBounds.top - partBounds.top;
  const leftShift = group.actualBounds.left - partBounds.left;

  return {
    topShift: Math.max(topShift, 0),
    leftShift: Math.max(leftShift, 0)
  };
};

const enlargeGroupBounds = (
  group: go.Group,
  partBottom: number,
  partRight: number
) => {
  const { bottom, right } = group.actualBounds;
  const bottomShift = partBottom - bottom;
  const rightShift = partRight - right;

  return {
    bottomShift: Math.max(bottomShift, 0),
    rightShift: Math.max(rightShift, 0)
  };
};

export const updateGroupBounds = (group: go.Group, part: go.Part) => {
  const partBounds = part.actualBounds;
  const { x, y } = part.location;

  const { topShift, leftShift } = calculatePartShift(group, partBounds);
  const updatedLocation = new go.Point(x + leftShift, y + topShift);

  const { bottomShift, rightShift } = enlargeGroupBounds(
    group,
    partBounds.bottom + topShift,
    partBounds.right + leftShift
  );

  part.move(updatedLocation);
  enlargeGroup(group, rightShift, bottomShift);
  (part.diagram.toolManager.draggingTool as any).enlargeGroupFinish();
};
