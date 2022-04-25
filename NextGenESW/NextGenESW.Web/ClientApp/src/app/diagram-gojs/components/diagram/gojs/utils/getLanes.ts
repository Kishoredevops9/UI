import * as _ from 'lodash/fp';
import * as go from 'gojs';

import { NodeCategory, NodeData } from '../../../../types/node';

export const isLane = ({ category }: go.Part | go.Node | go.ObjectData) =>
  category === NodeCategory.Lane;

export const getLanes = (diagram: go.Diagram): go.Group[] => _.flowRight(
  _.map((laneData: NodeData) => diagram.findNodeForData(laneData)),
  _.filter(isLane)
)(diagram.model.nodeDataArray);

export const getLastLane: (diagram: go.Diagram) => go.Group = _.flowRight(
  ([lastLane]) => lastLane,
  _.orderBy('data.order', 'desc'),
  getLanes
);
