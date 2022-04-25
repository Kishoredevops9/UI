import * as _ from 'lodash/fp';
import { mapActivityTypeIdToNodeType } from '../../../../../diagram-gojs/components/diagram/gojs/utils/mapActivityTypeIdToNodeType';
import { NodeType } from '../../../../../diagram-gojs/types/node';

import { Activity, ProcessMap } from '../../../../../process-maps/process-maps.model';
import { isIncluded } from '../../../../../process-maps/task-execution-map/utils/isIncluded';
import { Item } from '../../../../task-creation.model';
import { processActivityContentFilter } from './processActivityContentFilter';

type TaskExecutionActivitiesMap = {
  [key: string]: Item
};

const getTaskExecutionActivitiesMap = (
  taskExecutionStep: Item
): TaskExecutionActivitiesMap => {
  const disciplines = taskExecutionStep.children;
  return _.flowRight(
    _.reduce((a: {}, b: {}) => ({ ...a, ...b }), {}),
    _.map((activity: Item) => ({ [activity.content.title]: activity })),
    _.flatMap(
      (discipline: Item) => discipline.children
    )
  )(disciplines)
}

const processActivities = (
  taskExecutionActivitiesMap: TaskExecutionActivitiesMap,
  activityBlocks: Activity[]
) => _.flowRight(
  _.filter(_.identity),
  _.map((activity: Activity) => {
    const type = mapActivityTypeIdToNodeType(activity.activityTypeId);
    if (type !== NodeType.ActivityBlock) {
      return activity;
    }
    const item = taskExecutionActivitiesMap[activity.name];
    return isIncluded(item)
      && processActivityContentFilter(item, activity);
  })
)(activityBlocks);

export const filterSelectedActivityBlocks = (
  taskExecutionStep: Item,
  processMap: ProcessMap
) => {
  const taskExecutionActivitiesMap = getTaskExecutionActivitiesMap(taskExecutionStep);

  return {
    ...processMap,
    activityBlocks: processActivities(
      taskExecutionActivitiesMap,
      processMap.activityBlocks
    )
  };
};
