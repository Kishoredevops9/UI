import { ProcessMapsState } from './../process-maps/process-maps.reducer';
import { TaskItemsListState } from './../dashboard/task-items-list/task-items-list.reducer';
import {
  contentListsFeatureKey,
  ContentListsState,
} from './../dashboard/content-list/content-list.reducer';
import { newsListsFeatureKey } from './../dashboard/news-list/news-list.reducer';
import { createDocumentsFeatureKey, CreateDocumentState } from './../create-document/create-document.reducer';
import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer,
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import * as fromNewsList from '../dashboard/news-list/news-list.reducer';
import { NewsListsState } from '../dashboard/news-list/news-list.reducer';
import * as fromCreateDocumentList from './../create-document/create-document.reducer';
import * as fromContentList from '../dashboard/content-list/content-list.reducer';
import * as fromContentData from '../dashboard/content-list/shared/content-data.reducer';
import * as fromTodoData from '../dashboard/todo-items-list/shared/todo-data.reducer';
import * as fromTaskItemsList from '../dashboard/task-items-list/task-items-list.reducer';
import * as fromProcessMaps from '../process-maps/process-maps.reducer';
import { map } from 'rxjs/operators';
import * as fromTaskCreationReducer from '../task-creation/task-creation.reducer';
import { TaskCreationFeatureKey, TaskCreationState } from '../task-creation/task-creation.reducer';
import * as fromLobbyHomeReducer from '../lobby-home/lobby-home.reducer';
import * as commonListReducer from './common-list.reducer';
import { LobbyHomeFeatureKey, LobbyHomeState } from '../lobby-home/lobby-home.reducer';
import { todoDataFeatureKey, TodoDataState } from '../dashboard/todo-items-list/shared/todo-data.reducer';

export interface State {
  [fromNewsList.newsListsFeatureKey]: fromNewsList.NewsListsState;
  [fromContentList.contentListsFeatureKey]: fromContentList.ContentListsState;
  [fromCreateDocumentList.createDocumentsFeatureKey]: fromCreateDocumentList.CreateDocumentState;
  [fromTaskItemsList.taskItemsListsFeatureKey]: fromTaskItemsList.TaskItemsListState;
  [fromProcessMaps.processMapsesFeatureKey]: fromProcessMaps.ProcessMapsState;
  [fromTaskCreationReducer.TaskCreationFeatureKey]: fromTaskCreationReducer.TaskCreationState;
  [fromLobbyHomeReducer.LobbyHomeFeatureKey]: fromLobbyHomeReducer.LobbyHomeState;
  [fromContentData.contentDataFeatureKey]: fromContentData.ContentDataState;
  [fromTodoData.todoDataFeatureKey]: fromTodoData.TodoDataState;
  [commonListReducer.commonListKey]: commonListReducer.CommonListState
}

export const reducers: ActionReducerMap<State> = {
  [fromNewsList.newsListsFeatureKey]: fromNewsList.reducer,
  [fromContentList.contentListsFeatureKey]: fromContentList.reducer,
  [fromCreateDocumentList.createDocumentsFeatureKey]: fromCreateDocumentList.reducer,
  [fromTaskItemsList.taskItemsListsFeatureKey]: fromTaskItemsList.reducer,
  [fromProcessMaps.processMapsesFeatureKey]: fromProcessMaps.reducer,
  [fromTaskCreationReducer.TaskCreationFeatureKey]: fromTaskCreationReducer.reducer,
  [fromLobbyHomeReducer.LobbyHomeFeatureKey]: fromLobbyHomeReducer.reducer,
  [fromContentData.contentDataFeatureKey]: fromContentData.reducer,
  [fromTodoData.todoDataFeatureKey]: fromTodoData.reducer,
  [commonListReducer.commonListKey]: commonListReducer.reducer
};

export const metaReducers: MetaReducer<State>[] = !environment.production
  ? []
  : [];

export const selectNewsListState = createFeatureSelector<NewsListsState>(
  newsListsFeatureKey
);

export const selectNewsList = createSelector(
  selectNewsListState,
  fromNewsList.selectAllNewsList
);

export const selectContentListsState = createFeatureSelector<ContentListsState>(
  contentListsFeatureKey
);

export const selectContentList = createSelector(
  selectContentListsState,
  fromContentList.selectAllContentList
);

export const selectCreateDocumentState = createFeatureSelector<CreateDocumentState>(
  createDocumentsFeatureKey
);

export const selectCreateDocumentList = createSelector(
  selectCreateDocumentState,
  fromCreateDocumentList.selectCreateDocumentList
);

export const selectTaskItemsState = createFeatureSelector<TaskItemsListState>(
  fromTaskItemsList.taskItemsListsFeatureKey
);

export const selectTaskItemsList = createSelector(
  selectTaskItemsState,
  fromTaskItemsList.selectAllTaskItemsList
);

export const selectProcessMapsState = createFeatureSelector<ProcessMapsState>(
  fromProcessMaps.processMapsesFeatureKey
);

export const selectProcessMapEntities = createSelector(
  selectProcessMapsState,
  fromProcessMaps.selectEntities
);

export const selectProcessMaps = createSelector(
  selectProcessMapsState,
  fromProcessMaps.selectAllProcessMaps
);

export const selectSelectedProcessMapId = createSelector(
  selectProcessMapsState,
  fromProcessMaps.getSelectedProcessMapId
);

export const selectSelectedProcessMap = createSelector(
  selectProcessMapEntities,
  selectSelectedProcessMapId,
  (processMaps, mapId) => {
    let tempProcessMap = { ...processMaps[mapId] };
    if (tempProcessMap.swimLanes) {
      let sortedActivityGroups = [...tempProcessMap.swimLanes].sort(
        (a, b) => a.sequenceNumber - b.sequenceNumber
      );

      tempProcessMap.swimLanes = sortedActivityGroups;
      return tempProcessMap;
    } else {
      return processMaps[mapId];
    }
  }
);

export const selectSelectedProcessMapGroups = createSelector(
  selectSelectedProcessMap,
  (selectedProcessMap) => {
    // let groups = [...selectedProcessMap.activityGroups];
    // console.log('groups:', groups);
    // let sortedGroups = groups.sort((a,b) => a.displayIndex - b.displayIndex);
    // console.log('sortedGroups:', sortedGroups);
    return [...selectedProcessMap.swimLanes].sort(
      (a, b) => a.sequenceNumber - b.sequenceNumber
    );
  }
);

export const selectTaskCreationState = createFeatureSelector<TaskCreationState>(
  TaskCreationFeatureKey
);

export const selectTaskCreationList = createSelector(
  selectTaskCreationState,
  fromTaskCreationReducer.selectAllTaskCreation
);

export const selectLobbyHomeState = createFeatureSelector<LobbyHomeState>(
  LobbyHomeFeatureKey
);

export const selectLobbyHomeList = createSelector(
  selectLobbyHomeState,
  fromLobbyHomeReducer.selectAllLobbyHome
);
