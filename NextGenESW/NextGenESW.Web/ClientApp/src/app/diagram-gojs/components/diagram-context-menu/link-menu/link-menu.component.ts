import { Component } from '@angular/core';
import { BaseContextMenuComponent } from '../base-context-menu.component';

@Component({
  selector: 'app-link-menu',
  templateUrl: './link-menu.component.html'
})
export class LinkMenuComponent extends BaseContextMenuComponent {

  onDeleteClick() {
    this.diagramApi.deleteLinkByKey(
      this.model.data.key
    );
  }

  onPropertiesClick() {
    this.diagramApi.showPropertiesForExistingLink(
      this.model.data
    );
  }

}
