import { Component, Input, OnDestroy, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-html-viewer',
  template: `<div [innerHTML]="content | safe : 'html'"></div>`,
  encapsulation: ViewEncapsulation.Emulated
})
export class HtmlViewerComponent {
  @Input() content: string;
}
