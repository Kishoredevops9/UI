import { Item } from '../../../task-creation/task-creation.model';
import { ActivityTaskStatusMap } from './activityTask';

const ACTIVITY_BLOCK_NAME = 'A';

export const parseTaskExecutionData = (taskExecutionData: Item): ActivityTaskStatusMap => {
  const result = {};

  const filterItems = (items: Item[]) => {
    items.forEach((item) => {
      if (item.name === ACTIVITY_BLOCK_NAME) {
        const { content } = item;
        result[content.contentId] = content.AssetStatusId;
        return;
      }

      if (item.children) {
        filterItems(item.children);
      }
    });
  }
  filterItems(taskExecutionData.children)

  return result;
}
