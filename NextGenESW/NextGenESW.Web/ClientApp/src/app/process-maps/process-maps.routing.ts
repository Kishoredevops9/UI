import { ProcessMapEditComponent } from './process-map-edit/process-map-edit.component';
import { ProcessMapAddComponent } from './process-map-add/process-map-add.component';
import { ProcessMapsComponent } from './process-maps.component';
import { CreateFromExistingSearchMapComponent } from './create-from-existing-search-map/create-from-existing-search-map.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { StepComponent } from './step-flow/step/step.component';
import {PublicStepComponent } from './public-step/public-step.component'

const routes: Routes = [
  { path: '', component: ProcessMapsComponent },
  { path: 'create-progressmap', component: ProcessMapAddComponent,  data :  { 'id' : "9009" } },
  { path: 'step/:id', component: StepComponent, data : { module : "Step" }  },
  { path: 'create-progressmap/:id', component: ProcessMapAddComponent,   data :  { 'id' : "9009", module: 'Step Flow' } },
  { path: 'view', component: ProcessMapEditComponent },
  { path: 'edit/:id', component: ProcessMapEditComponent },
  { path: 'create-from-existingMap', component: CreateFromExistingSearchMapComponent},
  { path: 'SP', component: PublicStepComponent}, 
  { path: 'SP/:id', component: PublicStepComponent, data : { module : "PublicStep" } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ProcessMapsRoutes { }
