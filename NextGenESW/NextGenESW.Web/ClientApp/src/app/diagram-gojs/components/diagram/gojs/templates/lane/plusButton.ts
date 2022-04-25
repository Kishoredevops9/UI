import * as go from 'gojs';

import { theme } from '../../../../../theme/theme';
import { getApiForDiagram } from '../../api/getApiForDiagram';
import { LANE_PLUS_BUTTON, LANE_PLUS_BUTTON_ADORNMENT } from '../../consts';
import { getLanes } from '../../utils/getLanes';

const $ = go.GraphObject.make;

export const PADDING = 12;
export const BACKGROUND_SIZE = 32;
export const PICTURE_SIZE = 18;

const updatePlusButton = (part: go.Part) => {
  if (!part.findAdornment(LANE_PLUS_BUTTON_ADORNMENT)) {
    return;
  }

  const plusButtonAdornment = part.findAdornment(LANE_PLUS_BUTTON_ADORNMENT);
  const { x, y } = part.getDocumentPoint(go.Spot.BottomRight);

  plusButtonAdornment.moveTo(
    x - BACKGROUND_SIZE - PADDING,
    y - BACKGROUND_SIZE - PADDING,
    true
  );
};

export const updatePlusButtons = (diagram: go.Diagram) => {
  const lanes = getLanes(diagram);

  lanes.forEach(updatePlusButton);
};

const buttonBinding = (__, obj: go.Adornment) => {
  updatePlusButtons(obj.diagram);
};

const background = () => $(
  go.Shape,
  'Circle',
  {
    fill: theme.colors.grayLight,
    stroke: theme.colors.grayDark,
    desiredSize: new go.Size(BACKGROUND_SIZE, BACKGROUND_SIZE)
  }
);

const shape = () => $(
  go.Picture,
  {
    source: '/assets/icons/add.svg',
    desiredSize: new go.Size(PICTURE_SIZE, PICTURE_SIZE)
  }
);

const handleClick = (__, obj: go.GraphObject) => {
  const { diagram } = obj;
  const api = getApiForDiagram(diagram);

  const { x, y } = obj.actualBounds;
  const position = diagram.transformDocToView(new go.Point(x, y));
  api.setContextMenu({
    target: LANE_PLUS_BUTTON,
    position: {
      left: position.x - 1,
      top: position.y - 1
    }
  });
};

export const plusButton = () => $(
  go.Adornment,
  go.Panel.Spot,
  {
    zOrder: 5,
    name: LANE_PLUS_BUTTON,
    cursor: 'pointer',
    layerName: 'Foreground',
    click: handleClick,
    isActionable: true,
    visible: false
  },
  background(),
  shape(),
  new go.Binding('location', 'loc', buttonBinding),
  new go.Binding('desiredSize', 'size', buttonBinding),
  new go.Binding('visible', 'order', (order: number, obj: go.GraphObject) => {
    if (obj.diagram.toolManager.draggingTool.isActive) {
      return obj.visible;
    }

    if (obj.diagram.model.modelData.published) {
      return false;
    }

    const lanes = getLanes(obj.diagram);
    return order === lanes.length;
  })
);
