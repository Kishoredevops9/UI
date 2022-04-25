import * as go from 'gojs';

import { theme } from '../../../../../theme/theme';
import { HEADER_TEXT_NAME } from '../../consts';
import { updateHeaderTextPosition } from '../../listeners/updateHeaderTextPosition';
import { isLanePhase } from '../../utils/getLanePhases';
import { handleActionUp, handleMouseMove } from './handleActions';
import { contextMenu } from '../shared/contextMenu';
import { borderStyleBinding } from '../shared/bindings/borderStyleBinding';

const { colors: { white, lightBlue }, fontFamily, fontWeight } = theme;

const $ = go.GraphObject.make;

const textBinding = (_, obj: go.TextBlock) => {
  const adornment = obj.part as go.Adornment;
  updateHeaderTextPosition(adornment, isLanePhase(adornment.adornedObject));
};

const shape = ({
  sizeBinding,
  backgroundBinding,
  borderColorBinding,
  borderWidthBinding
}) => $(
  go.Shape,
  {
    fill: white,
    stroke: lightBlue
  },
  sizeBinding(),
  backgroundBinding(),
  borderColorBinding(),
  borderWidthBinding(),
  borderStyleBinding()
);

const text = () => $(
  go.TextBlock,
  {
    name: HEADER_TEXT_NAME,
    font: `${fontWeight.regular} 20px ${fontFamily}`,
    alignment: go.Spot.Center,
    overflow: go.TextBlock.OverflowEllipsis,
    maxLines: 1,
    textAlign: 'center'
  },
  new go.Binding('text', 'name'),
  new go.Binding('desiredSize', 'size', textBinding),
  new go.Binding('location', 'loc', textBinding)
);

type HeaderProps = {
  headerProperties: Partial<go.Panel>,
  sizeBinding: () => go.Binding,
  actionDownSelectionFunction: (obj: go.Panel) => go.Part[],
  backgroundBinding: () => go.Binding,
  borderColorBinding: () => go.Binding,
  borderWidthBinding: () => go.Binding,
};

export const header = ({
  headerProperties, sizeBinding, actionDownSelectionFunction,
  backgroundBinding, borderColorBinding, borderWidthBinding
}: HeaderProps) => $(
  go.Panel,
  go.Panel.Auto,
  {
    cursor: 'grab',
    visible: false,
    isActionable: true,
    actionMove: (_, obj: go.Panel) => {
      if (obj.diagram.model.modelData.published) {
        return;
      }
      handleMouseMove(actionDownSelectionFunction, obj);
    },
    actionUp: handleActionUp(actionDownSelectionFunction),
    contextMenu: contextMenu(),
    ...headerProperties
  },
  shape({
    sizeBinding,
    backgroundBinding,
    borderColorBinding,
    borderWidthBinding
  }),
  text(),
  new go.Binding(
    'angle',
    'isLaneCollapsed',
    (isLaneCollapsed) => isLaneCollapsed ? 0 : headerProperties.angle
  ),
  new go.Binding('cursor', 'published',
    (published) => published ? 'default' : 'grab'
  ).ofModel()
);
