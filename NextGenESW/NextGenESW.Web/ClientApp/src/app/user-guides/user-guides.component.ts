import { Component, OnInit } from '@angular/core';
import { LobbyHomeService } from '../lobby-home/lobby-home.service';
@Component({
  selector: 'app-user-guides',
  templateUrl: './user-guides.component.html',
  styleUrls: ['./user-guides.component.scss'],
})
export class UserGuidesComponent implements OnInit {
    userGuides;
    searchBox;
    filteredItems;
    masterData; 
  constructor(private lobbyHomeService: LobbyHomeService) { } 
  ngOnInit(): void {
    this.loadUserGuide();
  }

  
  sortArray(array) {
    array.sort((a, b) => a.index - b.index);
    array.forEach(a => {
      if (a.children && a.children.length > 0)
        this.sortArray(a.children)
    })
    return array;
  }

  loadUserGuide() {
    this.lobbyHomeService.getAllUserGuides().subscribe(
      (data) => {
        let res = this.sortArray(data);
        this.userGuides = res;        
        this.masterData  =  Object.freeze(  res )  
      }
    );
  }
 
  filterItem(value) {
    if (!value) {    
      this.userGuides   =    JSON.parse(  JSON.stringify(     this.masterData ));
    }
    else {
      let tempData = [];
      let loopData =  JSON.parse(  JSON.stringify(    this.masterData  ) );        
      loopData.forEach(function (node) { 
        let ch =  node.children.filter(function (n) {
          if (new RegExp(value.toLocaleLowerCase()).test(n.title.toLocaleLowerCase())) {
            return n;
          }
        }
        )
        node.children = ch;
        tempData.push(node)
      }
      )
    
       this.userGuides = tempData  
 
    }
  }
}