import * as go from 'gojs';

import { isLane } from '../utils/getLanes';
import { laneResize } from '../managers/resize/lanesResize';
import { lanePhaseResize } from '../managers/resize/lanePhaseResize';
import { getLastLanePhase, isLanePhase } from '../utils/getLanePhases';
import { computeLanePhaseMinSize } from '../managers/resize/computeLanePhaseMinSize';
import { computeLaneMinSize } from '../managers/resize/computeLaneMinSize';
import { getApiForDiagram } from '../api/getApiForDiagram';
import { parseLanePhaseKey } from '../utils/getLanePhaseKey';

export class ResizingTool extends go.ResizingTool {

  resize(newRect: go.Rect) {
    if (isLanePhase(this.adornedObject.part)) {
      lanePhaseResize(newRect, this.adornedObject);
    }
    if (isLane(this.adornedObject.part)) {
      laneResize(newRect, this.adornedObject);
    }
    super.resize(newRect);
  }

  doMouseUp() {
    const part = this.adornedObject.part;
    if (isLanePhase(part)) {
      this.afterLanePhaseResized(part);
    }
    if (isLane(part)) {
      this.afterSwimLaneResized(part);
    }

    super.doMouseUp();
  }

  computeMinSize(): go.Size {
    const { part } = this.adornedObject;
    let minSize = super.computeMinSize();

    if (part instanceof go.Group) {
      minSize = this.computeGroupMinSize(part, minSize);
    }

    return minSize;
  }

  computeReshape() {
    return true;
  }

  private computeGroupMinSize(part: go.Group, minSize: go.Size): go.Size {
    let groupMinSize = minSize.copy();

    if (isLane(part)) {
      groupMinSize = computeLaneMinSize(groupMinSize, part);
    }

    if (isLanePhase(part)) {
      groupMinSize = computeLanePhaseMinSize(groupMinSize, part);
    }

    return groupMinSize;
  }

  private afterLanePhaseResized(part: go.Part) {
    this.updateApi(part);
    this.updateApi(part.containingGroup);
  }

  private afterSwimLaneResized(part: go.Part) {
    this.updateApi(part);
    this.updateApi(getLastLanePhase(part as go.Group));
  }

  private updateApi(part: go.Part) {
    const { width, height } = part.actualBounds;
    const newSize = go.Size.stringify(
      new go.Size(width, height)
    );
    const api = getApiForDiagram(this.diagram);

    if (isLane(part)) {
      api.http.handleSwimLaneUpdate({ id: part.key as number, size: newSize });
    }
    if (isLanePhase(part)) {
      const { phaseId } = parseLanePhaseKey(part.key as string);
      api.http.handlePhaseUpdate({ id: phaseId, size: newSize });
    }
  }

}
