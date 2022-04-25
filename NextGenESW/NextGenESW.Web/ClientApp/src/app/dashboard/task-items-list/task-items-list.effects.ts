import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TaskItemsListService } from './task-items-list.service';
import { map, mergeMap, catchError } from 'rxjs/operators';
import * as fromActions from './task-items-list.actions';
import { of } from 'rxjs/internal/observable/of';

@Injectable()
export class TaskItemsListEffects {
  //  Load Task List
  loadTaskList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.loadTaskItemsList),
      mergeMap(() =>
        this.taskListService.getTaskList().pipe(
          map((taskItemsList) =>
            fromActions.loadTaskItemsListSuccess({ taskItemsList })
          ),
          catchError((error) =>
            of(fromActions.loadTaskItemsListFailure({ error }))
          )
        )
      )
    )
  );
  constructor(
    private actions$: Actions,
    private taskListService: TaskItemsListService
  ) {}
}
