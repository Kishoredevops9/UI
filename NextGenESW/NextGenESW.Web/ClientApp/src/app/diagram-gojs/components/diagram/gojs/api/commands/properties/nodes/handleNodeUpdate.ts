import * as go from 'gojs';
import * as _ from 'lodash/fp';

import { NodeData } from '../../../../../../../types/node';
import { mapNodeTypeToCategory } from '../../../../utils/mapNodeTypeToCategory';
import { skipUndoManager } from '../../../../utils/skipUndoManager';
import { updateDataObject } from '../../../../utils/updataDataObject';

export const handleNodeUpdate = _.curry((
  diagram: go.Diagram,
  properties: NodeData
) => skipUndoManager(diagram, () => {
  setNodeProperties(diagram, properties);
  adjustNodeCategory(diagram, properties);
}));

const setNodeProperties = (
  diagram: go.Diagram,
  nextData: NodeData
) => diagram.commit(() => {
  const { key } = nextData;
  const part = diagram.findPartForKey(key);
  updateDataObject(diagram, part.data, nextData);
});

const adjustNodeCategory = (
  diagram: go.Diagram,
  nextData: NodeData
) => diagram.commit(() => {
  const { key } = nextData;
  const part = diagram.findPartForKey(key);

  const nextCategory = mapNodeTypeToCategory(part.data.type);
  if (part.category !== nextCategory) {
    diagram.model.setCategoryForNodeData(part.data, nextCategory);
  }
});
