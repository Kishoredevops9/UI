import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { TaskCreationModel } from './task-creation.model';

// Load Task Creation List
export const loadTaskCreation = createAction(
  '[Task Creation Component] Load TaskCreation'
);

export const loadTaskCreationSuccess = createAction(
  '[Task Creation Effect] Load TaskCreation Success',
  props<{ taskCreation: TaskCreationModel[] }>()
);

export const loadTaskCreationFailure = createAction(
  '[Task Creation Effect] Load TaskCreation Failure',
  props<{ error: any }>()
);

export const addTaskCreation = createAction(
  '[TaskCreation/API] Add TaskCreation',
  props<{ taskCreation: TaskCreationModel }>()
);

export const upsertTaskCreation = createAction(
  '[TaskCreation/API] Upsert TaskCreation',
  props<{ taskCreation: TaskCreationModel }>()
);

export const updateTaskCreation = createAction(
  '[TaskCreation/API] Update TaskCreation',
  props<{ taskCreation: Update<TaskCreationModel> }>()
);

export const deleteTaskCreation = createAction(
  '[TaskCreation/API] Delete TaskCreation',
  props<{ id: any }>()
);

export const clearTaskCreation = createAction('[TaskCreation/API] Clear TaskCreation ');
