import * as go from 'gojs';
import { animate } from '../../utils/animate';

export const handleIndicatorClick = (
  _: go.InputEvent,
  obj: go.Node
) => {
  const node = obj.diagram.findNodeForKey(obj.data.originalNodeKey);
  const {
    x: nodeX,
    y: nodeY,
    width: nodeWidth,
    height: nodeHeight
  } = node.actualBounds;
  const {
    width: viewportWidth,
    height: viewportHeight
  } = obj.diagram.viewportBounds;
  const centerPoint = new go.Point(
    nodeX - viewportWidth / 2 + nodeWidth / 2,
    nodeY - viewportHeight / 2 + nodeHeight / 2
  );

  obj.diagram.select(node);
  animate(
    [[obj.diagram, 'position', obj.diagram.position, centerPoint]],
    obj.diagram.animationManager.duration
  );
};
