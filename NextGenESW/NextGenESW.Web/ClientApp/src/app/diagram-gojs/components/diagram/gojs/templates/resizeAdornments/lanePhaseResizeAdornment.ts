import * as go from 'gojs';

import { widthResizeAdornment } from './widthResizeAdornment';
import { heightResizeAdornment } from './heightResizeAdornment';

const $ = go.GraphObject.make;

export const lanePhaseResizeAdornment = () =>  $(
  go.Adornment,
  go.Adornment.Spot,
  $(go.Placeholder),
  widthResizeAdornment(),
  heightResizeAdornment()
);
