import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-advance-search',
  templateUrl: './advance-search.component.html',
  styleUrls: ['./advance-search.component.scss']
})
export class AdvanceSearchComponent implements OnInit {
  
  eksSearchDataCreated: any = '';
  eksSearchCountCreated: any;
  eksSearchTitleCreated: any = '';
  eksLeftSearchDataCreated: any = '';
  constructor(public dialog: MatDialog) { }

  ngOnInit() { }

  openModal(mytemplate2) {
    let dialogRef = this.dialog.open(mytemplate2, {
      width: '', height: ''
    });
    dialogRef.afterClosed().subscribe(result => { });
  }

  eksSearchOutput(eksSearchOutput) {
    this.eksSearchDataCreated = eksSearchOutput;
  }

  eksSearchCount(eksSearchCount){
    console.log("eksSearchCount response",eksSearchCount);
    this.eksSearchCountCreated = eksSearchCount + ' Result';
  }

  eksSearchTitle(eksSearchTitle){
    this.eksSearchTitleCreated = eksSearchTitle;
  }

  eksLeftSearchData(eksLeftSearchData) {
    console.log("eksLeftSearchData advance response",eksLeftSearchData);
    this.eksLeftSearchDataCreated = eksLeftSearchData;
  }

}