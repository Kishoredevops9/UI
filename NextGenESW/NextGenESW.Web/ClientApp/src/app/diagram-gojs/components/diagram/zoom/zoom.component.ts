import { Component, Input, ViewEncapsulation } from '@angular/core';
import { DiagramApi } from '../gojs/api/types';

@Component({
  selector: 'app-zoom',
  templateUrl: './zoom.component.html',
  styleUrls: ['./zoom.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ZoomComponent {

  @Input()
  diagramApi: DiagramApi;

  onZoomToFit() {
    this.diagramApi.zoomToFit();
  }

  onZoomIn() {
    this.diagramApi.zoomIn();
  }

  onZoomOut() {
    this.diagramApi.zoomOut();
  }

}
