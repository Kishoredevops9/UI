import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatMenuTrigger } from '@angular/material/menu';
import { DiagramApi, SeeThroughModel } from '../../diagram/gojs/api/types';
import { NodeType } from '../../../types/node';

@Component({
  selector: 'app-see-through',
  templateUrl: './diagram-see-through.component.html',
  styleUrls: ['./diagram-see-through.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DiagramSeeThroughComponent implements AfterViewInit, OnDestroy {

  @ViewChild('menuTrigger', { static: true })
  menuTrigger: MatMenuTrigger;

  @Input()
  mapId: number;

  @Input()
  set diagramApi(diagramApi: DiagramApi) {
    this.onApiAssign(diagramApi);
  }
  get diagramApi(): DiagramApi {
    return this._diagramApi;
  }
  private _diagramApi: DiagramApi;

  model: SeeThroughModel = {
    position: { top: 0, left: 0 }
  };

  private onDestroy$ = new Subject<void>();
  private onApiAssign$ = new Subject<void>();

  showActivityDetails = false;
  showKPack = false;

  constructor(
    private changeDetector: ChangeDetectorRef,
  ) { }

  ngAfterViewInit() {
    this.menuTrigger.openMenu();
    this.changeDetector.detectChanges();
    this.menuTrigger.closeMenu();
  }

  private onApiAssign(diagramApi: DiagramApi) {
    if (!diagramApi) {
      return;
    }

    this.onApiAssign$.next();
    this._diagramApi = diagramApi;
    this._diagramApi.getSeeThrough()
      .pipe(
        takeUntil(this.onApiAssign$),
        takeUntil(this.onDestroy$)
      )
      .subscribe((model) => this.onSeeThroughChange(model));
  }

  private onSeeThroughChange(model: SeeThroughModel) {
    if (!model) {
      return;
    }

    this.model = this.mapModel(model);
    this.menuTrigger.openMenu();
  }

  ngOnDestroy() {
    this.onApiAssign$.complete();

    this.onDestroy$.next();
    this.onDestroy$.complete();

    this.menuTrigger.closeMenu();
  }

  private mapModel(model: SeeThroughModel) {
    this.showActivityDetails = model.data.type === NodeType.ActivityBlock;
    this.showKPack = model.data.type === NodeType.KPack;

    return {
      ...model,
      data: {
        ...model.data,
        id: model.data.key,
        pid: this.mapId
      }
    };
  }

}
