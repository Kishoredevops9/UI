import { mergeMap, catchError, map } from 'rxjs/operators';
import { ContentListService } from './content-list.service';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as fromActions from './content-list.actions';
import { of } from 'rxjs';

@Injectable()
export class ContentListEffects {
  constructor(
    private actions$: Actions,
    private ContentListService: ContentListService
  ) { }
  // Load Content List
  loadContentList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.loadContentLists),
      mergeMap(() =>
        this.ContentListService.getContentLists().pipe(
          map((contentLists) =>
            fromActions.loadContentListsSuccess({ contentLists })
          ),
          catchError((error) =>
            of(fromActions.loadContentListsFailure({ error }))
          )
        )
      )
    )
  );

  //Publish Content Lists
  publishContentList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.publishContentLists),
      mergeMap((action) =>
        this.ContentListService.publishContentLists(action.contentList).pipe(
          map(() =>
            fromActions.publishContentListsSuccess({
              contentList: action.contentList,
            })
          ),
          catchError((error) =>
            of(fromActions.publishContentListsFailure({ error }))
          )
        )
      )
    )
  );

  //Preview Content Lists
  previewContentList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.previewContentLists),
      mergeMap((action) =>
        this.ContentListService.previewContentLists(action.contentList).pipe(
          map(() =>
            fromActions.previewContentListsSuccess({
              contentList: action.contentList,
            })
          ),
          catchError((error) =>
            of(fromActions.previewContentListsFailure({ error }))
          )
        )
      )
    )
  );
}
