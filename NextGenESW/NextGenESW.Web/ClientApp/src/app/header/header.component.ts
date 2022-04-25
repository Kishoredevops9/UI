import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  leftNavePanelOutput: boolean;
  leftNaveAdminPanelOutput: boolean;
  @Output() leftNavHeaderPanel = new EventEmitter<any>();
  @Output() leftNavAdminHeaderPanel = new EventEmitter<any>();
  constructor( private route: ActivatedRoute ) { }

  ngOnInit(): void {
  //  console.log("header data");

  }

  leftNavPanelShow(leftNavOutput){
    this.leftNavePanelOutput = leftNavOutput;
    //console.log("left panel show content header component",leftNavOutput);
    this.leftNavHeaderPanel.emit(this.leftNavePanelOutput);
  }

  leftNavAdminPanelShow(leftAdminOutput){
    this.leftNaveAdminPanelOutput = leftAdminOutput;
    //console.log("left panel show admin header component",leftAdminOutput);
    this.leftNavAdminHeaderPanel.emit(this.leftNaveAdminPanelOutput);
  }

}
