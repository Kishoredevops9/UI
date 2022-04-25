import { Component, OnInit } from '@angular/core';


// export interface PeriodicElementnew {
//   title: string;
//   position: number;
//   contentid: number;

  
// }

// const ELEMENT_DATA: PeriodicElementnew[] = [
//   {position: 1, title: 'Hydrogen', contentid: 1.0079,},
//   {position: 2, title: 'Helium', contentid: 4.0026,},
//   {position: 3, title: 'Lithium', contentid: 6.941, },
//   {position: 4, title: 'Beryllium', contentid: 9.0122, },
//   {position: 5, title: 'Boron', contentid: 10.811, },
// ];


@Component({
  selector: 'app-vbrick-result',
  templateUrl: './vbrick-result.component.html',
  styleUrls: ['./vbrick-result.component.scss']
})
export class VbrickResultComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }


  // displayedColumns2: string[] = ['position', 'title', 'contentid'];
  // dataSource = ELEMENT_DATA;


}
