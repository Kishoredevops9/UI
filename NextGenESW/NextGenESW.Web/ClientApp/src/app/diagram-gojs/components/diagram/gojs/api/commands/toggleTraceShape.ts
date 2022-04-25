import * as _ from 'lodash/fp';
import * as go from 'gojs';
import { skipUndoManager } from '../../utils/skipUndoManager';

export const toggleTraceShape = _.curry((
  diagram: go.Diagram,
  data: go.ObjectData
) => {
  const node = diagram.findNodeForData(data);
  const alreadyTracedNode = diagram.findNodesByExample({ isTraced: true }).first();
  let linksToLeave = [];

  node.linksConnected.each(({ key }) => linksToLeave = [...linksToLeave, key]);

  skipUndoManager(diagram, () => {
    diagram.links.each((link: go.Link) => {
        link.visible = data.isTraced
          ? true
          : _.includes(link.key)(linksToLeave);
      });
    diagram.model.set(data, 'isTraced', !data.isTraced);
    if (alreadyTracedNode && alreadyTracedNode.key !== node.key) {
      diagram.model.set(alreadyTracedNode.data, 'isTraced', false);
    }
  });
});
