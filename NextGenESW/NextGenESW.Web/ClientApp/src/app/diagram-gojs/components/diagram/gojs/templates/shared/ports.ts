import * as go from 'gojs';

import { generateGeometryFromSvgPath } from '../../utils/generateGeometryFromSvgPath';
import { nodeTypeDesiredSizeBinding } from './bindings/nodeTypeDesiredSize';
import { inPortShapeBinding, inPortSizeBinding, outPortShapeBinding } from './bindings/portsBindings';
import { DECISION_PORTS } from '../../shapes/portShapes';
import { theme } from '../../../../../theme/theme';
import { PORTS_PANEL_NAME } from '../../consts';

const $ = go.GraphObject.make;

const outPort = () => $(
  go.Shape,
  {
    name: PORTS_PANEL_NAME,
    opacity: 0,
    visible: false,
    geometry: generateGeometryFromSvgPath(DECISION_PORTS),
    portId: '',
    stroke: theme.colors.gojsBlue,
    fill: theme.colors.gojsBlue,
    fromLinkable: true,
    toLinkable: false,
    fromSpot: go.Spot.AllSides,
    toSpot: go.Spot.AllSides,
    cursor: 'pointer'
  },
  outPortShapeBinding(),
  nodeTypeDesiredSizeBinding()
);

const inPort = () => $(
  go.Shape,
  {
    fill: null,
    stroke: null,
    fromLinkable: false,
    toLinkable: true,
    fromSpot: go.Spot.AllSides,
    toSpot: go.Spot.AllSides,
    portId: '',
    desiredSize: new go.Size(30, 30)
  },
  inPortShapeBinding(),
  inPortSizeBinding()
);

export const ports = () => $(
  go.Panel,
  go.Panel.Spot,
  outPort(),
  inPort()
);
