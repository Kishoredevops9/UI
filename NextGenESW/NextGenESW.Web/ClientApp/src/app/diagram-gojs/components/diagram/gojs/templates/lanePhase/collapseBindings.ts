import * as go from 'gojs';
import * as _ from 'lodash/fp';

import {
  HEADER_ADORNMENT_NAME,
  HEADER_TEXT_NAME,
  HEADER_WIDTH,
  MAX_COLLAPSED_HEADER_TEXT_WIDTH
} from '../../consts';
import { measureText } from '../../utils/measureText';
import { propagateEventsForLanePhases } from '../../managers/lanePhasePropagator/lanePhasePropagator';
import { PROPAGATE_SELECTOR } from '../../managers/lanePhasePropagator/selectors';
import { updateLanesWidth } from '../../managers/resize/updateLanesWidth';

const COLLAPSED_PHASE_HEADER_PADDING = 10;

const collapseLanePhase = (shouldCollapse: boolean, lanePhase: go.Group) => {
  shouldCollapse ? lanePhase.collapseSubGraph() : lanePhase.expandSubGraph();
  lanePhase.findExternalLinksConnected().each((link: go.Link) => {
    link.visible = link.fromNode.isVisible() && link.toNode.isVisible();
  });
};

const laneCollapseBinding = () => new go.Binding(
  'desiredSize',
  'isLaneCollapsed',
  (isLaneCollapsed, obj: go.Shape) => {
    const { width } = obj.desiredSize;
    const { height } = go.Size.parse(obj.part.data.size);

    if (!obj.part.data.isPhaseCollapsed) {
      collapseLanePhase(isLaneCollapsed, obj.part as go.Group);
    }

    return new go.Size(width, isLaneCollapsed ? HEADER_WIDTH : height);
  }
);

const changeLanePhasesSize = (
  obj: go.Shape,
  header: go.Adornment,
  isCollapsed: boolean
) => {
  const textBlock = header.findObject(HEADER_TEXT_NAME) as go.TextBlock;
  const textWidth = measureText(textBlock.text, textBlock.font).width;
  const maxWidth = _.clamp(
    HEADER_WIDTH,
    MAX_COLLAPSED_HEADER_TEXT_WIDTH
  )(textWidth + COLLAPSED_PHASE_HEADER_PADDING);
  propagateEventsForLanePhases(
    [PROPAGATE_SELECTOR.VERTICALLY],
    obj.part,
    (part) => part.desiredSize = new go.Size(
      isCollapsed ? maxWidth : go.Size.parse(part.data.size).width,
      part.desiredSize.height
    )
  );
};

const phaseCollapseBinding = () => new go.Binding(
  'desiredSize',
  'isPhaseCollapsed',
  (isPhaseCollapsed, obj: go.Shape) => {
    const header = obj.part.findAdornment(HEADER_ADORNMENT_NAME);

    if (!obj.part.data.isLaneCollapsed) {
      collapseLanePhase(isPhaseCollapsed, obj.part as go.Group);
    }

    if (header) {
      changeLanePhasesSize(obj, header, isPhaseCollapsed);
      updateLanesWidth(obj.diagram);
    }
  }
);

export const collapseBindings = () => [
  laneCollapseBinding(),
  phaseCollapseBinding()
];
