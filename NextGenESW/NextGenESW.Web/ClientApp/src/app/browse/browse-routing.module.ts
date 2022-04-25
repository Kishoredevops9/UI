import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowseComponent } from './browse.component';
import { ManualsComponent } from './manuals/manuals.component';
import { MapComponent } from './map/map.component';

const routes: Routes = [
  { path: '',  redirectTo: 'map', } , 
{ path: 'map',    component: MapComponent  , data :  { 'id' : "9014" } },
{ path: 'manuals',    component: ManualsComponent  , data :  { 'id' : "9015" }    }
];

@NgModule({
 
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BrowseRoutingModule { }
