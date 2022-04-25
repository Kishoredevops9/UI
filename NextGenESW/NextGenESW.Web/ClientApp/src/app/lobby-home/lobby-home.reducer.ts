import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { LobbyHomeModel } from './lobby-home.model';
import * as LobbyHomeActions from './lobby-home.actions';
export const LobbyHomeFeatureKey = 'lobbyHome';

export interface LobbyHomeState extends EntityState<LobbyHomeModel> {
  error: string;
}

export const adapter: EntityAdapter<LobbyHomeModel> = createEntityAdapter<LobbyHomeModel>();

export const initialState: LobbyHomeState = adapter.getInitialState({
  error: undefined,
});

const lobbyHomeReducer = createReducer(
  initialState,

  on(LobbyHomeActions.loadLobbyHomeSuccess, (state, action) =>
    adapter.setAll(action.lobbyHome, {
      ...state,
      error: null,
    })
  ),

  on(LobbyHomeActions.loadLobbyHomeFailure, (state, action) => {
    return {
      ...state,
      error: action.error,
    };
  }),

  on(LobbyHomeActions.addLobbyHome, (state, action) =>
    adapter.addOne(action.lobbyHome, state)
  ),

  on(LobbyHomeActions.upsertLobbyHome, (state, action) =>
    adapter.upsertOne(action.lobbyHome, state)
  ),

  on(LobbyHomeActions.updateLobbyHome, (state, action) =>
    adapter.updateOne(action.lobbyHome, state)
  ),

  on(LobbyHomeActions.deleteLobbyHome, (state, action) =>
    adapter.removeOne(action.id, state)
  ),

  on(LobbyHomeActions.clearLobbyHomes, (state) => adapter.removeAll(state))

);

export function reducer(state: LobbyHomeState | undefined, action: Action) {
  return lobbyHomeReducer(state, action);
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();

export const selectAllLobbyHome = selectAll;
