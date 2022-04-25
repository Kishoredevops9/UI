import * as _ from 'lodash/fp';
import * as go from 'gojs';

import { NodeCategory, NodeData } from '../../../../types/node';

export const isLanePhase = ({ category }: go.Part | go.Node | go.ObjectData) =>
  category === NodeCategory.LanePhase;

export const getLanePhases = (diagram: go.Diagram): go.Group[] => _.flowRight(
  _.map((phaseData: NodeData) => diagram.findNodeForData(phaseData)),
  _.filter(isLanePhase)
)(diagram.model.nodeDataArray);

export const getLastLanePhase = (obj: go.Group) => {
  let lanePhases = [];

  obj.memberParts.each((part: go.Part) => {
    if (isLanePhase(part)) {
      lanePhases = [...lanePhases, part];
    }
  });

  return _.flowRight(
    _.head,
    _.orderBy('data.order', 'desc'),
  )(lanePhases);
};
