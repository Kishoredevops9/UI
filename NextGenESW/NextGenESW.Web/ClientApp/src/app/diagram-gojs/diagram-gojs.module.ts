import { NgModule } from '@angular/core';
import { DiagramModule } from './components/diagram';
import { PaletteModule } from './components/palette';

const imports = [
  DiagramModule,
  PaletteModule
];

@NgModule({
  imports,
  exports: imports
})
export class DiagramGoJSModule { }
