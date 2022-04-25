import { Injectable } from '@angular/core';

import { DiagramHttpService } from '../../../../../diagram-gojs/components/diagram/services/diagram-http.service';
import { HttpAction } from '../../../../../diagram-gojs/components/diagram/gojs/types';
import { LinkData, NodeData } from '../../../../../diagram-gojs/types/node';
import { Activity, ActivityGroup, Connector, Phase } from '@app/process-maps/process-maps.model';
import {
  activityBlockSelector,
  activityConnectorSelector,
  selectedProcessMapIdSelector,
  swimLaneSelector,
  phaseSelector
} from '../../../../process-maps.selectors';
import { mapNodeDataToActivity } from '../../../../../diagram-gojs/utils/mapNodeDataToActivity';
import { catchError, mergeMap, take } from 'rxjs/operators';
import * as ProcessMapsActions from "../../../../process-maps.actions";
import { Store } from '@ngrx/store';
import { ProcessMapsState } from '../../../../process-maps.reducer';
import { ProcessMapsService } from '../../../../process-maps.service';

@Injectable()
export class StepMapHttpService extends DiagramHttpService {

  constructor(
    private store: Store<ProcessMapsState>,
    private processMapsService: ProcessMapsService
  ) {
    super();
  }

  handleHttpAction(action: HttpAction) {
    switch (action.type) {
      case 'UpdateActivity':
        return this.handleUpdateActivity(action.payload);
      case 'InsertActivity':
        return this.handleInsertActivity(action.payload);
      case 'DeleteActivity':
        return this.handleDeleteActivity(action.payload);
      case 'InsertLink':
        return this.handleInsertLink(action.payload);
      case 'UpdateLink':
        return this.handleUpdateLink(action.payload);
      case 'DeleteLink':
        return this.handleDeleteLink(action.payload);
      case 'InsertSwimLane':
        return this.handleInsertSwimLane(action.payload);
      case 'UpdateSwimLane':
        return this.handleUpdateSwimLane(action.payload);
      case 'DeleteSwimLane':
        return this.handleDeleteSwimLane(action.payload);
      case 'InsertPhase':
        return this.handleInsertPhase(action.payload);
      case 'UpdatePhase':
        return this.handleUpdatePhase(action.payload);
      case 'DeletePhase':
        return this.handleDeletePhase(action.payload);
      default:
        console.log('STEP UNKNOWN ACTION', action);
        return Promise.resolve();
    }
  }

  private handleInsertActivity(nodeData: NodeData) {
    return new Promise<Activity>((resolve) => {
      const mapId$ = this.store.select(selectedProcessMapIdSelector);
      const { id: tempId, ...activity } = mapNodeDataToActivity(nodeData);

      mapId$.pipe(
        take(1),
        mergeMap(
          (mapId) => this.processMapsService.addActivity(mapId, {
              ...activity,
              processMapId: mapId
            })
        ),
        catchError((error) => {
          this.store.dispatch(ProcessMapsActions.addActivityFailure({ error }));
          return null;
        })
      ).subscribe((createdActivity: Activity) => {
        this.store.dispatch(ProcessMapsActions.addActivitySuccess({
          activity: createdActivity,
          skipsDiagramUpdate: true
        }));
        resolve(createdActivity);
      });
    });
  }

  private handleUpdateActivity(activityProperties) {
    return new Promise<Activity>((resolve) => {
      this.store.select(activityBlockSelector, activityProperties.id).pipe(
        take(1),
        mergeMap((storeActivity) => {
          const mapId = storeActivity.processMapId;
          const target = {
            ...storeActivity,
            ...activityProperties,
            processMapId: mapId,
            assetContentId: (storeActivity as any).assetContentId
          };
          return this.processMapsService.editActivity(target);
        }),
        catchError((error) => {
          this.store.dispatch(ProcessMapsActions.editActivityFailure({ error }));
          return null;
        })
      ).subscribe((updatedActivity: Activity) => {
        this.store.dispatch(ProcessMapsActions.editActivitySuccess({
          activity: updatedActivity,
          skipsDiagramUpdate: true
        }));
        resolve(updatedActivity);
      });
    });
  }

  private handleDeleteActivity(id: string) {
    return new Promise<void>((resolve) => {
      this.processMapsService.deleteProcessMapActivity(id)
        .subscribe(() => {
            this.store.dispatch(ProcessMapsActions.deleteProcessMapActivitySuccess({
              id,
              skipsDiagramUpdate: true
            }));
            resolve();
          },
          (error) => {
            this.store.dispatch(ProcessMapsActions.deleteProcessMapActivityFailure({ error }));
            resolve();
          }
        );
    });
  }

  private handleInsertLink(connector: Connector) {
    return new Promise((resolve) => {
      this.processMapsService.postActivityConnector(
        connector.activityBlockId,
        connector
      ).subscribe((result: Connector) => {
        this.store.dispatch(ProcessMapsActions.addConnectorSuccess({
          activityId: result.activityBlockId,
          connector: result,
          skipsDiagramUpdate: true
        }));
        resolve(result);
      }, (error) => {
        this.store.dispatch(ProcessMapsActions.addConnectorFailure({
          error
        }));
        resolve(null);
      });
    });
  }

  private handleDeleteLink(linkData: LinkData) {
    return new Promise<void>((resolve) => {
      this.processMapsService.deleteActivityConnector(linkData.key as number)
        .subscribe(() => {
          this.store.dispatch(ProcessMapsActions.deleteConnectorSuccess({
            activityId: linkData.to as number,
            connector: linkData.key as number,
            skipsDiagramUpdate: true
          }));
          resolve();
        }, (error) => {
          this.store.dispatch(ProcessMapsActions.deleteConnectorFailure({
            error
          }));
          resolve();
        });
    });
  }

  private handleUpdateLink(connector: Connector) {
    return new Promise<Connector>((resolve) => {
      this.store.select(activityConnectorSelector, {
        activityId: connector.activityBlockId,
        connectorId: connector.id
      }).pipe(
        take(1),
        mergeMap((storeConnector) => this.processMapsService.updateActivityConnector(
          connector.id,
          {
            ...storeConnector,
            ...connector
          }
        ))
      ).subscribe((result: Connector) => {
        this.store.dispatch(ProcessMapsActions.updateConnectorSuccess({
          activityId: connector.activityBlockId,
          connector: result,
          skipsDiagramUpdate: true
        }));
        resolve(result);
      }, (error) => {
        this.store.dispatch(ProcessMapsActions.updateConnectorFailure({
          error
        }));
        resolve(null);
      });
    });
  }

  private handleInsertSwimLane(swimLane: ActivityGroup) {
    return new Promise<ActivityGroup>((resolve) => {
      this.store.select(selectedProcessMapIdSelector).pipe(
        take(1),
        mergeMap(
          (mapId) => this.processMapsService.addGroup(mapId, swimLane)
        ),
        catchError((error) => {
          this.store.dispatch(ProcessMapsActions.addGroupFailure({ error }));
          return null;
        })
      ).subscribe((result: ActivityGroup) => {
        this.store.dispatch(ProcessMapsActions.addGroupSuccess({
          activityGroup: result,
          skipsDiagramUpdate: true
        }));
        resolve(result);
      });
    });
  }

  private handleUpdateSwimLane(updatedSwimLane: ActivityGroup) {
    updatedSwimLane.disciplineText = updatedSwimLane.name;
    return new Promise((resolve) => {
      this.store.select(swimLaneSelector, updatedSwimLane.id).pipe(
        take(1),
        mergeMap((swimLane) => this.processMapsService.updateGroup({
          ...swimLane,
          ...updatedSwimLane
        })),
        catchError((error) => {
          this.store.dispatch(ProcessMapsActions.updateProcessMapGroupFailure({ error }));
          return null;
        })
      ).subscribe((result: ActivityGroup) => {
        if (result.disciplineId === updatedSwimLane.disciplineId) {
          result.disciplineText = updatedSwimLane.disciplineText;
        }

        this.store.dispatch(ProcessMapsActions.updateProcessMapGroupSuccess({
          activityGroup: result,
          mapId: result.processMapId,
          skipsDiagramUpdate: true
        }));
        resolve(result);
      });
    });
  }

  private handleDeleteSwimLane(id: number) {
    return new Promise<void>((resolve) => {
      this.processMapsService.deleteSwimlane(id)
        .subscribe(() => {
            this.store.dispatch(ProcessMapsActions.deleteSwimlaneSuccess({
              id,
              skipsDiagramUpdate: true
            }));
            resolve();
          },
          (error) => {
            this.store.dispatch(ProcessMapsActions.deleteSwimlaneFailure({ error }));
            resolve();
          }
        );
    });
  }

  private handleInsertPhase(phaseData: Partial<Phase>) {
    return new Promise<Phase>((resolve) => {
      this.store.select(selectedProcessMapIdSelector).pipe(
        take(1),
        mergeMap((mapId) => {
          const { name, caption, sequenceNumber } = phaseData;
          return this.processMapsService.createProcessMapPhase({
            name,
            caption,
            sequenceNumber,
            processMapId: mapId
          });
        }),
        catchError((error) => {
          this.store.dispatch(ProcessMapsActions.addPhaseFailure({ error }));
          return null;
        })
      ).subscribe((phase: Phase) => {
        this.store.dispatch(ProcessMapsActions.addPhaseSuccess({
          phase,
          skipsDiagramUpdate: true
        }));
        resolve(phase);
      });
    });
  }

  private handleUpdatePhase(phase: Phase) {
    return new Promise<Phase>((resolve) => {
      this.store.select(phaseSelector, phase.id)
        .pipe(
          take(1),
          mergeMap((currentPhase) => this.processMapsService
            .updateProcessMapPhase({
              ...currentPhase,
              ...phase
            })
          ),
          catchError((error) => {
            this.store.dispatch(ProcessMapsActions.updatePhaseFailure(error));
            return null;
          })
        )
        .subscribe((savedPhase: Phase) => {
          this.store.dispatch(ProcessMapsActions.updatePhaseSuccess({
            phase: savedPhase,
            skipsDiagramUpdate: true
          }));
        });
      resolve(phase);
    });
  }

  private handleDeletePhase(id: number) {
    return new Promise<void>((resolve) => {
      this.processMapsService.deleteProcessMapPhase(id)
        .subscribe(() => {
            this.store.dispatch(ProcessMapsActions.deletePhaseSuccess({
              id,
              skipsDiagramUpdate: true
            }));
            resolve();
          },
          (error) => {
            this.store.dispatch(ProcessMapsActions.deletePhaseFailure({ error }));
            resolve();
          }
        );
    });
  }

}
