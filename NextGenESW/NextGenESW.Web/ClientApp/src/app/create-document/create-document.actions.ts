import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { CreateDocument } from './create-document.model';

export const loadCreateDocuments = createAction(
  '[CreateDocument/API] Load CreateDocuments'
);

export const loadCreateDocumentsSuccess = createAction(
  '[CreateDocument Effect] Load CreateDocuments',
  props<{ createDocument: CreateDocument[] }>()
);

export const loadCreateDocumentsFailure = createAction(
  '[CreateDocument Effect] Load CreateDocuments Failure',
  props<{ error: any }>()
);

export const addCreateDocument = createAction(
  '[CreateDocument/API] Add CreateDocument',
  props<{ createDocument: CreateDocument }>()
);

export const upsertCreateDocument = createAction(
  '[CreateDocument/API] Upsert CreateDocument',
  props<{ createDocument: CreateDocument }>()
);

export const addCreateDocuments = createAction(
  '[CreateDocument/API] Add CreateDocuments',
  props<{ createDocuments: CreateDocument[] }>()
);

export const upsertCreateDocuments = createAction(
  '[CreateDocument/API] Upsert CreateDocuments',
  props<{ createDocuments: CreateDocument[] }>()
);

export const updateCreateDocument = createAction(
  '[CreateDocument/API] Update CreateDocument',
  props<{ createDocument: Update<CreateDocument> }>()
);

export const updateCreateDocuments = createAction(
  '[CreateDocument/API] Update CreateDocuments',
  props<{ createDocuments: Update<CreateDocument>[] }>()
);

export const deleteCreateDocument = createAction(
  '[CreateDocument/API] Delete CreateDocument',
  props<{ id: string }>()
);

export const deleteCreateDocuments = createAction(
  '[CreateDocument/API] Delete CreateDocuments',
  props<{ ids: string[] }>()
);

export const clearCreateDocuments = createAction(
  '[CreateDocument/API] Clear CreateDocuments'
);
