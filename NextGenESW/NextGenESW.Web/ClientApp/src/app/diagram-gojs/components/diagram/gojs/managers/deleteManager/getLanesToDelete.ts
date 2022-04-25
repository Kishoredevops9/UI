import * as _ from 'lodash/fp';
import * as go from 'gojs';

import { getLanes, isLane } from '../../utils/getLanes';

export const getLanesToDelete = (diagram: go.Diagram): go.Part[] => {
  const selectedLanes = diagram.selection
    .toArray()
    .filter(isLane)
    .filter(
      (lane: go.Group) => !lane.memberParts.any(
        (part: go.Group) => !!part.memberParts.count
      )
    );
  return selectedLanes.length === getLanes(diagram).length
    ? _.tail(selectedLanes)
    : selectedLanes;
}
