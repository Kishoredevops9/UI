import * as go from 'gojs';
import * as _ from 'lodash/fp';

import { HEADER_ADORNMENT_NAME } from '../consts';
import { getLanes } from '../utils/getLanes';
import { phaseHeaderAdornment } from '../templates/header/phaseHeader';
import { GetHeaderLocation, getLaneHeaderLocation, getPhaseHeaderLocation} from '../utils/getHeaderLocation';
import { laneHeaderAdornment } from '../templates/header/laneHeader';
import { updateHeaderTextPosition } from './updateHeaderTextPosition';
import { skipUndoManager } from '../utils/skipUndoManager';
import { isLanePhase } from '../utils/getLanePhases';

const positionHeader = (
  getLocation: GetHeaderLocation,
  adornment: () => go.Adornment,
  part: go.Part
) => {
  const { location, diagram, data: { isLaneCollapsed }} = part;
  const newLocation = getLocation(location, diagram, isLaneCollapsed);

  if (!part.findAdornment(HEADER_ADORNMENT_NAME)) {
    return;
  }

  const partAdornment = part.findAdornment(HEADER_ADORNMENT_NAME);
  partAdornment.move(newLocation);
  return partAdornment;
};

export const positionHeaders = (diagram: go.Diagram) => {
  const lanes = getLanes(diagram);
  const firstLane = _.first(getLanes(diagram));

  if (!lanes[0]) {
    return;
  }

  skipUndoManager(diagram, () => {
    firstLane.memberParts
      .filter(isLanePhase)
      .each((lanePhase: go.Group) => {
        const adornment = positionHeader(
          getPhaseHeaderLocation,
          phaseHeaderAdornment,
          lanePhase
        );
        if (adornment) {
          updateHeaderTextPosition(adornment);
        }
    });
    _.forEach((lane: go.Group) => {
      const adornment = positionHeader(
        getLaneHeaderLocation,
        laneHeaderAdornment,
        lane
      );
      if (adornment) {
        updateHeaderTextPosition(adornment, false);
      }
    })(lanes);
  });
};
