import * as _ from 'lodash/fp';
import * as go from 'gojs';

import { Activity } from '../../process-maps/process-maps.model';
import { NodeData, NodeType } from '../types/node';

export const mapNodeDataToActivity = (node: NodeData): Activity => {
  const activityProperties = _.omit([
    'key',
    'type',
    'text',
    'category',
    'group',
    'loc',
    'backgroundColor',
    '__gohashid',
    'activityDocuments'
  ])(node);

  return {
    ...activityProperties,
    id: getId(node),
    name: getName(node),
    phaseId: node.phaseId,
    color: getBackgroundColor(node),
    assetContentId: getAssetContentId(node),
    ...getLocation(node)
  };
};

const getId = (node: NodeData) => node.id || node.key;

const getLocation = (node: NodeData) => {
  const { loc, locationX, locationY } = node;
  if (!loc) {
    return {
      locationX,
      locationY
    };
  }

  const { x, y } = go.Point.parse(node.loc);
  return {
    locationX: Math.round(x),
    locationY: Math.round(y)
  };
};

const getName = (node: NodeData) => node.name || node.text;

const getBackgroundColor = (node: NodeData) => node.color || node.backgroundColor;

const getAssetContentId = (node: NodeData) => {
  if (node.assetContentId) {
    return node.assetContentId;
  }

  if (
    node.type === NodeType.ActivityBlock
    || node.type === NodeType.Step
  ) {
    return node.description;
  }

  return node.assetContentId;
}
