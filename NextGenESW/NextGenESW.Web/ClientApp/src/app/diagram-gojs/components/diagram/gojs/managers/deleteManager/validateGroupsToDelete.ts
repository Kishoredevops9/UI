import * as go from 'gojs';
import * as _ from 'lodash/fp';
import { isLanePhase } from '../../utils/getLanePhases';
import { isLane } from '../../utils/getLanes';

export const validateGroupsToDelete = (
  selection: go.Set<go.Part>
): boolean => {
  for (let iterator = selection.iterator; iterator.next(); ) {
    const part = iterator.value;

    if (isLane(part)) {
      const isValidLane = validateLane(part as go.Group);
      if (!isValidLane) {
        return false;
      }
    } else if (isLanePhase(part)) {
      const isValidLanePhase = validateLanePhase(part as go.Group);
      if (!isValidLanePhase) {
        return false;
      }
    }
  }

  return true;
}

const validateLane = (group: go.Group) => {
  for (let iterator = group.memberParts.iterator; iterator.next();) {
    const lanePhase = iterator.value;

    const isValidLanePhase = validateLanePhase(lanePhase as go.Group);
    if (!isValidLanePhase) {
      return false;
    }
  }

  return true;
}

const validateLanePhase = (group: go.Group) => {
  return group.memberParts.count === 0;
}
