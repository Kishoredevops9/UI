import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { LobbyHomeService } from './lobby-home.service';
import { map, mergeMap, catchError } from 'rxjs/operators';
import * as fromActions from './lobby-home.actions';
import { of } from 'rxjs/internal/observable/of';

@Injectable()
export class TaskLobbyHomeEffects {
  //  Load Lobby Home List

          // loadCourses$ = createEffect(() =>
          //   this.actions$.pipe(
          //     ofType(courseActionTypes.loadCourses),
          //     switchMap(() => this.courseService.AllUser()),
          //     map((courses) => courseActionTypes.coursesLoaded({ courses }))
          //   )
          // );
  
  loadLobbyHome$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.loadLobbyHome),
      mergeMap(() =>
        this.lobbyHomeService.getLobbyHome().pipe(
          map((lobbyHome) =>
            fromActions.loadLobbyHomeSuccess({ lobbyHome })
          ),
          catchError((error) =>
            of(fromActions.loadLobbyHomeFailure({ error }))
          )
        )
      )
    )
  );
  constructor(
    private actions$: Actions,
    private lobbyHomeService: LobbyHomeService
  ) {}
}
