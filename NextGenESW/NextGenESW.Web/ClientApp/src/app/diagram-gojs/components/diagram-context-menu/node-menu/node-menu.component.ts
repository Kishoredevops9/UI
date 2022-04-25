import { ChangeDetectorRef, Component, Input, Optional } from '@angular/core';

import { mapNodeTypeToActivityTypeId } from '../../diagram/gojs/utils/mapNodeTypeToActivityTypeId';
import { ProcessMapsService } from '../../../../process-maps/process-maps.service';
import { BaseContextMenuComponent } from '../base-context-menu.component';
import { NodeType } from '../../../types/node';
import { MatDialog } from '@angular/material/dialog';
import { StepMapDialogComponent } from '@app/task-creation/task-creation-details/task-tab-five-content/step-map-dialog/step-map-dialog.component';
import { TaskExecutionMapDataService } from '../../../../process-maps/task-execution-map/services/task-execution-map-data.service';
import { DiagramDataService } from '../../diagram/diagram-data.service';

@Component({
  selector: 'app-node-menu',
  templateUrl: './node-menu.component.html'
})
export class NodeMenuComponent extends BaseContextMenuComponent {

  stepActivityTypeId = mapNodeTypeToActivityTypeId(NodeType.Step);

  @Input()
  linksVisibility: boolean;

  constructor(
    changeDetector: ChangeDetectorRef,
    private processMapsService: ProcessMapsService,
    public dialog: MatDialog,
    @Optional() private taskExecutionService: TaskExecutionMapDataService,
    @Optional() private diagramDataService: DiagramDataService
  ) {
    super(changeDetector);
  }

  onPinShapeClick() {
    this.diagramApi.togglePinShape(
      this.model.data
    );
  }

  onTraceShapeClick() {
    this.diagramApi.toggleTraceShape(
      this.model.data
    );
  }

  onDeleteClick() {
    this.diagramApi.deleteNodeByKey(
      this.model.data.key
    );
  }

  onAddShapeClick() {
    this.diagramApi.insertShapeBelow(
      this.model.data
    );
  }

  onPropertiesClick() {
    this.diagramApi.showPropertiesForExistingNode(
      this.model.data
    );
  }

  onSubMapOpen() {
    window.open('/process-maps/edit/' + this.model.data.subProcessMapId, '_blank');
  }

  onStepOpen() {
    if (!this.model.data.assetContentId) {
      console.error('Cannot open STEP - the node is missing assetContentId');
      return;
    }

    if (this.taskExecution) {
      this.openStepInDialog();
    } else {
      window.open(`/view-document/SP/${this.model.data.assetContentId}`, '_self');
    }
  }

  onNodeSelectionToggleClick() {
    this.diagramApi.toggleNodeSelection(
      this.model.data
    );
  }

  private openStepInDialog() {
    const id = this.model.data.assetContentId;
    const { contentId: stepFlowContentId } = this.diagramDataService
      .getCurrentProcessMap() as any;

    const activityStatusMap = this.taskExecutionService
      ? this.taskExecutionService.getCurrentActivityStatusMap()
      : {};
    const taskExecutionStep = this.taskExecutionService
      ? this.taskExecutionService.getStepTaskExecution(stepFlowContentId, String(id))
      : {};

    this.dialog.open(StepMapDialogComponent, {
      width: '80vw',
      height: '80vh',
      data: {
        name: this.model.data.name,
        contentId: this.model.data.assetContentId,
        activityStatusMap,
        taskExecutionStep
      }
    });
  }

}
