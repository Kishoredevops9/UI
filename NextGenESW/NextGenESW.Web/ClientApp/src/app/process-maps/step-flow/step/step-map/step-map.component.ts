import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as _ from 'lodash/fp';

import { DiagramDialogBoxService } from '../../../../diagram-gojs/components/diagram/services/diagram-dialog-box.service';
import { DiagramHttpService } from '../../../../diagram-gojs/components/diagram/services/diagram-http.service';
import { DiagramConfiguration } from '../../../../diagram-gojs/components/diagram/diagram.types';
import { StepMapDialogService } from './services/step-map-dialog.service';
import { StepMapHttpService } from './services/step-map-http.service';
import { isProcessMapPublished } from   '@app/process-maps/utils/isProcessMapPublished';



import { ProcessMap } from '../../../process-maps.model';
import { STEP_MAP_PALETTE } from './step-map.consts';
import { StepMapData, StepMapDataService } from '@app/process-maps/step-flow/step/step-map/services/step-map-data.service';
import { ASSET_STATUSES } from '@environments/constants';

@Component({
  selector: 'app-step-map',
  styleUrls: ['./step-map.component.scss'],
  templateUrl: './step-map.component.html',
  providers: [
    {
      provide: DiagramDialogBoxService,
      useClass: StepMapDialogService
    },
    {
      provide: DiagramHttpService,
      useClass: StepMapHttpService
    },
    StepMapDataService
  ],
})
export class StepMapComponent implements OnInit, OnDestroy {

  paletteItems = STEP_MAP_PALETTE;
  diagramConfiguration: DiagramConfiguration = {
    isStepMap: true
  };

  processMap: ProcessMap;
  loading: boolean;
  _previewMode: boolean;
  _disciplines: any[];

  @Input()
  largerDiagram: boolean;

  @Input()
  set disciplines(disciplines) {
    if (_.isEmpty(this._disciplines) && !_.isEmpty(disciplines)) {
      this.getData();
    }
    this._disciplines = disciplines;
  };

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

  @Input()
  headerContainer: ViewContainerRef;

  private onDestroy$ = new Subject<void>();

  constructor(
    private service: StepMapDataService,
    private changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getData();
  }

  private getData() {
    this.service.getProcessMapBasedOnUrl();
    this.service.getData()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data) => this.setData(data));
  }

  private setData(data: StepMapData) {
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

  get isContentOwner() {
    return this.processMap?.contentOwnerId === sessionStorage.getItem('userMail');
  }

  private getViewOnly() {
    return this.previewMode || (this.processMap && isProcessMapPublished(this.processMap)) || (this.processMap?.assetStatus === ASSET_STATUSES.SUBMITTED_FOR_APPROVAL && !this.isContentOwner);
  }

}
