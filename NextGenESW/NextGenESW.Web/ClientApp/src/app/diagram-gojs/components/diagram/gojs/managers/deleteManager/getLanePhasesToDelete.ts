import * as _ from 'lodash/fp';
import * as go from 'gojs';

import { getLanes } from '../../utils/getLanes';
import { isLanePhase } from '../../utils/getLanePhases';

const omitPhasesWithNodes = _.filter((phase: go.Group[]) =>
  !_.some((lanePhase: go.Group) => !!lanePhase.memberParts.count)(phase))

const leaveLastPhaseIfNeeded = _.curry((
  phasesAmount: number,
  phasesToRemove: go.Part[][],
) => phasesToRemove.length === phasesAmount
  ? _.tail(phasesToRemove)
  : phasesToRemove
);

export const getLanePhasesToDelete = (diagram: go.Diagram): go.Part[] => {
  const lanes = getLanes(diagram);
  const phasesAmount = lanes[0].memberParts.count;

  return _.flowRight(
    _.flatten,
    omitPhasesWithNodes,
    leaveLastPhaseIfNeeded(phasesAmount),
    _.filter((lanePhases) => lanePhases.length === lanes.length),
    _.values,
    _.reduce((result, part: go.Part) => {
      const { order } = part.data;

      return {
        ...result,
        [order]: !result[order] ? [part] : [...result[order], part]
      }
    }, {}),
    _.filter(isLanePhase)
  )(diagram.selection.toArray());
}
