import * as go from 'gojs';
import * as _ from 'lodash/fp';

import { NodeData, NodeType } from '../../../../../../../types/node';
import { parseLanePhaseKey } from '../../../../utils/getLanePhaseKey';
import { mapNodeTypeToActivityTypeId } from '../../../../utils/mapNodeTypeToActivityTypeId';
import { skipUndoManager } from '../../../../utils/skipUndoManager';
import { getApiForDiagram } from '../../../getApiForDiagram';
import { handleNodeUpdate } from './handleNodeUpdate';
import { getRelativeLoc } from '../../../../utils/getRelativeLoc';
import { mapNodeDataToActivity } from '../../../../../../../utils/mapNodeDataToActivity';

export const showPropertiesForPastedNode = _.curry(async (
  diagram: go.Diagram,
  lanePhase: go.Group,
  part: go.Part
) => {
  const { phaseId, swimLaneId } = parseLanePhaseKey(part.containingGroup.key as string);
  const nextData = {
    ..._.omit(['activityConnections'])(part.data),
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
    removeNode(diagram, part);
    return;
  }

  handleNodeUpdate(diagram, properties);
  await saveChanges(diagram, swimLaneId, phaseId, part, properties);
});

const saveChanges = _.curry(async (
  diagram: go.Diagram,
  swimLaneId: number,
  phaseId: number,
  part: go.Part,
  properties: go.ObjectData
) => {
  let newKey;
  const api = getApiForDiagram(diagram);
  const data = diagram.findPartForKey(part.key)?.data;

  if (data.type === NodeType.Step) {

    await api.http.handleActivityUpdate(mapNodeDataToActivity({
      ...data,
      key: properties.id,
      loc: getRelativeLoc(diagram, data)
    }));
    newKey = properties.id;
  } else {
    const { id } = await api.http.handleActivityInsert({
      ..._.omit(['id'])(data),
      swimLaneId,
      phaseId,
      activityConnections: [],
      loc: getRelativeLoc(diagram, data)
    });
    newKey = id;
  }

  skipUndoManager(diagram, () => {
    diagram.model.setKeyForNodeData(data, newKey);
  });
});

const removeNode = (
  diagram: go.Diagram,
  part: go.Part
) => skipUndoManager(diagram, () => diagram.remove(part));
