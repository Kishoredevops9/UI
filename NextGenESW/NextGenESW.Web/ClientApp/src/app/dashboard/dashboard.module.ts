import { TaskItemsListComponent } from './task-items-list/task-items-list.component';
import { TodoItemsListService } from './todo-items-list/todo-items-list.service';
import { NewsListService } from './news-list/news-list.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';
import { ContentTypeDropdownComponent } from './content-type-dropdown/content-type-dropdown.component';
import * as fromNewsList from './news-list/news-list.reducer';
import { NewsListComponent } from './news-list/news-list.component';
import { NewsListEffects } from './news-list/news-list.effects';
import * as fromContentList from './content-list/content-list.reducer';
import { ContentListComponent } from './content-list/content-list.component';
import { ContentListEffects } from './content-list/content-list.effects';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContentListService } from './content-list/content-list.service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import * as fromTodoItemsList from './todo-items-list/shared/todo-data.reducer';
import * as fromTaskItemsList from './task-items-list/task-items-list.reducer';
import * as fromTask from './task-items-list/shared/task-items-list.reducer';
import { TodoDataEffects } from './todo-items-list/shared/todo-data.effects';
import { TodoItemsListComponent } from './todo-items-list/todo-items-list.component';
import { TaskItemsListService } from './task-items-list/task-items-list.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CollaborateDialogComponent } from './content-list/collaborate-dialog/collaborate-dialog.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatSortModule } from '@angular/material/sort';
import { NgxDnDModule } from '@swimlane/ngx-dnd';
import { TooltipModule } from '@app/shared/_tooltip';

import {
  NgxUiLoaderModule,
  NgxUiLoaderConfig,
  SPINNER,
  POSITION,
  PB_DIRECTION,
} from "ngx-ui-loader";
import { ContentDataEffects } from '@app/dashboard/content-list/shared/content-data.effects';
import { TaskItemsListEffects } from '@app/dashboard/task-items-list/task-items-list.effects';
import { TaskItemsEffects } from './task-items-list/shared/task-items-list.effects';

//
const ngxUiLoaderConfig: NgxUiLoaderConfig = {

};

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    HttpClientModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    FlexLayoutModule,
    MatMenuModule,
    MatSortModule,
    NgxDnDModule.forRoot(),
    TooltipModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    EffectsModule.forFeature([
      NewsListEffects,
      ContentListEffects,
      TodoDataEffects,
      TaskItemsListEffects,
      ContentDataEffects,
      TaskItemsEffects
    ]),
    StoreModule.forFeature(
      fromNewsList.newsListsFeatureKey,
      fromNewsList.reducer
    ),
    StoreModule.forFeature(
      fromContentList.contentListsFeatureKey,
      fromContentList.reducer
    ),
    StoreModule.forFeature(
      fromTodoItemsList.todoDataFeatureKey,
      fromTodoItemsList.reducer
    ),
    StoreModule.forFeature(
      fromTaskItemsList.taskItemsListsFeatureKey,
      fromTaskItemsList.reducer
    ),
    StoreModule.forFeature(
      fromTask.taskItemFeatureKey,
      fromTask.reducer
    ),
  ],
  declarations: [
    DashboardComponent,
    TaskItemsListComponent,
    ContentTypeDropdownComponent,
    TodoItemsListComponent,
    NewsListComponent,
    ContentListComponent,
    DatePickerComponent,
    CollaborateDialogComponent,
  ],
  exports: [DashboardRoutingModule],
  providers: [
    TaskItemsListService,
    TodoItemsListService,
    NewsListService,
    ContentListService,
  ],
})
export class DashboardModule {}
