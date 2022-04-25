// import { ActivityMeta } from './../../../server/src/api/service/activity.service';
import { ProcessMapsService } from './process-maps.service';
import { Router } from '@angular/router';
import { mergeMap, catchError, map, tap, concatMap, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, of } from 'rxjs';
import * as fromActions from './process-maps.actions';
import { ProcessMap, ActivityGroup, ProcessMapMetaData } from './process-maps.model';
import { Update } from '@ngrx/entity';

@Injectable()
export class ProcessMapsEffects {

  constructor(
    private actions$: Actions,
    private router: Router,
    private ProcessMapsService: ProcessMapsService
  ) { }

  // Load a single Process Map by a given id
  loadProcessMap$ = createEffect(() => this.actions$.pipe(
    ofType(fromActions.loadProcessMap),
    mergeMap(({ id }) => this.ProcessMapsService.getProcessMap(id)),
    map((processMap) =>
      fromActions.loadProcessMapSuccess({
        selectedProcessMap: processMap
      })
    ),
    catchError((error) => of(fromActions.loadProcessMapFailure({ error })))
  ));

  //Loads all Process Map from database
  loadProcessMaps$ = createEffect(() =>
    this.actions$.pipe(ofType(fromActions.loadProcessMaps),
      mergeMap(() =>
        this.ProcessMapsService.getProcessMaps().pipe(
          map(processMaps => fromActions.loadProcessMapsSuccess({ processMaps })),
          catchError(error => of(fromActions.loadProcessMapsFailure({ error }))
          )
        ))
    )
  )

  //Add Process Map
  addProcessMap$ = createEffect(() =>
    this.actions$.pipe(ofType(fromActions.addProcessMap),
      mergeMap(action =>
        this.ProcessMapsService.addProcessMap(action.processMap).pipe(
          map(processMap => {
            this.router.navigate(['/process-maps/edit/' + processMap.id]);
            return fromActions.addProcessMapSuccess({
              processMap
            })
          }),
          catchError(error => of(fromActions.addProcessMapFailure({ error }))
          )
        )),
    )
  )

  //Copy Process Map from Existing
  copyProcessMap$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.copyProcessMap),
      mergeMap(action =>
        this.ProcessMapsService.copyProcessMap(action.id).pipe(
          map((processMap) => {
            this.router.navigate(['/process-maps/edit/' + processMap.id]);
            return fromActions.copyProcessMapSuccess({ processMap })
          }),
          catchError(error => of(fromActions.copyProcessMapFailure({ error }))
          )
        ))
    )
  )

  //Update Process Map

  UpdateProcessMap$ = createEffect(() =>
    this.actions$.pipe(ofType(fromActions.updateProcessMap),
      switchMap(action =>
        this.ProcessMapsService.editProcessMap(
          action.processMap.id,
          action.processMap.changes
        )
          .pipe(map((processMap) => {
            const update: Update<ProcessMap> = {
              id: processMap.id,
              changes: processMap
            }
            return fromActions.updateProcessMapSuccess({ processMap: update })
          })
          )
      )
    )
  )

  //Add Activity
  addActivity$ = createEffect(() =>
    this.actions$.pipe(ofType(fromActions.addActivity),
      mergeMap(action =>
        this.ProcessMapsService.addActivity(action.mapId, action.activity).pipe(
          map(activity => {
            return fromActions.addActivitySuccess({
              activity
            })
          }),
          catchError(error => of(fromActions.addActivityFailure({ error }))
          )
        )),
    )
  )
    //Edit Activity
editActivity$ = createEffect(() =>
this.actions$.pipe(ofType(fromActions.editActivity),
  mergeMap(action =>
    this.ProcessMapsService.editActivity(action.activity)
      .pipe(map(activity => {
        return fromActions.editActivitySuccess({
          activity
        })
      }),
      catchError(error => of(fromActions.addActivityFailure({ error }))
      )
        )),
    )
  )

  //Add Group
  addGroup$ = createEffect(() =>
    this.actions$.pipe(ofType(fromActions.addGroup),
      mergeMap(action =>
        this.ProcessMapsService.addGroup(action.mapId, action.activityGroup).pipe(
          map(activityGroup => {
            return fromActions.addGroupSuccess({
              activityGroup
            })
          }),
          catchError(error => of(fromActions.addGroupFailure({ error }))
          )
        ))
    )
  )

  //Edit Swimlane
  updateMapGroup$ = createEffect(() =>
  this.actions$.pipe(ofType(fromActions.updateMapGroup),
    mergeMap(action =>
      this.ProcessMapsService.updateMapGroup(action.group)
        .pipe(map(group => {
          return fromActions.updateMapGroupSuccess({
            group
          })
        }),
        catchError(error => of(fromActions.updateMapGroupFailure({ error }))
        )
          )),
      )
    )

  //Update the Group to Process Map
  updateProcessMapGroup$ = createEffect(() =>
    this.actions$.pipe(ofType(fromActions.updateProcessMapGroup),
      switchMap(action => {
        return this.ProcessMapsService.editProcessMapGroup(
          action.mapId,
          action.activityGroup.id,
          action.activityGroup.changes)
          .pipe(map((activityGroup) => fromActions.updateProcessMapGroupSuccess({ mapId: action.mapId, activityGroup: activityGroup }))
          )
      }
      )
    )
  )

  //Update the activity Group information
  updateProcessMapGroups$ = createEffect(() =>
    this.actions$.pipe(ofType(fromActions.updateProcessMapGroups),
      switchMap(action => {
        return this.ProcessMapsService.editProcessMapGroups(
          action.mapId,
          action.activityGroups.changes)
          .pipe(map((activityGroups) => fromActions.updateProcessMapGroupsSuccess({ mapId: action.mapId, activityGroups: activityGroups }))
          )
      }
      )
    )
  )
  //Delete Process Map Group
  deleteProcessMapGroup$ = createEffect(() =>
    this.actions$.pipe(ofType(fromActions.deleteProcessMapGroup),
      mergeMap(action =>
        this.ProcessMapsService.deleteProcessMapGroup(action.mapId, action.groupId).pipe(
          map(activityGroup => {
            return fromActions.deleteProcessMapGroupSuccess({
              id: action.groupId
            })
          }),
          catchError(error => of(fromActions.deleteProcessMapGroupFailure({ error }))
          )
        ))
    )
  )

   //Delete Swimalane to Process Map Group
   deleteSwimlane$ = createEffect(() =>
   this.actions$.pipe(ofType(fromActions.deleteSwimlane),
     mergeMap(action =>
       this.ProcessMapsService.deleteSwimlane(action.id).pipe(
         map(activityGroup => {
           return fromActions.deleteSwimlaneSuccess({
             id: action.id
           })
         }),
         catchError(error => of(fromActions.deleteSwimlaneFailure({ error }))
         )
       ))
   )
 )

  // //Update Activity
  // UpdateProcessMapActivity$ = createEffect(() =>
  //   this.actions$.pipe(ofType(fromActions.updateProcessMapActivity),
  //     switchMap(action =>
  //       this.ProcessMapsService.editProcessMapActvity(
  //         action.activity.id,
  //         action.activity.changes
  //       )
  //         .pipe(map((activity) => fromActions.updateProcessMapActivitySuccess({ activity: activity }))
  //         )
  //     )
  //   )
  // )

  //Delete Process Map
  deleteProcessMap$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.deleteProcessMap),
      mergeMap(action =>
        this.ProcessMapsService.deleteProcessMap(action.id).pipe(
          map(() => fromActions.deleteProcessMapSuccess({ id: action.id })),
          catchError(error => of(fromActions.deleteProcessMapFailure({ error }))
          )
        ))
    )
  )

  //Delete Process Map Activity
  deleteProcessMapActivity$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.deleteProcessMapActivity),
      mergeMap(action =>
        this.ProcessMapsService.deleteProcessMapActivity(action.id).pipe(
          map(() => fromActions.deleteProcessMapActivitySuccess({ id: action.id })),
          catchError(error => of(fromActions.deleteProcessMapActivityFailure({ error }))
          )
        ))
    )
  )

  //Add Process Map Meta Data
  addProcessMapMetaData$ = createEffect(() =>
    this.actions$.pipe(ofType(fromActions.addProcessMapMetaData),
      mergeMap(action =>
        this.ProcessMapsService.addProcessMapMetaData(action.mapId, action.processMapMetaData).pipe(
          map(processMapMetaData => {
            return fromActions.addProcessMapMetaDataSuccess({
              processMapMetaData
            })
          }),
          catchError(error => of(fromActions.addProcessMapMetaFailure({ error }))
          )
        ))
    )
  )

  //Delete Process Map Meta Data
  deleteProcessMapMetaData$ = createEffect(() =>
    this.actions$.pipe(ofType(fromActions.deleteProcessMapMetaData),
      mergeMap(action =>
        this.ProcessMapsService.deleteProcessMapMetaData(action.mapId, action.metaDataId).pipe(
          map(activityGroup => {
            return fromActions.deleteProcessMapMetaDataSuccess({
              id: action.metaDataId
            })
          }),
          catchError(error => of(fromActions.deleteProcessMapMetaDataFailure({ error }))
          )
        ))
    )
  )
  //Add Activities Meta Data

  addActivitiesMetaData$ = createEffect(() =>
    this.actions$.pipe(ofType(fromActions.addActivitiesMetaData),
      mergeMap(action =>
        this.ProcessMapsService.addActivitiesMetaData(action.activityId, action.activityMeta).pipe(
          map(activityMeta => {
            return fromActions.addActivitiesMetaDataSuccess({
              activityId: action.activityId,
              activityMeta: activityMeta

            })
          }),
          catchError(error => of(fromActions.addActivitiesMetaDataFailure({ error }))
          )
        ))
    )
  )

  //Delete Activity Metadata
  deleteActivitiesMetaData$ = createEffect(() =>
    this.actions$.pipe(ofType(fromActions.deleteActivitiesMetaData),
      mergeMap(action =>
        this.ProcessMapsService.deleteActivitiesMetaData(action.activityId, action.activityMeta).pipe(
          map(() => {
            return fromActions.deleteActivitiesMetaDataSuccess({
              activityId: action.activityId,
              activityMeta: action.activityMeta
            })
          }),
          catchError(error => of(fromActions.deleteActivitiesMetaDataFailure({ error }))
          )
        ))
    )
  )

  //Add Connector
  addConnector$ = createEffect(() =>
    this.actions$.pipe(ofType(fromActions.addConnector),
      mergeMap(action =>
        this.ProcessMapsService.postActivityConnector(action.activityId, action.connector).pipe(
          map(connector => {
            return fromActions.addConnectorSuccess({
              activityId: action.activityId,
              connector: connector
            })
          }),
          catchError(error => of(fromActions.addGroupFailure({ error }))
          )
        ))
    )
  )

  //Update Connector
  updateConnector$ = createEffect(() =>
    this.actions$.pipe(ofType(fromActions.updateProcessMapGroup),
      switchMap(action => {
        return this.ProcessMapsService.editProcessMapGroup(
          action.mapId,
          action.activityGroup.id,
          action.activityGroup.changes)
          .pipe(map((activityGroup) => fromActions.updateProcessMapGroupSuccess({ mapId: action.mapId, activityGroup: activityGroup }))
          )
      }
      )
    )
  )

  //Delete Connector
  deleteConnector$ = createEffect(() =>
    this.actions$.pipe(ofType(fromActions.deleteConnector),
      mergeMap(action =>
        this.ProcessMapsService.deleteActivityConnector(action.connector).pipe(
          map(connector => {
            return fromActions.deleteConnectorSuccess({
              activityId: action.activityId,
              connector: action.connector
            })
          }),
          catchError(error => of(fromActions.deleteProcessMapGroupFailure({ error }))
          )
        ))
    )
  )

  addPhase$ = createEffect(() => this.actions$.pipe(
    ofType(fromActions.addPhase),
    mergeMap(({ phase }) => this.ProcessMapsService.createProcessMapPhase(phase)),
    map((phase) => fromActions.addPhaseSuccess({
      phase
    })),
    catchError((error) => of(fromActions.addPhaseFailure({ error })))
  ));

  deletePhase$ = createEffect(() => this.actions$.pipe(
    ofType(fromActions.deletePhase),
    mergeMap(({ id }) => this.ProcessMapsService.deleteProcessMapPhase(id).pipe(
        map(() => fromActions.deletePhaseSuccess({ id })),
        catchError(() => of(fromActions.deletePhaseFailure))
      )
    )
  ));

  updatePhase$ = createEffect(() => this.actions$.pipe(
    ofType(fromActions.updatePhase),
    mergeMap(({ phase }) => this.ProcessMapsService.updateProcessMapPhase(phase)),
    map((phase) => fromActions.updatePhaseSuccess({
      phase
    })),
    catchError((error) => of(fromActions.updatePhaseFailure({ error })))
  ));

}
