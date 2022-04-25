import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { NewsList } from './news-list.model';
import * as NewsListActions from './news-list.actions';

export const newsListsFeatureKey = 'newsLists';

export interface NewsListsState extends EntityState<NewsList> {
  error: string;
}

export const adapter: EntityAdapter<NewsList> = createEntityAdapter<NewsList>();

export const initialState: NewsListsState = adapter.getInitialState({
  error: undefined,
});

const newsListReducer = createReducer(
  initialState,

  on(NewsListActions.loadNewsListsSuccess, (state, action) =>
    adapter.setAll(action.newsList, {
      ...state,
      error: null,
    })
  ),

  on(NewsListActions.loadNewsListsFailure, (state, action) => {
    return {
      ...state,
      error: action.error,
    };
  }),

  on(NewsListActions.addNewsList, (state, action) =>
    adapter.addOne(action.newsList, state)
  ),
  on(NewsListActions.upsertNewsList, (state, action) =>
    adapter.upsertOne(action.newsList, state)
  ),
  on(NewsListActions.addNewsLists, (state, action) =>
    adapter.addMany(action.newsLists, state)
  ),
  on(NewsListActions.upsertNewsLists, (state, action) =>
    adapter.upsertMany(action.newsLists, state)
  ),
  on(NewsListActions.updateNewsList, (state, action) =>
    adapter.updateOne(action.newsList, state)
  ),
  on(NewsListActions.updateNewsLists, (state, action) =>
    adapter.updateMany(action.newsLists, state)
  ),
  on(NewsListActions.deleteNewsList, (state, action) =>
    adapter.removeOne(action.id, state)
  ),
  on(NewsListActions.deleteNewsLists, (state, action) =>
    adapter.removeMany(action.ids, state)
  ),

  on(NewsListActions.clearNewsLists, (state) => adapter.removeAll(state))
);

export function reducer(state: NewsListsState | undefined, action: Action) {
  return newsListReducer(state, action);
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();

export const selectAllNewsList = selectAll;
