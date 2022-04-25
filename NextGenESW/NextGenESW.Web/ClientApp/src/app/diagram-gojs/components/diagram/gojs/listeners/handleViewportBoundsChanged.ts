import * as go from 'gojs';
import { positionHeaders } from './positionHeaders';
import { updateNodeIndicators } from '../managers/attentionIndicator/attentionIndicator';
import { skipUndoManager } from '../utils/skipUndoManager';
import { getActivityNodes } from '../utils/getActivityNodes';

export const handleViewportBoundsChanged = (diagram: go.Diagram) => () => {
  positionHeaders(diagram);

  skipUndoManager(diagram, () => {
    const activityNodes = getActivityNodes(diagram);
    updateNodeIndicators(diagram, activityNodes);
  });
};
