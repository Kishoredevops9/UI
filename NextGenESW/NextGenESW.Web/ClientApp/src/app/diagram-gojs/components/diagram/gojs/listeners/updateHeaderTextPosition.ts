import * as go from 'gojs';
import * as _ from 'lodash/fp';

import { HEADER_TEXT_NAME, LANE_HEADER_ADORNMENT_NAME } from '../consts';

const getEdges = (xAxis: boolean, adornment: go.Adornment) => {
  const {
    left: viewportLeft,
    right: viewportRight,
    top: viewportTop,
    bottom: viewportBottom
  } = adornment.diagram.viewportBounds;
  const { right, left, top, bottom } = adornment.actualBounds;
  const headerFirstEdge = xAxis
    ? Math.max(viewportLeft, left)
    : Math.max(viewportTop, top);
  const headerSecondEdge = xAxis
    ? Math.min(viewportRight, right)
    : Math.min(viewportBottom, bottom);
  const offset = xAxis ? viewportLeft - left : viewportTop - top;

  return {
    headerFirstEdge,
    headerSecondEdge,
    offset
  };
};

const isLaneHeaderAndCollapsed = (adornment: go.Adornment) =>
  adornment.name === LANE_HEADER_ADORNMENT_NAME && adornment.adornedPart.data.isLaneCollapsed;

export const updateHeaderTextPosition = (
  adornment: go.Adornment,
  xAxis: boolean = true
) => {
  const text = adornment.findObject(HEADER_TEXT_NAME) as go.TextBlock;
  const ensuredXAxis = isLaneHeaderAndCollapsed(adornment) ? !xAxis : xAxis;
  adornment.ensureBounds();

  const { headerFirstEdge, headerSecondEdge, offset } = getEdges(ensuredXAxis, adornment);
  const headerWidth = headerSecondEdge - headerFirstEdge;

  if (_.isNaN(headerWidth) || headerWidth < 0) {
    return;
  }

  text.desiredSize = new go.Size(headerWidth, text.height);
  text.alignment = new go.Spot(
    ensuredXAxis ? 0 : 1,
    .5,
    Math.max(offset, 0) * (ensuredXAxis ? 1 : -1)
  );
  text.textAlign = isLaneHeaderAndCollapsed(adornment) ? 'left' : 'center';
  text.margin = new go.Margin(0, 0, 0, isLaneHeaderAndCollapsed(adornment) ? 10 : 0);
};
