import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { TaskItemsList } from './task-items-list.model';
import * as TaskItemsListActions from './task-items-list.actions';

export const taskItemsListsFeatureKey = 'taskItemsLists';

export interface TaskItemsListState extends EntityState<TaskItemsList> {
  // additional entities state properties
}

export const adapter: EntityAdapter<TaskItemsList> = createEntityAdapter<
  TaskItemsList
>();

export const initialState: TaskItemsListState = adapter.getInitialState({
  // additional entity state properties
});

const taskItemsListReducer = createReducer(
  initialState,
  on(TaskItemsListActions.loadTaskItemsListSuccess, (state, action) => {
    return adapter.setAll(action.taskItemsList, {
      ...state,
      error: null,
    });
  }),
  on(TaskItemsListActions.loadTaskItemsListFailure, (state, action) => {
    return {
      ...state,
      error: action.error,
    };
  }),
  on(TaskItemsListActions.addTaskItemsList, (state, action) =>
    adapter.addOne(action.taskItemsList, state)
  ),
  on(TaskItemsListActions.upsertTaskItemsList, (state, action) =>
    adapter.upsertOne(action.taskItemsList, state)
  ),
  on(TaskItemsListActions.addTaskItemsLists, (state, action) =>
    adapter.addMany(action.taskItemsLists, state)
  ),
  on(TaskItemsListActions.upsertTaskItemsLists, (state, action) =>
    adapter.upsertMany(action.taskItemsLists, state)
  ),
  on(TaskItemsListActions.updateTaskItemsList, (state, action) =>
    adapter.updateOne(action.taskItemsList, state)
  ),
  on(TaskItemsListActions.updateTaskItemsLists, (state, action) =>
    adapter.updateMany(action.taskItemsLists, state)
  ),
  on(TaskItemsListActions.deleteTaskItemsList, (state, action) =>
    adapter.removeOne(action.id, state)
  ),
  on(TaskItemsListActions.deleteTaskItemsLists, (state, action) =>
    adapter.removeMany(action.ids, state)
  ),
  on(TaskItemsListActions.clearTaskItemsLists, (state) =>
    adapter.removeAll(state)
  )
);

export function reducer(state: TaskItemsListState | undefined, action: Action) {
  return taskItemsListReducer(state, action);
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();

export const selectAllTaskItemsList = selectAll;
