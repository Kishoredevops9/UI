import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { LobbyHomeService } from '../../lobby-home/lobby-home.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-manuals',
  templateUrl: './manuals.component.html',
  styleUrls: ['./manuals.component.scss'],
})
export class ManualsComponent implements OnInit {

  manuals;
  originalData;
  inputFieldValue = new FormControl();
  text="";
  noData: boolean = false;
  searchBox:any;

  constructor( private lobbyHomeService: LobbyHomeService ) { }

  ngOnInit(): void {
    this.loadManuals();
  }

  loadManuals(){
    this.lobbyHomeService.getAllBrowseManuals().subscribe(
      (data) => {
        let dataArray:any = data;
        this.manuals = dataArray.sort(function(a,b){
          return a.index - b.index;
          });
        this.originalData = data;
        console.log(this.manuals);
        this.calcManuals();
      }
    );
  }

  onKeyUp(event){
    this.text = event.target.value;
    this.text = this.text.trim().toLocaleLowerCase();
    let tempArray = [];
    if(this.text != ''){
      this.originalData.forEach(element => {
        if(element.title.toLocaleLowerCase().includes(this.text)){
          tempArray.push(element);
        }
      });
      
      if(tempArray.length>0){
        this.noData = false;
      }else{
        this.noData = true;
      }
      this.manuals = tempArray;
    }else{
      this.manuals = this.originalData;
      this.noData = false;
    }
  }

  calcManuals(){
    let resultHeight;
    let len = this.manuals.length;
    let heigght = (len/3)*40;
    if (len%3 == 0){
      resultHeight = heigght;
    }else{
      resultHeight = heigght + 40;
    }
    document.getElementById('containerId').style.height = resultHeight + 'px';
  }

}
