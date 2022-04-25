import { WiDetails } from './create-document/wi-create-document/wi-details.component';
import { UserAuthComponent } from './user-auth/user-auth.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { ActivityPageComponent } from '@app/activity-page/activity-page.component';
import { HelloWorldComponent } from '@app/hello-world/hello-world.component';
import { GlobalSearchDetailsComponent } from '@app/shared/component/global-search-details/global-search-details.component';
import { RelatedContentDetailsComponent } from '@app/related-content/related-content-details/related-content-details.component';
import { AdvanceSearchComponent } from '@app/shared/component/global-search-details/global-inner-content/advance-search/advance-search.component';
import { ShareUrlComponent } from '@app/shared/component/global-search-details/global-inner-content/share-url/share-url.component';
import { EksInternalSearchComponent } from '@app/shared/component/global-search-details/eks-internal-search/eks-internal-search.component';
import { UserGuidesComponent } from '@app/user-guides/user-guides.component';
import { DisciplinesComponent } from './disciplines/disciplines.component';
import { KnowledgeAssetComponent } from './knowledge-asset/knowledge-asset.component';
import { TaskSearchComponent } from './shared/component/task-search/task-search.component';

const routes: Routes = [
  { path: '', redirectTo: '/lobbyhome', pathMatch: 'full' },
  {
    path: 'admin',
    canActivate: [MsalGuard],
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: 'browse',
    canActivate: [MsalGuard],
    loadChildren: () =>
      import('./browse/browse.module').then((m) => m.BrowseModule),
  },
  { path: 'users', component: UserAuthComponent, canActivate: [MsalGuard] },

  {
    path: 'design-standards',
    data: { id: '9008' },
    canActivate: [MsalGuard],
    loadChildren: () =>
      import('./design-standards/design-standards.module').then(
        (m) => m.DesignStandardsModule
      ),
  },

  {
    path: 'lobbyhome',
    data: { id: '9001', module: 'LobbyHome' },
    canActivate: [MsalGuard],
    loadChildren: () =>
      import('./lobby-home/lobby-home.module').then((m) => m.LobbyHomeModule),
  },
  {
    path: 'dashboard',
    data: { id: '9002' },
    canActivate: [MsalGuard],
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'create-document',
    data: { id: '9005' },
    canActivate: [MsalGuard],
    loadChildren: () =>
      import('./create-document/create-document.module').then(
        (m) => m.CreateDocumentModule
      ),
  },
  {
    path: 'criteria-group',
    data: { id: '9007' },
    canActivate: [MsalGuard],
    loadChildren: () =>
      import('./criteria-group/criteria-group.module').then(
        (m) => m.CriteriaGroupModule
      ),
  },
  {
    path: 'guide-book',
    data: { id: '9010' },
    canActivate: [MsalGuard],
    loadChildren: () =>
      import('./guide-book/guide-book.module').then((m) => m.GuideBookModule),
  },

  {
    path: 'document-view',
    canActivate: [MsalGuard],
    loadChildren: () =>
      import('./document-view/document-view.module').then(
        (m) => m.DocumentViewModule
      ),
  },
  {
    path: 'view-document/WI',
    canActivate: [MsalGuard],
    loadChildren: () =>
      import('./design-standards/design-standards.module').then(
        (m) => m.DesignStandardsModule
      ),
  },
  {
    path: 'view-document/DS',
    canActivate: [MsalGuard],
    loadChildren: () =>
      import('./design-standards/design-standards.module').then(
        (m) => m.DesignStandardsModule
      ),
  },
  {
    path: 'view-document/GB',
    canActivate: [MsalGuard],
    loadChildren: () =>
      import('./design-standards/design-standards.module').then(
        (m) => m.DesignStandardsModule
      ),
  },
  /* Content Common url routing start here */
  {
    path: 'view-document',
    canActivate: [MsalGuard],
    loadChildren: () =>
      import('./document-view/document-view.module').then(
        (m) => m.DocumentViewModule
      ),
  },
  {
    path: 'view-draft',
    canActivate: [MsalGuard],
    loadChildren: () =>
      import('./design-standards/design-standards.module').then(
        (m) => m.DesignStandardsModule
      ),
  },
  /* Content Common url routing end here */
  {
    path: 'task',
    canActivate: [MsalGuard],
    loadChildren: () =>
      import('./task-creation/task-creation.module').then(
        (m) => m.TaskCreationModule
      ),
  },
  {
    path: 'process-maps',
    canActivate: [MsalGuard],
    loadChildren: () =>
      import('./process-maps/process-maps.module').then(
        (m) => m.ProcessMapsModule
      ),
  },
  {
    path: 'activity-page',
    data: { id: '9006' },
    component: ActivityPageComponent,
  },
  {
    path: 'design-standards',
    data: { id: '9008' },
    canActivate: [MsalGuard],
    loadChildren: () =>
      import('./design-standards/design-standards.module').then(
        (m) => m.DesignStandardsModule
      ),
  },
  { path: 'hello-world', component: HelloWorldComponent },
  {
    path: 'toc',
    data: { id: '9013' },
    canActivate: [MsalGuard],
    loadChildren: () => import('./toc/toc.module').then((m) => m.TocModule),
  },
  {
    path: 'k-pack',
    data: { id: '9012' },
    canActivate: [MsalGuard],
    loadChildren: () =>
      import('./k-packs/k-packs.module').then((m) => m.KPacksModule),
  },
  { path: '_search', component: GlobalSearchDetailsComponent },
  { path: '_tasksearch', component: TaskSearchComponent },
  { path: '_advancesearch', component: EksInternalSearchComponent },
  {
    path: 'related-content',
    data: { id: '9011' },
    component: RelatedContentDetailsComponent,
  },
  { path: 'advance-search', component: AdvanceSearchComponent },
  { path: 'share-url', component: ShareUrlComponent },
  { path: 'user-guides', component: UserGuidesComponent },
  {
    path: 'disciplines',
    component: DisciplinesComponent,
    data: { id: '9016' },
  },
  { path: 'knowledge-asset', component: KnowledgeAssetComponent },
  
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes, {
      // scroll top after router change -> don't remove
      enableTracing: false,
      relativeLinkResolution: 'legacy',
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      scrollOffset: [0, 78], // [x, y] - adjust scroll offset
      onSameUrlNavigation: 'reload'
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
