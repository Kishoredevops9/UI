import * as go from 'gojs';

import { theme } from '../../../../../theme/theme';
import { MAIN_SHAPE_NAME } from '../../consts';
import { nodeTypeDesiredSizeBinding } from './bindings/nodeTypeDesiredSize';
import { nodeTypeShapeBinding } from './bindings/nodeTypeShapeBinding';
import { updateAttentionIndicator } from './updateAttentionIndicator';
import { addHash } from '../../utils/color';
import { borderStyleBinding } from './bindings/borderStyleBinding';

const $ = go.GraphObject.make;

const backgroundColorBinding = () => new go.Binding(
  'fill',
  'backgroundColor',
  (backgroundColor: string, obj: go.Shape) => {
    updateAttentionIndicator(obj, 'backgroundColor', backgroundColor);
    return addHash(backgroundColor) || theme.colors.blue;
  }
);

const borderColorBinding = () => new go.Binding(
  'stroke',
  'borderColor',
  (borderColor: string, obj: go.Shape) => {
    updateAttentionIndicator(obj, 'borderColor', borderColor);
    return addHash(borderColor) || theme.colors.grayDark;
  }
);

const borderWidthBinding = (
  published: boolean,
  task: boolean,
  { unselected, borderWidth }: go.ObjectData
) => published && task && unselected === false ? borderWidth + 2 : borderWidth;

const borderWidthBindings = () => [
  new go.Binding('strokeWidth', 'unselected', (__, obj: go.Shape) => {
    const { published, task } = obj.diagram.model.modelData;
    return borderWidthBinding(published, task, obj.part.data);
  }),
  new go.Binding('strokeWidth', 'published', (published: boolean, obj: go.Shape) =>
    borderWidthBinding(published, obj.diagram.model.modelData.task, obj.part.data)
  ).ofModel(),
  new go.Binding('strokeWidth', 'task', (task: boolean, obj: go.Shape) =>
    borderWidthBinding(obj.diagram.model.modelData.published, task, obj.part.data)
  ).ofModel(),
  new go.Binding('strokeWidth', 'borderWidth', (task: boolean, obj: go.Shape) =>
    borderWidthBinding(obj.diagram.model.modelData.published, task, obj.part.data)
  )
];

export const baseBackground = ({
  name = MAIN_SHAPE_NAME
}) => $(
  go.Shape,
  {
    name,
    stroke: theme.colors.grayDark,
    strokeWidth: 1,
    fill: theme.colors.blue
  },
  backgroundColorBinding(),
  borderColorBinding(),
  borderStyleBinding(),
  ...borderWidthBindings(),
  nodeTypeShapeBinding(),
  nodeTypeDesiredSizeBinding()
);
