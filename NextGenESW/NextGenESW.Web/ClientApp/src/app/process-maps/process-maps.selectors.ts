import { createFeatureSelector, createSelector } from '@ngrx/store';

import { Activity, ActivityGroup, Phase, ProcessMap } from './process-maps.model';
import { ProcessMapsState } from './process-maps.reducer';

export const processMapsStateSelector = createFeatureSelector<ProcessMapsState>(
  'processMapses'
);

export const selectedProcessMapIdSelector = createSelector(
  processMapsStateSelector,
  (state) => state.selectedProcessMapId
);

export const selectedProcessMapSelector = createSelector(
  processMapsStateSelector,
  selectedProcessMapIdSelector,
  (state, selectedProcessMapId) => state.entities[selectedProcessMapId]
);

export const phasesSelector = createSelector(
  selectedProcessMapSelector,
  (processMap) => processMap.phases
);

export const phaseSelector = createSelector(
  phasesSelector,
  (phases: Phase[], id: number) => phases.find(
    (phase) => phase.id === id
  )
);

export const swimLanesSelector = createSelector(
  selectedProcessMapSelector,
  (processMap) => processMap.swimLanes
);

export const swimLaneSelector = createSelector(
  swimLanesSelector,
  (swimLanes: ActivityGroup[], id: number) => swimLanes.find(
    (swimLane) => swimLane.id === id
  )
);

export const activityBlocksSelector = createSelector(
  selectedProcessMapSelector,
  (processMap) => processMap.activityBlocks
);

export const activityBlockSelector = createSelector(
  activityBlocksSelector,
  (activityBlocks: Activity[], id: number) => activityBlocks.find(
    (activityBlock) => activityBlock.id === id
  )
);

export const activityConnectorSelector = createSelector(
  selectedProcessMapSelector,
  (processMap: ProcessMap, { activityId, connectorId }) =>  processMap
    .activityBlocks
    ?.find(({ id }) => id === activityId)
    ?.activityConnections
    ?.find(({ id }) => id === connectorId)
);
