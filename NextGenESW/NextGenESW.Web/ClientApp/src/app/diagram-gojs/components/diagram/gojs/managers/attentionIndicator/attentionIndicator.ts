import * as go from 'gojs';

import { getIndicatorOrientation } from './getIndicatorOrientation';
import { indicatorMargin } from './consts';
import { NodeCategory } from '../../../../../types/node';
import { getIndicatorPosition } from './getIndicatorPosition';
import { isPartInViewport } from './isPartInViewport';

export const addIndicatorForNode = (node: go.Node) => {
  const diagram = node.diagram;
  const orientation = getIndicatorOrientation(node);
  const { key, backgroundColor, borderColor, borderStyle, text } = node.data;

  diagram.model.addNodeData({
    category: NodeCategory.AttentionIndicator,
    orientation,
    originalNodeKey: key,
    backgroundColor,
    borderColor,
    borderStyle,
    text
  });
  const indicator = diagram
    .findNodesByExample({ originalNodeKey: key })
    .first();
  indicator.move(diagram.transformViewToDoc(getIndicatorPosition(
    node,
    orientation
  )));
};

export const removeIndicatorForNode = (node: go.Node) => {
  const diagram = node.diagram;
  const indicators = getFilteredIndicators(diagram, node);

  diagram.removeParts(indicators, false);
};

export const getFilteredIndicators = (
  diagram: go.Diagram,
  node: go.Node
) => diagram
  .findNodesByExample({ category: NodeCategory.AttentionIndicator })
  .filter(({ data }) => data.originalNodeKey === node.data.key);

export const getNodeIndicator = (
  diagram: go.Diagram,
  node: go.Node
) => getFilteredIndicators(diagram, node).first();

export const hasIndicator = (diagram: go.Diagram, node: go.Node) =>
  !!getNodeIndicator(diagram, node);

export const updateIndicator = (diagram: go.Diagram, node: go.Node) => {
  const indicator = getNodeIndicator(diagram, node);
  const orientation = getIndicatorOrientation(node);
  const newPosition = getIndicatorPosition(node, orientation);
  diagram.transformViewToDoc(newPosition);
  indicator.move(diagram.transformViewToDoc(newPosition));
  diagram.model.set(
    indicator.data,
    'orientation',
    orientation
  );
};

export const updateNodeIndicators = (
  diagram: go.Diagram,
  nodes: go.Node[]
) => {
  nodes.forEach((node: go.Node) => {
    const isInViewport = isPartInViewport(node, indicatorMargin);
    const nodeHasIndicator = hasIndicator(diagram, node);
    const { isPinned } = node.data;
    if (isPinned && nodeHasIndicator && !isInViewport) {
      updateIndicator(diagram, node);
    } else if (isPinned && !isInViewport) {
      addIndicatorForNode(node);
    } else if ((isInViewport && nodeHasIndicator) || !isPinned) {
      removeIndicatorForNode(node);
    }
  });
};
