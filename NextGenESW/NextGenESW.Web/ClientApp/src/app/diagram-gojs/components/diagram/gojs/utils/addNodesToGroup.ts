import * as _ from 'lodash/fp';
import * as go from 'gojs';

import { isLane } from './getLanes';
import { getApiForDiagram } from '../api/getApiForDiagram';
import { updateGroupBounds } from '../managers/updateGroupBounds/updateGroupBounds';

const isInsideOwnGroup = (group: go.Group, part: go.Part) =>
  part.containingGroup?.key === group.key;

const shouldAddToGroup = (group: go.Group) => (part: go.Part) => !isLane(part)
  && (!part.containingGroup || !isInsideOwnGroup(group, part))
  && (part.diagram.lastInput.shift || !part.containingGroup);

const isNewNode = (part: go.Part) => !part.containingGroup;

export const addNodesToGroup = (event: go.InputEvent, group: go.Group) => {
  const { diagram } = event;
  const nodes = diagram.selection;
  const nodesToAdd = nodes.filter(shouldAddToGroup(group));

  if (group.data.isLaneCollapsed || group.data.isPhaseCollapsed) {
    return event.diagram.currentTool.doCancel();
  }

  const api = getApiForDiagram(diagram);
  _.flowRight(
    _.each((part) => {
      updateGroupBounds(group, part);
      api.showPropertiesForNewNode(group, part);
    }),
    _.filter(isNewNode)
  )(nodesToAdd.toArray());

  if (!nodesToAdd.count) {
    return;
  }

  const validMember = group
    ? group.addMembers(nodesToAdd, true)
    : diagram.commandHandler.addTopLevelParts(nodesToAdd, true);

  if (!validMember) {
    diagram.currentTool.doCancel();
  }
};
