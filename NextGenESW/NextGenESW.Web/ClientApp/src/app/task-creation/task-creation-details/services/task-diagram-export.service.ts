import { Injectable } from '@angular/core';
import { DiagramComponent } from '../../../diagram-gojs/components/diagram';

@Injectable()
export class TaskDiagramExportService {

  private diagram: DiagramComponent

  setDiagramComponent(diagram: DiagramComponent) {
    this.diagram = diagram;
  }

  exportAsPDF() {
    this.diagram.api.exportAsPDF();
  }

  exportAsSVG() {
    this.diagram.api.exportAsSVG();
  }

  exportAsPNG() {
    this.diagram.api.exportAsPNG();
  }

}
