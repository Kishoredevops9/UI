import * as go from 'gojs';
import * as _ from 'lodash/fp';

import { NodeData } from '../../../../../../../types/node';
import { mapNodeTypeToActivityTypeId } from '../../../../utils/mapNodeTypeToActivityTypeId';
import { getApiForDiagram } from '../../../getApiForDiagram';
import { handleNodeUpdate } from './handleNodeUpdate';
import { parseLanePhaseKey } from '../../../../utils/getLanePhaseKey';
import { getRelativeLoc } from '../../../../utils/getRelativeLoc';
import { mapNodeDataToActivity } from '../../../../../../../utils/mapNodeDataToActivity';

export const showPropertiesForExistingNode = _.curry(async (
  diagram: go.Diagram,
  data: NodeData
) => {
  const { key } = data;
  const part = diagram.findPartForKey(key);
  const { phaseId, swimLaneId } = parseLanePhaseKey(part.containingGroup.key as string);
  const nextData = {
    ...part.data,
    activityTypeId: mapNodeTypeToActivityTypeId(part.data.type),
    swimLaneId,
    phaseId
  };

  if (!nextData.activityTypeId) {
    return;
  }

  const api = getApiForDiagram(diagram);
  const properties = await api.openDialogBox({
    type: 'UpdateActivity',
    payload: nextData
  }) as NodeData;
  if (!properties) {
    return;
  }
  properties.loc = nextData.loc;

  await api.http.handleActivityUpdate(mapNodeDataToActivity({
    ...properties,
    swimLaneId,
    phaseId,
    loc: getRelativeLoc(diagram, properties)
  }));
  handleNodeUpdate(diagram, properties);
});
