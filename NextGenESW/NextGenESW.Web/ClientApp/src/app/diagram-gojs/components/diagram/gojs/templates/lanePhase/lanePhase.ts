import * as go from 'gojs';

import { NodeCategory } from '../../../../../types/node';
import { locationBinding } from '../shared/bindings/locationBinding';
import { HEADER_WIDTH, MAIN_SHAPE_NAME } from '../../consts';
import { desiredSizeBinding } from '../bindings/desiredSizeBinding';
import { lanePhaseResizeAdornment } from '../resizeAdornments/lanePhaseResizeAdornment';
import { addNodesToGroup } from '../../utils/addNodesToGroup';
import { theme } from '../../../../../theme/theme';
import { contextMenu } from '../shared/contextMenu';
import { collapseBindings } from './collapseBindings';
import { collapseSizeBinding } from './collapseSizeBinding';
import { addHash } from '../../utils/color';
import { borderStyleBinding } from '../shared/bindings/borderStyleBinding';

const $ = go.GraphObject.make;

const { transparent, lightBlue, grayLight } = theme.colors;

const fillBinding = () => new go.Binding(
  'fill',
  'isPhaseCollapsed',
  (isPhaseCollapsed) => isPhaseCollapsed ? grayLight : transparent
);

const borderColorBinding = () => new go.Binding(
  'stroke',
  'borderColor',
  (borderColor) => borderColor ? addHash(borderColor) : theme.colors.lightBlue
);

const background = () => $(
  go.Shape,
  {
    name: MAIN_SHAPE_NAME,
    minSize: new go.Size(HEADER_WIDTH, HEADER_WIDTH),
    fill: transparent,
    stroke: lightBlue
  },
  fillBinding(),
  borderColorBinding(),
  borderStyleBinding(),
  desiredSizeBinding(go.Size.parse, collapseSizeBinding),
  ...collapseBindings(),
);

const group = (...children: go.GraphObject[]) => $(
  go.Group,
  go.Group.Spot,
  {
    name: 'phase-group',
    background: transparent,
    resizeAdornmentTemplate: lanePhaseResizeAdornment(),
    resizeObjectName: MAIN_SHAPE_NAME,
    resizable: true,
    mouseDrop: addNodesToGroup,
    contextMenu: contextMenu(),
    deletable: false,
    movable: false,
  },
  ...children,
  locationBinding(),
  new go.Binding('resizable', 'published', (published) => !published).ofModel(),
);

export const lanePhase = () => ({
  category: NodeCategory.LanePhase,
  template: group(
    background()
  )
});
