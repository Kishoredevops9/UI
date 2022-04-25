import * as _ from 'lodash/fp';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { mergeMap, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { DiagramDialogBoxService } from '../../../diagram-gojs/components/diagram/services/diagram-dialog-box.service';
import { ConfirmDialogComponent } from '../../../shared/component/confirm-dialog/confirm-dialog.component';
import * as DialogBoxAction from '../../../diagram-gojs/components/diagram/gojs/types';
import { AddConnectorComponent } from '../../add-connector/add-connector.component';
import { GroupModifyComponent } from '../../group-modify/group-modify.component';
import { PhaseAddComponent } from '../../phase-add/phase-add.component';
import { NodeData } from '../../../diagram-gojs/types/node';
import { Phase } from '../../process-maps.model';
import { selectedProcessMapSelector } from '../../process-maps.selectors';
import { ActivityAddComponent } from '../../activity-add/activity-add.component';
import { mapActivityToNodeData } from '../../../diagram-gojs/components/diagram/gojs/utils/mapActivityToNodeData';

@Injectable()
export class ProcessMapEditDialogService extends DiagramDialogBoxService {

  constructor(
    private dialog: MatDialog,
    private store: Store
  ) {
    super();
  }

  handleDialogBoxRequest(action) {
    switch (action.type) {
      case 'InsertActivity':
        return this.handleInsertActivity(action);
      case 'UpdateActivity':
        return this.handleUpdateActivity(action);
      case 'InsertPhase':
        return this.handleInsertPhase();
      case 'UpdatePhase':
        return this.handleUpdatePhase(action);
      case 'InsertSwimLane':
        return this.handleInsertSwimLane();
      case 'UpdateSwimLane':
        return this.handleUpdateSwimLane(action);
      case 'InsertLink':
        return this.handleInsertLink();
      case 'UpdateLink':
        return this.handleUpdateLink(action);
      case 'ConfirmDelete':
        return this.handleConfirmDelete();
      default:
        return Promise.resolve({});
    }
  }

  private getProcessMap() {
    return this.store.select(selectedProcessMapSelector);
  }

  private handleInsertActivity(action: DialogBoxAction.InsertActivityDialogBoxAction) {
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

  private handleUpdateActivity(action: DialogBoxAction.UpdateActivityDialogBoxAction) {
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

  private handleUpdatePhase(action: DialogBoxAction.UpdatePhaseDialogBoxAction) {
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

  private handleInsertSwimLane() {
    return new Promise<any>((resolve) => {
      const dialogRef = this.dialog.open(GroupModifyComponent, {
        width: '35%',
        data: {},
      });

      dialogRef.afterClosed()
        .pipe(take(1))
        .subscribe((result) => {
          resolve(result);
        });
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

  private handleUpdateSwimLane(action: DialogBoxAction.UpdateSwimLaneDialogBoxAction) {
    return new Promise((resolve) => {
      const {
        name, description, backgroundColor, borderColor, borderStyle, borderWidth
      } = action.payload;
      const dialogRef = this.dialog.open(GroupModifyComponent, {
        width: '35%',
        data: {
          name, description, backgroundColor,
          borderColor, borderStyle, borderWidth
        },
      });

      dialogRef.afterClosed()
        .pipe(take(1))
        .subscribe((result) => {
          resolve(result);
        });
    });
  }

  private handleInsertLink() {
    return new Promise((resolve) => {
      const dialogRef = this.dialog.open(AddConnectorComponent, {
        width: '35%',
        data: {
          isNew: true
        }
      });

      dialogRef.afterClosed()
        .pipe(take(1))
        .subscribe((result) => {
          resolve(result)
        });
    })
  }

  private handleUpdateLink(action: DialogBoxAction.UpdateLinkDialogBoxAction) {
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
        .subscribe((result) => {
          resolve(result)
        });
    });
  }

}
