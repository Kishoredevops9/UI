import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-criteria-properties',
  templateUrl: './criteria-properties.component.html',
  styleUrls: ['./criteria-properties.component.scss']
})
export class CriteriaPropertiesComponent implements OnInit {
  contentType: string = 'CG';
  constructor() { }

  ngOnInit(): void {
  }

}
