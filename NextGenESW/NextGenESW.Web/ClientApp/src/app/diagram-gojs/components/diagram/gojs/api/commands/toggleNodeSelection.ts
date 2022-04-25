import * as go from 'gojs';
import * as _ from 'lodash/fp';

import { NodeData } from '../../../../../types/node';
import { skipUndoManager } from '../../utils/skipUndoManager';

export const toggleNodeSelection = _.curry((
  diagram: go.Diagram,
  nodeData: NodeData
) => skipUndoManager(diagram, () => {
  const part = diagram.findPartForKey(nodeData.key);
  diagram.model.setDataProperty(
    part.data,
    'unselected',
    !part.data.unselected
  );
  adjustLinksSelection(diagram);
}));

export const adjustLinksSelection = (
  diagram: go.Diagram
) => {
  diagram.links.each((link) => {
    const fromData = link.fromNode.data;
    const toData = link.toNode.data;
    const nextUnselected = !!(fromData.unselected || toData.unselected);
    diagram.model.setDataProperty(
      link.data,
      'unselected',
      nextUnselected
    );
  });
};
