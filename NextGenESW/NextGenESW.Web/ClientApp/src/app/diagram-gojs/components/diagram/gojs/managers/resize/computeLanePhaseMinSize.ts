import * as go from 'gojs';
import { propagateEventsForLanePhases } from '../lanePhasePropagator/lanePhasePropagator';
import { PROPAGATE_SELECTOR } from '../lanePhasePropagator/selectors';
import { getMembersEdges } from './getMembersEdges';

export const computeLanePhaseMinSize = (
  groupMinSize: go.Size,
  part: go.Part
): go.Size => {
  let minWidth = groupMinSize.width;
  let minHeight = groupMinSize.height;

  propagateEventsForLanePhases(
    [PROPAGATE_SELECTOR.VERTICALLY],
    part,
    (lanePhase: go.Group) =>
      minWidth = Math.max(minWidth, getMembersEdges(lanePhase).right)
  );
  propagateEventsForLanePhases(
    [PROPAGATE_SELECTOR.HORIZONTALLY],
    part,
    (lanePhase: go.Group) =>
      minHeight = Math.max(minHeight, getMembersEdges(lanePhase).bottom)
  );

  return new go.Size(minWidth, minHeight);
}
