import { Component, Input, OnInit, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { StringUtils } from '@azure/msal-browser';
 



@Component({
  selector: 'app-browse-map',
  templateUrl: './browse-map.component.html',
  styleUrls: ['./browse-map.component.scss']
})
export class BrowseMapComponent implements OnInit {

 

  @Input() navData: string; 
  @Input() searchText : string;
 
  constructor(   ) { }

  ngOnInit(): void {
      // this.BrowseMapService.getNav().subscribe((node)=>{  
      //   console.log(this.navData)
      //   this.navData = node;
      // }) 

 
 
  }


}
