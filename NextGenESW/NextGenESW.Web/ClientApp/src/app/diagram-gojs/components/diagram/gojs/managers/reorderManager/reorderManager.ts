import * as go from 'gojs';

import { ReorderSnapshot } from './types';
import { handleReorder } from './handleReorder';
import { generateReorderSnapshot } from './generateReorderSnapshot';
import { runWithoutLayoutAnimation } from '../../listeners/runWithoutLayoutAnimation';
import { LANE_HEADER_ADORNMENT_NAME } from '../../consts';
import { LANE_MODE, LANE_PHASE_MODE, MODES } from './modes';
import { runListenerOnce } from '../../listeners/runListenerOnce';
import { getLanes } from '../../utils/getLanes';

let mode: string;
let draggedParts: go.Part[];
let computedParts: go.Part[];
let reorderSnapshot: ReorderSnapshot = { shift: 0, borders: [] };
let proceedReorder = false;
let expandCollapseParts: go.Part[];

const clear = () => {
  draggedParts = [];
  computedParts = [];
  reorderSnapshot = { shift: 0, borders: [] };
  proceedReorder = false;
  expandCollapseParts = [];
};

const createSnapshot = () => {
  computedParts = MODES[mode].getComputedParts(draggedParts);
  reorderSnapshot = generateReorderSnapshot(mode, computedParts);
  proceedReorder = true;
};

const handleDragActivate = (
  parts: go.Map<go.Part, go.DraggingInfo>,
  currentPart: go.Part
) => {
  mode = currentPart.name === LANE_HEADER_ADORNMENT_NAME
    ? LANE_MODE
    : LANE_PHASE_MODE;
  draggedParts = MODES[mode].getDraggedParts(parts);

  const { diagram } = draggedParts[0];
  diagram.startTransaction();
  // glueLanesTogether(draggedParts, currentPart);
  runListenerOnce(diagram, 'LayoutCompleted', createSnapshot);
  diagram.layout.invalidateLayout();
};

const handleDragMouseMove = (prevPoint: go.Point) => {
  if (!proceedReorder) {
    return;
  }

  handleReorder(mode, computedParts, prevPoint, reorderSnapshot);
};

const handleDragMouseUp = () => {
  if (!proceedReorder) {
    return;
  }

  const { diagram } = draggedParts[0];

  getLanes(diagram).forEach((lane) => lane.updateTargetBindings());
  runWithoutLayoutAnimation(diagram, () => MODES[mode].dragMouseUp(diagram));
  diagram.commitTransaction();
  clear();
  return true;
};

export const createReorderManager = () => ({
  handleDragActivate,
  handleDragMouseMove,
  handleDragMouseUp
});

export type ReorderManager = ReturnType<typeof createReorderManager>;
