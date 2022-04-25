import { Injectable } from '@angular/core';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { NewsListService } from './news-list.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as fromActions from './news-list.actions';
import { of } from 'rxjs/internal/observable/of';

@Injectable()
export class NewsListEffects {
  loadNewsList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.loadNewsLists),
      mergeMap(() =>
        this.newsListService.getNewsList().pipe(
          map((newsList) => fromActions.loadNewsListsSuccess({ newsList })),
          catchError((error) => of(fromActions.loadNewsListsFailure({ error })))
        )
      )
    )
  );
  constructor(
    private actions$: Actions,
    private newsListService: NewsListService
  ) {}
}
