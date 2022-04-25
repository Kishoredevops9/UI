import * as _ from 'lodash/fp';
import * as go from 'gojs';

import { mapActivityTypeIdToNodeType } from './mapActivityTypeIdToNodeType';
import { NodeData, NodeType } from '../../../../types/node';
import { mapNodeTypeToCategory } from './mapNodeTypeToCategory';
import { getLanePhaseKey } from './getLanePhaseKey';

export const mapActivityToNodeData = _.curry((
  nodeData: NodeData,
  properties: go.ObjectData
): NodeData => {
  const { swimLaneId, name, activityTypeId, color, locationX, locationY, phaseId } = properties;
  const type = mapActivityTypeIdToNodeType(activityTypeId);
  const category = mapNodeTypeToCategory(type);
  const activityProperties = _.omit([
    'reviewGate',
    'locationX',
    'locationY',
    'id'
  ])(properties);
  const group = getLanePhaseKey(phaseId, swimLaneId);
  const loc = `${locationX || 0} ${locationY || 0}`;

  return {
    backgroundColor: color,
    ...nodeData,
    ...activityProperties,
    type,
    category,
    text: name,
    loc,
    phaseId,
    ...getDocumentProperties(properties),
    ...(phaseId && swimLaneId ? { group } : {}),
  };
});

export const getDocumentProperties = (properties: go.ObjectData) => {
  const type = mapActivityTypeIdToNodeType(properties.activityTypeId);
  const [document] = properties.activityDocuments || [];
  if (!document) {
    return {};
  }

  if (type === NodeType.ActivityBlock) {
    return {
      documentId: `${document.type}-${document.contentId}`,
      activityPageId: document.activityPageId
    };
  }
  if (type === NodeType.KPack) {
    return {
      documentId: `${document.type}-${document.contentId}`,
      activityPageId: document.activityPageId
    };
  }

  if (type === NodeType.SubMapLink) {
    return {
      subProcessMapId: document.subProcessMapId
    };
  }

  return {};
};
