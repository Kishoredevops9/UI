import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { TaskItemsList } from './task-items-list.model';

export const loadTaskItemsList = createAction(
  '[TaskItemsList List Component] Load TaskItemsList'
);

export const loadTaskItemsListSuccess = createAction(
  '[TaskItemsList Effect] Load TaskItemsList Success',
  props<{ taskItemsList: TaskItemsList[] }>()
);

export const loadTaskItemsListFailure = createAction(
  '[TaskItemsList Effect] Load TaskItemsList Failure',
  props<{ error: any }>()
);

export const addTaskItemsList = createAction(
  '[TaskItemsList/API] Add TaskItemsList',
  props<{ taskItemsList: TaskItemsList }>()
);

export const upsertTaskItemsList = createAction(
  '[TaskItemsList/API] Upsert TaskItemsList',
  props<{ taskItemsList: TaskItemsList }>()
);

export const addTaskItemsLists = createAction(
  '[TaskItemsList/API] Add TaskItemsLists',
  props<{ taskItemsLists: TaskItemsList[] }>()
);

export const upsertTaskItemsLists = createAction(
  '[TaskItemsList/API] Upsert TaskItemsLists',
  props<{ taskItemsLists: TaskItemsList[] }>()
);

export const updateTaskItemsList = createAction(
  '[TaskItemsList/API] Update TaskItemsList',
  props<{ taskItemsList: Update<TaskItemsList> }>()
);

export const updateTaskItemsLists = createAction(
  '[TaskItemsList/API] Update TaskItemsLists',
  props<{ taskItemsLists: Update<TaskItemsList>[] }>()
);

export const deleteTaskItemsList = createAction(
  '[TaskItemsList/API] Delete TaskItemsList',
  props<{ id: string }>()
);

export const deleteTaskItemsLists = createAction(
  '[TaskItemsList/API] Delete TaskItemsLists',
  props<{ ids: string[] }>()
);

export const clearTaskItemsLists = createAction(
  '[TaskItemsList/API] Clear TaskItemsLists'
);
