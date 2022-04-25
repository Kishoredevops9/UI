import * as go from 'gojs';

import { theme } from '../../../../../theme/theme';
import { MAIN_SHAPE_NAME } from '../../consts';
import { PADDING } from './consts';
import { NodeType } from '../../../../../types/node';
import { textBlockTypeBinding } from './textBlockTypeBinding';
import { textBinding } from './textBinding';

const $ = go.GraphObject.make;

const sizeBinding = () => new go.Binding(
  'desiredSize',
  'desiredSize',
  (desiredSize: go.Size) => {
    const { width, height } = desiredSize;
    return new go.Size(width - 4 * PADDING.X, height - 2 * PADDING.Y);
  }
).ofObject(MAIN_SHAPE_NAME);

const labelText = () => $(
  go.TextBlock,
  {
    stretch: go.GraphObject.Fill,
    font: `${theme.fontWeight.medium} 15px ${theme.fontFamily}`,
    maxLines: 4,
    overflow: go.TextBlock.OverflowEllipsis
  },
  textBinding()
);

export const dataTextBlock = (types?: NodeType[]) => $(
  go.Panel,
  go.Panel.Vertical,
  {
    margin: new go.Margin(
      PADDING.Y,
      PADDING.X * 2,
      PADDING.Y,
      PADDING.X * 2
    ),
  },
  sizeBinding(),
  labelText(),
  textBlockTypeBinding(types)
);
