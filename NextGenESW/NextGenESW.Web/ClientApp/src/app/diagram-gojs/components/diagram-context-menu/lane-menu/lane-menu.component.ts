import { Component, OnInit } from '@angular/core';

import { BaseContextMenuComponent } from '../base-context-menu.component';

@Component({
  selector: 'app-lane-menu',
  templateUrl: './lane-menu.component.html'
})
export class LaneMenuComponent extends BaseContextMenuComponent implements OnInit {

  isLaneCollapsed: boolean;

  ngOnInit() {
    this.isLaneCollapsed = !!this.model.data.isLaneCollapsed;
  }

  onDeleteClick() {
    this.diagramApi.deleteNodeByKey(
      this.model.data.key
    );
  }

  onAddLaneClick() {
    this.diagramApi.insertLaneBelow(
      this.model.data
    );
  }

  onExpandCollapseClick() {
    this.diagramApi.expandCollapseLane(
      this.model.data,
      this.isLaneCollapsed
    );
  }

  onPropertiesClick() {
    this.diagramApi.showPropertiesForExistingSwimLane(
      this.model.data
    )
  }

}
