import * as go from 'gojs';
import { theme } from '../../../../../theme/theme';
import { contextMenu } from '../shared/contextMenu';
import { fromLabel, label, toLabel } from './labels';
import { SpreadLink } from './SpreadLink';

const $ = go.GraphObject.make;

const line = () => $(
  go.Shape,
  {
    stroke: theme.colors.grayDark,
    strokeWidth: 1,
    isPanelMain: true
  }
);

const clickArea = () => $(
  go.Shape,
  {
    stroke: theme.colors.transparent,
    strokeWidth: 8,
    isPanelMain: true
  }
);

const toArrow = () => $(
  go.Shape,
  {
    toArrow: 'Triangle',
    fill: theme.colors.grayDark,
    stroke: theme.colors.grayDark,
  }
);

const opacityBinding = () => new go.Binding('opacity', 'unselected', (unselected) => unselected ? 0.3 : 1);
const deletableBinding = () => new go.Binding('deletable', 'primary', (primary) => !primary);

export const link = () => $(
  SpreadLink,
  {
    fromEndSegmentLength: 24,
    toEndSegmentLength: 24,
    zOrder: 2,
    corner: 4,
    routing: go.Link.Orthogonal,
    layerName: 'Foreground',
    contextMenu: contextMenu()
  },
  clickArea(),
  line(),
  toArrow(),
  fromLabel(),
  label(),
  toLabel(),
  opacityBinding(),
  deletableBinding()
);
