import { Activity } from '../../../../../process-maps/process-maps.model';
import { Item } from '../../../../task-creation.model';

type ActivityContentVisibilityMap = {
  [key: string]: boolean;
}

const getContentVisibilityMap = (activity: Item): ActivityContentVisibilityMap => {
  const result = {}
  const getChildrenContent = (items: Item[]) => items.forEach(
    (item) => {
      result[item.content.contentId] = item.content.IncludedInd;

      if (item.children && item.children.length) {
        getChildrenContent(item.children);
      }
    }
  );
  getChildrenContent(activity.children);

  return result;
}

export const processActivityContentFilter = (
  item: Item,
  activity: Activity
) => {
  (activity as any).contentVisibilityMap = getContentVisibilityMap(item);
  return activity;
}
