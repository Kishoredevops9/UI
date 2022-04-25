import * as go from 'gojs';
import * as _ from 'lodash/fp';
import { getLastLane } from './getLanes';
import { isLanePhase } from './getLanePhases';
import { parseLanePhaseKey } from './getLanePhaseKey';

const mapLanePhaseToPhase = (lanePhase: go.Group): go.ObjectData => {
  const { phaseId } = parseLanePhaseKey(lanePhase.key as string);
  const phaseData = _.omit(['category', 'group', 'isGroup', 'loc', 'size'])(lanePhase.data);

  return {
    ...phaseData,
    key: phaseId
  };
};

export const getPhases = (diagram: go.Diagram): go.ObjectData[] => _.flowRight(
  _.map(mapLanePhaseToPhase),
  (lane: go.Group) => {
    let lanePhases = [];
    lane.memberParts.each((part: go.Part) => {
      if (isLanePhase(part)) {
        lanePhases = [...lanePhases, part];
      }
    });
    return lanePhases;
  },
  getLastLane
)(diagram);
