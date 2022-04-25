import * as _ from 'lodash/fp';
import * as go from 'gojs';
import { ChangeDetectorRef, Component, Input, OnDestroy, Output, ViewEncapsulation, EventEmitter, ViewContainerRef, TemplateRef, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DiagramDialogBoxService } from '../services/diagram-dialog-box.service';
import { createDiagram } from '../gojs/createDiagram/createDiagram';
import { ProcessMapDiagram } from '../../../types/processMap';
import { DiagramDataService } from '../diagram-data.service';
import { NodeData, LinkData } from '../../../types/node';
import { DiagramConfiguration, DiagramModel } from '../diagram.types';
import { DiagramApi } from '../gojs/api/types';
import { createApi } from '../gojs/api/api';
import { DiagramHttpService } from '../services/diagram-http.service';
import { PaletteItem } from '@app/diagram-gojs/types/palette';
import { DiagramContextMenuEventsService } from '../services/diagram-context-menu-events.service';
import { DiagramSnackBarService } from '../services/diagram-snack-bar.service';

@Component({
  selector: 'app-diagram',
  templateUrl: './diagram.component.html',
  styleUrls: ['./diagram.component.scss'],
  providers: [DiagramDataService, DiagramSnackBarService],
  encapsulation: ViewEncapsulation.None
})
export class DiagramComponent implements OnDestroy {

  @Input()
  set processMap(processMap: ProcessMapDiagram) {
    this.dataService.setProcessMap(processMap);
  }

  @Input()
  set configuration(configuration: DiagramConfiguration) {
    this.dataService.setConfiguration(configuration);
    this.api?.setConfiguration(configuration);
    this._configuration = configuration;
  }
  get configuration() {
    return this._configuration;
  }
  private _configuration: DiagramConfiguration;

  @Input()
  paletteItems: PaletteItem[];

  @Input()
  loading: boolean;

  @Input()
  headerContainer: ViewContainerRef;

  @ViewChild('header')
  header: TemplateRef<any>;

  nodeDataArray: NodeData[] = [];
  linkDataArray: LinkData[] = [];
  skipsDiagramUpdate = false;
  api: DiagramApi;
  linksVisibility = true;

  private diagram: go.Diagram;
  private onDestroy$ = new Subject<void>();

  constructor(
    private dialogBoxService: DiagramDialogBoxService,
    private diagramHttpService: DiagramHttpService,
    private changeDetector: ChangeDetectorRef,
    private dataService: DiagramDataService,
    private contextMenuEventsService: DiagramContextMenuEventsService,
    private snackBarService: DiagramSnackBarService
  ) { }

  initDiagram = () => {
    this.diagram = createDiagram();
    this.api = createApi(this.diagram);
    this.api.setDialogBoxHandler((action) =>
      this.dialogBoxService.handleDialogBoxRequest(action)
    );
    this.api.http.setHttpActionHandler((action) =>
      this.diagramHttpService.handleHttpAction(action)
    );
    this.api.setSnackBarHandler((message) =>
      this.snackBarService.handleSnackBar(message)
    );
    this.api.processMap.set(this.dataService.getCurrentProcessMap());
    this.changeDetector.detectChanges();
    this.dataService.getDiagramModel()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(
        (diagramModel) => {
          this.updateDiagramModel(diagramModel);
          // HACK: It looks like GoJS needs some time to properly update model
          //       If we run the update immediately the the lanes are not ready yet
          setTimeout(() => this.api?.updateAdornments());
        }
      );
    this.api.setConfiguration(
      this.dataService.getCurrentConfiguration()
    );
    this.api.toggleLinksVisibility(this.linksVisibility);

    this.contextMenuEventsService.addDiagram(this);
    this.mountHeader();

    return this.diagram;
  }

  ngOnDestroy() {
    this.diagram.div = null;
    this.contextMenuEventsService.removeDiagram(this);

    this.onDestroy$.next();
    this.onDestroy$.complete();

    if (this.headerContainer) {
      this.headerContainer.clear();
    }
  }

  private updateDiagramModel(diagramModel: DiagramModel) {
    const { nodes, links, skipsDiagramUpdate, apiChanges } = diagramModel;

    this.skipsDiagramUpdate = skipsDiagramUpdate;
    this.changeDetector.detectChanges();

    this.nodeDataArray = _.cloneDeep(nodes);
    this.linkDataArray =
      (this.configuration.isTaskExecutionMap || this.configuration.isTaskExecutionStepMap)
        ? []
        : _.cloneDeep(links);
    this.changeDetector.detectChanges();

    apiChanges.forEach((action) => {
      this.api.http.handleAction(action);
    });
  }

  private mountHeader() {
    if (!this.headerContainer) {
      return;
    }

    this.headerContainer.clear();
    this.headerContainer.createEmbeddedView(this.header);
  }
}
