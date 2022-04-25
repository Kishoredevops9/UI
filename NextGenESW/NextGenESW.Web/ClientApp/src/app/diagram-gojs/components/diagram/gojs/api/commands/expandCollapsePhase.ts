import * as go from 'gojs';
import * as _ from 'lodash/fp';

import { propagateEventsForLanePhases } from '../../managers/lanePhasePropagator/lanePhasePropagator';
import { PROPAGATE_SELECTOR } from '../../managers/lanePhasePropagator/selectors';

export const expandCollapsePhase = _.curry((
  diagram: go.Diagram,
  sourceData: go.ObjectData,
  collapsed: boolean
) => {
  const lanePhaseWithHeader = diagram.findNodeForData(sourceData);

  propagateEventsForLanePhases(
    [PROPAGATE_SELECTOR.VERTICALLY],
    lanePhaseWithHeader.part,
    (lanePhase) => {
      diagram.model.set(
        lanePhase.data,
        'isPhaseCollapsed',
        !collapsed
      );
    }
  );
});
