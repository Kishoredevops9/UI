import * as go from 'gojs';

import { getApiForDiagram } from '../../api/getApiForDiagram';
import { parseLanePhaseKey } from '../../utils/getLanePhaseKey';
import { isLanePhase } from '../../utils/getLanePhases';

export const updateEnlargedGroups = (
  diagram: go.Diagram,
  enlargedGroupKeys: Set<go.Key>
) => {
  const api = getApiForDiagram(diagram);
  const swimLanes = [];

  enlargedGroupKeys.forEach((key) => {
    const part = diagram.findPartForKey(key);
    if (isLanePhase(part)) {
      const { phaseId, swimLaneId } = parseLanePhaseKey(key as string);
      api.http.handlePhaseUpdate({
        id: phaseId,
        size: part.data.size
      });

      if (!swimLanes.includes(swimLaneId)) {
        swimLanes.push(swimLaneId);
      }
    }
  });

  swimLanes.forEach((key) => {
    const part = diagram.findPartForKey(key);
    api.http.handleSwimLaneUpdate({
      id: key,
      size: part.data.size
    });
  });
};
