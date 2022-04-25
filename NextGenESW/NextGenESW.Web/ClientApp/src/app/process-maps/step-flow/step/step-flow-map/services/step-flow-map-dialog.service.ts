import { Injectable } from '@angular/core';
import * as _ from 'lodash/fp';

import { DiagramDialogBoxService } from '../../../../../diagram-gojs/components/diagram/services/diagram-dialog-box.service';
import { DialogBoxAction, UpdateActivityDialogBoxAction } from '../../../../../diagram-gojs/components/diagram/gojs/types';
import { ConfirmDialogComponent } from '../../../../../shared/component/confirm-dialog/confirm-dialog.component';
import { mergeMap, take } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { AddConnectorComponent } from '../../../../add-connector/add-connector.component';
import { NodeData } from '../../../../../diagram-gojs/types/node';
import { ActivityAddComponent } from '../../../../activity-add/activity-add.component';
import { mapActivityToNodeData } from '../../../../../diagram-gojs/components/diagram/gojs/utils/mapActivityToNodeData';
import { selectedProcessMapSelector } from '../../../../process-maps.selectors';
import { Store } from '@ngrx/store';
import { GroupModifyComponent } from '../../../../group-modify/group-modify.component';
import { mapNodeDataToActivity } from '../../../../../diagram-gojs/utils/mapNodeDataToActivity';
import { Phase } from '../../../../process-maps.model';
import { PhaseAddComponent } from '../../../../phase-add/phase-add.component';
import { AddStepPopupComponent } from '../../../add-step-popup/add-step-popup.component';

@Injectable()
export class StepFlowMapDialogService extends DiagramDialogBoxService {

  constructor(
    private dialog: MatDialog,
    private store: Store
  ) {
    super();
  }

  handleDialogBoxRequest(action: DialogBoxAction) {
    switch (action.type) {
      case 'InsertActivity':
        return this.handleInsertActivity(action);
      case 'UpdateActivity':
        return this.handleUpdateActivity(action);
      case 'InsertLink':
        return this.handleInsertLink();
      case 'UpdateLink':
        return this.handleUpdateLink(action);
      case 'UpdateSwimLane':
        return this.handleUpdateSwimLane(action);
      case 'ConfirmDelete':
        return this.handleConfirmDelete();
      case 'InsertPhase':
        return this.handleInsertPhase();
      case 'UpdatePhase':
        return this.handleUpdatePhase(action);
      default:
        console.log('STEP FLOW UNKNOWN DIALOG', action);
        return Promise.resolve(null);
    }
  }

  private getProcessMap() {
    return this.store.select(selectedProcessMapSelector);
  }

  private defaultInsertActivityDialog(action) {
    return new Promise<NodeData>((resolve) => {
      const { activityTypeId, swimLaneId } = action.payload;
      this.getProcessMap()
        .pipe(
          take(1),
          mergeMap((processMap) => {
            const dialogRef = this.dialog.open(ActivityAddComponent, {
              width: '35%',
              data: {
                activityTypeId: activityTypeId,
                autofill: true,
                model: processMap,
                processMapId: processMap.id,
                groupId: swimLaneId,
                swimLaneId: swimLaneId,
                editShapedata: {},
                editShapeMap: {},
                isMapView: true
              }
            });

            return dialogRef.afterClosed();
          })
        ).subscribe((result) => resolve(
        result
          ? mapActivityToNodeData(action.payload, result)
          : result
      ));
    });
  }

  private stepInsertDialog(action) {
    return new Promise<NodeData>((resolve) => {
      this.getProcessMap()
        .pipe(
          take(1),
          mergeMap((processMap) => {
            const dialogRef = this.dialog.open(AddStepPopupComponent, {
              data: {
                ..._.omit(['id'])(mapNodeDataToActivity(action.payload)),
                processMapId: processMap.id,
                isMapView: true
              }
            });

            return dialogRef.afterClosed();
          })
        )
        .subscribe((result) => resolve(
          result
            ? mapActivityToNodeData({ ...action.payload, id: result.id }, result)
            : result
        ));
    });
  }

  private handleInsertActivity(action) {
    switch (action.payload.activityTypeId) {
      case 8:
        return this.stepInsertDialog(action);
      default:
        return this.defaultInsertActivityDialog(action);
    }
  }

  private handleUpdateActivity(action) {
    return this.handleUpdateOtherActivities(action);
  }

  private handleUpdateOtherActivities(action) {
    return new Promise<NodeData>((resolve) => {
      this.getProcessMap()
        .pipe(
          take(1),
          mergeMap((processMap) => {
            const { activityTypeId, swimLaneId } = action.payload;
            const dialogRef = this.dialog.open(ActivityAddComponent, {
              width: '35%',
              data: {
                activityTypeId: activityTypeId,
                autofill: true,
                model: processMap,
                processMapId: processMap.id,
                groupId: swimLaneId,
                swimLaneId: swimLaneId,
                editShapedata: {
                  id: action.payload.key,
                  ..._.omit(['key'])(action.payload)
                },
                editShapeMap: {},
                isMapView: true
              },
            });
            return dialogRef.afterClosed();
          })
        ).subscribe((result) => {
          resolve(result ? mapActivityToNodeData(action.payload, result) : result);
        });
    });
  }

  private handleInsertLink() {
    return new Promise((resolve) => {
      const dialogRef = this.dialog.open(AddConnectorComponent, {
        width: '35%',
        data: { isNew: true }
      });

      dialogRef.afterClosed()
        .pipe(take(1))
        .subscribe((result) => resolve(result));
    });
  }

  private handleUpdateLink(action) {
    return new Promise((resolve) => {
      const { label, toLabel, fromLabel } = action.payload;
      const dialogRef = this.dialog.open(AddConnectorComponent, {
        width: '35%',
        data: {
          isNew: false,
          captionMiddle: label,
          captionStart: fromLabel,
          captionEnd: toLabel
        }
      });

      dialogRef.afterClosed()
        .pipe(take(1))
        .subscribe((result) => resolve(result));
    });
  }

  private handleUpdateSwimLane(action) {
    return new Promise((resolve) => {
      const data = _.pick([
        'name',
        'description',
        'borderColor',
        'borderStyle',
        'borderWidth'
      ])(action.payload);
      data.color = action.payload.backgroundColor;

      const dialogRef = this.dialog.open(GroupModifyComponent, {
        width: '35%',
        data: {
          ...data,
          isStepFlow: true,
          isStep: false,
        }
      });

      dialogRef.afterClosed()
        .pipe(take(1))
        .subscribe((result) => resolve(result));
    });
  }

  private handleConfirmDelete() {
    return new Promise<boolean>((resolve) => {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        maxWidth: '500px',
        data: {
          title: 'DELETE?',
          message: 'Are you sure you want to remove?'
        }
      });

      dialogRef.afterClosed()
        .pipe(take(1))
        .subscribe((result) => {
          resolve(result);
        });
    });
  }

  private handleInsertPhase() {
    return new Promise<Phase>((resolve) => {
      const dialogRef = this.dialog.open(PhaseAddComponent, {
        width: '35%',
        data: {},
      });

      dialogRef.afterClosed()
        .pipe(take(1))
        .subscribe((result) => resolve(result));
    });
  }

  private handleUpdatePhase(action) {
    return new Promise<Phase>((resolve) => {
      const { payload: { name, caption } } = action;
      const dialogRef = this.dialog.open(PhaseAddComponent, {
        width: '35%',
        data: {
          name,
          caption
        },
      });

      dialogRef.afterClosed()
        .pipe(take(1))
        .subscribe((result) => resolve(result));
    });
  }

}
