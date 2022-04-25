import * as go from 'gojs';
import * as _ from 'lodash/fp';

import { NodeData, NodeType } from '../../../../types/node';

export const isActivityNode = (data: go.ObjectData) => _.includes(data.type)(_.values(NodeType));

export const getActivityNodes = (diagram: go.Diagram): go.Node[] => _.flowRight(
  _.map((activityData: NodeData) => diagram.findNodeForData(activityData)),
  _.filter(isActivityNode)
)(diagram.model.nodeDataArray);
