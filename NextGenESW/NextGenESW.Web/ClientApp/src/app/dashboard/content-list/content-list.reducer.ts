import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { ContentList } from './content-list.model';
import * as ContentListActions from './content-list.actions';

export const contentListsFeatureKey = 'contentLists';

export interface ContentListsState extends EntityState<ContentList> {
  error: string;
}

export const adapter: EntityAdapter<ContentList> = createEntityAdapter<
  ContentList
>({
  selectId: selectUserId,
});

export function selectUserId(a: ContentList) {
  //In this case this would be optional since primary key is id
  return a.rowNumber;
}

export const initialState: ContentListsState = adapter.getInitialState({
  error: undefined,
});

const contentListReducer = createReducer(
  initialState,

  on(ContentListActions.loadContentListsSuccess, (state, action) => {
    return adapter.setAll(action.contentLists, {
      ...state,
      error: null,
    });
  }),

  on(ContentListActions.loadContentListsFailure, (state, action) => {
    return {
      ...state,
      error: action.error,
    };
  }),

  on(ContentListActions.publishContentListsSuccess, (state, action) => {
    return {
      ...state,
      error: null,
    };
  }),

  on(ContentListActions.publishContentListsFailure, (state, action) => {
    return {
      ...state,
      error: action.error,
    };
  }),

  //Publish Content Lists - Till here
  on(ContentListActions.addContentList, (state, action) =>
    adapter.addOne(action.contentList, state)
  ),
  on(ContentListActions.upsertContentList, (state, action) =>
    adapter.upsertOne(action.contentList, state)
  ),
  on(ContentListActions.addContentLists, (state, action) =>
    adapter.addMany(action.contentLists, state)
  ),
  on(ContentListActions.upsertContentLists, (state, action) =>
    adapter.upsertMany(action.contentLists, state)
  ),

  on(ContentListActions.updateContentLists, (state, action) =>
    adapter.updateMany(action.contentLists, state)
  ),
  on(ContentListActions.deleteContentList, (state, action) =>
    adapter.removeOne(action.id, state)
  ),
  on(ContentListActions.deleteContentLists, (state, action) =>
    adapter.removeMany(action.ids, state)
  ),
  on(ContentListActions.clearContentLists, (state) => adapter.removeAll(state))
);

export function reducer(state: ContentListsState | undefined, action: Action) {
  return contentListReducer(state, action);
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();

export const selectAllContentList = selectAll;
