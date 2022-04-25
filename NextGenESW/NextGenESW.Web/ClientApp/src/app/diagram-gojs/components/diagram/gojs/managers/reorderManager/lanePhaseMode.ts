import * as _ from 'lodash/fp';
import * as go from 'gojs';

import { propagateEventsForLanePhases } from '../lanePhasePropagator/lanePhasePropagator';
import { PROPAGATE_SELECTOR } from '../lanePhasePropagator/selectors';
import { changeOrder } from './changeOrder';
import { getLanes } from '../../utils/getLanes';
import { isLanePhase } from '../../utils/getLanePhases';
import { getApiForDiagram } from '../../api/getApiForDiagram';
import { parseLanePhaseKey } from '../../utils/getLanePhaseKey';

const setMinMaxLocations = (lanePhase: go.Group) => {
  const {
    x: minX,
    y: minY
  } = lanePhase.containingGroup.getDocumentPoint(go.Spot.TopLeft);
  const maxX = lanePhase.containingGroup.getDocumentPoint(go.Spot.BottomRight).x;

  lanePhase.minLocation = new go.Point(minX, minY);
  lanePhase.maxLocation = new go.Point(maxX - lanePhase.actualBounds.width, minY);
};

const lanePhaseGetComputedParts = (parts) => {
  let orders = [];

  return _.flowRight(
    _.reduce((computedParts, part: go.Part) => {
      if (_.includes(part.data.order)(orders)) {
        return computedParts;
      }

      orders = [...orders, part.data.order];
      return [...computedParts, part];
    }, []),
    _.forEach(setMinMaxLocations)
  )(parts);
};

const getAllParts = (part: go.Part) => {
  let allParts = [];
  part.containingGroup.memberParts.each((nextPart: go.Part) =>
    allParts = [...allParts, nextPart]);
  return allParts;
};

const updateParts = (draggedParts, newLocation, orderShift, intersectedPart) => {
  let draggedLanePhases = [];
  let intersectedLanePhases = [];
  propagateEventsForLanePhases(
    [PROPAGATE_SELECTOR.VERTICALLY],
    intersectedPart,
    (lanePhase: go.Group) => intersectedLanePhases = [...intersectedLanePhases, lanePhase]
  );
  draggedParts.forEach((draggedPart) => {
    propagateEventsForLanePhases(
      [PROPAGATE_SELECTOR.VERTICALLY],
      draggedPart,
      (lanePhase: go.Group) => draggedLanePhases = [...draggedLanePhases, lanePhase]
    );
  });
  intersectedLanePhases.forEach((lanePhase) => {
    changeOrder(orderShift, lanePhase);
    lanePhase.move(new go.Point(newLocation, lanePhase.location.y), true);
  });
  draggedLanePhases.forEach(changeOrder(orderShift * -1));
};

const dragMouseUp = (diagram) => {
  const lanes = getLanes(diagram);
  const api = getApiForDiagram(diagram);
  lanes.forEach((lane) => lane.layout.invalidateLayout());
  lanes[0].memberParts.each((lanePhase: go.Group) => {
    const { phaseId } = parseLanePhaseKey(lanePhase.key as string);
    api.http.handlePhaseUpdate({
      id: phaseId,
      sequenceNumber: lanePhase.data.order
    });
  });
};

const getDraggedParts = (draggedParts) => _.flowRight(
  _.map(({ key }) => key),
  _.forEach(({ key }) => setMinMaxLocations(key)),
  _.filter(({ key }) => isLanePhase(key))
)(draggedParts.toArray());

export const lanePhaseMode = {
  getComputedParts: lanePhaseGetComputedParts,
  getAxis: ({ x }) => x,
  getBounds: ({ left, right }) => ({ firstBound: left, secondBound: right }),
  getAllParts,
  getSize: ({ width }) => width,
  updateParts,
  dragMouseUp,
  getDraggedParts
};
