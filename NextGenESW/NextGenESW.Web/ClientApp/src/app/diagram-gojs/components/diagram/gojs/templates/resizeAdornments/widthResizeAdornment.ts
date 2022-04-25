import * as go from 'gojs';
import { theme } from '../../../../../theme/theme';
import { ADORNMENT_THICKNESS, getMainShape } from './utils';
import { collapseBinding } from './collapseBinding';

const $ = go.GraphObject.make;

export const widthResizeAdornment = () => $(
  go.Shape,
  {
    alignment: go.Spot.Right,
    fill: theme.colors.gojsBlue,
    stroke: theme.colors.gojsBlue,
    cursor: 'col-resize'
  },
  new go.Binding('desiredSize', '', (_, obj: go.GraphObject) => {
    const { height } = getMainShape(obj).desiredSize;
    return new go.Size(ADORNMENT_THICKNESS, height);
  }),
  collapseBinding()
);
