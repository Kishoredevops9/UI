import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GojsAngularModule } from 'gojs-angular';
import { MatMenuModule } from '@angular/material/menu';
import { HttpClientModule } from '@angular/common/http';
import { MatRippleModule } from '@angular/material/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';

import { DiagramContextMenuModule } from '../diagram-context-menu/diagram-context-menu.module';
import { DiagramComponent } from './diagram/diagram.component';
import { ZoomComponent } from './zoom/zoom.component';
import { registerIcons } from '../../utils/registerIcons';
import { DiagramHeaderModule } from '../diagram-header/diagram-header.module';
import { DiagramSeeThroughModule } from '../diagram-see-through/diagram-see-through.module';
import { PaletteModule } from '@app/diagram-gojs/components/palette';
import { DiagramContextMenuEventsService } from './services/diagram-context-menu-events.service';

const imports = [
  CommonModule,
  HttpClientModule,
  GojsAngularModule,
  MatIconModule,
  MatRippleModule,
  MatMenuModule,
  DiagramContextMenuModule,
  DiagramSeeThroughModule,
  DiagramHeaderModule,
  PaletteModule
];

const providers = [
  DiagramContextMenuEventsService
];

const components = [
  DiagramComponent
];

const innerComponents = [
  ZoomComponent
];

@NgModule({
  imports,
  providers,
  declarations: [
    ...components,
    ...innerComponents
  ],
  exports: components
})
export class DiagramModule {

  constructor(
    iconRegistry: MatIconRegistry,
    domSanitizer: DomSanitizer
  ) {
    const icons = [
      'zoom-in',
      'zoom-out',
      'zoom-to-fit'
    ];
    registerIcons(iconRegistry, domSanitizer, icons);
  }

}
