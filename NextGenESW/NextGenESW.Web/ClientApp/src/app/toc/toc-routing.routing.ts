import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TocDetailsComponent } from './toc-details/toc-details.component';

const routes: Routes = [
  {
    path: 'toc/:id', component: TocDetailsComponent, data: {
      module: 'Table of Content'
    }
  },
  {
    path: '', component: TocDetailsComponent, data: {
      module: 'Table of Content'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TocRoutingModule { }
