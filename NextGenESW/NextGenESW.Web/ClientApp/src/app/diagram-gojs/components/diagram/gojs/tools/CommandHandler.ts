import * as go from 'gojs';

import { createDeleteManager, DeleteManager } from '../managers/deleteManager/deleteManager';
import { HEADER_WIDTH } from '../consts';
import { isLane } from '../utils/getLanes';
import { isLanePhase } from '../utils/getLanePhases';
import { getApiForDiagram } from '../api/getApiForDiagram';

export class CommandHandler extends go.CommandHandler {

  deleteManager: DeleteManager;

  copiesGroupKey = true;

  constructor() {
    super();

    this.deleteManager = createDeleteManager();
  }

  async deleteSelection() {
    if (this.diagram.model.modelData.published) {
      return;
    }

    const canDelete = this.deleteManager.validateGroupsToDelete(this.diagram.selection);
    if (!canDelete) {
      this.showSelectionCannotBeDeleted();
      return;
    }

    const shouldDelete = await this.deleteManager.openConfirmDeleteDialog(
      this.diagram
    );

    if (!shouldDelete) {
      return;
    }

    this.deleteManager.beforeDeleteSelection(this.diagram);
    super.deleteSelection();
    this.deleteManager.afterDeleteSelection(this.diagram);
  }

  zoomToFit() {
    const { width, height } = this.diagram.viewportBounds;
    const startRect = new go.Rect(-HEADER_WIDTH, -HEADER_WIDTH, width, height);
    this.diagram.centerRect(startRect);
    super.zoomToFit();
  }

  copySelection() {
    this.diagram.selectCollection(
      this.diagram.selection.filter((part: go.Part) => !isLane(part) && !isLanePhase(part))
    );
    super.copySelection();
  }

  private showSelectionCannotBeDeleted() {
    getApiForDiagram(this.diagram).showSnackBar('Cannot delete non-empty groups');
  }

}
