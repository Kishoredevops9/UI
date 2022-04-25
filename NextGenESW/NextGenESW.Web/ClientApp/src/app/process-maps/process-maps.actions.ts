import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { ProcessMap, Activity, EditActivityGroup, ActivityGroup, ProcessMapMetaData, ActivityMeta, Connector, Phase } from './process-maps.model';


//Load Maps
export const loadProcessMaps = createAction(
  '[ProcessMaps Load Component] Load ProcessMaps'
);

export const loadProcessMapsSuccess = createAction(
  '[ProcessMaps Effect] Load ProcessMaps Success',
  props<{ processMaps: ProcessMap[] }>()
);

export const loadProcessMapsFailure = createAction(
  '[ProcessMaps Effect] Load ProcessMaps Failure',
  props<{ error: any }>()
);

//Load Particular Map
export const loadProcessMap = createAction(
  '[ProcessMap Load Component] Load ProcessMap',
  props<{ id: number }>()
);

export const loadProcessMapSuccess = createAction(
  '[ProcessMap Effect] Load ProcessMap Success',
  props<{ selectedProcessMap: ProcessMap }>()
);

export const loadProcessMapFailure = createAction(
  '[ProcessMap Effect] Load ProcessMap Failure',
  props<{ error: any }>()
);


//Add Process Map
export const addProcessMap = createAction(
  '[ProcessMap Add Component] Add ProcessMaps',
  props<{ processMap: ProcessMap }>()
);

export const addProcessMapSuccess = createAction(
  '[ProcessMap Effect] Add ProcessMap Success',
  props<{ processMap: ProcessMap }>()
);

export const addProcessMapFailure = createAction(
  '[ProcessMaps Effect] Add ProcessMap Failure',
  props<{ error: any }>()
);

//Add Activity to Map
export const addActivity = createAction(
  '[ProcessMap Add Component] Add Activity',
  props<{ mapId:number , activity: Activity }>()
);

export const addActivitySuccess = createAction(
  '[ProcessMap Effect] Add Activity Success',
  props<{
    activity: Activity,
    skipsDiagramUpdate?: boolean
  }>()
);

export const addActivityFailure = createAction(
  '[ProcessMaps Effect] Add Activity Failure',
  props<{ error: any }>()
);

//Edit Activity to Map
export const editActivity = createAction(
  '[ProcessMapActivity Edit Component] Update ProcessMapActivity',
  props<{ activity: Update<Activity> }>()
);
export const editActivitySuccess = createAction(
  '[ProcessMapActivity Edit Component] Update ProcessMapActivity Success',
  props<{
    activity: Activity,
    skipsDiagramUpdate?: boolean
  }>()
)
export const editActivityFailure = createAction(
  '[ProcessMapActivity Edit Component] Update ProcessMapActivity Failed',
  props<{ error: any }>()
);

//Edit Swimlane to Map
export const updateMapGroup = createAction(
  '[ProcessMapActivity Edit Component] Update ProcessMapGroup',
  props<{ group: Update<ActivityGroup> }>()
);
export const updateMapGroupSuccess = createAction(
  '[ProcessMapActivity Edit Component] Update ProcessMapGroup Success',
  props<{
    group: ActivityGroup,
    skipsDiagramUpdate?: boolean
  }>()
)
export const updateMapGroupFailure = createAction(
  '[ProcessMapActivity Edit Component] Update ProcessMapGroup Failed',
  props<{ error: any }>()
);


//Delete Process Map
export const deleteProcessMap = createAction(
  '[ProcessMap Delete Component] Delete ProcessMap',
  props<{ id: string }>()
);

export const deleteProcessMapSuccess = createAction(
  '[ProcessMap Effect] Delete ProcessMap Success',
  props<{ id: string }>()
);

export const deleteProcessMapFailure = createAction(
  '[ProcessMap Effect] Delete ProcessMap Failure',
  props<{ error: any }>()
);

//Copy Process Map from Existing
export const copyProcessMap = createAction(
  '[ProcessMap Delete Component] Copy ProcessMap',
  props<{ id: string }>()
);

export const copyProcessMapSuccess = createAction(
  '[ProcessMap Effect] Copy ProcessMap Success',
  props<{ processMap: ProcessMap }>()
);

export const copyProcessMapFailure = createAction(
  '[ProcessMap Effect] Copy ProcessMap Failure',
  props<{ error: any }>()
);


//Delete Process Map Activity
export const deleteProcessMapActivity = createAction(
  '[ProcessMap Delete Component] Delete ProcessMapActivity',
  props<{ id: string }>()
);

export const deleteProcessMapActivitySuccess = createAction(
  '[ProcessMap Effect] Delete ProcessMapActivity Success',
  props<{
    id: string,
    skipsDiagramUpdate?: boolean
  }>()
);

export const deleteProcessMapActivityFailure = createAction(
  '[ProcessMap Effect] Delete ProcessMapActivity Failure',
  props<{ error: any }>()
);

//Update Process Map
export const updateProcessMap = createAction(
  '[ProcessMaps Edit Component] Update ProcessMap',
  props<{ processMap: Update<ProcessMap> }>()
);
export const updateProcessMapSuccess = createAction(
  '[ProcessMapActivity Edit Component] Update ProcessMap Success',
  props<{ processMap: Update<ProcessMap> }>()
)

export const updateProcessMapFailure = createAction(
  '[ProcessMaps Edit Component] Update ProcessMap'
)

//Update Process Map Activity
export const updateProcessMapActivity = createAction(
  '[ProcessMapActivity Edit Component] Update ProcessMapActivity',
  props<{ activity: Update<Activity> }>()
);
export const updateProcessMapActivityFailure = createAction(
  '[ProcessMapActivity Edit Component] Update ProcessMapActivity Failed'
)
export const updateProcessMapActivitySuccess = createAction(
  '[ProcessMapActivity Edit Component] Update ProcessMapActivity Success',
  props<{ activity: Activity }>()
)

//Add  Group to Process Map
export const addGroup = createAction(
  '[ProcessMap Add Component] Add Group',
  props<{ mapId:number , activityGroup: ActivityGroup }>()
);

export const addGroupSuccess = createAction(
  '[ProcessMap Effect] Add Group Success',
  props<{
    activityGroup: ActivityGroup,
    skipsDiagramUpdate?: boolean
  }>()
);

export const addGroupFailure = createAction(
  '[ProcessMaps Effect] Add Group Failure',
  props<{ error: any }>()
);

//Update Group to Process Map
export const updateProcessMapGroup = createAction(
  '[ProcessMapGroup Edit Component] Update ProcessMapGroup',
  props<{
    mapId:number,
    activityGroup: Update<ActivityGroup>
  }>()
);

export const updateProcessMapGroupSuccess = createAction(
  '[ProcessMapGroup Edit Component] Update  ProcessMapGroup Success',
  props<{
    mapId:number,
    activityGroup: ActivityGroup,
    skipsDiagramUpdate?: boolean
  }>()
);

export const updateProcessMapGroupFailure = createAction(
  '[ProcessMapGroup Edit Component] Update  ProcessMapGroup Failed',
  props<{ error: any }>()
);

//Update Groups to Process Map
export const updateProcessMapGroups = createAction(
  '[ProcessMapGroup Edit Component] Update ProcessMapGroups',
  props<{mapId:number, activityGroups: Update<ActivityGroup[]>}>()
);
export const updateProcessMapGroupsSuccess = createAction(
  '[ProcessMapGroup Edit Component] Update  ProcessMapGroups Success',
  props<{mapId:number, activityGroups: ActivityGroup[] }>()
)
export const updateProcessMapGroupsFailure = createAction(
  '[ProcessMapGroup Edit Component] Update  ProcessMapGroups Failed'
)

//Delete Group to Process Map
export const deleteProcessMapGroup = createAction(
  '[ProcessMap Delete Component] Delete ProcessMapGroup',
  props<{ mapId:number , groupId: number }>()
);

//Delete Swimalne to Process Map
export const deleteProcessMapGroupSuccess = createAction(
  '[ProcessMap Effect] Delete ProcessMapGroup Success',
  props<{ id: any }>()
);

export const deleteSwimlaneFailure = createAction(
  '[ProcessMap Effect] Delete ProcessMapGroup Failure',
  props<{ error: any }>()
);

export const deleteSwimlane = createAction(
  '[ProcessMap Delete Component] Delete ProcessMapGroup',
  props<{ id: number }>()
);

export const deleteSwimlaneSuccess = createAction(
  '[ProcessMap Effect] Delete ProcessMapGroup Success',
  props<{
    id: number,
    skipsDiagramUpdate?: boolean
  }>()
);

export const deleteProcessMapGroupFailure = createAction(
  '[ProcessMap Effect] Delete ProcessMapGroup Failure',
  props<{ error: any }>()
);


//Add Meta Data to Process Map
export const addProcessMapMetaData = createAction(
  '[ProcessMap Add Component] Add ProcessMapMetaData',
  props<{ mapId:number , processMapMetaData: ProcessMapMetaData }>()
);

export const addProcessMapMetaDataSuccess = createAction(
  '[ProcessMap Effect] Add ProcessMapMetaData Success',
  props<{ processMapMetaData: ProcessMapMetaData }>()
);

export const addProcessMapMetaFailure = createAction(
  '[ProcessMaps Effect] Add ProcessMapMetaData Failure',
  props<{ error: any }>()
);


//Delete Group to Process Map
export const deleteProcessMapMetaData = createAction(
  '[ProcessMap Delete Component] Delete ProcessMapMetaData',
  props<{ mapId:number , metaDataId: number }>()
);

export const deleteProcessMapMetaDataSuccess = createAction(
  '[ProcessMap Effect] Delete ProcessMapMetaData Success',
  props<{ id: any }>()
);

export const deleteProcessMapMetaDataFailure = createAction(
  '[ProcessMap Effect] Delete ProcessMapMetaData Failure',
  props<{ error: any }>()
);



//Add Meta Data to Activites
export const addActivitiesMetaData = createAction(
  '[ProcessMap Add Component] Add ActivitiesMetaData',
  props<{ activityId:number , activityMeta: ActivityMeta }>()
);

export const addActivitiesMetaDataSuccess = createAction(
  '[ProcessMap Effect] Add ActivitiesMetaData Success',
  props<{ activityId:number, activityMeta: ActivityMeta }>()
);

export const addActivitiesMetaDataFailure = createAction(
  '[ProcessMaps Effect] Add ActivitiesMetaData Failure',
  props<{ error: any }>()
);


//Delete MetaData to Activites
export const deleteActivitiesMetaData = createAction(
  '[ProcessMap Delete Component] Delete ActivitiesMetaData',
  props<{ activityId:number , activityMeta: number }>()
);

export const deleteActivitiesMetaDataSuccess = createAction(
  '[ProcessMap Effect] Delete ActivitiesMetaData Success',
  props<{activityId:number, activityMeta: number }>()
);

export const deleteActivitiesMetaDataFailure = createAction(
  '[ProcessMap Effect] Delete ActivitiesMetaData Failure',
  props<{ error: any }>()
);


export const clearProcessMapss = createAction(
  '[ProcessMaps/API] Clear ProcessMapss'
);

//Add Connector to Activites
export const addConnector = createAction(
  '[ProcessMap Add Component] Add Connector',
  props<{
    activityId: number,
    connector: Connector
  }>()
);

export const addConnectorSuccess = createAction(
  '[ProcessMap Effect] Add Connector Success',
  props<{
    activityId: number,
    connector: Connector,
    skipsDiagramUpdate?: boolean
  }>()
);

export const addConnectorFailure = createAction(
  '[ProcessMaps Effect] Add Connector Failure',
  props<{ error: any }>()
);

//Delete Connector to Activites
export const deleteConnector = createAction(
  '[ProcessMap Delete Component] Delete Connector',
  props<{ activityId:number , connector: number }>()
);

export const deleteConnectorSuccess = createAction(
  '[ProcessMap Effect] Delete Connector Success',
  props<{
    activityId:number,
    connector: number,
    skipsDiagramUpdate?: boolean
  }>()
);

export const deleteConnectorFailure = createAction(
  '[ProcessMap Effect] Delete Connector Failure',
  props<{ error: any }>()
);

// Add Phase
export const addPhase = createAction(
  '[ProcessMap Effect] Add Phase',
  props<{ phase: Partial<Phase> }>()
);

export const addPhaseSuccess = createAction(
  '[ProcessMap Effect] Add Phase Success',
  props<{
    phase: Phase,
    skipsDiagramUpdate?: boolean
  }>()
);

export const addPhaseFailure = createAction(
  '[ProcessMap Effect] Add Phase Failure',
  props<{ error: any }>()
);

// Delete phase

export const deletePhase = createAction(
  '[ProcessMap Effect] Delete Phase',
  props<{
    id: number
  }>()
);

export const deletePhaseSuccess = createAction(
  '[ProcessMap Effect] Delete Phase Success',
  props<{
    id: number,
    skipsDiagramUpdate?: boolean
  }>()
);

export const deletePhaseFailure = createAction(
  '[ProcessMap Effect] Delete Phase Failure',
  props<{ error }>()
);

// Update phase
export const updatePhase = createAction(
  '[ProcessMap Effect] Update Phase',
  props<{ phase: Partial<Phase> }>()
);

export const updatePhaseSuccess = createAction(
  '[ProcessMap Effect] Update Phase Success',
  props<{
    phase: Phase,
    skipsDiagramUpdate?: boolean
  }>()
);

export const updatePhaseFailure = createAction(
  '[ProcessMap Effect] Update Phase Failure',
  props<{ error: any }>()
);

// Update connector

export const updateConnector = createAction(
  '[ProcessMap Effect] Update Connector',
  props<{
    activityId: number,
    connector: Connector
  }>()
);

export const updateConnectorSuccess = createAction(
  '[ProcessMap Effect] Update Connector Success',
  props<{
    activityId: number,
    connector: Connector,
    skipsDiagramUpdate?: boolean;
  }>()
);

export const updateConnectorFailure = createAction(
  '[ProcessMap Effect] Update Connector Failure',
  props<{ error }>()
);

export const setSelectedProcessMapId = createAction(
  '[ProcessMap] Set selected process map id',
  props<{ id: number }>()
);
