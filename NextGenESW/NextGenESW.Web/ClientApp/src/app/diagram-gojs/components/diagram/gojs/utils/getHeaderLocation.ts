import * as go from 'gojs';
import * as _ from 'lodash/fp';

import { HEADER_WIDTH } from '../consts';
import { getLanes } from './getLanes';

export type GetHeaderLocation = (
  loc: go.Point,
  diagram: go.Diagram,
  isCollapsed?: boolean
) => go.Point;

export const getLaneHeaderLocation: GetHeaderLocation = (
  loc,
  diagram,
  isLaneCollapsed
) => {
  const x = -HEADER_WIDTH;
  const viewportX = diagram.viewportBounds.x;
  const lane = getLanes(diagram)[0];
  const maxX = lane.getDocumentPoint(go.Spot.Right).x - HEADER_WIDTH;

  return new go.Point(
    isLaneCollapsed ? x : _.clamp(x, maxX)(viewportX),
    loc.y
  );
};

export const getPhaseHeaderLocation: GetHeaderLocation = (
  loc,
  diagram
) => {
  const y = -HEADER_WIDTH;
  const viewportY = diagram.viewportBounds.y;

  return new go.Point(loc.x, Math.max(y, viewportY));
};
