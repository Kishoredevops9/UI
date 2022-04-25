import * as go from 'gojs';
import * as _ from 'lodash/fp';

import { getApiForDiagram } from '../../api/getApiForDiagram';
import { ContextMenuTarget } from '../../api/types';

export const handleActionUp = _.curry((
  selectionFunction: (obj: go.Panel) => go.Part[],
  event: go.InputEvent,
  obj: go.Panel
) => {
  const { diagram, part } = obj;
  const newSelection = selectionFunction(obj);
  const api = getApiForDiagram(diagram);
  const { x, y } = part.diagram.lastInput.viewPoint;

  if (event.button === 2) {
    api.setContextMenu({
      target: obj.name as ContextMenuTarget,
      data: part.data,
      position: {
        left: x,
        top: y
      }
    });
  }

  newSelection.forEach((selectedPart: go.Part) => selectedPart.selectable = true);
  obj.diagram.selectCollection(newSelection);
});

export const handleMouseMove = (
  selectionFunction: (obj: go.Panel) => go.Part[],
  obj: go.Panel
) => {
  if (obj.diagram.toolManager.draggingTool.isActive) {
    return;
  }

  const newSelection = selectionFunction(obj);
  obj.diagram.selectCollection(newSelection);

  const tool = obj.diagram.toolManager.draggingTool;
  tool.currentPart = obj.part;
  obj.diagram.currentTool = tool;
  tool.doActivate();
};
