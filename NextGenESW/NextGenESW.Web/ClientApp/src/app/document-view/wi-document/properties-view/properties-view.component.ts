import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-properties-view',
  templateUrl: './properties-view.component.html',
  styleUrls: ['./properties-view.component.scss']
})
export class PropertiesViewComponent implements OnInit {
  contentType = 'DocumentView'
  constructor() { }

  ngOnInit(): void {
  }

}
