import * as go from 'gojs';

const separator = '@';

export const getLanePhaseKey = (
  phaseId: go.Key,
  swimlaneKey: go.Key
) => `${phaseId}${separator}${swimlaneKey}`;

export const parseLanePhaseKey = (lanePhaseKey: string) => {
  const [phaseId, swimLaneId] = lanePhaseKey.split(separator);
  return {
    phaseId: parseInt(phaseId, 10),
    swimLaneId: parseInt(swimLaneId, 10)
  };
};
