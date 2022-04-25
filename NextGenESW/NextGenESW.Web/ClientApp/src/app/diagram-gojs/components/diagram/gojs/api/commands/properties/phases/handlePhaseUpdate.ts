import * as go from 'gojs';
import * as _ from 'lodash/fp';

import { Phase } from '../../../../../../../../process-maps/process-maps.model';
import { LANE_PHASE_WIDTH } from '../../../../consts';
import { getLanePhaseKey } from '../../../../utils/getLanePhaseKey';
import { getLanePhases } from '../../../../utils/getLanePhases';
import { skipUndoManager } from '../../../../utils/skipUndoManager';
import { propagateEventsForLanePhases } from '../../../../managers/lanePhasePropagator/lanePhasePropagator';
import { PROPAGATE_SELECTOR } from '../../../../managers/lanePhasePropagator/selectors';

export const handlePhaseUpdate = _.curry((
  diagram: go.Diagram,
  order: number,
  result: Phase
) => skipUndoManager(diagram, () => {
  const { id, name, caption } = result;
  _.flowRight(
    _.each((lanePhase: go.Group) => {
      const data = lanePhase.data;
      diagram.model.setDataProperty(data, 'name', name);
      diagram.model.setDataProperty(data, 'caption', caption);

      const swimlane = lanePhase.containingGroup;
      const size = getSize(swimlane, result);
      diagram.model.setDataProperty(data, 'size', size);

      const nextKey = getLanePhaseKey(id, swimlane.key);
      diagram.model.setKeyForNodeData(data, nextKey);
      propagateEventsForLanePhases(
        [PROPAGATE_SELECTOR.VERTICALLY],
        lanePhase,
        (nextLanePhase) => {
          diagram.model.setKeyForNodeData(
            nextLanePhase.data,
            getLanePhaseKey(id, nextLanePhase.containingGroup.key)
          );
        }
      );
    }),
    _.filter({ data: { order } }),
    getLanePhases
  )(diagram);
}));

const getSize = (
  swimlane: go.Group,
  phase: Phase
): string => {
  const height = swimlane.actualBounds.height;
  const width = go.Size.parse(phase.size)?.width || LANE_PHASE_WIDTH;

  return go.Size.stringify(
    new go.Size(width, height)
  );
};
