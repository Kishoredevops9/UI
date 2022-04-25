import { UserAuthComponent } from './user-auth/user-auth.component';
import { BrowserModule } from '@angular/platform-browser';
import {
  NgModule,
  NO_ERRORS_SCHEMA,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TopNavComponent } from './top-nav/top-nav.component';
import { HeaderComponent } from './header/header.component';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { EffectsModule } from '@ngrx/effects';
import { UserAuthModule } from './user-auth/user-auth.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ActivitypageModule } from './activity-page/activity-page.module';
import { TocModule } from './toc/toc.module';
import { KPacksModule } from './k-packs/k-packs.module';
import { ActivityPageService } from './activity-page/activity-page.service';
import { LobbyHomeModule } from './lobby-home/lobby-home.module';
import { LeftNavComponent } from './left-nav/left-nav.component';

// Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { HelloWorldComponent } from './hello-world/hello-world.component';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { EnvServiceProvider } from './env.service.provider';
import { MatBadgeModule } from '@angular/material/badge';
import { TodoItemsListService } from './dashboard/todo-items-list/todo-items-list.service';
import { RelatedContentModule } from './related-content/related-content.module';
import { DndDirective } from './dnd.directive';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ShareUrlComponent } from './shared/component/global-search-details/global-inner-content/share-url/share-url.component';
import { UserGuidesComponent } from './user-guides/user-guides.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { WINDOW_PROVIDERS } from './shared/component/global-panel/window.providers';
import { ApiInterceptor } from './interceptors/api.interceptor';
import { DisciplinesComponent } from './disciplines/disciplines.component';
import { BrowseModule } from './browse/browse.module';
import { DisciplinesItemsComponent } from './disciplines/disciplines-items/disciplines-items.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { MatInputModule } from '@angular/material/input';
import { RecordsService } from './shared/records.service';
import { TaskRecordsService1 } from './shared/TaskRecords1.service';
import { RecordsService1 } from './shared/records1.service';
import { AdminModule } from '@app/admin/admin.module';
import { DatePipe } from '@angular/common';
import { AddAssetsComponent } from './knowledge-asset/add-assets/add-assets.component';
import { TooltipModule } from '@app/shared/_tooltip';
import { NgxIndexedDBModule, DBConfig } from 'ngx-indexed-db';
import { MatDialogRef } from '@angular/material/dialog';
import { RedirectChromeComponent } from './redirect-chrome/redirect-chrome.component'
import { CommonListEffects } from '@app/shared/effect';

const dbConfig: DBConfig = {
  name: 'MyDb',
  version: 1,
  objectStoresMeta: [
    {
      store: 'knowledgeasset',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'name', keypath: 'name', options: { unique: false } },
      ],
    },
    {
      store: 'step',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'name', keypath: 'name', options: { unique: false } },
      ],
    },
    {
      store: 'noc',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'name', keypath: 'name', options: { unique: false } },
      ],
    },
    {
      store: 'KPACK',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'name', keypath: 'name', options: { unique: false } },
      ],
    },
    {
      store: 'stepflowPurpose',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'name', keypath: 'name', options: { unique: false } },
      ],
    },
    {
      store: 'stepPurpose',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'name', keypath: 'name', options: { unique: false } },
      ],
    },
  ],
};

@NgModule({
  declarations: [
    AppComponent,
    TopNavComponent,
    HeaderComponent,
    UserAuthComponent,
    LeftNavComponent,
    HelloWorldComponent,
    DndDirective,
    UserGuidesComponent,
    DisciplinesComponent,
    DisciplinesItemsComponent,
    FeedbackComponent,
    AddAssetsComponent,
    RedirectChromeComponent,

  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    SharedModule,
    AppRoutingModule,
    TocModule,
    KPacksModule,
    LobbyHomeModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatButtonModule,
    MatToolbarModule,
    MatMenuModule,
    MatBadgeModule,
    MatInputModule,
    StoreModule.forRoot(reducers, {
      metaReducers,
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
    EffectsModule.forRoot([CommonListEffects]),
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    UserAuthModule,
    FormsModule,
    HttpClientModule,
    ActivitypageModule,
    RelatedContentModule,
    NgbModule,
    FlexLayoutModule,
    AdminModule,
    TooltipModule,
    NgxIndexedDBModule.forRoot(dbConfig),
  ],
  providers: [
    ActivityPageService,
    EnvServiceProvider,
    TodoItemsListService,
    WINDOW_PROVIDERS,
    RecordsService,
    RecordsService1,
    TaskRecordsService1,
    DatePipe,
    {
      provide: MatDialogRef,
      useValue: {},
    },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
