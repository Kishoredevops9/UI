import { CriteriaDetailsComponent } from './criteria-details/criteria-details.component';
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [
  { path: '', component: CriteriaDetailsComponent },
  {
    path: ':id', component: CriteriaDetailsComponent,
    data: {
      module: 'Criteria Group'
    }
  }  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CriteriaGroupRoutes { }


