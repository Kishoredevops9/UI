import * as go from 'gojs';
import * as _ from 'lodash/fp';

import { Phase } from '../../../../process-maps/process-maps.model';
import { NodeData } from '../../../types/node';
import { nodeTypeDesiredSizeMap } from '../gojs/templates/shared/bindings/nodeTypeDesiredSize';

const OFFSET = 5;

const isNewActivity = (activity: NodeData) => activity.loc === '0 0';
const getActivityWidth = (object: NodeData) => nodeTypeDesiredSizeMap[object.type][0];
const getActivityHeight = (object: NodeData) => nodeTypeDesiredSizeMap[object.type][1];
const getHeight = (object: NodeData) => go.Size.parse(object?.size)?.height;
const getWidth = (object: NodeData) => go.Size.parse(object?.size)?.width;
const getY = (object: NodeData) => go.Point.parse(object?.loc)?.y;

const getLayoutInfo = _.reduce((result, activity) => {
  const yUnderActivities = getActivityHeight(activity) + getY(activity) + OFFSET;
  const singleGroup = result[activity.group];

  if (!singleGroup) {
    return {
      ...result,
      [activity.group]: isNewActivity(activity)
        ? { y: OFFSET, activities: [activity] }
        : { y: yUnderActivities, activities: []}
    };
  }
  return {
    ...result,
    [activity.group]: {
      ...singleGroup,
      ...(
        isNewActivity(activity)
          ? { y: singleGroup.y, activities: [...singleGroup.activities, activity] }
          : { y: Math.max(singleGroup.y, yUnderActivities), activities: singleGroup.activities }
      )
    }
  };
}, {});

export const layoutNewActivities = (
  phases: Phase[],
  lanes: NodeData[],
  activities: NodeData[]
) => {
  let layoutApiChanges = [];
  const lanesToUpdate = {};
  const phasesToUpdate = {};
  const activitiesToUpdate = {};
  const layoutInfo = getLayoutInfo(activities);

  _.forEach((groupKey) => {
    const activitiesToLayout = layoutInfo[groupKey].activities;
    let nextX = OFFSET;

    if (_.isEmpty(activitiesToLayout)) {
      return;
    }

    _.forEach((activityToLayout) => {
      activitiesToUpdate[activityToLayout.key] = go.Point.stringify(new go.Point(nextX, layoutInfo[groupKey].y));
      nextX += getActivityWidth(activityToLayout) + OFFSET;

      const bottomBound = layoutInfo[groupKey].y + getActivityHeight(activityToLayout) + OFFSET;
      const phaseWidth = getWidth(_.find(({ id }) => id === activityToLayout.phaseId)(phases));
      const swimLaneHeight = getHeight(_.find(({ key }) => key === activityToLayout.swimLaneId)(lanes));

      if (phaseWidth < nextX) {
        phasesToUpdate[activityToLayout.phaseId] = nextX;
      }
      if ((lanesToUpdate[activityToLayout.swimLaneId] || swimLaneHeight) < bottomBound) {
        lanesToUpdate[activityToLayout.swimLaneId] = bottomBound;
      }
    })(activitiesToLayout);
  })(_.keys(layoutInfo));

  const layoutedPhases = _.map((phase) => {
    if (!phasesToUpdate[phase.id]) {
      return phase;
    }

    const newSize = go.Size.stringify(new go.Size(phasesToUpdate[phase.id], getHeight(phase)));
    layoutApiChanges = [...layoutApiChanges, { type: 'UpdatePhase', payload: { id: phase.id, size: newSize }}];
    return { ...phase, size: newSize };
  })(phases);

  const layoutedLanes = _.map((lane) => {
    if (!lanesToUpdate[lane.key]) {
      return lane;
    }
    const newSize = go.Size.stringify(new go.Size(getWidth(lane), lanesToUpdate[lane.key]));
    layoutApiChanges = [...layoutApiChanges, { type: 'UpdateSwimLane', payload: { id: lane.key, size: newSize }}];
    return { ...lane, size: newSize };
  })(lanes);

  const layoutedActivities = _.map((activity) => {
    if (!activitiesToUpdate[activity.key]) {
      return activity;
    }
    const { x, y } = go.Point.parse(activitiesToUpdate[activity.key]);

    layoutApiChanges = [
      ...layoutApiChanges,
      {
        type: 'UpdateActivity',
        payload: { id: activity.key, locationX: x, locationY: y }
      }
    ];
    return { ...activity, loc: activitiesToUpdate[activity.key]};
  })(activities);

  return {
    layoutedPhases,
    layoutedLanes,
    layoutedActivities,
    layoutApiChanges
  };
};
