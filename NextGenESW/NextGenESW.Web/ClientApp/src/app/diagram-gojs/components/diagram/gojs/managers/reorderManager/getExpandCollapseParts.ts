import * as _ from 'lodash/fp';
import * as go from 'gojs';
import { getLanes } from '../../utils/getLanes';

export const getExpandCollapseParts = (diagram: go.Diagram) => {
  let lanePhases = [];
  const lanes = _.flowRight(
    _.filter(({ data }) => data.isLaneCollapsed),
    getLanes
  )(diagram);

  getLanes(diagram)[0].memberParts.each((lanePhase) => {
    if (lanePhase.data.isPhaseCollapsed) {
      lanePhases = [...lanePhases, lanePhase];
    }
  });

  return [...lanes, ...lanePhases];
};
