import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-deviation-report',
  templateUrl: './deviation-report.component.html',
  styleUrls: ['./deviation-report.component.scss'],
})
export class DeviationReportComponent implements OnInit {
  @Input() title: string;

  constructor() {}

  ngOnInit() {}
}
