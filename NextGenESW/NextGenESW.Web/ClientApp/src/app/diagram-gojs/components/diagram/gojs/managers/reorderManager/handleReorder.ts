import * as _ from 'lodash/fp';
import * as go from 'gojs';

import { ReorderBorder, ReorderSnapshot } from './types';
import { getDiagramMousePoint } from '../../utils/getMousePoint';
import { changeOrder } from './changeOrder';
import { MODES } from './modes';

const checkIfCrossed = (prevLoc: number, loc: number, border: number) =>
  _.inRange(Math.min(loc, prevLoc), Math.max(loc, prevLoc))(border);

const calculateNewLocation = (
  mode: string,
  { start, isFollowing }: ReorderBorder,
  crossedFromAbove: boolean,
  shift
) => {
  if (isFollowing) {
    return crossedFromAbove ? start - shift : start;
  }

  return crossedFromAbove ? start : start + shift;
};

const moveLane = (
  mode: string,
  draggedParts: go.Part[],
  reorderBorder: ReorderBorder,
  crossedWithFollowing: boolean,
  shift: number,
  orderShift: number
) => {
  const { part } = reorderBorder;
  const newLocation = calculateNewLocation(
    mode,
    reorderBorder,
    crossedWithFollowing,
    shift
  );

  MODES[mode].updateParts(draggedParts, newLocation, orderShift, part);
};

export const handleReorder = (
  mode: string,
  draggedParts: go.Part[],
  point: go.Point,
  reorderSnapshot: ReorderSnapshot
) => {
  const { getAxis } = MODES[mode];
  const prevLoc = getAxis(point);
  const loc = getAxis(getDiagramMousePoint(draggedParts[0].diagram));

  return _.forEach((reorderBorder: ReorderBorder) => {
    if (!checkIfCrossed(prevLoc, loc, reorderBorder.border)) {
      return;
    }

    const crossedWithFollowing = prevLoc < loc;
    moveLane(
      mode,
      draggedParts,
      reorderBorder,
      crossedWithFollowing,
      reorderSnapshot.shift,
      draggedParts.length * (crossedWithFollowing ? -1 : 1)
    );
  })(reorderSnapshot.borders);
};
