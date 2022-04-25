import * as go from 'gojs';
import * as _ from 'lodash/fp';

import { ActivityGroup } from '../../../../../../../../process-maps/process-maps.model';
import { getLanes } from '../../../../utils/getLanes';
import { skipUndoManager } from '../../../../utils/skipUndoManager';
import { getApiForDiagram } from '../../../getApiForDiagram';
import { handleSwimLaneUpdate } from './handleSwimLaneUpdate';

export const showPropertiesForNewSwimLane = _.curry(async (
  diagram: go.Diagram,
  order: number
) => {
  const api = getApiForDiagram(diagram);
  const result = await api.openDialogBox({
    type: 'InsertSwimLane'
  }) as ActivityGroup;

  if (!result) {
    removeSwimlane(diagram, order);
    return;
  }

  const httpResult = await api.http.handleSwimLaneInsert({
    ...result,
    sequenceNumber: order
  });

  handleSwimLaneUpdate(diagram, order, httpResult);
  handleAppendingSwimLanesOrderUpdate(diagram, order);
});

const handleAppendingSwimLanesOrderUpdate = (diagram: go.Diagram, order: number) => {
  const api = getApiForDiagram(diagram);
  _.flowRight(
    _.forEach(({ data }: go.Group) => api.http.handleSwimLaneUpdate({ id: data.key, sequenceNumber: data.order })),
    _.filter((lane: go.Group) => lane.data.order > order),
    getLanes
  )(diagram);
};

const removeSwimlane = (diagram: go.Diagram, order: number) => {
  const swimlane = _.flowRight(
    _.head,
    _.filter({ data: { order } }),
    getLanes
  )(diagram);
  skipUndoManager(diagram, () => diagram.remove(swimlane));
};
