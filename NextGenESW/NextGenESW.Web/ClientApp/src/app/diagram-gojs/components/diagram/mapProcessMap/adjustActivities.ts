import * as _ from 'lodash/fp';
import * as go from 'gojs';

const getRealLoc = (loc: string, parentLoc: string) => {
  const { x, y } = go.Point.parse(loc);
  const { x: parentX, y: parentY } = go.Point.parse(parentLoc);

  return new go.Point(parentX + x, parentY + y);
};

export const adjustActivities = (activities, lanePhases) => _.map((activity) => {
  const parent = _.find(({ key }) => key === activity.group)(lanePhases);
  if (!parent) {
    return activity;
  }

  const { x: realX, y: realY } = getRealLoc(activity.loc, parent.loc);
  const { x: minX, y: minY } = go.Point.parse(parent.loc);
  const { width, height } = go.Size.parse(parent.size);
  const maxX = minX + width;
  const maxY = minY + height;

  return {
    ...activity,
    loc: go.Point.stringify(
      new go.Point(
        _.clamp(minX, maxX, realX),
        _.clamp(minY, maxY, realY)
      )
    )
  };
})(activities);
