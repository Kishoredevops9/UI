import * as go from 'gojs';
import * as _ from 'lodash/fp';

import { getApiForDiagram } from '../../api/getApiForDiagram';
import { isLanePhase } from '../../utils/getLanePhases';
import { parseLanePhaseKey } from '../../utils/getLanePhaseKey';
import { isLane } from '../../utils/getLanes';
import { isActivityNode } from '../../utils/getActivityNodes';

export const sendDeleteRequest = (
  diagram: go.Diagram,
  parts: go.Part[]
) => {
  const api = getApiForDiagram(diagram);

  _.flowRight(
    _.each(api.http.handlePhaseDelete),
    getPhaseIdsToRemove
  )(parts);
  _.flowRight(
    _.each(api.http.handleSwimLaneDelete),
    getSwimLaneIdsToRemove
  )(parts);
  _.flowRight(
    _.each(api.http.handleActivityDelete),
    getActivitiesIdsToRemove
  )(parts);
  _.flowRight(
    _.each(api.http.handleLinkDelete),
    getLinksDataToRemove
  )(parts);
};

const getPhaseIdsToRemove = (parts: go.Part[]) => _.flowRight(
  _.uniq,
  _.map((part: go.Part) => parseLanePhaseKey(String(part.key)).phaseId),
  _.filter(isLanePhase)
)(parts);

const getSwimLaneIdsToRemove = (parts: go.Part[]) => _.flowRight(
  _.uniq,
  _.map((part: go.Part) => part.key),
  _.filter(isLane)
)(parts);

const getActivitiesIdsToRemove = (parts: go.Part[]) => _.flowRight(
  _.uniq,
  _.map((part: go.Part) => part.key),
  _.filter(({ data }) => isActivityNode(data))
)(parts);

const getLinksDataToRemove = (parts: go.Part[]) => _.flowRight(
  _.map((part: go.Part) => part.data),
  _.filter((part: go.Part) => part instanceof go.Link)
)(parts);
