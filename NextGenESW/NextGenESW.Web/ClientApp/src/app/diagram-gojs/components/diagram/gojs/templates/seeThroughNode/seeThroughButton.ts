import * as go from 'gojs';

import { theme } from '../../../../../theme/theme';
import { getApiForDiagram } from '../../api/getApiForDiagram';
import { generateGeometryFromSvgPath } from '../../utils/generateGeometryFromSvgPath';
import { NodeType } from '../../../../../types/node';

const $ = go.GraphObject.make;

const BUTTON_SIZE = 24;
const ADDITIONAL_PADDINGS = {
  [NodeType.ActivityBlock]: [5, 5],
  [NodeType.KPack]: [15, 5],
};

const ICON = 'M 16,16 H 2 V 2 H 8.9999998 V 0 H 2 C 0.89,0 0,0.89999998 0,2 v 14 c 0,1.1 0.89,2 2,2 h 14 c 1.1,0 2,-0.9 2,-2 V 9 H 16 Z M 11,0 v 2 h 3.59 L 4.76,11.83 6.17,13.24 16,3.41 V 7 h 2 V 0 Z';

const shape = () => $(
  go.Shape,
  'Rectangle',
  {
    fill: 'transparent',
    stroke: null,
    desiredSize: new go.Size(BUTTON_SIZE, BUTTON_SIZE)
  }
);

const icon = () => $(
  go.Shape,
  {
    geometry: generateGeometryFromSvgPath(ICON),
    desiredSize: new go.Size(15, 15),
    stroke: null,
    fill: theme.colors.black
  }
);

export const seeThroughButton = () => $(
  go.Panel,
  go.Panel.Spot,
  {
    isActionable: true,
    cursor: 'pointer',
    click: (_, { diagram, part }: go.Panel) => {
      const api = getApiForDiagram(diagram);
      const { x, y } = diagram.lastInput.viewPoint;
      api.setSeeThrough({
        data: part.data,
        position: { top: y + 10, left: x }
      });
    }
  },
  new go.Binding(
    'alignment',
    'type',
    (type) => new go.Spot(1, 1,
      -(BUTTON_SIZE / 2 + ADDITIONAL_PADDINGS[type][0]),
      -(BUTTON_SIZE / 2 + ADDITIONAL_PADDINGS[type][1])
    )
  ),
  new go.Binding('visible', 'taskExecutionStep', (taskExecutionStep) => !taskExecutionStep).ofModel(),
  shape(),
  icon()
);
