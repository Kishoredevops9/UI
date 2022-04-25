import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-task-tab-three-content',
  templateUrl: './task-tab-three-content.component.html',
  styleUrls: ['./task-tab-three-content.component.scss'],
})
export class TabThreeContentComponent implements OnInit {
  constructor() {}
  @Output() buildTaskCreatedOutput = new EventEmitter<any>();
  hasBuildCreated: any = false;
  ngOnInit(): void {
      
  }
  LeftbuildCreatedOutput(hasBuildCreated){
    this.hasBuildCreated = hasBuildCreated;
    this.buildTaskCreatedOutput.emit(hasBuildCreated);
  }
}
