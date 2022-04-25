import * as go from 'gojs';

import { NodeCategory, NodeType } from '../../../../types/node';
import { baseBackground } from './shared/baseBackground';
import { theme } from '../../../../theme/theme';
import { baseNode } from './shared/baseNode';

const $ = go.GraphObject.make;

const textBinding = () => new go.Binding('text', 'type',
  (type) => type === NodeType.Start
    ? 'Start'
    : 'End'
);

const text = () => $(
  go.TextBlock,
  {
    font: `${theme.fontWeight.semiBold} 16px ${theme.fontFamily}`,
    stroke: theme.colors.grayDark,
    verticalAlignment: go.Spot.Center,
    alignment: new go.Spot(0.5, 0.5, 0, 2)
  },
  textBinding()
);

export const edgeNode = () => ({
  category: NodeCategory.EdgeNode,
  template: baseNode(
    {},
    baseBackground({}),
    text()
  )
});
