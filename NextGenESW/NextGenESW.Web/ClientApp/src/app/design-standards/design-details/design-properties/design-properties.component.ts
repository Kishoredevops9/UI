import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-design-properties',
  templateUrl: './design-properties.component.html',
  styleUrls: ['./design-properties.component.scss'],
})
export class DesignPropertiesComponent implements OnInit {
  contentType: string = 'DS';
  constructor() {}

  ngOnInit(): void {}
}
