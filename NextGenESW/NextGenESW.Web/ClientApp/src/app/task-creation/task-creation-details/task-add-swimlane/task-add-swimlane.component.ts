import { Component, OnInit, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-task-add-swimlane',
  templateUrl: './task-add-swimlane.component.html',
  styleUrls: ['./task-add-swimlane.component.scss']
})
export class TaskAddSwimlaneComponent implements OnInit {

  newSwimlaneValue = new FormControl();

  constructor( ) { }

  ngOnInit(): void { }

}
