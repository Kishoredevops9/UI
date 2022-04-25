import * as go from 'gojs';

import { MAIN_SHAPE_NAME } from '../../consts';
import { lanePhaseWidthResize } from '../resize/lanePhaseWidthResize';
import { lanePhaseHeightResize } from '../resize/lanePhaseHeightResize';

export const enlargeGroup = (
  group: go.Group,
  rightShift: number,
  bottomShift: number
) => {
  const groupShape = group.findObject(MAIN_SHAPE_NAME);
  const newHeight = groupShape.height + bottomShift;
  const newWidth = groupShape.width + rightShift;

  if (bottomShift) {
    lanePhaseHeightResize(group, newHeight);
    (group.diagram.toolManager.draggingTool as any).onEnlargeGroup(group.key);
  }
  if (rightShift) {
    lanePhaseWidthResize(group, groupShape.width, newWidth);
    (group.diagram.toolManager.draggingTool as any).onEnlargeGroup(group.key);
  }
};
