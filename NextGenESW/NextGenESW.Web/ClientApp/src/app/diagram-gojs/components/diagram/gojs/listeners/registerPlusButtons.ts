import * as go from 'gojs';

import { LANE_PLUS_BUTTON_ADORNMENT } from '../consts';
import { registerAdornment } from '../utils/registerAdornments';
import { plusButton } from '../templates/lane/plusButton';
import { getLanes } from '../utils/getLanes';

export const registerPlusButtons = (diagram: go.Diagram) => {
  if (diagram.model.modelData.published) {
    return;
  }

  const lanes = getLanes(diagram);

  lanes.forEach((lane: go.Part) => {
    if (!lane.findAdornment(LANE_PLUS_BUTTON_ADORNMENT)) {
      registerAdornment(plusButton(), LANE_PLUS_BUTTON_ADORNMENT, lane)
    }
  });
};
