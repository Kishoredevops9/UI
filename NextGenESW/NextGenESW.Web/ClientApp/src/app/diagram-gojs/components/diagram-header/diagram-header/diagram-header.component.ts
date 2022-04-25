import { Component, Input, Output, ViewEncapsulation, EventEmitter, OnDestroy, OnInit, OnChanges } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { DiagramApi } from '../../../components/diagram/gojs/api/types';
import { DiagramDataService } from '../../diagram/diagram-data.service';

@Component({
  selector: 'app-diagram-header',
  templateUrl: './diagram-header.component.html',
  styleUrls: ['./diagram-header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DiagramHeaderComponent implements OnDestroy, OnInit {

  @Input()
  contentType: string;

  @Input()
  diagramApi: DiagramApi;

  @Input()
  id: any;

  @Input()
  linksVisibility: boolean;

  @Output()
  linksVisibilityChange = new EventEmitter<boolean>();

  showExportMenu: boolean = false;
  isTaskExecutionMap: boolean;

  private onDestroy$ = new Subject<void>();

  constructor(
    private dataService: DiagramDataService,
  ) { }

  ngOnInit(): void {
    this.dataService.getConfiguration()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((configuration) => {
        this.isTaskExecutionMap = !!configuration?.isTaskExecutionMap;
        this.showExportMenu = !!configuration.viewOnly;
      });
  }

  toggleLinksVisibility(event) {
    this.diagramApi.toggleLinksVisibility(event.checked);
    this.linksVisibilityChange.emit(this.linksVisibility);
  }

  onPDFExportClick() {
    this.diagramApi.exportAsPDF();
  }

  onSVGExportClick() {
    this.diagramApi.exportAsSVG();
  }

  onPNGExportClick() {
    this.diagramApi.exportAsPNG();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

}
