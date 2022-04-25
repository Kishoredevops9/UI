import * as go from 'gojs';
import { theme } from '../../../../../theme/theme';
import { MAIN_SHAPE_NAME, NODE_SELECTION_NAME } from '../../consts';

const $ = go.GraphObject.make;

const getMainShape = (obj: go.GraphObject) =>
  (obj.part as go.Node).findObject(MAIN_SHAPE_NAME) as go.Shape;

const geometryStringBinding = () =>
  new go.Binding('geometryString', '', (_, obj) => getMainShape(obj).geometryString);

const desiredSizeBinding = () =>
  new go.Binding('desiredSize', '', (_, obj) => getMainShape(obj).desiredSize);

export const nodeSelection = () => $(
  go.Panel,
  go.Panel.Spot,
  {
    name: NODE_SELECTION_NAME,
    visible: false
  },
  $(
    go.Shape,
    {
      stroke: theme.colors.gojsBlue,
      strokeWidth: 6,
      fill: null
    },
    geometryStringBinding(),
    desiredSizeBinding()
  )
);
