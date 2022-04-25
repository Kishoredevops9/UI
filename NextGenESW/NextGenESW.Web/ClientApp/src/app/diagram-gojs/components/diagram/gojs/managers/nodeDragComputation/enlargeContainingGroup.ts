import * as go from 'gojs';

import { enlargeGroup } from '../updateGroupBounds/enlargeGroup';

export const enlargeContainingGroup = (
  group: go.Group,
  part: go.Part,
  point: go.Point
) => {
  const { y: groupBottom, x: groupRight } = group.getDocumentPoint(go.Spot.BottomRight);
  const { height, width } = part.actualBounds;

  const rightShift = Math.max(point.x + width - groupRight, 0);
  const bottomShift = Math.max(point.y + height - groupBottom, 0);

  enlargeGroup(group, rightShift, bottomShift);

  return { rightShift, bottomShift };
};
