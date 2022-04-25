import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { ContentList } from './content-list.model';

//Publish Content Lists


export const previewContentLists = createAction(
  '[ContentList Load Component] Preview ContentLists',
  props<{ contentList: ContentList }>()
);

export const previewContentListsSuccess = createAction(
  '[ContentList Effect] Preview ContentLists',
  props<{ contentList: ContentList }>()
);

export const previewContentListsFailure = createAction(
  '[ProcessMap Effect] Preview ContentLists Failure',
  props<{ error: any }>()
);

export const publishContentLists = createAction(
  '[ContentList Load Component] Publish ContentLists',
  props<{ contentList: ContentList }>()
);

export const publishContentListsSuccess = createAction(
  '[ContentList Effect] Publish ContentLists',
  props<{ contentList: ContentList }>()
);

export const publishContentListsFailure = createAction(
  '[ProcessMap Effect] Publish ContentLists Failure',
  props<{ error: any}>()
);

// Load Content List
export const loadContentLists = createAction(
  '[ContentList Load Component] Load ContentLists'
);

export const loadContentListsSuccess = createAction(
  '[ContentList Effect] Load ContentLists Success',
  props<{ contentLists: ContentList[] }>()
);

export const loadContentListsFailure = createAction(
  '[ContentList Effect] Load ContentLists Failure',
  props<{ error: any}>()
);

// Add Content List
export const addContentList = createAction(
  '[ContentList/API] Add ContentList',
  props<{ contentList: ContentList }>()
);

export const upsertContentList = createAction(
  '[ContentList/API] Upsert ContentList',
  props<{ contentList: ContentList }>()
);

export const addContentLists = createAction(
  '[ContentList/API] Add ContentLists',
  props<{ contentLists: ContentList[] }>()
);

export const upsertContentLists = createAction(
  '[ContentList/API] Upsert ContentLists',
  props<{ contentLists: ContentList[] }>()
);

export const updateContentList = createAction(
  '[ContentList/API] Update ContentList',
  props<{ contentList: Update<ContentList> }>()
);

export const updateContentLists = createAction(
  '[ContentList/API] Update ContentLists',
  props<{ contentLists: Update<ContentList>[] }>()
);

export const deleteContentList = createAction(
  '[ContentList/API] Delete ContentList',
  props<{ id: string }>()
);

export const deleteContentLists = createAction(
  '[ContentList/API] Delete ContentLists',
  props<{ ids: string[] }>()
);

export const clearContentLists = createAction(
  '[ContentList/API] Clear ContentLists'
);
