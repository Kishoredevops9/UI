import * as _ from 'lodash/fp';

export const calculatePoint = (
  shapeMin: number,
  shapeMax: number,
  point: number,
  size: number
) => _.clamp(shapeMin, shapeMax - size - 1)(point)
