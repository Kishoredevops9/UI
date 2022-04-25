import { Component, OnInit } from '@angular/core';


export interface PeriodicElement {
  title: string;
  position: number;
  contentid: number;
  contenttype: string;
  Disciplines: string;
  Disciplinescode: string;
}


const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, title: 'Hydrogen', contentid: 1.0079, contenttype: 'KP', Disciplines: 'abc.com', Disciplinescode: '101'},
  {position: 2, title: 'Helium', contentid: 4.0026, contenttype: 'WI', Disciplines: 'abc.com', Disciplinescode: '102'},
  {position: 3, title: 'Lithium', contentid: 6.941, contenttype: 'AP', Disciplines: 'abc.com', Disciplinescode: '103'},
  {position: 4, title: 'Beryllium', contentid: 9.0122, contenttype: 'DS', Disciplines: 'abc.com', Disciplinescode: '104'},
  {position: 5, title: 'Boron', contentid: 10.811, contenttype: 'M', Disciplines: 'abc.com', Disciplinescode: '105'},
];


@Component({
  selector: 'app-global-search-result',
  templateUrl: './global-search-result.component.html',
  styleUrls: ['./global-search-result.component.scss']
})




export class GlobalSearchResultComponent implements OnInit {

 

  constructor() { }

  ngOnInit(): void {
  }


  displayedColumns: string[] = ['position', 'title', 'contentid', 'contenttype', 'Disciplines', 'Disciplinescode'];
  dataSource = ELEMENT_DATA;

}
