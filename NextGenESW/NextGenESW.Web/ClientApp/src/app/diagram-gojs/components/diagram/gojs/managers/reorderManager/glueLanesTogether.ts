import * as _ from 'lodash/fp';
import * as go from 'gojs';

import { NodeData } from '../../../../../types/node';
import { changeOrder } from './changeOrder';

let ordersShift: {[key: string]: number} = {};

const changeIntersectedLanesOrder = (
  parts: go.Part[],
  isFollowing: boolean,
  currentOrder: number,
  partOrder: number
) => {
  const { diagram } = parts[0];
  const { nodeDataArray } = diagram.model;
  const draggedPartsOrders = _.map(({ data }) => data.order)(parts);
  let nextOrderShift = 0;

  _.flowRight(
    _.forEach((order: number) => {
      const { key } = _.find<NodeData>((data) =>
        data.order === order)(nodeDataArray)

      if (ordersShift[key]) {
        return ordersShift[key] += isFollowing ? -1 : 1;
      }
      ordersShift[key] = isFollowing ? -1 : 1;
      ++nextOrderShift;
    }),
    _.filter((order) => !_.includes(order)(draggedPartsOrders)),
    _.tail,
    _.range(currentOrder)
  )(partOrder);

  return nextOrderShift;
}

const changeOrders = (
  parts: go.Part[],
  currentOrder: number,
  isFollowing: boolean = false
) => {
  if (!parts.length) {
    return;
  }

  _.reduce(
    (nextOrder: number, { key, data: { order: laneOrder }}: go.Part) => {
      const shiftToAdd = changeIntersectedLanesOrder(
        parts,
        isFollowing,
        currentOrder,
        laneOrder
      );
      ordersShift[key] = nextOrder + shiftToAdd * (isFollowing ? 1 : -1);
      return nextOrder + shiftToAdd;
    },
    0
  )(parts);
}

const changeLanesOrder = (
  draggedLanes: go.Part[],
  shifts: { [key: string]: number }
) => _.flowRight(
  _.forEach((key: string) => {
    const { diagram } = draggedLanes[0];
    const nodeData = diagram.model.nodeDataArray
      .find((data) => data.key === key);
    const lane = diagram.findNodeForData(nodeData) as go.Group;
    changeOrder(shifts[key], lane);
  }),
  _.keys
)(shifts);

const glueLanesWithCurrent = (
  currentLane: go.Part,
  aboveCurrent: go.Part[],
  belowCurrent: go.Part[]
) => {
  const { top, bottom } = currentLane.actualBounds;
  const glueLanes = (initialValue, returnFunction, shouldDivideHeight) =>
    _.reduce((newY: number, part: go.Part) => {
      const { height } = part.actualBounds;
      const newYLocation = newY - (shouldDivideHeight ? height : 0);
      part.moveTo(part.location.x, newYLocation);
      return returnFunction(newY, height);
    }, initialValue);


  glueLanes(top, _.subtract, true)(aboveCurrent);
  glueLanes(bottom, _.add, false)(belowCurrent);
}

export const glueLanesTogether = (
  computedParts: go.Part[],
  currentPart: go.Part
) => {
  ordersShift = {};

  const currentOrder = currentPart.data.order;
  const [reversedFollowingCurrent, precedingAndWithCurrent] = _.partition<go.Group>(
    ({ data }) => data.order < currentOrder)(computedParts);
  const precedingCurrent = _.filter<go.Part>(({ key }) =>
    key !== currentPart.key)(precedingAndWithCurrent);
  const followingCurrent = _.reverse(reversedFollowingCurrent);

  changeOrders(precedingCurrent, currentOrder);
  changeOrders(followingCurrent, currentOrder, true);

  changeLanesOrder(computedParts, ordersShift);
  glueLanesWithCurrent(currentPart, followingCurrent, precedingCurrent);
}
