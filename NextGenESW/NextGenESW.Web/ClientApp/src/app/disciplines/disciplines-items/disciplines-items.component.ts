import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-disciplines-items',
  templateUrl: './disciplines-items.component.html',
  styleUrls: ['./disciplines-items.component.scss']
})
export class DisciplinesItemsComponent implements OnInit {

  searchContent: any;

  @Input() navData: string;
  @Input() navFullData: string;
  @Input() searchText;

  constructor() { }

  ngOnInit(): void {
    // this.BrowseMapService.getNav().subscribe((node)=>{  
    //   console.log(this.navData)
    //   this.navData = node;
    // }) 

    if (this.searchText) {

    }
  }

 
  expand(item) {
    return item.child ? (item.child = false) : (item.child = true);
  }

}
