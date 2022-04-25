import * as go from 'gojs';
import * as _ from 'lodash/fp';

import { getLanes } from '../utils/getLanes';
import { HEADER_ADORNMENT_NAME } from '../consts';
import { registerAdornment } from '../utils/registerAdornments';
import { laneHeaderAdornment } from '../templates/header/laneHeader';
import { phaseHeaderAdornment } from '../templates/header/phaseHeader';
import { GetHeaderLocation, getLaneHeaderLocation, getPhaseHeaderLocation} from '../utils/getHeaderLocation';
import { isLanePhase } from '../utils/getLanePhases';

export const registerSingleHeader = _.curry((
  adornment: () => go.Adornment,
  getLocation: GetHeaderLocation,
  part: go.Part,
) => {
  const { location, diagram, data: { isLaneCollapsed }} = part;
  const newLocation = getLocation(location, diagram, isLaneCollapsed);

  if (part.findAdornment(HEADER_ADORNMENT_NAME)) {
    return;
  }

  const partAdornment = registerAdornment(adornment(), HEADER_ADORNMENT_NAME, part);
  partAdornment.location = newLocation;
});

export const registerHeaders = (diagram: go.Diagram) => {
  const lanes = getLanes(diagram);

  if (_.isEmpty(lanes)) {
    return;
  }

  lanes.forEach(registerSingleHeader(
    laneHeaderAdornment,
    getLaneHeaderLocation
  ));

  if (diagram.model.modelData.blank) {
    return;
  }

  lanes[0].memberParts
    .filter(isLanePhase)
    .each(
      registerSingleHeader(phaseHeaderAdornment, getPhaseHeaderLocation)
    );
};
