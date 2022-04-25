import * as _ from 'lodash/fp';
import * as go from 'gojs';
import { getLanes } from '../../utils/getLanes';
import { changeOrder } from '../reorderManager/changeOrder';
import { getLanePhases } from '../../utils/getLanePhases';
import { propagateEventsForLanePhases } from '../lanePhasePropagator/lanePhasePropagator';
import { PROPAGATE_SELECTOR } from '../lanePhasePropagator/selectors';
import { getApiForDiagram } from '../../api/getApiForDiagram';
import { parseLanePhaseKey } from '../../utils/getLanePhaseKey';

export const updateOrders = (diagram: go.Diagram) => {
  const api = getApiForDiagram(diagram);
  const lanes = getLanes(diagram);
  const lanePhases = getLanePhases(diagram);
  const sortedLanes = _.sortBy(({ location }) => location.y)(lanes);
  const sortedPhases = _.flowRight(
    _.sortBy(({ location }) => location.x),
    _.uniqBy(({ data }) => data.order)
  )(lanePhases);

  sortedLanes.forEach((lane: go.Group, order: number) => {
    changeOrder(order + 1 - lane.data.order, lane);
    api.http.handleSwimLaneUpdate({
      id: lane.key as number,
      sequenceNumber: lane.data.order
    });
  });
  sortedPhases.forEach((lanePhase: go.Group, order: number) => {
    const { phaseId } = parseLanePhaseKey(lanePhase.key as string);
    propagateEventsForLanePhases(
      [PROPAGATE_SELECTOR.VERTICALLY],
      lanePhase.part,
      changeOrder(order + 1 - lanePhase.data.order)
    );
    api.http.handlePhaseUpdate({
      id: phaseId,
      sequenceNumber: lanePhase.data.order
    });
  });
};
