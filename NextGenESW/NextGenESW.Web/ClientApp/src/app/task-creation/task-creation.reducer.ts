import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { TaskCreationModel } from './task-creation.model';
import * as TaskCreationActions from './task-creation.actions';

export const TaskCreationFeatureKey = 'taskCreation';

export interface TaskCreationState extends EntityState<TaskCreationModel> {
  error: string;
}

export const adapter: EntityAdapter<TaskCreationModel> = createEntityAdapter<TaskCreationModel>();

export const initialState: TaskCreationState = adapter.getInitialState({
  error: undefined,
});

const TaskCreationReducer = createReducer(
  initialState,

  on(TaskCreationActions.loadTaskCreationSuccess, (state, action) =>
    adapter.setAll(action.taskCreation, {
      ...state,
      error: null,
    })
  ),

  on(TaskCreationActions.loadTaskCreationFailure, (state, action) => {
    return {
      ...state,
      error: action.error,
    };
  }),

  on(TaskCreationActions.addTaskCreation, (state, action) =>
    adapter.addOne(action.taskCreation, state)
  ),

  on(TaskCreationActions.upsertTaskCreation, (state, action) =>
    adapter.upsertOne(action.taskCreation, state)
  ),

  on(TaskCreationActions.updateTaskCreation, (state, action) =>
    adapter.updateOne(action.taskCreation, state)
  ),

  on(TaskCreationActions.deleteTaskCreation, (state, action) =>
    adapter.removeOne(action.id, state)
  ),

  on(TaskCreationActions.clearTaskCreation, (state) => adapter.removeAll(state))

);

export function reducer(state: TaskCreationState | undefined, action: Action) {
  return TaskCreationReducer(state, action);
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();

export const selectAllTaskCreation = selectAll;
