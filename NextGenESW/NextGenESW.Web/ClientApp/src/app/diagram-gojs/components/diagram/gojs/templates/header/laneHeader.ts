import * as go from 'gojs';
import { header } from './header';
import { getLaneHeaderLocation } from '../../utils/getHeaderLocation';
import { HEADER_WIDTH, LANE_HEADER_ADORNMENT_NAME, LANE_HEADER_NAME } from '../../consts';
import { theme } from '../../../../../theme/theme';
import { addHash } from '../../utils/color';

const $ = go.GraphObject.make;

const locationBinding = () => new go.Binding(
  'location',
  'loc',
  (loc: string, obj: go.Adornment) =>
    getLaneHeaderLocation(go.Point.parse(loc), obj.diagram, obj.part.data.isLaneCollapsed)
);

const sizeBinding = () => new go.Binding(
  'desiredSize',
  'size',
  (size: string, obj: go.Panel) => {
    const { isLaneCollapsed } = obj.part.data;
    const { height, width } = go.Size.parse(size);

    return isLaneCollapsed
      ? new go.Size(width + HEADER_WIDTH, HEADER_WIDTH)
      : new go.Size(height, HEADER_WIDTH);
  }
);

const zOrderBinding = () =>
  new go.Binding('zOrder', 'isLaneCollapsed', (isLaneCollapsed) => isLaneCollapsed ? 1 : 4);

const selectionFunction = (obj: go.Panel) =>
  [(obj.part as go.Adornment).adornedPart];

const backgroundBinding = () => new go.Binding(
  'fill',
  'backgroundColor',
  (backgroundColor) => backgroundColor ? addHash(backgroundColor) : theme.colors.white
);

const borderColorBinding = () => new go.Binding(
  'stroke',
  'borderColor',
  (borderColor) => borderColor ? addHash(borderColor) : theme.colors.lightBlue
);

const borderWidthBinding = () => new go.Binding(
  'strokeWidth',
  'borderWidth',
  (borderWidth) => borderWidth || 1
);

const laneHeader = (visible = true) => header({
  headerProperties: {
    alignment: go.Spot.TopLeft,
    alignmentFocus: go.Spot.TopCenter,
    angle: 270,
    name: LANE_HEADER_NAME,
    visible
  },
  sizeBinding,
  actionDownSelectionFunction: selectionFunction,
  backgroundBinding,
  borderColorBinding,
  borderWidthBinding
});

export const laneHeaderAdornment = () => $(
  go.Adornment,
  go.Panel.Auto,
  {
    name: LANE_HEADER_ADORNMENT_NAME,
    zOrder: 3,
    layerName: 'Foreground'
  },
  laneHeader(),
  locationBinding(),
  zOrderBinding()
);
