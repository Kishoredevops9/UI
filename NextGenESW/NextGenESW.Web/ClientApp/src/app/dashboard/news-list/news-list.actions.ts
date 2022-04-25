import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { NewsList } from './news-list.model';

// Load news List
export const loadNewsLists = createAction(
  '[NewsList List Component] Load NewsList'
);

export const loadNewsListsSuccess = createAction(
  '[NewsList Effect] Load NewsList Success',
  props<{ newsList: NewsList[] }>()
);

export const loadNewsListsFailure = createAction(
  '[NewsList Effect] Load NewsList Failure',
  props<{ error: any }>()
);

export const addNewsList = createAction(
  '[NewsList/API] Add NewsList',
  props<{ newsList: NewsList }>()
);

export const upsertNewsList = createAction(
  '[NewsList/API] Upsert NewsList',
  props<{ newsList: NewsList }>()
);

export const addNewsLists = createAction(
  '[NewsList/API] Add NewsLists',
  props<{ newsLists: NewsList[] }>()
);

export const upsertNewsLists = createAction(
  '[NewsList/API] Upsert NewsLists',
  props<{ newsLists: NewsList[] }>()
);

export const updateNewsList = createAction(
  '[NewsList/API] Update NewsList',
  props<{ newsList: Update<NewsList> }>()
);

export const updateNewsLists = createAction(
  '[NewsList/API] Update NewsLists',
  props<{ newsLists: Update<NewsList>[] }>()
);

export const deleteNewsList = createAction(
  '[NewsList/API] Delete NewsList',
  props<{ id: string }>()
);

export const deleteNewsLists = createAction(
  '[NewsList/API] Delete NewsLists',
  props<{ ids: string[] }>()
);

export const clearNewsLists = createAction('[NewsList/API] Clear NewsLists');
