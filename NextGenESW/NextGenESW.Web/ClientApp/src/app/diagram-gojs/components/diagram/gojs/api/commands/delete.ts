import * as _ from 'lodash/fp';
import * as go from 'gojs';

import { isLane } from '../../utils/getLanes';
import { getLanePhases, isLanePhase } from '../../utils/getLanePhases';

const deleteLane = (diagram: go.Diagram, node: go.Node) => {
  diagram.select(node);
  diagram.commandHandler.deleteSelection();
}

const deletePhase = (diagram: go.Diagram, node: go.Node) => {
  const newSelection = _.filter<go.Part>(
    ({ data }) => data.order === node.data.order
  )(getLanePhases(node.diagram))
  diagram.selectCollection(newSelection);
  diagram.commandHandler.deleteSelection();
}

export const deleteNodeByKey = _.curry((
  diagram: go.Diagram,
  key: go.Key
) => diagram.commit(() => {
  const node = diagram.findNodeForKey(key);

  if (isLane(node)) {
    return deleteLane(diagram, node);
  }

  if (isLanePhase(node)) {
    return deletePhase(diagram, node);
  }

  diagram.select(node);
  diagram.commandHandler.deleteSelection();
}));

export const deleteLinkByKey = _.curry((
  diagram: go.Diagram,
  key: go.Key
) => diagram.commit(() => {
  const link = diagram.findLinkForKey(key);
  diagram.select(link);
  diagram.commandHandler.deleteSelection();
}));
