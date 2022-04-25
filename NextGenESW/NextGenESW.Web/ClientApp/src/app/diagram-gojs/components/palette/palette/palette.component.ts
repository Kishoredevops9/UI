import { Component, ElementRef, Input, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';

import { createPalette } from '../gojs/createPalette';
import { PaletteItem } from '../../../types/palette';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { animateToFitScreen } from '../utils/animateToFitScreen';

const OFFSET = 46;

@Component({
  selector: 'app-palette',
  templateUrl: './palette.component.html',
  styleUrls: ['./palette.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PaletteComponent {
  
  private static SINGLE_ROW_HEIGHT = 74;
  
  @Input()
  set paletteItems(paletteItems : PaletteItem[]) {
    this._paletteItems = paletteItems;
    this.adjustHeight();
  }
  get paletteItems() : PaletteItem[] {
    return this._paletteItems;
  }
  private _paletteItems : PaletteItem[] = [];

  @ViewChild(CdkDrag, { static: true })
  dragElement: CdkDrag;

  @ViewChild('container', { static: true })
  container: ElementRef<HTMLDivElement>;

  height: number = 370;
  dragPosition = { x: 0 , y: 0 };
  paletteCollapsed: boolean;

  initPalette = () => {
    const palette = createPalette();
    return palette;
  }

  constructor(
    private renderer: Renderer2
  ) {}

  onExpandButtonClick() {
    this.paletteCollapsed = !this.paletteCollapsed;
    if (!this.paletteCollapsed) {
      this.ensureFitsScreen();
    }
  }

  private adjustHeight() {
    this.height = PaletteComponent.SINGLE_ROW_HEIGHT
      * Math.ceil(this.paletteItems.length / 2);
  }

  private ensureFitsScreen() {
    const position = this.dragElement.getFreeDragPosition();
    const expandedBottom = position.y + this.height;
    const { height: maxBottom } = this.container.nativeElement
      .getBoundingClientRect();

    if (expandedBottom > maxBottom) {
      this.moveToFitScreen(expandedBottom - maxBottom);
    }
  }

  private async moveToFitScreen(diff: number) {
    const { x, y: prevY } = this.dragElement.getFreeDragPosition();
    const target = {
      x,
      y: prevY - diff - OFFSET
    };
    await animateToFitScreen(this.renderer, this.dragElement.element.nativeElement, target);
    this.dragPosition = target;
  }

}
