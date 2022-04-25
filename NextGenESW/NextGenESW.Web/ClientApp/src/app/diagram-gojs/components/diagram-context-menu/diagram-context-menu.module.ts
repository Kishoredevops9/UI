import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';

import { PlusButtonMenuComponent } from './plus-button-menu/plus-button-menu.component';
import { DiagramContextMenuComponent } from './context-menu/context-menu.component';
import { DiagramMenuComponent } from './diagram-menu/diagram-menu.component';
import { ContextMenuItemComponent } from './menu-item/menu-item.component';
import { BaseContextMenuComponent } from './base-context-menu.component';
import { NodeMenuComponent } from './node-menu/node-menu.component';
import { LanePhaseMenuComponent } from './lane-phase-menu/lane-phase-menu.component';
import { LinkMenuComponent } from './link-menu/link-menu.component';

import { registerIcons } from '../../utils/registerIcons';
import { LaneMenuComponent } from './lane-menu/lane-menu.component';
import { PhaseMenuComponent } from './phase-menu/phase-menu.component';

const imports = [
  CommonModule,
  MatMenuModule,
  MatIconModule
];

const innerComponents = [
  BaseContextMenuComponent,
  ContextMenuItemComponent,
  NodeMenuComponent,
  LaneMenuComponent,
  PhaseMenuComponent,
  LanePhaseMenuComponent,
  DiagramMenuComponent,
  LinkMenuComponent,
  PlusButtonMenuComponent
];

const components = [
  DiagramContextMenuComponent
];

@NgModule({
  imports,
  declarations: [
    ...innerComponents,
    ...components
  ],
  exports: components
})
export class DiagramContextMenuModule {

  constructor(
    iconRegistry: MatIconRegistry,
    domSanitizer: DomSanitizer
  ) {
    const icons = [
      'add',
      'delete',
      'properties',
      'expand',
      'collapse',
      'open-sub-map',
      'trace-shape',
      'pin',
      'unselect-node',
      'select-node'
    ];
    registerIcons(iconRegistry, domSanitizer, icons);
  }

}
