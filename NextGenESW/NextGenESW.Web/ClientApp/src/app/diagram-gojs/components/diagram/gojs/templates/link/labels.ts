import * as go from 'gojs';
import { theme } from '../../../../../theme/theme';

export const FROM_LABEL_NAME = 'fromLabel';
export const LABEL_NAME = 'label';
export const TO_LABEL_NAME = 'toLabel';

const $ = go.GraphObject.make;

const baseLabel = (
  properties: Partial<go.TextBlock>,
  ...children: go.Binding[]
) => $(
  go.TextBlock,
  {
    textAlign: 'center',
    font: `14px ${theme.fontFamily}`,
    stroke: theme.colors.grayDark,
    segmentOffset: new go.Point(NaN, NaN),
    segmentOrientation: go.Link.OrientUpright,
    ...properties,
  },
  ...children
);

export const fromLabel = () => baseLabel(
  { segmentIndex: 0, name: FROM_LABEL_NAME },
  new go.Binding('text', 'fromLabel')
);

export const label = () => baseLabel(
  { name: LABEL_NAME, segmentOffset: new go.Point(0, NaN), },
  new go.Binding('text', 'label')
);

export const toLabel = () => baseLabel(
  { segmentIndex: -1, name: TO_LABEL_NAME },
  new go.Binding('text', 'toLabel')
);
