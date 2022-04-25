import * as _ from 'lodash/fp';
import * as go from 'gojs';

import { updateGroupBounds } from '../../../managers/updateGroupBounds/updateGroupBounds';
import { mapNodeTypeToCategory } from '../../../utils/mapNodeTypeToCategory';
import { mapNodeTypeToLabel } from '../../../utils/mapNodeTypeToLabel';
import { NodeData, NodeType } from '../../../../../../types/node';
import { getApiForDiagram } from '../../getApiForDiagram';
import { Position } from '../../types';

const createNodeData = (
  diagram: go.Diagram,
  nodeType: NodeType,
  clickPosition: Position,
): NodeData => {
  const position = new go.Point(clickPosition.left, clickPosition.top);
  const loc = diagram.transformViewToDoc(position);
  return {
    category: mapNodeTypeToCategory(nodeType),
    type: nodeType,
    text: mapNodeTypeToLabel(nodeType),
    loc: go.Point.stringify(loc)
  };
};

export const insertShape = _.curry((
  diagram: go.Diagram,
  nodeType: NodeType,
  clickPosition: Position,
  groupKey: go.Key
) => diagram.commit(() => {
  const nodeData = createNodeData(diagram, nodeType, clickPosition);
  diagram.model.addNodeData(nodeData);

  const part = diagram.findPartForKey(nodeData.key);
  const group = diagram.findPartForKey(groupKey) as go.Group;
  group.addMembers(new go.List([part]));

  part.ensureBounds();
  updateGroupBounds(group, part);

  getApiForDiagram(diagram).showPropertiesForNewNode(group, part);
}));
