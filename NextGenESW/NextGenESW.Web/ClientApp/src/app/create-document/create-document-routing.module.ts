import { WiDetails } from './wi-create-document/wi-details.component';
import { CreateDocumentComponent } from './create-document.component';
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', component: CreateDocumentComponent },
  {
    path: ':id', component: CreateDocumentComponent, data: {
      module: 'Work Instruction'
    }
  },
  {
    path: 'wi-document', component: WiDetails, data: {
      module: 'Work Instruction'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CreateDocumentRoutes { }


