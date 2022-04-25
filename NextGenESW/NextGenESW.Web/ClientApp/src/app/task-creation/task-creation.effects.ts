import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TaskCrationPageService } from './task-creation.service';
import { map, mergeMap, catchError } from 'rxjs/operators';
import * as fromActions from './task-creation.actions';
import { of } from 'rxjs/internal/observable/of';

@Injectable()
export class TaskCreationEffects {
    
  loadTaskCreation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.loadTaskCreation),
      mergeMap(() =>
        this.taskCreationPageService.getTaskCreation().pipe(
          map((taskCreation) =>
            fromActions.loadTaskCreationSuccess({ taskCreation })
          ),
          catchError((error) =>
            of(fromActions.loadTaskCreationFailure({ error }))
          )
        )
      )
    )
  );
  constructor(
    private actions$: Actions,
    private taskCreationPageService: TaskCrationPageService
  ) {}
}
