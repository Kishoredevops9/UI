import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GuideDetailsComponent } from './guide-details/guide-details.component';


const routes: Routes = [
  { path: '', component: GuideDetailsComponent },
  {
    path: ':id', component: GuideDetailsComponent, data: {
      module: 'Guide Book'
    }
  },
  {
    path: 'view-document/:id/:documentType', component: GuideDetailsComponent, data: {
      module: 'Guide Book'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GuideBookRoutingModule { }
