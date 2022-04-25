import * as go from 'gojs';

import { PORTS_PANEL_NAME } from '../consts';
import { animate } from '../utils/animate';

const ANIMATION_DURATION = 100;
const VISIBLE_OPACITY = 0.5;

export const showPortsPanel = (part: go.Part) => {
  const portsPanel = part.findObject(PORTS_PANEL_NAME);
  portsPanel.visible = true;

  animate(
    [[portsPanel, 'opacity', 0, VISIBLE_OPACITY]],
    ANIMATION_DURATION
  );
};

export const hidePortsPanel = async (part: go.Part) => {
  const portsPanel = part.findObject(PORTS_PANEL_NAME);

  await animate(
    [[portsPanel, 'opacity', VISIBLE_OPACITY, 0]],
    ANIMATION_DURATION
  );
  portsPanel.visible = false;
};
