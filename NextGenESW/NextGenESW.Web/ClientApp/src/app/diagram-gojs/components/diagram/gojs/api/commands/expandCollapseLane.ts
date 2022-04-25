import * as go from 'gojs';
import * as _ from 'lodash/fp';

import { propagateEventsForLanePhases } from '../../managers/lanePhasePropagator/lanePhasePropagator';
import { PROPAGATE_SELECTOR } from '../../managers/lanePhasePropagator/selectors';

export const expandCollapseLane = _.curry((
  diagram: go.Diagram,
  sourceData: go.ObjectData,
  collapsed: boolean
) => {
  const lane = diagram.findNodeForData(sourceData) as go.Group;

  lane.diagram.model.set(lane.data, 'isLaneCollapsed', !collapsed);
  propagateEventsForLanePhases(
    [PROPAGATE_SELECTOR.CHILDREN],
    lane.part,
    (lanePhase: go.Group) => {
      lane.diagram.model.set(lanePhase.data, 'isLaneCollapsed', !collapsed)
    }
  );
});
