import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-context-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ContextMenuItemComponent {

    @Input()
    large = false;

    @Input()
    icon: string;

    @Input()
    text: string;

    @Input()
    showIcon = true;

}
