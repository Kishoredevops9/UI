import * as go from 'gojs';
import * as _ from 'lodash/fp';

import { ActivityGroup } from '../../../../../../../../process-maps/process-maps.model';
import { NodeData } from '../../../../../../../types/node';
import { getApiForDiagram } from '../../../getApiForDiagram';
import { handleSwimLaneUpdate } from './handleSwimLaneUpdate';

export const showPropertiesForExistingSwimLane = _.curry(async (
  diagram: go.Diagram,
  swimLaneData: NodeData
) => {
  const api = getApiForDiagram(diagram);
  const result = await api.openDialogBox({
    type: 'UpdateSwimLane',
    payload: swimLaneData
  }) as ActivityGroup;
  if (!result) {
    return;
  }

  const { key, size, loc, order } = swimLaneData;
  const httpResult = await api.http.handleSwimLaneUpdate({
    id: key as number,
    size,
    location: loc,
    sequenceNumber: order,
    ...result
  });

  handleSwimLaneUpdate(diagram, order, httpResult);
});
