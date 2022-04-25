import * as _ from 'lodash/fp';
import * as go from 'gojs';

import { header } from './header';
import { getPhaseHeaderLocation } from '../../utils/getHeaderLocation';
import {
  HEADER_WIDTH,
  PHASE_HEADER_ADORNMENT_NAME,
  PHASE_HEADER_NAME
} from '../../consts';
import { propagateEventsForLanePhases } from '../../managers/lanePhasePropagator/lanePhasePropagator';
import { PROPAGATE_SELECTOR } from '../../managers/lanePhasePropagator/selectors';
import { theme } from '../../../../../theme/theme';
import { getLanes } from '../../utils/getLanes';

const $ = go.GraphObject.make;
const locationBinding = () => new go.Binding(
  'location',
  'loc',
  (loc: string, obj: go.Adornment) =>
    getPhaseHeaderLocation(go.Point.parse(loc), obj.diagram)
);

const sizeBinding = () => new go.Binding(
  'desiredSize',
  'size',
  (size: string, obj: go.Panel) => {
    const { adornedPart } = obj.part as go.Adornment;
    const { width } = go.Size.parse(size);

    return obj.part.data.isPhaseCollapsed
      ? new go.Size(adornedPart.desiredSize.width, HEADER_WIDTH)
      : new go.Size(width, HEADER_WIDTH);
  }
);

const selectionFunction = (obj: go.Panel) => {
  let partsToSelect = [];
  propagateEventsForLanePhases(
    [PROPAGATE_SELECTOR.VERTICALLY],
    obj.part,
    (part) => partsToSelect = [...partsToSelect, part]
  );

  return partsToSelect;
};

const backgroundBinding = () => new go.Binding('fill', 'backgroundColor', () => theme.colors.white);
const borderColorBinding = () => new go.Binding('stroke', 'borderColor', () => theme.colors.lightBlue);
const borderWidthBinding = () => new go.Binding('strokeWidth', 'borderWidth', () => 1);


const phaseHeader = (properties: go.ObjectData = {}) => header({
  headerProperties: {
    name: PHASE_HEADER_NAME,
    angle: 0,
    ...properties
  },
  sizeBinding,
  actionDownSelectionFunction: selectionFunction,
  backgroundBinding,
  borderColorBinding,
  borderWidthBinding
});

export const phaseHeaderAdornment = () => $(
  go.Adornment,
  go.Panel.Auto,
  {
    zOrder: 3,
    name: PHASE_HEADER_ADORNMENT_NAME,
    layerName: 'Foreground'
  },
  phaseHeader({
    alignment: go.Spot.TopLeft,
    alignmentFocus: go.Spot.TopCenter,
    visible: true
  }),
  locationBinding()
);
