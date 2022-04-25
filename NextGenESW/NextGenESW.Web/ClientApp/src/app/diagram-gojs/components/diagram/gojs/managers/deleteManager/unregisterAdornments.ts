import * as _ from 'lodash/fp';
import * as go from 'gojs';
import { unregisterAdornment } from '../../utils/registerAdornments';
import {
  HEADER_ADORNMENT_NAME,
  LANE_PLUS_BUTTON_ADORNMENT
} from '../../consts';
import { propagateEventsForLanePhases } from '../lanePhasePropagator/lanePhasePropagator';
import { PROPAGATE_SELECTOR } from '../lanePhasePropagator/selectors';

export const unregisterAdornments = (
  lanesToDelete: go.Part[],
  lanePhasesToDelete: go.Part[]
) => {
  _.forEach((lane: go.Part) => {
    unregisterAdornment(lane, HEADER_ADORNMENT_NAME);
    unregisterAdornment(lane, LANE_PLUS_BUTTON_ADORNMENT);
    propagateEventsForLanePhases(
      [PROPAGATE_SELECTOR.CHILDREN],
      lane,
      (part) => unregisterAdornment(part, HEADER_ADORNMENT_NAME)
    )
  })(lanesToDelete);

  _.forEach((lanePhase: go.Part) => {
    unregisterAdornment(lanePhase, HEADER_ADORNMENT_NAME);
  })(lanePhasesToDelete)
}
