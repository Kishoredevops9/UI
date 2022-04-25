import * as _ from 'lodash/fp';
import { Item } from '../../../task-creation/task-creation.model';
import { isIncluded } from './isIncluded';

export const getIncludedStepFlows = (
  root: Item
): Item => _.filter(isIncluded)(
  root.children
);
