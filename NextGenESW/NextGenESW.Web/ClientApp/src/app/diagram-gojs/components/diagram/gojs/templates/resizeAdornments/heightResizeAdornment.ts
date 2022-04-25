import * as go from 'gojs';

import { ADORNMENT_THICKNESS, getMainShape } from './utils';
import { theme } from '../../../../../theme/theme';
import { collapseBinding } from './collapseBinding';

const $ = go.GraphObject.make;

export const heightResizeAdornment = () => $(
  go.Shape,
  {
    alignment: go.Spot.Bottom,
    desiredSize: new go.Size(50, 7),
    fill: theme.colors.gojsBlue,
    stroke: theme.colors.gojsBlue,
    cursor: 'row-resize'
  },
  new go.Binding('desiredSize', '', (_, obj: go.GraphObject) => {
    const { width } = getMainShape(obj).desiredSize;
    return new go.Size(width, ADORNMENT_THICKNESS);
  }),
  collapseBinding()
);
