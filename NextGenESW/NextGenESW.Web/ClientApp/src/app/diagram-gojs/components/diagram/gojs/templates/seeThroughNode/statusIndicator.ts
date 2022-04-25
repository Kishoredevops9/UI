import * as go from 'gojs';
import { NodeType } from '../../../../../types/node';
import { theme } from '../../../../../theme/theme';
import { getApiForDiagram } from '../../api/getApiForDiagram';

const $ = go.GraphObject.make;

const isProperMode = ({ showStatusIndicator }: go.ObjectData) => !!showStatusIndicator;

const visibilityBinding = () => new go.Binding(
  'visible',
  'type',
  (__, obj: go.Shape) => isProperMode(obj.diagram.model.modelData)
    && obj.part.data.type === NodeType.ActivityBlock
);

const mapStatusToColor = (status: number) => {
  if (!status || status < 1) {
    return theme.colors.status.gray;
  } else if (status < 5) {
    return theme.colors.status.green
  }

  return theme.colors.status.blue;
};

const shape = () => $(
  go.Shape,
  'Triangle',
  {
    desiredSize: new go.Size(25, 22),
    fill: theme.colors.status.gray,
    stroke: null
  },
  new go.Binding('fill', 'assetStatusId', mapStatusToColor)
);

const deviationText = () => $(
  go.TextBlock,
  {
    alignment: new go.Spot(.5, 1, 0, -6),
    desiredSize: new go.Size(20, NaN),
    font: `14px ${theme.fontFamily}`,
    textAlign: 'center'
  },
  new go.Binding('text', 'deviation', (deviation) => deviation ? 'D' : '')
);

export const statusIndicator = () => $(
  go.Panel,
  go.Panel.Spot,
  {
    alignment: new go.Spot(0, 1, 1, -7),
    isActionable: true,
    cursor: 'pointer',
    visible: false,
    click: (_, { diagram, part }: go.Panel) => {
      const api = getApiForDiagram(diagram);
      const { x, y } = diagram.lastInput.viewPoint;
      api.setSeeThrough({
        data: part.data,
        position: { top: y + 10, left: x }
      });
    }
  },
  shape(),
  deviationText(),
  visibilityBinding()
);
