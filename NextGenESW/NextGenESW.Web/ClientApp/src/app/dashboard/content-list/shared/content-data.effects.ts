import { mergeMap, catchError, map, switchMap, tap, concatMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { forkJoin, of } from 'rxjs';

import * as fromActions from './content-data.actions';
import { ContentListService } from '@app/dashboard/content-list/content-list.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { LOADING_TYPE } from '@app/dashboard/content-list/shared/content-data.reducer';

const LOADING_CHUNK_SIZE = 10;

const PAGINATION_INFO = {
  [LOADING_TYPE.PARTIAL]: { from: 0, size: LOADING_CHUNK_SIZE },
  [LOADING_TYPE.REST]: { from: LOADING_CHUNK_SIZE + 1, size: 0 },
  [LOADING_TYPE.FULL]: { from: 0, size: 0 }
};

@Injectable()
export class ContentDataEffects {
  constructor(
    private actions$: Actions,
    private contentListService: ContentListService,
    private ngxService: NgxUiLoaderService
  ) {
  }

  // Load Content data
  loadContentData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.loadContentData),
      concatMap(action => {
          const { implicitLoading, loadingType } = action || {};
          const { from, size } = PAGINATION_INFO[loadingType];
          if ( !implicitLoading ) {
            this.ngxService.startLoader('content-loader');
          }
          return forkJoin([
            this.contentListService.getContentLists(from, size),
            this.contentListService.getWebBasedContentLists(from, size)
          ]).pipe(
            tap(() => {
              this.ngxService.stopLoader('content-loader');
            }),
            map(([ contentList, webBasedList ]) => fromActions.loadContentDataSuccess({
                contentData: [ ...contentList, ...webBasedList ],
                loadingType
              })
            ),
            catchError((error) =>
              of(fromActions.loadContentDataFailure({ error }))
            )
          );
        }
      )
    )
  );
}
