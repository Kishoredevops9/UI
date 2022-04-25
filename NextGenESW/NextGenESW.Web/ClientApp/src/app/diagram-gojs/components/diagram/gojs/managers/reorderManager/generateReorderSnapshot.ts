import * as _ from 'lodash/fp';
import * as go from 'gojs';

import { ReorderSnapshot } from './types';
import { MODES } from './modes';

const REORDER_OFFSET = 10;

const getShift = (mode: string) => _.reduce((newShift: number, part: go.Part) =>
  newShift + MODES[mode].getSize(part.actualBounds), 0);

export const generateReorderSnapshot = (
  mode: string,
  computedParts: go.Part[]
): ReorderSnapshot => {
  const { location } = computedParts[0];
  const draggedPartsKeys = _.map(({ key }) => key)(computedParts);
  let borders = [];

  MODES[mode].getAllParts(computedParts[0])
    .filter((part) => !_.includes(part.key)(draggedPartsKeys))
    .forEach((part: go.Part) => {
      const { firstBound, secondBound } = MODES[mode].getBounds(part.actualBounds);
      const isFollowing = firstBound > MODES[mode].getAxis(location);

      borders = [
        ...borders,
        {
          part,
          order: part.data.order,
          border: isFollowing
            ? firstBound + REORDER_OFFSET
            : secondBound - REORDER_OFFSET,
          start: MODES[mode].getAxis(part.location.copy()),
          isFollowing
        }
      ];
    });

  return { borders, shift: getShift(mode)(computedParts) };
};
