import * as go from 'gojs';

import { propagateEventsForLanePhases } from '../lanePhasePropagator/lanePhasePropagator';
import { PROPAGATE_SELECTOR } from '../lanePhasePropagator/selectors';
import { MAIN_SHAPE_NAME } from '../../consts';
import { getLastLanePhase } from '../../utils/getLanePhases';

export const laneResize = (rect: go.Rect, obj: go.GraphObject) => {
  const { height: newHeight, width: newWidth } = rect;
  const { height: oldHeight, width: oldWidth } = obj;

  if (newHeight !== oldHeight) {
    propagateEventsForLanePhases(
      [PROPAGATE_SELECTOR.CHILDREN],
      obj.part,
      (part) => {
        const shape = part.findObject(MAIN_SHAPE_NAME);
        shape.height = newHeight;
      }
    );
  }

  if (newWidth !== oldWidth) {
    propagateEventsForLanePhases(
      [PROPAGATE_SELECTOR.VERTICALLY],
      getLastLanePhase(obj.part as go.Group),
      (part) => {
        const shape = part.findObject(MAIN_SHAPE_NAME);
        shape.width = shape.width + newWidth - oldWidth;
      }
    )
  }
};
