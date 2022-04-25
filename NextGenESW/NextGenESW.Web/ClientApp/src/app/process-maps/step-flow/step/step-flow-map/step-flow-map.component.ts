import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { DiagramDialogBoxService } from '../../../../diagram-gojs/components/diagram/services/diagram-dialog-box.service';
import { DiagramHttpService } from '../../../../diagram-gojs/components/diagram/services/diagram-http.service';
import { DiagramConfiguration } from '../../../../diagram-gojs/components/diagram/diagram.types';
import { StepFlowMapDialogService } from './services/step-flow-map-dialog.service';
import { StepFlowMapHttpService } from './services/step-flow-map-http.service';
import { STEP_FLOW_MAP_PALETTE } from './step-flow-map.consts';
import { ProcessMap } from '../../../process-maps.model';
import { StepFlowMapData, StepFlowMapDataService } from './services/step-flow-map-data.service';
import { isProcessMapPublished } from '../../../utils/isProcessMapPublished';

@Component({
  selector: 'app-step-flow-map',
  styleUrls: ['./step-flow-map.component.scss'],
  templateUrl: './step-flow-map.component.html',
  providers: [
    {
      provide: DiagramDialogBoxService,
      useClass: StepFlowMapDialogService
    },
    {
      provide: DiagramHttpService,
      useClass: StepFlowMapHttpService
    },
    StepFlowMapDataService
  ],
})
export class StepFlowMapComponent implements OnInit, OnDestroy{

  paletteItems = STEP_FLOW_MAP_PALETTE;
  diagramConfiguration: DiagramConfiguration = {
    isStepFlowMap: true
  };

  loading: boolean;
  processMap: ProcessMap;
  _previewMode: boolean;

  @Input()
  headerContainer: ViewContainerRef;

  @Input()
  set previewMode(value) {
    this._previewMode = value;
    this.diagramConfiguration = {
      ...this.diagramConfiguration,
      viewOnly: this.getViewOnly()
    };
  }

  get previewMode() {
    return this._previewMode;
  }

  private onDestroy$ = new Subject<void>();

  constructor(
    private service: StepFlowMapDataService,
    private changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.service.getProcessMapBasedOnUrl();
    this.service.getData()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data) => this.setData(data));
  }

  private setData(data: StepFlowMapData) {
    const { loading, processMap } = data;
    this.loading = loading;

    if (!this.loading) {
      this.processMap = processMap;
      this.diagramConfiguration = {
        ...this.diagramConfiguration,
        viewOnly: this.getViewOnly()
      };
    }

    this.changeDetector.detectChanges();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  private getViewOnly() {
    return this.previewMode || (this.processMap && isProcessMapPublished(this.processMap));
  }

}
