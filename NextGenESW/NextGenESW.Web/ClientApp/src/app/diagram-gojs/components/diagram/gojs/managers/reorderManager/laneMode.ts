import * as go from 'gojs';
import * as _ from 'lodash/fp';

import { getLanes, isLane } from '../../utils/getLanes';
import { changeOrder } from './changeOrder';
import { getApiForDiagram } from '../../api/getApiForDiagram';

const updateParts = (draggedParts, newLocation, orderShift, intersectedPart) => {
  draggedParts.forEach(changeOrder(orderShift * -1));
  changeOrder(orderShift, intersectedPart);
  intersectedPart.move(new go.Point(intersectedPart.location.x, newLocation), true);
};

const getDraggedParts = (draggedParts) => _.flowRight(
  _.map(({ key }) => key),
  _.filter(({ key }) => isLane(key))
)(draggedParts.toArray());

const dragMouseUp = (diagram: go.Diagram) => {
  const api = getApiForDiagram(diagram);
  diagram.layout.invalidateLayout();
  _.forEach((lane: go.Group) => {
    api.http.handleSwimLaneUpdate({
      id: lane.key as number,
      sequenceNumber: lane.data.order
    });
  })(getLanes(diagram));
};

export const laneMode = {
  getComputedParts: (parts) => parts,
  getAxis: ({ y }) => y,
  getBounds: ({ top, bottom }) => ({ firstBound: top, secondBound: bottom }),
  getAllParts: ({ diagram }) => getLanes(diagram),
  getSize: ({ height }) => height,
  updateParts,
  dragMouseUp,
  getDraggedParts
};
