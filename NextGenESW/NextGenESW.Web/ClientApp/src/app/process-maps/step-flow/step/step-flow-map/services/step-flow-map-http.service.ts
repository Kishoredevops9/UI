import { Injectable } from '@angular/core';
import * as _ from 'lodash/fp';
import { catchError, map, mergeMap, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { DiagramHttpService } from '../../../../../diagram-gojs/components/diagram/services/diagram-http.service';
import { HttpAction } from '../../../../../diagram-gojs/components/diagram/gojs/types';
import { LinkData, NodeData, NodeType } from '../../../../../diagram-gojs/types/node';
import { Activity, ActivityGroup, Connector, Phase } from '../../../../process-maps.model';
import {
  activityBlockSelector,
  activityConnectorSelector,
  selectedProcessMapIdSelector,
  swimLaneSelector,
  phaseSelector,
  selectedProcessMapSelector
} from '../../../../process-maps.selectors';
import { mapNodeDataToActivity } from '../../../../../diagram-gojs/utils/mapNodeDataToActivity';
import * as ProcessMapsActions from '../../../../process-maps.actions';
import { ProcessMapsState } from '../../../../process-maps.reducer';
import { ProcessMapsService } from '../../../../process-maps.service';
import { mapActivityTypeIdToNodeType } from '../../../../../diagram-gojs/components/diagram/gojs/utils/mapActivityTypeIdToNodeType';

@Injectable()
export class StepFlowMapHttpService extends DiagramHttpService {

  processMap;

  constructor(
    private store: Store<ProcessMapsState>,
    private processMapsService: ProcessMapsService
  ) {
    super();
  }

  setProcessMap(processMap) {
    this.processMap = processMap;
  }

  handleHttpAction(action: HttpAction) {
    const result = this.handleAction(action);
    return result;
  }

  private handleAction(action: HttpAction) {
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
      case 'UpdateSwimLane':
        return this.handleUpdateSwimLane(action.payload);
      case 'InsertPhase':
        return this.handleInsertPhase(action.payload);
      case 'UpdatePhase':
        return this.handleUpdatePhase(action.payload);
      case 'DeletePhase':
        return this.handleDeletePhase(action.payload);
      default:
        console.log('STEP FLOW UNKNOWN ACTION', action);
        return Promise.resolve();
    }
  }

  private handleInsertActivity(nodeData: NodeData) {
    if (nodeData.type === NodeType.Step) {
      return this.handleInsertStep(nodeData);
    }

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

  private handleInsertStep(nodeData: NodeData) {
    const activity = mapNodeDataToActivity(nodeData);
    this.store.dispatch(ProcessMapsActions.addActivitySuccess({
      activity: activity,
      skipsDiagramUpdate: true
    }));

    return new Promise((resolve) => {
      this.store.select(activityBlockSelector, activity.id).pipe(
        take(1),
        mergeMap((storeActivity) => {
          const mapId = storeActivity.processMapId;
          return this.processMapsService.editActivity({
            ...storeActivity,
            ...activity,
            processMapId: mapId
          });
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
      resolve(nodeData);
    });
  }

  private handleUpdateActivity(activityProperties) {
    return new Promise<Activity>((resolve) => {
      const activity = mapNodeDataToActivity(activityProperties);
      this.store.select(activityBlockSelector, activity.id).pipe(
        take(1),
        mergeMap((storeActivity) => {
          const mapId = storeActivity.processMapId;
          return this.processMapsService.editActivity({
            ...storeActivity,
            ...activity,
            processMapId: mapId
          });
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

  private async handleDeleteActivity(id) {
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

  private handleUpdateSwimLane(updatedSwimLane: ActivityGroup) {
    return new Promise((resolve) => {
      this.store.select(swimLaneSelector, updatedSwimLane.id).pipe(
        take(1),
        mergeMap((swimLane) => {
          const updateGroup = _.omit([
            'disciplineId',
            'disciplineText'
          ])({
            ...swimLane,
            ...updatedSwimLane
          });

          return this.processMapsService.updateGroup(updateGroup);
        }),
        catchError((error) => {
          this.store.dispatch(ProcessMapsActions.updateProcessMapGroupFailure({ error }));
          return null;
        })
      ).subscribe((result: ActivityGroup) => {
        this.store.dispatch(ProcessMapsActions.updateProcessMapGroupSuccess({
          activityGroup: {
            ...result,
            name: updatedSwimLane.name
          },
          mapId: result.processMapId,
          skipsDiagramUpdate: true
        }));
        resolve(result);
      });
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

  private findNodeDataById(nodeId: number) {
    return this.store.select(selectedProcessMapSelector)
    .pipe(
      take(1),
      map((processMap) => {
        const node = processMap.activityBlocks.find(
          (node) => node.id === nodeId
        );
        return node;
      })
    )
    .toPromise();
  }

  private async isStep(nodeId: number) {
    const node = await this.findNodeDataById(nodeId);
    const nodeType = mapActivityTypeIdToNodeType(node.activityTypeId);
    return nodeType === NodeType.Step;
  }


}
