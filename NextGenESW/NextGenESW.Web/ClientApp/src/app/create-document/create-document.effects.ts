import { Injectable } from '@angular/core';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { CreateDocumentService } from './create-document.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as fromActions from './create-document.actions';
import { of } from 'rxjs/internal/observable/of';

@Injectable()
export class CreateDocumentEffects {
  loadNewsList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.loadCreateDocuments),
      mergeMap((action) =>
        this.createDocumentService.getLessonLearned().pipe(
          map((createDocument) => 
          fromActions.loadCreateDocumentsSuccess({ createDocument })),
          catchError((error) => of(fromActions.loadCreateDocumentsFailure({ error })))
        )
      )
    ) 
  );
  constructor(
    private actions$: Actions,
    private createDocumentService: CreateDocumentService
  ) {}
}
