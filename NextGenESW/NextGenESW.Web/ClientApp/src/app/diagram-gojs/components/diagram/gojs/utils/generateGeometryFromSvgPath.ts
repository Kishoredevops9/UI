import * as _ from 'lodash/fp';
import * as go from 'gojs';

export const generateGeometryFromSvgPath = (path: string) => _.flowRight(
  go.Geometry.parse,
  go.Geometry.fillPath,
)(path);
