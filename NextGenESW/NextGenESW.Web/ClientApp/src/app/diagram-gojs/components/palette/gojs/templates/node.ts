import * as go from 'gojs';

import { theme } from '../../../../theme/theme';
import { mapNodeTypeToIconPath } from '../utils/mapNodeTypeToIcon';

const $ = go.GraphObject.make;

const text = () => $(
  go.TextBlock,
  {
    maxSize: new go.Size(70, NaN),
    font: `14px ${theme.fontFamily}`,
    stroke: theme.colors.grayDark,
    maxLines: 2,
    textAlign: 'center',
    margin: new go.Margin(8, 0, 0, 0)
  },
  new go.Binding('text')
);

const picture = () => $(
  go.Picture,
  {
    maxSize: new go.Size(55, 35),
    imageStretch: go.GraphObject.Uniform
  },
  new go.Binding('source', 'type', mapNodeTypeToIconPath)
)

export const nodeTemplate = () => $(
  go.Node,
  go.Panel.Vertical,
  {
    alignment: go.Spot.Center,
    locationSpot: go.Spot.Top
  },
  picture(),
  text(),
);
