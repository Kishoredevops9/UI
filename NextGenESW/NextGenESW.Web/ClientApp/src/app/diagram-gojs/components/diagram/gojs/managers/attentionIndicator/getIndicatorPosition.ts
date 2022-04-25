import * as go from 'gojs';
import { IndicatorShape } from '../../../../../types/node';
import { calculateDimensions } from './calculateDimensions';

export const getIndicatorPosition = (
  node: go.Node,
  orientation: IndicatorShape
): go.Point => {
  const { x, y, maxH, maxV, minH, minV } = calculateDimensions(node);

  const getPositionTop = () => {
    if (x > maxH) {
      return new go.Point(maxH, minV);
    }
    if (x < minH) {
      return new go.Point(minH, minV);
    }
    return new go.Point(x, minV);
  };

  const getPositionBottom = () => {
    if (x > maxH) {
      return new go.Point(maxH, maxV);
    }
    if (x < minH) {
      return new go.Point(minH, maxV);
    }
    return new go.Point(x, maxV);
  };

  const getPositionLeft = () => new go.Point(
    minH,
    y > maxV ? maxV : (y <= minV ? minV : y),
  );

  const getPositionRight = () => new go.Point(
    maxH,
    y > maxV ? maxV : (y <= minV ? minV : y),
  );

  if (orientation === IndicatorShape.Top) {
    return getPositionTop();
  }

  if (orientation === IndicatorShape.Bottom) {
    return getPositionBottom();
  }

  if (orientation === IndicatorShape.Left) {
    return getPositionLeft();
  }

  return getPositionRight();

};
