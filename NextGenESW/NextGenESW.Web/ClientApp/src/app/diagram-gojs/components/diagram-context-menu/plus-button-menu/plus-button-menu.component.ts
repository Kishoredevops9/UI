import { Component } from '@angular/core';
import { BaseContextMenuComponent } from '../base-context-menu.component';

@Component({
  selector: 'app-plus-button-menu',
  templateUrl: './plus-button-menu.component.html'
})
export class PlusButtonMenuComponent extends BaseContextMenuComponent {

  onAddLaneClick() {
    this.diagramApi.insertLaneAtTheEnd();
  }

  onAddPhaseClick() {
    this.diagramApi.insertPhaseAtTheEnd();
  }

}
