import * as go from 'gojs';
import { isLane } from '../utils/getLanes';
import { isLanePhase } from '../utils/getLanePhases';

export const handleDropOnTheDiagram = (event: go.InputEvent) => {
  const shouldCancelTool = event.diagram.selection.any((part: go.Part) => {
    return !isLane(part) && !isLanePhase(part)
  })

  if (shouldCancelTool) {
    event.diagram.currentTool.doCancel();
  }
};
