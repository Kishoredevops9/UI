import { take } from 'rxjs/operators';
import { MatMenuTrigger } from '@angular/material/menu';
import { AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, ViewChild } from '@angular/core';

import { DiagramApi, ContextMenuModel } from '../diagram/gojs/api/types';

@Component({
  selector: 'app-base-context-menu',
  template: ''
})
export class BaseContextMenuComponent implements AfterViewInit, OnDestroy {

  @Input()
  diagramApi: DiagramApi;

  @Input()
  model: ContextMenuModel;

  @Input()
  published: boolean;

  @Input()
  blank: boolean;

  @Input()
  stepFlow: boolean;

  @Input()
  step: boolean;

  @Input()
  taskExecution: boolean;

  @ViewChild('menuTrigger', { static: true })
  menuTrigger: MatMenuTrigger;

  constructor(
    private changeDetector: ChangeDetectorRef
  ) { }

  ngAfterViewInit() {
    this.menuTrigger?.openMenu();
    this.menuTrigger?.menuClosed
      .pipe(take(1))
      .subscribe(() => {
        this.diagramApi.setContextMenu(null);
      });
    this.changeDetector.detectChanges();
  }

  ngOnDestroy() {
    this.menuTrigger?.closeMenu();
  }

}
