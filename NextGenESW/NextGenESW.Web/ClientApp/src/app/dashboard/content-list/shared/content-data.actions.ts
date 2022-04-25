// Load Content Data
import { createAction, props } from '@ngrx/store';
import { ContentList } from '@app/dashboard/content-list/content-list.model';
import { LOADING_TYPE } from '@app/dashboard/content-list/shared/content-data.reducer';

export const loadContentData = createAction(
  '[ContentData Load Component] Load ContentData',
  props<{ implicitLoading: boolean, loadingType: LOADING_TYPE }>()
);

export const resetContentData = createAction(
  '[ContentData Reset] Reset ContentData'
);

export const loadContentDataSuccess = createAction(
  '[ContentData Effect] Load ContentData Success',
  props<{ contentData: ContentList[], loadingType: LOADING_TYPE }>()
);

export const loadContentDataFailure = createAction(
  '[ContentData Effect] Load ContentData Failure',
  props<{ error: any }>()
);
