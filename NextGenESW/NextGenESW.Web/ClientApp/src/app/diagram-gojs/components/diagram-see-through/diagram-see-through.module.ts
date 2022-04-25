import { NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';

import { DiagramSeeThroughComponent } from './see-through/diagram-see-through.component';
import { DiagramActivityContentComponent } from './activity-content/diagram-activity-content.component';

const imports = [
  CommonModule,
  MatMenuModule
];

const components = [
  DiagramSeeThroughComponent
];

const innerComponents = [
  DiagramActivityContentComponent
];

@NgModule({
  declarations: [
    ...components,
    ...innerComponents
  ],
  exports: components,
  imports
})

export class DiagramSeeThroughModule { }
