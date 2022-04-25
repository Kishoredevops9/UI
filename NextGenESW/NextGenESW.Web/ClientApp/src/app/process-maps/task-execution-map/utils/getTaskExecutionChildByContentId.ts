import * as _ from 'lodash/fp';
import { Item } from '../../../task-creation/task-creation.model';

export const getTaskExecutionChildByContentId = (
  parent: Item,
  contentId: string
) => _.find(
  (stepFlow: Item) => stepFlow.content.contentId === contentId
)(parent.children);
