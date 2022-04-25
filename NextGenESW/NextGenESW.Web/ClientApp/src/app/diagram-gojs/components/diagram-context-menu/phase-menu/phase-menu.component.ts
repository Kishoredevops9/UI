import { Component, OnInit } from '@angular/core';

import { BaseContextMenuComponent } from '../base-context-menu.component';

@Component({
  selector: 'app-phase-menu',
  templateUrl: './phase-menu.component.html'
})
export class PhaseMenuComponent extends BaseContextMenuComponent implements OnInit{

  isPhaseCollapsed: boolean;

  ngOnInit() {
    this.isPhaseCollapsed = !!this.model.data.isPhaseCollapsed;
  }

  onDeleteClick() {
    this.diagramApi.deleteNodeByKey(
      this.model.data.key
    );
  }

  onAddPhaseClick() {
    this.diagramApi.insertPhaseAfter(
      this.model.data
    );
  }

  onExpandCollapseClick() {
    this.diagramApi.expandCollapsePhase(
      this.model.data,
      this.isPhaseCollapsed
    );
  }

  onPropertiesClick() {
    this.diagramApi.showPropertiesForExistingPhase(
      this.model.data
    );
  }

}
