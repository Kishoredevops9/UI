import * as go from 'gojs';

import { NodeCategory } from '../../../../../types/node';
import { locationBinding } from '../shared/bindings/locationBinding';
import { theme } from '../../../../../theme/theme';
import { HEADER_WIDTH, MAIN_SHAPE_NAME} from '../../consts';
import { desiredSizeBinding } from '../bindings/desiredSizeBinding';
import { enlargeOtherLanes } from './enlargeOtherLanes';
import { contextMenu } from '../shared/contextMenu';
import { LanePhasesLayout } from '../../layouts/LanePhasesLayout';
import { laneResizeAdornment } from '../resizeAdornments/laneResizeAdornment';
import { collapseBinding } from './collapseBinding';
import { addHash } from '../../utils/color';
import { borderStyleBinding } from '../shared/bindings/borderStyleBinding';

const $ = go.GraphObject.make;

const backgroundColorBinding = () => new go.Binding(
  'fill',
  'backgroundColor',
  (backgroundColor) => backgroundColor
    ? addHash(backgroundColor)
    : theme.colors.white
);

const borderColorBinding = () => new go.Binding(
  'stroke',
  'borderColor',
  (borderColor) => borderColor
    ? addHash(borderColor)
    : theme.colors.lightBlue
);

const strokeWidthBinding = () => new go.Binding(
  'strokeWidth',
  'borderWidth',
  (borderWidth) => (borderWidth || 1) - 1
);

const background = () => $(
  go.Shape,
  {
    minSize: new go.Size(HEADER_WIDTH, HEADER_WIDTH),
    name: MAIN_SHAPE_NAME,
    fill: theme.colors.white,
    stroke: theme.colors.lightBlue,
    shadowVisible: true
  },
  desiredSizeBinding(
    enlargeOtherLanes,
    (desiredSize, { size, isLaneCollapsed }) => isLaneCollapsed
        ? go.Size.stringify(new go.Size(desiredSize.width, go.Size.parse(size).height))
        : go.Size.stringify(desiredSize)
  ),
  strokeWidthBinding(),
  collapseBinding(),
  borderColorBinding(),
  borderStyleBinding(),
  backgroundColorBinding()
);

const group = (...children: go.GraphObject[]) => $(
  go.Group,
  go.Group.Spot,
  {
    background: theme.colors.transparent,
    layout: new LanePhasesLayout(),
    minLocation: new go.Point(NaN, -Infinity),
    maxLocation: new go.Point(NaN, Infinity),
    contextMenu: contextMenu(),
    resizeAdornmentTemplate: laneResizeAdornment(),
    resizeObjectName: MAIN_SHAPE_NAME,
    resizable: true,
    deletable: false,
  },
  ...children,
  locationBinding(),
  new go.Binding('resizable', 'published', (published) => !published)
    .ofModel(),
);

export const lane = () => ({
  category: NodeCategory.Lane,
  template: group(
    background()
  )
});
