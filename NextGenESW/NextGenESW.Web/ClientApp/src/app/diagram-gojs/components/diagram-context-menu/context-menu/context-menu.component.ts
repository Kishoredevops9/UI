import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ContextMenuModel, ContextMenuTarget, DiagramApi } from '../../diagram/gojs/api/types';
import { MenuType } from '../diagram-context-menu.types';
import { NodeCategory } from '../../../types/node';
import { LANE_HEADER_NAME, LANE_PLUS_BUTTON, PHASE_HEADER_NAME } from '../../diagram/gojs/consts';
import { DiagramDataService } from '../../diagram/diagram-data.service';
import { PaletteItem } from '@app/diagram-gojs/types/palette';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DiagramContextMenuComponent implements OnInit, OnDestroy {

  @Input()
  set diagramApi(diagramApi: DiagramApi) {
    this.onApiAssign(diagramApi);
  }
  get diagramApi(): DiagramApi {
    return this._diagramApi;
  }
  private _diagramApi: DiagramApi;

  @Input()
  linksVisibility: boolean;

  @Input()
  paletteItems: PaletteItem[];

  open: boolean;
  model: ContextMenuModel;
  menuType: MenuType;
  published: boolean;
  blank: boolean;
  task: boolean;
  stepFlow: boolean;
  step: boolean;
  taskExecution: boolean;
  taskExecutionStep: boolean;
  MenuType = MenuType;

  private onDestroy$ = new Subject<void>();
  private onApiAssign$ = new Subject<void>();

  constructor(
    protected diagramDataService: DiagramDataService
  ) {}

  ngOnInit() {
    this.diagramDataService.getConfiguration()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((configuration) => {
        this.published = configuration?.viewOnly;
        this.blank = configuration?.isBlankMap;
        this.task = configuration?.isTaskMap;
        this.stepFlow = configuration?.isStepFlowMap;
        this.step = configuration?.isStepMap;
        this.taskExecution = configuration?.isTaskExecutionMap;
        this.taskExecutionStep = configuration?.isTaskExecutionStepMap;
      });
  }

  private onApiAssign(diagramApi: DiagramApi) {
    if (!diagramApi) {
      return;
    }

    this.onApiAssign$.next();
    this._diagramApi = diagramApi;
    this._diagramApi.getContextMenu()
      .pipe(
        takeUntil(this.onApiAssign$),
        takeUntil(this.onDestroy$)
      )
      .subscribe((model) => this.onContextMenuChange(model));
  }

  private onContextMenuChange(model: ContextMenuModel) {
    if (!model) {
      this.open = false;
      return;
    }

    this.model = model;
    this.updateMenuType();

    this.open = true;
  }

  private updateMenuType() {
    const menuTargetTypeMap: Record<ContextMenuTarget, MenuType> = {
      [NodeCategory.TextNode]: MenuType.Node,
      [NodeCategory.ShapeNode]: MenuType.Node,
      [NodeCategory.EdgeNode]: MenuType.Node,
      [NodeCategory.SeeThroughNode]: MenuType.Node,
      [NodeCategory.LanePhase]: MenuType.LanePhase,
      [LANE_HEADER_NAME]: MenuType.Lane,
      [PHASE_HEADER_NAME]: MenuType.Phase,
      [LANE_PLUS_BUTTON]: MenuType.PlusButton,
      Diagram: MenuType.Diagram,
      Link: MenuType.Link
    };
    this.menuType = menuTargetTypeMap[this.model.target];
  }

  ngOnDestroy() {
    this.onApiAssign$.complete();

    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

}
