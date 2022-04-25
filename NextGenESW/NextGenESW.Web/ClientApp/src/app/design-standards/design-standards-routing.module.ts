import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesignDetailsComponent } from './design-details/design-details.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: DesignDetailsComponent },
  {
    path: ':contentId', component: DesignDetailsComponent, data: { module: 'Design Standards' }
  },
  {
    path: ':id', component: DesignDetailsComponent, data: { module: 'Design Standards' }
  },
  {
    path: ':documentType/:id', component: DesignDetailsComponent, data: { module: 'Design Standards' }
  },
  {
    path: 'view-document/:id/:documentType', component: DesignDetailsComponent, data: { module: 'Design Standards' }
  },
  {
    path: 'view-document/:documentType/:contentId', component: DesignDetailsComponent, data: { module: 'Design Standards' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DesignStandardsRoutingModule { }
