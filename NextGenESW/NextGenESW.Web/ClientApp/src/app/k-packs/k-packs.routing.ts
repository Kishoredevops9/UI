import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { KPacksDetailsComponent } from './k-packs-details/k-packs-details.component';

const routes: Routes = [
  {
    path: 'k-pack/:id', component: KPacksDetailsComponent, data: {
      module: 'K Pack'
    }
  },
  {
    path: '', component: KPacksDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KPacksRoutingModule { }
