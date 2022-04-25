import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { LobbyHomeModel } from './lobby-home.model';

// Load Lobby Home List
export const loadLobbyHome = createAction(
  '[Lobby Home Component] Load LobbyHome'
);

export const loadLobbyHomeSuccess = createAction(
  '[Lobby Home Effect] Load LobbyHome Success',
  props<{ lobbyHome: LobbyHomeModel[] }>()
);

export const loadLobbyHomeFailure = createAction(
  '[Lobby Home Effect] Load LobbyHome Failure',
  props<{ error: any }>()
);

export const addLobbyHome = createAction(
  '[LobbyHome/API] Add LobbyHome',
  props<{ lobbyHome: LobbyHomeModel }>()
);

export const upsertLobbyHome = createAction(
  '[LobbyHome/API] Upsert LobbyHome',
  props<{ lobbyHome: LobbyHomeModel }>()
);

export const updateLobbyHome = createAction(
  '[LobbyHome/API] Update LobbyHome',
  props<{ lobbyHome: Update<LobbyHomeModel> }>()
);

export const updateLobbyHomes = createAction(
  '[LobbyHome/API] Update LobbyHomes',
  props<{ lobbyHomes: Update<LobbyHomeModel>[] }>()
);

export const deleteLobbyHome = createAction(
  '[LobbyHome/API] Delete LobbyHome',
  props<{ id: any }>()
);

export const clearLobbyHomes = createAction('[LobbyHome/API] Clear LobbyHomes');
