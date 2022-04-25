import { Component, Input } from '@angular/core';

import { NodeType } from '../../../types/node';
import { mapNodeTypeToLabel } from '../../diagram/gojs/utils/mapNodeTypeToLabel';
import { BaseContextMenuComponent } from '../base-context-menu.component';
import { PaletteItem } from '../../../types/palette';

@Component({
  selector: 'app-lane-phase-menu',
  templateUrl: './lane-phase-menu.component.html'
})
export class LanePhaseMenuComponent extends BaseContextMenuComponent {

  @Input()
  set paletteItems(paletteItems: PaletteItem[]) {
    this.shapes = paletteItems.map(({ type }) => type);
    this.shapeNames = this.shapes.reduce((result, shape) => ({ ...result, [shape]: mapNodeTypeToLabel(shape)}), {});
  }

  shapes = [];

  shapeNames: Record<string, string> = {};

  onAddShapeClick(nodeType: NodeType) {
    this.diagramApi.insertShape(
      nodeType,
      this.model.position,
      this.model.data.key
    );
  }

}
