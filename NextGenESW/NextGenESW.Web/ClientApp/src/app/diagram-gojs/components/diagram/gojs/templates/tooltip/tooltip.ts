import * as go from 'gojs';
import { theme } from '../../../../../theme/theme';

const $ = go.GraphObject.make;

export const createTooltipAdornment = (text: string) => $(
  go.Adornment,
  'Auto',
  $(
    go.Shape,
    'RoundedRectangle',
    {
      fill: theme.colors.gray,
      stroke: null,
      maxSize: new go.Size(150, NaN)
    }
  ),
  $(
    go.TextBlock,
    {
      margin: 3,
      text,
      textAlign: 'center',
      maxSize: new go.Size(150, NaN),
      font: `10 ${theme.fontFamily}`,
      stroke: theme.colors.white,
      isMultiline: true,
    },
  )
);
