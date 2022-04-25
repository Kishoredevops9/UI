import * as go from 'gojs';
import { IndicatorShape } from '../../../../../types/node';
import { calculateDimensions } from './calculateDimensions';

export const getIndicatorOrientation = (
  node: go.Node,
): IndicatorShape => {
  const { x, y, maxH, maxV, minV } = calculateDimensions(node);

  if (y <= minV){
    return IndicatorShape.Top;
  } else if (y >= maxV) {
    return IndicatorShape.Bottom;
  } else if (x >= maxH) {
    return IndicatorShape.Right;
  } else {
    return IndicatorShape.Left;
  }
};
