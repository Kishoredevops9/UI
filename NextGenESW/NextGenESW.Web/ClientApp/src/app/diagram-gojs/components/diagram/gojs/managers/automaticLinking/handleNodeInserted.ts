import * as go from 'gojs';
import * as _ from 'lodash/fp';
import { showPropertiesForNewLink } from '../../api/commands/properties/links/showForNewLink';

import { getApiForDiagram } from '../../api/getApiForDiagram';

export const handleNodeInserted = (
  diagram: go.Diagram,
  part: go.Part
) => {
  const api = getApiForDiagram(diagram);
  if (!api.getConfiguration().automaticallyCreateConnectors) {
    return;
  }

  const previousNode = findPreviousNodeInLanePhase(part);
  if (!previousNode) {
    return;
  }

  const linkData = createLink(diagram, previousNode, part);
  showPropertiesForNewLink(diagram, linkData);
};

const findPreviousNodeInLanePhase = (
  targetPart: go.Part
) => {
  const lanePhase = targetPart.containingGroup;

  const groupMembers = [];
  lanePhase.memberParts.each((part) => groupMembers.push(part));

  return _.flowRight(
    _.get('part'),
    _.head,
    _.orderBy('distance', 'ASC'),
    _.map(mapToDistanceObject(targetPart)),
    _.filter((part: go.Part) =>
      part.key !== targetPart.key
        || part.actualBounds.right < targetPart.actualBounds.right
    )
  )(groupMembers);
};

const mapToDistanceObject = _.curry((
  targetPart: go.Part,
  compared: go.Part
) => {
  const { right: targetRight, top: targetTop } = targetPart.actualBounds;
  const { right, top } = compared.actualBounds;
  const distanceX = targetRight - right;
  const distanceY = targetTop - top;

  return {
    part: compared,
    distance: Math.sqrt(distanceX * distanceX + distanceY * distanceY)
  };
});

const createLink = (
  diagram: go.Diagram,
  fromPart: go.Part,
  toPart: go.Part
) => {
  const model = diagram.model as go.GraphLinksModel;

  const linkData = {
    from: fromPart.key,
    to: toPart.key
  };
  model.addLinkData(linkData);

  return linkData;
}
