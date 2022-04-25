import * as go from 'gojs';
import * as _ from 'lodash/fp';

import { getDiagramMousePoint } from '../../utils/getMousePoint';
import { isLane } from '../../utils/getLanes';
import { LANE_HEADER_ADORNMENT_NAME, PHASE_HEADER_ADORNMENT_NAME } from '../../consts';
import { isLanePhase } from '../../utils/getLanePhases';
import { createReorderManager, ReorderManager } from '../../managers/reorderManager/reorderManager';
import { getApiForDiagram } from '../../api/getApiForDiagram';
import { parseLanePhaseKey } from '../../utils/getLanePhaseKey';
import { isActivityNode } from '../../utils/getActivityNodes';
import { updateEnlargedGroups } from '../../managers/updateGroupBounds/updateEnlargedGroups';
import { updateGroupBounds } from '../../managers/updateGroupBounds/updateGroupBounds';
import { getRelativeLoc } from '../../utils/getRelativeLoc';
import { GuidedDraggingTool } from './GoJSGuidedDraggingTool';
import { theme } from '../../../../../theme/theme';
import { NodeCategory } from '../../../../../types/node';
import { mapNodeDataToActivity } from '../../../../../utils/mapNodeDataToActivity';

export class DraggingTool extends go.DraggingTool {

  private reorderManager: ReorderManager;
  private prevPoint: go.Point;
  private enlargedGroups = new Set<go.Key>();
  private guidedDraggingTool: GuidedDraggingTool;

  constructor() {
    super();
    this.reorderManager = createReorderManager();
    this.guidedDraggingTool = new GuidedDraggingTool(
      this.diagram,
      {
        blacklist: [
          NodeCategory.Lane,
          NodeCategory.LanePhase,
          NodeCategory.AttentionIndicator
        ],
        lineColor: theme.colors.gojsBlue
      }
    );
    this.isCopyEnabled = false;
  }

  doActivate() {
    super.doActivate();

    if (this.diagram.model.modelData.published) {
      return super.doCancel();
    }

    this.prevPoint = this.startPoint;
    this.enlargedGroups.clear();

    if (this.isLaneOrLanePhase()) {
      return super.doCancel();
    }

    if (this.isReorderHandle()) {
      this.reorderManager.handleDragActivate(
        this.draggedParts,
        this.currentPart
      );
    }

    this.updateDraggedParts();
  }

  doDeactivate() {
    super.doDeactivate();
    this.guidedDraggingTool.doDeactivate();
  }

  doMouseMove() {
    super.doMouseMove();

    this.reorderManager.handleDragMouseMove(this.prevPoint);
    this.prevPoint = getDiagramMousePoint(this.diagram);
  }

  doMouseUp() {
    const draggedParts = this.draggedParts.copy();

    super.doMouseUp();

    const isReordering = this.reorderManager.handleDragMouseUp();
    this.updateNodesLocation(draggedParts, isReordering);
    this.enlargeGroupFinish();
    this.enlargedGroups.clear();
  }

  computeEffectiveCollection(
    parts: go.Iterable<go.Part>,
    options: go.DraggingOptions
  ): go.Map<go.Part, go.DraggingInfo> {
    let newParts;

    if (this.currentPart.name === LANE_HEADER_ADORNMENT_NAME) {
      newParts = parts.iterator.filter(isLane);
    } else if (this.currentPart.name === PHASE_HEADER_ADORNMENT_NAME) {
      newParts = parts.iterator.filter(isLanePhase);
    } else {
      newParts = parts.iterator.filter((part) =>
        !isLane(part) && !isLanePhase(part));
    }

    return super.computeEffectiveCollection(newParts, options);
  }

  doDragOver(pt: go.Point, obj: go.GraphObject) {
    this.guidedDraggingTool.doDragOver(pt, obj, this.copiedParts, this.draggedParts);
  }

  doDropOnto(pt: go.Point, obj: go.GraphObject) {
    this.guidedDraggingTool.doDropOnto(pt, obj, this.copiedParts, this.draggedParts);
  }

  onEnlargeGroup(key: go.Key) {
    this.enlargedGroups.add(key);
  }

  enlargeGroupFinish() {
    updateEnlargedGroups(this.diagram, this.enlargedGroups);
  }

  private isLaneOrLanePhase() {
    return isLane(this.currentPart) || isLanePhase(this.currentPart);
  }

  private isReorderHandle() {
    return _.includes(
      this.currentPart.name
    )([LANE_HEADER_ADORNMENT_NAME, PHASE_HEADER_ADORNMENT_NAME]);
  }

  private updateDraggedParts() {
    this.draggedParts = this.computeEffectiveCollection(
      this.draggedParts.iteratorKeys,
      this.dragOptions
    );
  }

  private updateNodesLocation(draggedParts: go.Map<go.Part, go.DraggingInfo>, isReordering: boolean) {
    const api = getApiForDiagram(this.diagram);
    draggedParts.each(({ key }) => {
      if (!isActivityNode(key.data)) {
        return;
      }
      if (!isReordering) {
        updateGroupBounds(key.containingGroup, key);
      }
      const { phaseId, swimLaneId } = parseLanePhaseKey(key.containingGroup.key as string);
      api.http.handleActivityUpdate(mapNodeDataToActivity({
        ...key.data,
        phaseId,
        swimLaneId,
        loc: this.getActivityNodeLoc(key)
      }));
    });
  }

  private getActivityNodeLoc(activityNode: go.Part): string {
    const relativeLoc = getRelativeLoc(this.diagram, activityNode.data);
    const newRelativeLoc = go.Point.parse(relativeLoc);
    if (newRelativeLoc.x === 0) {
      newRelativeLoc.x = 0.1;
    }
    if (newRelativeLoc.y === 0) {
      newRelativeLoc.y = 0.1;
    }
    return go.Point.stringify(newRelativeLoc);
  }

}
