import * as go from 'gojs';

import { lanePhaseHeightResize } from './lanePhaseHeightResize';
import { lanePhaseWidthResize } from './lanePhaseWidthResize';

export const lanePhaseResize = (
  rect: go.Rect,
  obj: go.GraphObject
) => {
  const { width: newWidth, height: newHeight } = rect;
  const { width: oldWidth, height: oldHeight } = obj;

  if (newHeight !== oldHeight) {
    lanePhaseHeightResize(obj, newHeight);
  }

  if (newWidth !== oldWidth) {
    lanePhaseWidthResize(obj, oldWidth, newWidth);
  }
};
