import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-expand-button',
  templateUrl: './expand-button.component.html',
  styleUrls: ['./expand-button.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ExpandButtonComponent {

    @Input()
    collapsed: boolean;

}
