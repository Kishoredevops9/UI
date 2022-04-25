import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { GojsAngularModule } from 'gojs-angular';

import { PaletteComponent } from './palette/palette.component';
import { ExpandButtonComponent } from './expand-button/expand-button.component';

const imports = [
  CommonModule,
  GojsAngularModule,
  DragDropModule,
  MatIconModule,
  MatRippleModule
];

const components = [
  PaletteComponent
];

const innerComponents = [
  ExpandButtonComponent
];

@NgModule({
  imports,
  declarations: [
    ...components,
    ...innerComponents
  ],
  exports: components
})
export class PaletteModule { }
