import { Action, createReducer, on } from '@ngrx/store';
import * as TaskItemListActions from './task-items-list.actions';
import { TaskItemsList } from '@app/dashboard/task-items-list/task-items-list.model';

export const taskItemFeatureKey = 'taskItemsListData';

export enum TASK_ITEMS_LIST_LOADING_STATUS {
  INITIAL,
  LOADING,
  LOADED,
  ERROR
}

export enum LOADING_TYPE {
  PARTIAL,
  FULL,
  REST
}

export interface TaskItemsListState {
  error: string;
  partialTaskItemsListData: TaskItemsList[];
  allTaskItemsListData: TaskItemsList[];
  taskItemsListDataLoaded: TASK_ITEMS_LIST_LOADING_STATUS;
}

export const initialState: TaskItemsListState = {
  error: null,
  partialTaskItemsListData: [],
  allTaskItemsListData: [],
  taskItemsListDataLoaded: TASK_ITEMS_LIST_LOADING_STATUS.INITIAL
};

const taskItemsListReducer = createReducer(
  initialState,

  on(TaskItemListActions.loadTaskItemsList, (state, action) => {
    return {
      ...state,
      taskItemsListDataLoaded: TASK_ITEMS_LIST_LOADING_STATUS.LOADING
    };
  }),

  on(TaskItemListActions.resetTaskItemsList, (state, action) => {
    return {
      ...state,
      allTaskItemsListData: [],
      partialTaskItemsListData: [],
      error: null,
      taskItemsListDataLoaded: TASK_ITEMS_LIST_LOADING_STATUS.INITIAL
    };
  }),

  on(TaskItemListActions.loadTaskItemsListSuccess, (state, action) => {
    const { taskItemsList, loadingType } = action;
    const defaultStateUpdated = {
      ...state,
      error: null,
      taskItemsListDataLoaded: TASK_ITEMS_LIST_LOADING_STATUS.LOADED
    };
    switch ( loadingType ) {
      case LOADING_TYPE.REST:
        return {
          ...defaultStateUpdated,
          allTaskItemsListData: [ ...state.partialTaskItemsListData, ...taskItemsList ]
        };
      case LOADING_TYPE.FULL:
        return {
          ...defaultStateUpdated,
          allTaskItemsListData: [ ...taskItemsList ]
        };
      case LOADING_TYPE.PARTIAL:
        return {
          ...defaultStateUpdated,
          allTaskItemsListData: [ ...taskItemsList ],
          partialTaskItemsListData: [ ...taskItemsList ],
        };
    }
  }),

  on(TaskItemListActions.loadTaskItemsListFailure, (state, action) => {
    return {
      ...state,
      error: action.error,
      allTaskItemsListData: [],
      partialTaskItemsListData: [],
      taskItemsListDataLoaded: TASK_ITEMS_LIST_LOADING_STATUS.ERROR
    };
  })
);

export function reducer(state: TaskItemsListState | undefined, action: Action) {
  return taskItemsListReducer(state, action);
}
