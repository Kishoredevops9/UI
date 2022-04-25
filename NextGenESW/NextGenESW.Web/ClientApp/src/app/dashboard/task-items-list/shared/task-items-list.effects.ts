import { mergeMap, catchError, map, switchMap, tap, concatMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { forkJoin, of } from 'rxjs';

import * as fromActions from './task-items-list.actions';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { TaskItemsListService } from '@app/dashboard/task-items-list/task-items-list.service';
import { LOADING_TYPE } from '@app/dashboard/task-items-list/shared/task-items-list.reducer';

const LOADING_CHUNK_SIZE = 10;

const PAGINATION_INFO = {
  [LOADING_TYPE.PARTIAL]: { from: 0, size: LOADING_CHUNK_SIZE },
  [LOADING_TYPE.REST]: { from: LOADING_CHUNK_SIZE + 1, size: 0 },
  [LOADING_TYPE.FULL]: { from: 0, size: 0 }
};

@Injectable()
export class TaskItemsEffects {
  constructor(
    private actions$: Actions,
    private taskItemsListService: TaskItemsListService,
    private ngxService: NgxUiLoaderService
  ) {
  }

  // Load Content data
  loadContentData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.loadTaskItemsList),
      concatMap(action => {
          const { implicitLoading, loadingType } = action || {};
          const { from, size } = PAGINATION_INFO[loadingType];
          if ( !implicitLoading ) {
            this.ngxService.startLoader('task-list-loader');
          }
          return this.taskItemsListService.getTaskList(from, size).pipe(
            tap(() => {
              this.ngxService.stopLoader('task-list-loader');
            }),
            map((taskItemsList) => fromActions.loadTaskItemsListSuccess({
              taskItemsList,
                loadingType
              })
            ),
            catchError((error) =>
              of(fromActions.loadTaskItemsListFailure({ error }))
            )
          );
        }
      )
    )
  );
}
