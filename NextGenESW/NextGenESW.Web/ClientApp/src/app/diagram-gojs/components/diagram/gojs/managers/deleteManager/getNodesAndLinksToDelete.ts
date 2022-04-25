import * as _ from 'lodash/fp';
import * as go from 'gojs';
import { isLanePhase } from '../../utils/getLanePhases';
import { isLane } from '../../utils/getLanes';
import { isActivityNode } from '../../utils/getActivityNodes';

export const getNodesAndLinksToDelete = (diagram: go.Diagram) => _.flowRight(
  _.partition((part: go.Part) => !part.deletable),
  _.flatten,
  _.map((part: go.Part) => {
    let linksToRemove = [];

    if (isActivityNode(part.data)) {
      (part as go.Node)
        .findLinksOutOf()
        .each((link) => linksToRemove = [...linksToRemove, link]);
    }

    return [part, ...linksToRemove];
  }),
  _.filter((part) => !isLane(part) && !isLanePhase(part))
)(diagram.selection.toArray());
