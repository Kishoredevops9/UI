import * as go from 'gojs';

import { propagateEventsForLanePhases } from '../lanePhasePropagator/lanePhasePropagator';
import { PROPAGATE_SELECTOR } from '../lanePhasePropagator/selectors';
import { HEADER_ADORNMENT_NAME, MAIN_SHAPE_NAME } from '../../consts';
import { updateHeaderTextPosition } from '../../listeners/updateHeaderTextPosition';
import { isLane } from '../../utils/getLanes';

export const lanePhaseHeightResize = (
  obj: go.GraphObject,
  newHeight: number
) => {
  propagateEventsForLanePhases(
    [PROPAGATE_SELECTOR.HORIZONTALLY, PROPAGATE_SELECTOR.PARENT],
    obj.part,
    (part) => {
      const shape = part.findObject(MAIN_SHAPE_NAME);
      const header = part.findAdornment(HEADER_ADORNMENT_NAME);
      shape.height = newHeight;
      if (header && isLane(part)) {
        updateHeaderTextPosition(header, false);
      }
    }
  );
};
