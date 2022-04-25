// Load Content Data
import { createAction, props } from '@ngrx/store';
import { TaskItemsList } from '@app/dashboard/task-items-list/task-items-list.model';
import { LOADING_TYPE } from '@app/dashboard/task-items-list/shared/task-items-list.reducer';

export const loadTaskItemsList = createAction(
  '[TaskItemsList Load Component] Load TaskItemsList',
  props<{ implicitLoading: boolean, loadingType: LOADING_TYPE }>()
);

export const resetTaskItemsList = createAction(
  '[TaskItemsList Reset] Reset TaskItemsList'
);

export const loadTaskItemsListSuccess = createAction(
  '[TaskItemsList Effect] Load TaskItemsList Success',
  props<{ taskItemsList: TaskItemsList[], loadingType: LOADING_TYPE }>()
);

export const loadTaskItemsListFailure = createAction(
  '[TaskItemsList Effect] Load TaskItemsList Failure',
  props<{ error: any }>()
);
