import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DiagramConfiguration } from '@app/diagram-gojs/components/diagram/diagram.types';
import { ProcessMap } from '../../../../process-maps/process-maps.model';
import { DiagramHttpService } from '../../../../diagram-gojs/components/diagram/services/diagram-http.service';
import { StepMapDialogHttpService } from './services/step-map-dialog-http.service';
import { DiagramDialogBoxService } from '../../../../diagram-gojs/components/diagram/services/diagram-dialog-box.service';
import { StepMapDialogDialogService } from './services/step-map-dialog-dialog.service';
import { StepMapDialogDataService } from './services/step-map-dialog-data.service';
import { Item } from '../../../task-creation.model';

@Component({
  selector: 'app-step-map-dialog',
  templateUrl: './step-map-dialog.component.html',
  styleUrls: ['./step-map-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: DiagramHttpService,
      useClass: StepMapDialogHttpService
    },
    {
      provide: DiagramDialogBoxService,
      useClass: StepMapDialogDialogService
    },
    StepMapDialogDataService
  ]
})
export class StepMapDialogComponent implements OnInit, OnDestroy {

  diagramConfiguration: DiagramConfiguration = {
    viewOnly: true,
    showStatusIndicator: true,
    isTaskExecutionStepMap: true
  };

  processMap: ProcessMap;
  loading = true;
  private onDestroy$ = new Subject<void>();

  constructor(
    private service: StepMapDialogDataService,
    public dialogRef: MatDialogRef<StepMapDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { name: string, contentId: string, activityStatusMap: {}, taskExecutionStep: Item }
  ) { }

  ngOnInit() {
    const { contentId } = this.data;
    this.service.getTaskExecutionStepDiagram(
      contentId,
      this.data.activityStatusMap,
      this.data.taskExecutionStep
    )
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((processMap) => {
        this.processMap = processMap;
        this.loading = false;
      });
  }

  onClose() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

}
