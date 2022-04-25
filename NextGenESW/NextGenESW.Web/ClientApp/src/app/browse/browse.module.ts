import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrowseRoutingModule } from './browse-routing.module';
import { BrowseComponent } from './browse.component';

import { MapComponent } from './map/map.component';
import { ManualsComponent } from './manuals/manuals.component';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BrowseMapComponent } from './browse-map/browse-map.component';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from '@app/shared/shared.module';
 
@NgModule({
  declarations: [BrowseComponent, MapComponent, ManualsComponent,     BrowseMapComponent    ],
  imports: [
    CommonModule,
    BrowseRoutingModule,
    FlexLayoutModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    SharedModule


  ]
})
export class BrowseModule { }
