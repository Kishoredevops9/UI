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
    const { width } = desiredSize;
    return new go.Size(width - 2 * PADDING.X, 15);
  }
).ofObject(MAIN_SHAPE_NAME);

const labelText = () => $(
  go.TextBlock,
  {
    stretch: go.GraphObject.Fill,
    font: `${theme.fontWeight.medium} 15px ${theme.fontFamily}`,
    maxLines: 1,
    overflow: go.TextBlock.OverflowEllipsis,
    textAlign: 'center'
  },
  textBinding()
);

export const oneLineTextBlock = (types?: NodeType[]) => $(
  go.Panel,
  go.Panel.Vertical,
  {
    alignment: new go.Spot(.5, .5, 0, 4)
  },
  sizeBinding(),
  labelText(),
  textBlockTypeBinding(types)
);
