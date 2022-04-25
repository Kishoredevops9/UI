import { Component } from '@angular/core';
import { BaseContextMenuComponent } from '../base-context-menu.component';

@Component({
  selector: 'app-diagram-menu',
  templateUrl: './diagram-menu.component.html'
})
export class DiagramMenuComponent extends BaseContextMenuComponent {

  onAddLaneClick() {
    this.diagramApi.insertLaneAtTheEnd();
  }

  onAddPhaseClick() {
    this.diagramApi.insertPhaseAtTheEnd();
  }

}
