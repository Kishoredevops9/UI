import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-help-userguides',
  templateUrl: './help-userguides.component.html',
  styleUrls: ['./help-userguides.component.scss']
})
export class HelpUserguidesComponent implements OnInit {

  selectType : any = 'Help on this Page';

  constructor() { }

  ngOnInit(): void {
  }

}
