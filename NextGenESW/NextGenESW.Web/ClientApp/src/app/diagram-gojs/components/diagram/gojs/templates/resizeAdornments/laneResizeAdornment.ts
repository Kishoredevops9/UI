import * as go from 'gojs';

import { heightResizeAdornment } from './heightResizeAdornment';
import { widthResizeAdornment } from '@app/diagram-gojs/components/diagram/gojs/templates/resizeAdornments/widthResizeAdornment';

const $ = go.GraphObject.make;

export const laneResizeAdornment = () =>  $(
  go.Adornment,
  go.Adornment.Spot,
  $(go.Placeholder),
  heightResizeAdornment(),
  widthResizeAdornment()
);
