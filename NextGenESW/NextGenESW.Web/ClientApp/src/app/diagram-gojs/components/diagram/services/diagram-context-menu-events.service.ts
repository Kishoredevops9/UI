import { Injectable } from '@angular/core';
import { DiagramComponent } from '../diagram/diagram.component';

/**
 * This service was created to fix a certain bug caused by using CDK Overlay
 * for context menu.
 * 
 * The diagram context menu is implemented using Angular CDK Overlay.
 * However, on some browsers, the context menu for overlay is open before
 * the actual diagram context menu. It results in Windows context menu
 * being open above the diagram one.
 * 
 * To fix this issue we overwrite event listeners and block opening the context
 * menu on CDK element if there's context menu request on the diagram.
 */
@Injectable()
export class DiagramContextMenuEventsService {

  private diagrams: DiagramComponent[] = [];

  addDiagram(diagram: DiagramComponent) {
    if (!this.diagrams.length) {
      this.addContextMenuEventListener();
    }

    this.diagrams = [
      ...this.diagrams,
      diagram
    ];
  }

  removeDiagram(diagram: DiagramComponent) {
    this.diagrams = this.diagrams.filter((item) => item !== diagram);

    if (!this.diagrams.length) {
      this.removeContextMenuEventListener();
    }
  }

  private addContextMenuEventListener() {
    const overlay = document.getElementsByClassName('cdk-overlay-container')
      .item(0) as any;
    if (overlay) {
      overlay.oncontextmenu = this.onContextMenu;
    }
  }

  private removeContextMenuEventListener() {
    const overlay = document.getElementsByClassName('cdk-overlay-container')
      .item(0) as any;
    if(overlay) {
      overlay.oncontextmenu = null;
    }
  }

  private onContextMenu = () => {
    const lastDiagram = this.diagrams[this.diagrams.length - 1];
    const contextMenu = lastDiagram.api.getCurrentContextMenu();
    return !contextMenu?.target;
  }

}
