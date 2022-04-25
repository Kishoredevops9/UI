import * as _ from 'lodash/fp';
import * as go from 'gojs';

import { LANE_PHASE_WIDTH } from '../gojs/consts';
import { HttpAction } from '../gojs/types';
import { Phase } from '../../../../process-maps/process-maps.model';
import { ProcessMapDiagram } from '../../../types/processMap';

const _reduce = _.reduce.convert({ cap: false });

type PhasesAndApiChanges = {
  phases: Phase[],
  phasesApiChanges: HttpAction[]
};

export const getPhases = ({ phases }: ProcessMapDiagram) => _.flowRight(
  _reduce((result: PhasesAndApiChanges, phase: Phase, idx: number) => {
    let propertiesToUpdate = {};

    if (!phase.sequenceNumber || phase.sequenceNumber !== idx + 1) {
      const sequenceNumber = idx + 1;
      propertiesToUpdate = { ...propertiesToUpdate, sequenceNumber };
    }

    if (!phase.size) {
      const size = go.Size.stringify(new go.Size(LANE_PHASE_WIDTH, 0));
      propertiesToUpdate = { ...propertiesToUpdate, size };
    }

    return _.isEmpty(propertiesToUpdate)
      ? {
        phases: [...result.phases, phase],
        phasesApiChanges: result.phasesApiChanges
      }
      : {
        phases: [...result.phases, { ...phase, ...propertiesToUpdate }],
        phasesApiChanges: [
          ...result.phasesApiChanges,
          {
            type: 'UpdatePhase',
            payload: { id: phase.id, ...propertiesToUpdate }
          }
        ]
      };
  }, { phases: [], phasesApiChanges: [] }),
  _.sortBy(({ sequenceNumber }) => sequenceNumber)
)(phases);
