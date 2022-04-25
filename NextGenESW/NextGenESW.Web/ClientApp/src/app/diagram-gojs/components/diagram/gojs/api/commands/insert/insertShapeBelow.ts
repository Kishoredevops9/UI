import * as _ from 'lodash/fp';
import * as go from 'gojs';

import { NodeData } from '../../../../../../types/node';
import { updateGroupBounds } from '../../../managers/updateGroupBounds/updateGroupBounds';
import { mapNodeTypeToLabel } from '../../../utils/mapNodeTypeToLabel';
import { getApiForDiagram } from '../../getApiForDiagram';

const PRIMARY_MARGIN_Y = 12;
const PRIMARY_MARGIN_X = 2;
const OVERLAPPING_DELTA = 5;
const MARGIN = 12;

const isOverlapping = (target: go.Part, rect: Partial<go.Rect>) => {
  const { x, y } = target.actualBounds;
  const { x: rectX, y: rectY } = rect;

  return Math.abs(rectX - x) < OVERLAPPING_DELTA
    && Math.abs(rectY - y) < OVERLAPPING_DELTA;
}

const getTargetLocation = (
  sourcePart: go.Part
) => {
  const siblingParts = sourcePart.containingGroup.memberParts;
  const { x, y, height } = sourcePart.actualBounds;

  let targetLocation = { x: x + PRIMARY_MARGIN_X, y: y + height + PRIMARY_MARGIN_Y };
  let searchingResult = false;
  do {
    searchingResult = false;
    for (let iterator = siblingParts.iterator; iterator.hasNext();) {
      const sibling = iterator.value;

      if (isOverlapping(sibling, targetLocation)) {
        targetLocation = {
          x: targetLocation.x + MARGIN,
          y: targetLocation.y + MARGIN
        };
        searchingResult = true;
        break;
      }
    }
    
    siblingParts.reset();
  } while(searchingResult);

  return new go.Point(targetLocation.x, targetLocation.y);
}

const createTargetData = (
  sourcePart: go.Part
): NodeData => {
  const { category, type } = sourcePart.data;
  const targetLocation = getTargetLocation(sourcePart);

  return {
    category,
    type,
    text: mapNodeTypeToLabel(type),
    loc: go.Point.stringify(targetLocation)
  };
};

export const insertShapeBelow = _.curry((
  diagram: go.Diagram,
  sourceData: NodeData
) => diagram.commit(() => {
  const sourcePart = diagram.findPartForKey(sourceData.key);
  const part = createTargetData(sourcePart);
  diagram.model.addNodeData(part);

  const group = sourcePart.containingGroup;
  const targetPart = diagram.findPartForKey(part.key);
  group.addMembers(new go.List([targetPart]));

  targetPart.ensureBounds();
  updateGroupBounds(group, targetPart);

  getApiForDiagram(diagram).showPropertiesForNewNode(group, targetPart);
}));
