import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-approval-content',
  templateUrl: './approval-content.component.html',
  styleUrls: ['./approval-content.component.scss']
})
export class ApprovalContentComponent implements OnInit {
  @Input() contentInfo: any;
  constructor() { }

  ngOnInit(): void {
  }

}
