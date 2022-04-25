import * as _ from 'lodash/fp';
import * as go from 'gojs';

import { NodeCategory, NodeData } from '../../../../../../types/node';
import { getLanePhases } from '../../../utils/getLanePhases';
import { LANE_PHASE_WIDTH } from '../../../consts';
import { getLanes } from '../../../utils/getLanes';
import { changeOrder } from '../../../managers/reorderManager/changeOrder';
import { updateLanesWidth } from '../../../managers/resize/updateLanesWidth';
import { registerHeaders } from '../../../listeners/registerHeaders';
import { runWithoutLayoutAnimation } from '../../../listeners/runWithoutLayoutAnimation';
import { getApiForDiagram } from '../../getApiForDiagram';

const getLastPhaseOrder = (diagram: go.Diagram) => _.flowRight(
  _.get('data.order'),
  _.head,
  _.orderBy('data.order', 'desc'),
  getLanePhases
)(diagram);

const insertPhaseWithOrder = (
  diagram: go.Diagram,
  order: number
) => _.flowRight(
  _.each((lane: go.Group) => {
    const { key, data: { size, isLaneCollapsed, borderColor, borderStyle }} = lane;
    const { height } = go.Size.parse(size);

    const newPhase: NodeData = {
      category: NodeCategory.LanePhase,
      order: order,
      isGroup: true,
      name: 'Phase',
      size: go.Size.stringify(
        new go.Size(LANE_PHASE_WIDTH, height)
      ),
      group: key,
      isLaneCollapsed,
      borderColor,
      borderStyle
    };
    diagram.model.addNodeData(newPhase);
  }),
  getLanes
)(diagram);

const adjustOrder = (diagram: go.Diagram, order: number) => _.flowRight(
  _.each(changeOrder(1)),
  _.filter((phase: go.Group) => phase.data.order > order),
  getLanePhases
)(diagram);

const insertPhase = (diagram: go.Diagram, order: number) => {
  insertPhaseWithOrder(diagram, order);
  runWithoutLayoutAnimation(
    diagram,
    () => {
      updateLanesWidth(diagram);
      registerHeaders(diagram);
      diagram.updateAllTargetBindings();
    },
    true
  );

  getApiForDiagram(diagram).showPropertiesForNewPhase(order);
};

export const insertPhaseAfter = _.curry((
  diagram: go.Diagram,
  sourceData: NodeData
) => diagram.commit(() => {
  const { order } = sourceData;
  adjustOrder(diagram, order);
  insertPhase(diagram, order + 1);
}));

export const insertPhaseAtTheEnd = (
  diagram: go.Diagram
) => diagram.commit(() => {
  const lastPhaseOrder = getLastPhaseOrder(diagram);
  insertPhase(diagram, lastPhaseOrder + 1);
});
