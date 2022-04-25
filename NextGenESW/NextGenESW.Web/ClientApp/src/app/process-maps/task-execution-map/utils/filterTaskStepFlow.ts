import * as _ from 'lodash/fp';

import { mapActivityTypeIdToNodeType } from '../../../diagram-gojs/components/diagram/gojs/utils/mapActivityTypeIdToNodeType';
import { NodeType } from '../../../diagram-gojs/types/node';
import { Item } from '../../../task-creation/task-creation.model';
import { Activity, ProcessMap } from '../../process-maps.model';
import { getTaskExecutionChildByContentId } from './getTaskExecutionChildByContentId';
import { isIncluded } from './isIncluded';

const filterSelectedSteps = (
  stepFlow: Item,
  activityBlocks: Activity[]
): Activity[] => _.filter((activity: Activity) => {
  const type = mapActivityTypeIdToNodeType(activity.activityTypeId);
  if (type !== NodeType.Step) {
    return true;
  }

  const taskExecutionStep = getTaskExecutionChildByContentId(
    stepFlow, activity.assetContentId
  );
  if (!taskExecutionStep) {
    console.warn(`STEP ${activity.assetContentId} is not included in task execution data`);
    return false;
  }
  return isIncluded(taskExecutionStep);
})(activityBlocks);

export const filterTaskStepFlow = (
  taskExecution: Item,
  contentId: string,
  processMap: ProcessMap
) => {
  const stepFlow = getTaskExecutionChildByContentId(taskExecution, contentId);
  const activityBlocks = filterSelectedSteps(stepFlow, processMap.activityBlocks);

  return {
    ...processMap,
    activityBlocks
  };
}
