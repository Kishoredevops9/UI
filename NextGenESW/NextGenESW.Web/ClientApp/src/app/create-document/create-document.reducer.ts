import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { CreateDocument } from './create-document.model';
import * as CreateDocumentActions from './create-document.actions';

export const createDocumentsFeatureKey = 'createDocuments';

export interface CreateDocumentState extends EntityState<CreateDocument> {
  // additional entities state properties
}

export const adapter: EntityAdapter<CreateDocument> = createEntityAdapter<CreateDocument>();

export const initialState: CreateDocumentState = adapter.getInitialState({
  // additional entity state properties
});


export const reducer = createReducer(
  initialState,
  on(CreateDocumentActions.addCreateDocument,
    (state, action) => adapter.addOne(action.createDocument, state)
  ),
  on(CreateDocumentActions.upsertCreateDocument,
    (state, action) => adapter.upsertOne(action.createDocument, state)
  ),
  on(CreateDocumentActions.addCreateDocuments,
    (state, action) => adapter.addMany(action.createDocuments, state)
  ),
  on(CreateDocumentActions.upsertCreateDocuments,
    (state, action) => adapter.upsertMany(action.createDocuments, state)
  ),
  on(CreateDocumentActions.updateCreateDocument,
    (state, action) => adapter.updateOne(action.createDocument, state)
  ),
  on(CreateDocumentActions.updateCreateDocuments,
    (state, action) => adapter.updateMany(action.createDocuments, state)
  ),
  on(CreateDocumentActions.deleteCreateDocument,
    (state, action) => adapter.removeOne(action.id, state)
  ),
  on(CreateDocumentActions.deleteCreateDocuments,
    (state, action) => adapter.removeMany(action.ids, state)
  ),
  on(CreateDocumentActions.loadCreateDocumentsSuccess, (state, action) => {
    return adapter.setAll(action.createDocument, {
      ...state,
      error: null,
    });
  }),
  on(CreateDocumentActions.loadCreateDocumentsFailure, (state, action) => {
    return {
      ...state,
      error: action.error,
    };
  }),
  on(CreateDocumentActions.clearCreateDocuments,
    state => adapter.removeAll(state)
  ),
);


export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();

export const selectCreateDocumentList = selectAll;
