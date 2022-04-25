import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ChangeDetectorRef, ViewContainerRef, ViewChild, AfterViewInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DiagramDialogBoxService } from '../../diagram-gojs/components/diagram/services/diagram-dialog-box.service';
import { DiagramHttpService } from '../../diagram-gojs/components/diagram/services/diagram-http.service';
import { DiagramConfiguration } from '../../diagram-gojs/components/diagram/diagram.types';
import { TaskExecutionMapDialogService } from './services/task-execution-map-dialog.service';
import { TaskExecutionMapHttpService } from './services/task-execution-map-http.service';
import { Item } from '../../task-creation/task-creation.model';
import { TaskExecutionMapDataService } from './services/task-execution-map-data.service';
import { TaskDiagramExportService } from '../../task-creation/task-creation-details/services/task-diagram-export.service';
import { DiagramComponent } from '../../diagram-gojs/components/diagram';

@Component({
  selector: 'app-task-execution-map',
  styleUrls: ['./task-execution-map.component.scss'],
  templateUrl: './task-execution-map.component.html',
  providers: [
    {
      provide: DiagramDialogBoxService,
      useClass: TaskExecutionMapDialogService
    },
    {
      provide: DiagramHttpService,
      useClass: TaskExecutionMapHttpService
    },
    TaskExecutionMapDataService
  ]
})
export class TaskExecutionMapComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input()
  set taskExecutionData(data: Item) {
    this._taskExecutionData = data;
    this.service.setTaskExecutionData(this.taskExecutionData);
  }
  get taskExecutionData(): Item {
    return this._taskExecutionData;
  }
  private _taskExecutionData: Item;

  @Output()
  openListView = new EventEmitter();

  @ViewChild('headerContainer', { read: ViewContainerRef })
  headerContainerRef: ViewContainerRef;

  @ViewChild(DiagramComponent)
  diagram: DiagramComponent;

  diagramConfiguration: DiagramConfiguration = {
    isTaskExecutionMap: true,
    isStepFlowMap: true,
    viewOnly: true
  };

  dropdownOptions;
  selectedDropdownOption;
  processMap;
  loading: boolean;

  private onDestroy$ = new Subject<void>();

  constructor(
    private service: TaskExecutionMapDataService,
    private changeDetector: ChangeDetectorRef,
    private taskDiagramExportService: TaskDiagramExportService
  ) { }

  onSelectedStepFlowChange(contentId: string) {
    const selectedDropdownOption = this.dropdownOptions.find(
      option => option.value === contentId
    );
    this.selectedDropdownOption = selectedDropdownOption;
    this.service.setSelectedContentId(contentId);
  }

  ngOnInit() {
    this.service.getData()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(({ processMap, loading }) => {
        this.loading = loading;
        if (!this.loading) {
          this.processMap = processMap;
        }
        this.changeDetector.detectChanges();
      });

    this.service.getDropdownItems()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((options) => {
        this.dropdownOptions = options;
        this.onSelectedStepFlowChange(this.dropdownOptions[0].value);
      });
  }

  ngAfterViewInit() {
    this.taskDiagramExportService.setDiagramComponent(
      this.diagram
    );
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

}
