import * as go from 'gojs';

import { NodeData } from '../../../../../types/node';
import { getApiForDiagram } from '../../api/getApiForDiagram';
import { ContextMenuTarget, DiagramApi} from '../../api/types';

const $ = go.GraphObject.make;

const showForDiagram = (api: DiagramApi, diagram: go.Diagram) => {
  const { x, y } = diagram.lastInput.viewPoint;
  api.setContextMenu({
    target: 'Diagram',
    position: {
      left: x,
      top: y
    }
  });
};

export const showForNode = (
  api: DiagramApi,
  obj: go.GraphObject,
  diagram: go.Diagram
) => {
  const part = obj.part;
  const { x, y } = diagram.lastInput.viewPoint;
  api.setContextMenu({
    target: part.category as ContextMenuTarget,
    data: part.data as NodeData,
    position: {
      left: x,
      top: y
    }
  });
};

const showForLink = (
  api: DiagramApi,
  obj: go.GraphObject,
  diagram: go.Diagram
) => {
  const part = obj.part;
  const { x, y } = diagram.lastInput.viewPoint;
  api.setContextMenu({
    target: 'Link',
    data: part.data as NodeData,
    position: {
      left: x,
      top: y
    }
  });
};

export const contextMenu = () => $(
  go.HTMLInfo,
  {
    show: (obj: go.GraphObject, diagram: go.Diagram) => {
      const api = getApiForDiagram(diagram);
      if (!obj) {
        showForDiagram(api, diagram);
        return;
      }

      if (obj instanceof go.Link) {
        showForLink(api, obj, diagram);
        return;
      }

      showForNode(api, obj, diagram);
    }
  }
);
