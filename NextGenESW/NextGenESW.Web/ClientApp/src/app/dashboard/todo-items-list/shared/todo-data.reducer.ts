import { Action, createReducer, on } from '@ngrx/store';
import * as TodoDataActions from './todo-data.actions';
import { TodoItemsList } from '@app/dashboard/todo-items-list/todo-items-list.model';

export const todoDataFeatureKey = 'todoData';

export enum TODO_DATA_LOADING_STATUS {
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

export interface TodoDataState {
  error: string;
  partialTodoData: TodoItemsList[];
  allTodoData: TodoItemsList[];
  todoDataLoaded: TODO_DATA_LOADING_STATUS;
}

export const initialState: TodoDataState = {
  error: null,
  partialTodoData: [],
  allTodoData: [],
  todoDataLoaded: TODO_DATA_LOADING_STATUS.INITIAL
};

const todoDataReducer = createReducer(
  initialState,

  on(TodoDataActions.loadTodoData, (state, action) => {
    return {
      ...state,
      todoDataLoaded: TODO_DATA_LOADING_STATUS.LOADING
    };
  }),

  on(TodoDataActions.resetTodoData, (state, action) => {
    return {
      ...state,
      allTodoData: [],
      partialTodoData: [],
      error: null,
      todoDataLoaded: TODO_DATA_LOADING_STATUS.INITIAL
    };
  }),

  on(TodoDataActions.loadTodoDataSuccess, (state, action) => {
    const { todoData, loadingType } = action;
    const defaultStateUpdated = {
      ...state,
      error: null,
      todoDataLoaded: TODO_DATA_LOADING_STATUS.LOADED
    };
    switch ( loadingType ) {
      case LOADING_TYPE.REST:
        return {
          ...defaultStateUpdated,
          allTodoData: [ ...state.partialTodoData, ...todoData ]
        };
      case LOADING_TYPE.FULL:
        return {
          ...defaultStateUpdated,
          allTodoData: [ ...todoData ]
        };
      case LOADING_TYPE.PARTIAL:
        return {
          ...defaultStateUpdated,
          allTodoData: [ ...todoData ],
          partialTodoData: [ ...todoData ],
        };
    }
  }),

  on(TodoDataActions.loadTodoDataFailure, (state, action) => {
    return {
      ...state,
      error: action.error,
      allTodoData: [],
      partialTodoData: [],
      todoDataLoaded: TODO_DATA_LOADING_STATUS.ERROR
    };
  })
);

export function reducer(state: TodoDataState | undefined, action: Action) {
  return todoDataReducer(state, action);
}
