import { Action, createReducer, on } from '@ngrx/store';
import { ContentList } from '../content-list.model';
import * as ContentDataActions from './content-data.actions';

export const contentDataFeatureKey = 'contentData';

export enum CONTENT_DATA_LOADING_STATUS {
  INITIAL,
  LOADING,
  LOADED,
  ERROR
}

export enum LOADING_TYPE {
  PARTIAL,
  FULL,
  REST
}

export interface ContentDataState {
  error: string;
  partialContentData: ContentList[];
  allContentData: ContentList[];
  contentDataLoaded: CONTENT_DATA_LOADING_STATUS;
}

export const initialState: ContentDataState = {
  error: null,
  partialContentData: [],
  allContentData: [],
  contentDataLoaded: CONTENT_DATA_LOADING_STATUS.INITIAL
};

const contentDataReducer = createReducer(
  initialState,

  on(ContentDataActions.loadContentData, (state, action) => {
    return {
      ...state,
      contentDataLoaded: CONTENT_DATA_LOADING_STATUS.LOADING
    };
  }),

  on(ContentDataActions.resetContentData, (state, action) => {
    return {
      ...state,
      allContentData: [],
      partialContentData: [],
      error: null,
      contentDataLoaded: CONTENT_DATA_LOADING_STATUS.INITIAL
    };
  }),

  on(ContentDataActions.loadContentDataSuccess, (state, action) => {
    const { contentData, loadingType } = action;
    const defaultStateUpdated = {
      ...state,
      error: null,
      contentDataLoaded: CONTENT_DATA_LOADING_STATUS.LOADED
    };
    switch ( loadingType ) {
      case LOADING_TYPE.REST:
        return {
          ...defaultStateUpdated,
          allContentData: [ ...state.partialContentData, ...contentData ]
        };
      case LOADING_TYPE.FULL:
        return {
          ...defaultStateUpdated,
          allContentData: [ ...contentData ]
        };
      case LOADING_TYPE.PARTIAL:
        return {
          ...defaultStateUpdated,
          allContentData: [ ...contentData ],
          partialContentData: [ ...contentData ],
        };
    }
  }),

  on(ContentDataActions.loadContentDataFailure, (state, action) => {
    return {
      ...state,
      error: action.error,
      allContentData: [],
      partialContentData: [],
      contentDataLoaded: CONTENT_DATA_LOADING_STATUS.ERROR
    };
  })
);

export function reducer(state: ContentDataState | undefined, action: Action) {
  return contentDataReducer(state, action);
}
