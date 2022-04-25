import * as _ from 'lodash/fp';
import * as go from 'gojs';

import { NodeCategory, NodeData } from '../../../../../../types/node';
import { LANE_HEIGHT } from '../../../consts';
import { getLanes, getLastLane } from '../../../utils/getLanes';
import { changeOrder } from '../../../managers/reorderManager/changeOrder';
import { registerSingleHeader } from '../../../listeners/registerHeaders';
import { laneHeaderAdornment } from '../../../templates/header/laneHeader';
import { getLaneHeaderLocation } from '../../../utils/getHeaderLocation';
import { registerPlusButtons } from '../../../listeners/registerPlusButtons';
import { getApiForDiagram } from '../../getApiForDiagram';
import { getLanePhaseKey, parseLanePhaseKey } from '../../../utils/getLanePhaseKey';

const adjustOrder = (
  diagram: go.Diagram,
  sourceData: NodeData
) => _.flowRight(
  _.each(changeOrder(1)),
  _.filter((lane: go.Group) => lane.data.order > sourceData.order),
  getLanes
)(diagram);

const insertLanePhase = _.curry((
  diagram: go.Diagram,
  laneData: NodeData,
  { data }: go.Group
) => {
  const { key: laneKey } = laneData;
  const { phaseId } = parseLanePhaseKey(data.key);
  const key = getLanePhaseKey(phaseId, laneKey);
  const newPhase: NodeData = {
    category: NodeCategory.LanePhase,
    order: data.order,
    isGroup: true,
    name: data.name,
    size: go.Size.stringify(
      new go.Size(
        go.Size.parse(data.size).width,
        go.Size.parse(laneData.size).height
      )
    ),
    group: laneKey,
    isLaneCollapsed: data.isLaneCollapsed,
    isPhaseCollapsed: data.isPhaseCollapsed,
    key
  };

  diagram.model.addNodeData(newPhase);
});

const insertLane = (diagram: go.Diagram, sourceData: NodeData) => {
  const { order, size } = sourceData;
  const newSize = go.Size.parse(size);
  newSize.height = LANE_HEIGHT;

  const newLane: NodeData = {
    category: NodeCategory.Lane,
    order: order + 1,
    isGroup: true,
    name: 'Lane',
    size: go.Size.stringify(newSize)
  };
  const prevLane = diagram.findNodeForData(sourceData) as go.Group;
  diagram.model.addNodeData(newLane);
  prevLane.memberParts.each(insertLanePhase(diagram, newLane));
  const newLaneNode = diagram.findNodeForData(newLane);
  registerSingleHeader(laneHeaderAdornment, getLaneHeaderLocation, newLaneNode);
  registerPlusButtons(diagram);

  getApiForDiagram(diagram)
    .showPropertiesForNewSwimLane(order + 1)
    .then(() => diagram.updateAllTargetBindings());
};

export const insertLaneBelow = _.curry((
  diagram: go.Diagram,
  sourceData: NodeData
) => diagram.commit(() => {
  adjustOrder(diagram, sourceData);
  insertLane(diagram, sourceData);
  diagram.updateAllTargetBindings();
}));

export const insertLaneAtTheEnd = (
  diagram: go.Diagram
) => diagram.commit(() => {
  const lastLane = getLastLane(diagram).data;
  insertLane(diagram, lastLane);
  diagram.updateAllTargetBindings();
});
