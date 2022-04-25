import { catchError, map, tap, concatMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import * as fromActions from './todo-data.actions';
import { LOADING_TYPE } from '@app/dashboard/todo-items-list/shared/todo-data.reducer';
import { TodoItemsListService } from '@app/dashboard/todo-items-list/todo-items-list.service';

const LOADING_CHUNK_SIZE = 10;

const PAGINATION_INFO = {
  [LOADING_TYPE.PARTIAL]: { from: 0, size: LOADING_CHUNK_SIZE },
  [LOADING_TYPE.REST]: { from: LOADING_CHUNK_SIZE + 1, size: 0 },
  [LOADING_TYPE.FULL]: { from: 0, size: 0 }
};

@Injectable()
export class TodoDataEffects {
  constructor(
    private actions$: Actions,
    private todoItemsListService: TodoItemsListService,
    private ngxService: NgxUiLoaderService
  ) {
  }

  // Load Todo data
  loadTodoData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.loadTodoData),
      concatMap(action => {
          const { implicitLoading, loadingType } = action || {};
          const { from, size } = PAGINATION_INFO[loadingType];
          if ( !implicitLoading ) {
            this.ngxService.startLoader('todo-loader');
          }
          return this.todoItemsListService.getTaskItemsList(from, size).pipe(
            tap(() => {
              this.ngxService.stopLoader('todo-loader');
            }),
            map((todoList) => fromActions.loadTodoDataSuccess({
                todoData: todoList,
                loadingType
              })
            ),
            catchError((error) =>
              of(fromActions.loadTodoDataFailure({ error }))
            )
          );
        }
      )
    )
  );
}
