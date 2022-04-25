import * as go from 'gojs';
import * as _ from 'lodash/fp';

import { mapNodeTypeToActivityTypeId } from '../../../../utils/mapNodeTypeToActivityTypeId';
import { skipUndoManager } from '../../../../utils/skipUndoManager';
import { getApiForDiagram } from '../../../getApiForDiagram';
import { handleNodeUpdate } from './handleNodeUpdate';
import { parseLanePhaseKey } from '../../../../utils/getLanePhaseKey';
import { getRelativeLoc } from '../../../../utils/getRelativeLoc';
import { NodeData, NodeType } from '../../../../../../../types/node';
import { automaticLinkingManager } from '../../../../managers/automaticLinking/automaticLinkingManager';
import { mapNodeDataToActivity } from '../../../../../../../utils/mapNodeDataToActivity';

export const showPropertiesForNewNode = _.curry(async (
  diagram: go.Diagram,
  lanePhase: go.Group,
  part: go.Part
) => {
  const { phaseId, swimLaneId } = parseLanePhaseKey(lanePhase.key as string);
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
    type: 'InsertActivity',
    payload: nextData
  }) as NodeData;

  if (!properties) {
    removeNode(diagram, part);
    return;
  }

  handleNodeUpdate(diagram, {
    ...properties,
    loc: part.data.loc
  });
  await saveChanges(diagram, swimLaneId, phaseId, part, properties);

  automaticLinkingManager.handleNodeInserted(diagram, part);
});

const saveChanges = _.curry(async (
  diagram: go.Diagram,
  swimLaneId: number,
  phaseId: number,
  part: go.Part,
  properties: go.ObjectData
) => {
  const api = getApiForDiagram(diagram);
  const data = diagram.findPartForKey(part.key)?.data;

  if (data.type === NodeType.Step) {
    await api.http.handleActivityInsert({
      ...data,
      phaseId,
      swimLaneId,
      key: properties.id,
      loc: getRelativeLoc(diagram, data)
    });
    updateNodeKey(diagram, data, properties.id);
  } else {
    const response = await api.http.handleActivityInsert({
      ...data,
      swimLaneId,
      phaseId,
      loc: getRelativeLoc(diagram, data)
    });

    updateNodeKey(diagram, data, response.id);
    if (data.type === NodeType.ActivityBlock) {
      updateActivityBlock(diagram, data, response);
    }
  }
});

const removeNode = (
  diagram: go.Diagram,
  part: go.Part
) => skipUndoManager(diagram, () => diagram.remove(part));

const updateNodeKey = (
  diagram: go.Diagram,
  data: any,
  key: go.Key
) => skipUndoManager(diagram, () => {
  diagram.model.setKeyForNodeData(data, key);
});

const updateActivityBlock = (
  diagram: go.Diagram,
  data: any,
  response: any
) => skipUndoManager(diagram, () => {
  diagram.model.setDataProperty(
    data,
    'activityContainers',
    response.activityContainers
  );
});
