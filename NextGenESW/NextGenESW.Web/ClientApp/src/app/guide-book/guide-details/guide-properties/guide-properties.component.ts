import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-guide-properties',
  templateUrl: './guide-properties.component.html',
  styleUrls: ['./guide-properties.component.scss']
})
export class GuidePropertiesComponent implements OnInit {
  contentType: string = 'GB';
  constructor() { }

  ngOnInit(): void {
  }

}
