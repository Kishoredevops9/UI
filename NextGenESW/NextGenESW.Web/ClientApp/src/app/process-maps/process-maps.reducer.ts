import { Action, createReducer, on, State } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { ProcessMap, ActivityGroup, ProcessMapMetaData } from './process-maps.model';
import * as ProcessMapsActions from './process-maps.actions';
//import { stat } from 'fs';

export const processMapsesFeatureKey = 'processMapses';

export interface ProcessMapsState extends EntityState<ProcessMap> {
  error: string;
  selectedProcessMapId: number;
}

export const adapter: EntityAdapter<ProcessMap> = createEntityAdapter<ProcessMap>();

export const initialState: ProcessMapsState = adapter.getInitialState({
  error: undefined,
  selectedProcessMapId: undefined
});

const processMapsReducer = createReducer(
  initialState,

  //Load Process Maps
  on(ProcessMapsActions.loadProcessMapsSuccess,
    (state, action) => {
      const processMaps = {
        ...action.processMaps,
        skipsDiagramUpdate: false
      };
      return adapter.setAll(processMaps, {
        ...state,
        error: null,
      });
    }
  ),
  on(ProcessMapsActions.loadProcessMapsFailure,
    (state, action) => {
      return {
        ...state,
        error: action.error
      }
    }
  ),

  on(ProcessMapsActions.loadProcessMap,
    (state, action) => {
      return {
        ...state,
        selectedProcessMapId: action.id
      }
    }
  ),
  on(ProcessMapsActions.loadProcessMapSuccess,
    (state, action) => {
      const map = {
        ...action.selectedProcessMap,
        skipsDiagramUpdate: false
      };
      return adapter.upsertOne(map, state);
    }
  ),
  on(ProcessMapsActions.loadProcessMapFailure,
    (state, action) => {
      return {
        ...state,
        error: action.error
      }
    }
  ),

  // Add Process Maps
  on(ProcessMapsActions.addProcessMapSuccess,
    (state, action) => adapter.addOne(action.processMap, state)
  ),
  on(ProcessMapsActions.addProcessMapFailure,
    (state, action) => {
      return {
        ...state,
        error: action.error
      }
    }
  ),

  //Update the Process Map
  on(ProcessMapsActions.updateProcessMapSuccess,
    (state, action) => {
      return adapter.updateOne(action.processMap, state)
    }
  ),
  //Add Activity
  on(ProcessMapsActions.addActivitySuccess, (state, action) => {
    const { skipsDiagramUpdate } = action;
    const processMap = {
      ...state.entities[state.selectedProcessMapId],
      skipsDiagramUpdate
    };

    if (!processMap.activityBlocks) {
      return;
    }

    processMap.activityBlocks = [...processMap.activityBlocks, action.activity];
    return adapter.upsertOne(processMap, state);
  }),

  //Edit Shapes
  on(ProcessMapsActions.editActivitySuccess, (state, action) => {
    const { skipsDiagramUpdate } = action;
    const processMap = {
      ...state.entities[state.selectedProcessMapId],
      skipsDiagramUpdate
    };

    if (!processMap.activityBlocks) {
      return;
    }

    processMap.activityBlocks = [...processMap.activityBlocks, action.activity];
    return adapter.upsertOne(processMap, state);
  }),

    //Edit Swimlane
    on(ProcessMapsActions.updateMapGroupSuccess, (state, action) => {
      const { skipsDiagramUpdate } = action;
      const processMap = {
        ...state.entities[state.selectedProcessMapId],
        skipsDiagramUpdate
      };
      processMap.swimLanes = [...processMap.swimLanes, action.group];
      return adapter.upsertOne(processMap, state);
    }),

  //Update the Activity
  on(ProcessMapsActions.updateProcessMapActivitySuccess, (state, action) => {

    let processMap = { ...state.entities[state.selectedProcessMapId] };

    let tempActivites = processMap.activityBlocks.filter((activityBlocks) => activityBlocks.id != action.activity.id);

    let tempActivity = { ...action.activity };

    tempActivity.swimLaneId = Number(tempActivity.swimLaneId);

    processMap.activityBlocks = [...tempActivites, tempActivity];
    return adapter.upsertOne(processMap, state);
  }),


  //Delete Process Map
  on(ProcessMapsActions.deleteProcessMapSuccess,
    (state, action) => {

      return adapter.removeOne(action.id, state)
    }
  ),

  on(ProcessMapsActions.deleteProcessMapFailure,
    (state, action) => {
      return {
        ...state,
        error: action.error
      }
    }
  ),

  //Delete Process Map Activity
  on(ProcessMapsActions.deleteProcessMapActivitySuccess,
    (state, action) => {
      let processMap = {
        ...state.entities[state.selectedProcessMapId],
        skipsDiagramUpdate: action.skipsDiagramUpdate
      };

      let tempActivites = processMap.activityBlocks.filter((activity) => '' + activity.id != action.id);

      processMap.activityBlocks = [...tempActivites];

      return adapter.upsertOne(processMap, state);
    }
  ),

  // Add groups to Maps
  on(ProcessMapsActions.addGroupSuccess,
    (state, action) => {
      const { activityGroup, skipsDiagramUpdate } = action;

      const processMap = state.entities[state.selectedProcessMapId];
      const { swimLanes } = processMap;
      const nextProcessMap = {
        ...processMap,
        swimLanes: [
          ...(swimLanes || []),
          activityGroup
        ],
        skipsDiagramUpdate
      };

      return adapter.upsertOne(nextProcessMap, state);
    }),
  on(ProcessMapsActions.addGroupFailure,
    (state, action) => {
      return {
        ...state,
        error: action.error
      }
    }),

  //Update the Group
  on(ProcessMapsActions.updateProcessMapGroupSuccess, (state, action) => {
    const { activityGroup, skipsDiagramUpdate, mapId } = action;

    const processMap = state.entities[mapId];
    const { swimLanes } = processMap;
    const nextProcessMap = {
      ...processMap,
      swimLanes: (swimLanes || []).map(
        (lane) => lane.id === activityGroup.id
          ? activityGroup
          : lane
      ),
      skipsDiagramUpdate
    };

    return adapter.upsertOne(nextProcessMap, state);
  }),
  //Update Groups
  on(ProcessMapsActions.updateProcessMapGroupsSuccess, (state, action) => {

    let processMap = { ...state.entities[state.selectedProcessMapId] };

    // let tempActivites = processMap.activityGroups.filter((group) => group.id != action.activityGroup.id);

    // processMap.activityGroups = [...tempActivites, action.activityGroup];
    processMap.swimLanes = action.activityGroups
    return adapter.upsertOne(processMap, state);
  }),

  //Delete Process Map Group
  on(ProcessMapsActions.deleteProcessMapGroupSuccess,
    (state, action) => {
      let processMap = { ...state.entities[state.selectedProcessMapId] };

      let tempGroups = processMap.swimLanes.filter((group) => '' + group.id != action.id);

      processMap.swimLanes = [...tempGroups];

      return adapter.upsertOne(processMap, state);
    }
  ),

  //Delete Swimalne Process Map Group
  on(ProcessMapsActions.deleteSwimlaneSuccess, (state, action) => {
    const { id: deletedId, skipsDiagramUpdate } = action;

    const processMap = state.entities[state.selectedProcessMapId];
    const { swimLanes } = processMap;
    const nextProcessMap = {
      ...processMap,
      swimLanes: (swimLanes || []).filter((lane) => lane.id !== deletedId),
      skipsDiagramUpdate
    };

    return adapter.upsertOne(nextProcessMap, state);
    }
  ),


  // Add MetaData to Maps
  on(ProcessMapsActions.addProcessMapMetaDataSuccess,
    (state, action) => {

      let processMap = { ...state.entities[state.selectedProcessMapId] };

      processMap.processMapMeta = [...processMap.processMapMeta, action.processMapMetaData];

      return adapter.upsertOne(processMap, state);

    }),
  on(ProcessMapsActions.addProcessMapMetaFailure,
    (state, action) => {
      return {
        ...state,
        error: action.error
      }
    }),

  // Delete Meta Data to Map

  on(ProcessMapsActions.deleteProcessMapMetaDataSuccess,
    (state, action) => {
      let processMap = { ...state.entities[state.selectedProcessMapId] };

      let tempGroups = processMap.processMapMeta.filter((metaData) => '' + metaData.id != action.id);

      processMap.processMapMeta = [...tempGroups];

      return adapter.upsertOne(processMap, state);
    }
  ),

  //add Activities Meta Data
  on(ProcessMapsActions.addActivitiesMetaDataSuccess,
    (state, action) => {

      let processMap = { ...state.entities[state.selectedProcessMapId] };

      let index = processMap.activityBlocks.findIndex((activity) => activity.id == action.activityId)

      const tempActivity = JSON.parse(JSON.stringify(processMap.activityBlocks[index]))
      if (processMap.activityBlocks[index].activityMeta != undefined) {
        tempActivity.metadata = [...processMap.activityBlocks[index].activityMeta, action.activityMeta]
      }

      else {
        tempActivity.metadata = [action.activityMeta]
      }

      processMap.activityBlocks = [...processMap.activityBlocks.filter((activity) => activity.id != action.activityId), tempActivity];


      return adapter.upsertOne(processMap, state);

    }),
  on(ProcessMapsActions.addActivitiesMetaDataFailure,
    (state, action) => {
      return {
        ...state,
        error: action.error
      }
    }),
  // delete activity metadata
  on(ProcessMapsActions.deleteActivitiesMetaDataSuccess,
    (state, action) => {
      let processMap = { ...state.entities[state.selectedProcessMapId] };

      let index = processMap.activityBlocks.findIndex((activity) => activity.id == action.activityId)

      const tempActivity = JSON.parse(JSON.stringify(processMap.activityBlocks[index]))
      tempActivity.metadata = processMap.activityBlocks[index].activityMeta.filter(metadata => metadata.id != action.activityMeta)

      processMap.activityBlocks = [...processMap.activityBlocks.filter((activity) => activity.id != action.activityId), tempActivity];


      return adapter.upsertOne(processMap, state);
    }
  ),
  //add Connector
  on(ProcessMapsActions.addConnectorSuccess, (state, action) => {
    const { activityId, connector, skipsDiagramUpdate } = action;
    const processMap = {
      ...state.entities[state.selectedProcessMapId]
    };

    const activities = processMap.activityBlocks || [];
    const nextActivities = activities.map((activity) => {
      if (activityId !== activity.id) {
        return activity;
      }

      const connectors = activity.activityConnections || [];
      return {
        ...activity,
        activityConnections: [
          ...connectors,
          connector
        ]
      };
    })

    const nextProcessMap = {
      ...processMap,
      activityBlocks: nextActivities,
      skipsDiagramUpdate
    };

    return adapter.upsertOne(nextProcessMap, state);
  }),
  //Delete Connector
  on(ProcessMapsActions.deleteConnectorSuccess,
    (state, action) => {
      const { activityId, connector, skipsDiagramUpdate } = action;
      const processMap = { ...state.entities[state.selectedProcessMapId] };
      const activities = processMap.activityBlocks || [];
      const nextActivities = activities.map((activity) => {
        if (activity.id !== activityId) {
          return activity;
        }

        return {
          ...activity,
          activityConnections: (activity.activityConnections || []).filter(
            (activityConnection) => activityConnection.id !== connector
          )
        };
      })

      const nextProcessMap = {
        ...processMap,
        activityBlocks: nextActivities,
        skipsDiagramUpdate
      };
      return adapter.upsertOne(nextProcessMap, state);
    }
  ),
  // Add phase
  on(ProcessMapsActions.addPhaseSuccess, (state, action) => {
    const { phase, skipsDiagramUpdate } = action;

    const processMap = state.entities[state.selectedProcessMapId];
    const { phases } = processMap;
    const nextProcessMap = {
      ...processMap,
      phases: [
        ...(phases || []),
        phase
      ],
      skipsDiagramUpdate
    };

    return adapter.upsertOne(nextProcessMap, state);
  }),
  on(ProcessMapsActions.addPhaseFailure, (state, action) => {
    return {
      ...state,
      error: action.error
    };
  }),
  // Delete phase
  on(ProcessMapsActions.deletePhaseSuccess, (state, action) => {
    const { id: deletedId, skipsDiagramUpdate } = action;

    const processMap = state.entities[state.selectedProcessMapId];
    const { phases } = processMap;
    const nextProcessMap = {
      ...processMap,
      phases: (phases || []).filter((phase) => phase.id !== deletedId),
      skipsDiagramUpdate
    };

    return adapter.upsertOne(nextProcessMap, state);
  }),
  on(ProcessMapsActions.deletePhaseFailure, (state, action) => {
    return {
      ...state,
      error: action.error
    };
  }),
  // Update phase
  on(ProcessMapsActions.updatePhaseSuccess, (state, action) => {
    const { phase: updatedPhase, skipsDiagramUpdate } = action;

    const processMap = state.entities[state.selectedProcessMapId];
    const { phases } = processMap;
    const nextProcessMap = {
      ...processMap,
      phases: (phases || []).map(
        (phase) => phase.id === updatedPhase.id
          ? updatedPhase
          : phase
      ),
      skipsDiagramUpdate
    };

    return adapter.upsertOne(nextProcessMap, state);
  }),
  on(ProcessMapsActions.updatePhaseFailure, (state, action) => {
    return {
      ...state,
      error: action.error
    };
  }),
  on(ProcessMapsActions.updateConnectorSuccess, (state, action) => {
    const { activityId, skipsDiagramUpdate, connector } = action;
    const processMap = state.entities[state.selectedProcessMapId];
    const activities = processMap.activityBlocks || [];
    const nextActivities = activities.map((activity) => {
      if (activity.id !== activityId) {
        return activity;
      }

      return {
        ...activity,
        activityConnections: (activity.activityConnections || []).map(
          (activityConnector) => activityConnector.id !== connector.id
            ? activityConnector
            : connector
        )
      };
    });
    const nextProcessMap = {
      ...processMap,
      activityBlocks: nextActivities,
      skipsDiagramUpdate
    };

    return adapter.upsertOne(nextProcessMap, state);
  }),
  on(ProcessMapsActions.setSelectedProcessMapId, (state, action) => ({
    ...state,
    selectedProcessMapId: action.id
  }))
);

export function reducer(state: ProcessMapsState | undefined, action: Action) {
  return processMapsReducer(state, action);
}

export const getSelectedProcessMapId = (state: ProcessMapsState) => state.selectedProcessMapId;

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();

export const selectAllProcessMaps = selectAll;
