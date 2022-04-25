import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';

import { SharedModule } from '@app/shared/shared.module';

import { DiagramHeaderComponent } from './diagram-header/diagram-header.component';

const imports = [
  CommonModule,
  SharedModule,
  MatMenuModule
];

const components = [
  DiagramHeaderComponent
];

@NgModule({
  imports,
  declarations: [
    ...components
  ],
  exports: components
})
export class DiagramHeaderModule { }
