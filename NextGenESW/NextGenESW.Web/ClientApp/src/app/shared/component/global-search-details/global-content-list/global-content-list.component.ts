import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-global-content-list',
  templateUrl: './global-content-list.component.html',
  styleUrls: ['./global-content-list.component.scss'],
})
export class GlobalContentListComponent implements OnInit {
  @Output() getSearchContentType = new EventEmitter<string>();
  searchContentType;
  showTitleBorder;
  constructor() {}

  ngOnInit(): void {}
  onFilterHandler(contentType) {
    this.showTitleBorder = 'title_border';
    this.getSearchContentType.emit(contentType);
  }
}
