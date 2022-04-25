import * as go from 'gojs';

import { propagateEventsForLanePhases } from '../lanePhasePropagator/lanePhasePropagator';
import { PROPAGATE_SELECTOR } from '../lanePhasePropagator/selectors';
import { HEADER_ADORNMENT_NAME, MAIN_SHAPE_NAME } from '../../consts';
import { updateHeaderTextPosition } from '../../listeners/updateHeaderTextPosition';

const propagateToLane = (
  obj: go.GraphObject,
  widthOffset: number
) => propagateEventsForLanePhases(
  [PROPAGATE_SELECTOR.PARENT],
  obj.part,
  (part) => {
    const shape = part.findObject(MAIN_SHAPE_NAME);
    shape.width += widthOffset;
  }
);

const propagateHorizontally = (
  mainPart: go.Part,
  widthOffset: number
) => propagateEventsForLanePhases(
  [PROPAGATE_SELECTOR.HORIZONTALLY],
  mainPart,
  (part) => {
    const header = part.findAdornment(HEADER_ADORNMENT_NAME);

    if (header) {
      updateHeaderTextPosition(header);
    }

    if (part.data.order > mainPart.data.order) {
      const { x, y } = part.location.copy();
      part.moveTo(x + widthOffset, y, true);
    }
  }
);

const propagateVertically = (
  obj: go.GraphObject,
  newWidth: number,
  widthOffset: number
) => propagateEventsForLanePhases(
  [PROPAGATE_SELECTOR.VERTICALLY],
  obj.part,
  (part) => {
    const shape = part.findObject(MAIN_SHAPE_NAME);

    shape.width = newWidth;
    propagateHorizontally(part, widthOffset);
  }
);

export const lanePhaseWidthResize = (
  obj: go.GraphObject,
  oldWidth: number,
  newWidth: number
) => {
  const widthOffset = newWidth - oldWidth;

  propagateVertically(obj, newWidth, widthOffset);
  propagateToLane(obj, widthOffset);
};
