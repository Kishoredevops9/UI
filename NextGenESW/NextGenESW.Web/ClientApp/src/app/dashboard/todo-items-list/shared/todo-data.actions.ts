import { createAction, props } from '@ngrx/store';
import { LOADING_TYPE } from '@app/dashboard/content-list/shared/content-data.reducer';
import { TodoItemsList } from '@app/dashboard/todo-items-list/todo-items-list.model';

export const loadTodoData = createAction(
  '[TodoData Load Component] Load TodoData',
  props<{ implicitLoading: boolean, loadingType: LOADING_TYPE }>()
);

export const resetTodoData = createAction(
  '[TodoData Reset] Reset TodoData'
);

export const loadTodoDataSuccess = createAction(
  '[TodoData Effect] Load TodoData Success',
  props<{ todoData: TodoItemsList[], loadingType: LOADING_TYPE }>()
);

export const loadTodoDataFailure = createAction(
  '[TodoData Effect] Load TodoData Failure',
  props<{ error: any }>()
);
