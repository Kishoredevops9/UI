import * as go from 'gojs';

import { NodeCategory } from '../../../../../types/node';
import { theme } from '../../../../../theme/theme';
import { MAIN_SHAPE_NAME } from '../../consts';
import { handleIndicatorClick } from './handleIndicatorClick';
import { verticalRectangleWithArrow } from '../../managers/attentionIndicator/consts';
import { SHAPE_HEIGHT, SHAPE_WIDTH } from './consts';
import { shapeOrientationBindings, textOrientationBindings, textPanelOrientationBindings } from './orientationBindings';
import { createTooltipAdornment } from '../tooltip/tooltip';
import { addHash } from '../../utils/color';

const $ = go.GraphObject.make;

const text = () => $(
  go.Panel,
  go.Panel.Vertical,
  {},
  $(
    go.TextBlock,
    {
      stretch: go.GraphObject.Fill,
      font: `${theme.fontWeight.medium} 14px ${theme.fontFamily}`,
      maxLines: 1,
      textAlign: 'center',
      overflow: go.TextBlock.OverflowEllipsis,
      desiredSize: new go.Size(SHAPE_WIDTH, SHAPE_HEIGHT - 6)
    },
    new go.Binding('text'),
    ...textOrientationBindings()
  ),
  ...textPanelOrientationBindings()
);

const shape = () => $(
  go.Shape,
  'RoundedRectangle',
  {
    geometryString: go.Geometry.fillPath(verticalRectangleWithArrow),
    name: MAIN_SHAPE_NAME,
    desiredSize: new go.Size(SHAPE_WIDTH, SHAPE_HEIGHT),
    parameter1: 4,
    fill: theme.colors.blue,
    stroke: theme.colors.grayDark,
  },
  new go.Binding('fill', 'backgroundColor', (backgroundColor) => addHash(backgroundColor) || theme.colors.blue),
  new go.Binding('stroke', 'borderColor', (borderColor) => addHash(borderColor) || theme.colors.grayDark),
  ...shapeOrientationBindings()
);

const node = (...children: go.GraphObject[]) => $(
  go.Node,
  go.Panel.Spot,
  {
    zOrder: 6,
    cursor: 'pointer',
    selectionAdorned: false,
    click: handleIndicatorClick,
    movable: false,
    selectable: false,
    isLayoutPositioned: false,
    layerName: 'Foreground'
  },
  new go.Binding('toolTip', 'text', createTooltipAdornment),
  ...children
);

export const attentionIndicatorNode = () => ({
  category: NodeCategory.AttentionIndicator,
  template: node(
    shape(),
    text(),
  )
});

