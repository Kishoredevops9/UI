import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContentsComponent } from './related-content-details/contents/contents.component';
import { RelatedContentPurposeComponent } from './related-content-details/related-content-purpose/related-content-purpose.component';

import { RelatedContentDetailsComponent } from './related-content-details/related-content-details.component';

const routes: Routes = [
  {
    path: 'related-content/:id',
    component: RelatedContentDetailsComponent,
    data: {
      module: 'Related Content Details'
    }
  },
 
  {
    path: '',
    component: RelatedContentDetailsComponent,
    data: {
      module: 'Related Content Details'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RelatedContentRoutingRoutingModule {}
