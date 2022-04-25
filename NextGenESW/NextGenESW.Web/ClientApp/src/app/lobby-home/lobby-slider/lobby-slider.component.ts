import { Component, OnInit } from "@angular/core";
import { FooterServiceService } from '../footer-service.service';
import { NgxIndexedDBService } from 'ngx-indexed-db'; 
import {
  trigger,
  transition,
  query,
  style,
  animate,
  group
} from "@angular/animations";

@Component({
  selector: 'app-lobby-slider',
  templateUrl: './lobby-slider.component.html',
  animations: [
    trigger("slider", [
      transition(
        ":increment",
        group([
          query(":enter", [
            style({
              left: "100%"
            }),
            animate("0.5s ease-out", style("*"))
          ]),
          query(":leave", [
            animate(
              "0.5s ease-out",
              style({
                left: "-100%"
              })
            )
          ])
        ])
      ),
      transition(
        ":decrement",
        group([
          query(":enter", [
            style({
              left: "-100%"
            }),
            animate("0.5s ease-out", style("*"))
          ]),
          query(":leave", [
            animate(
              "0.5s ease-out",
              style({
                left: "100%"
              })
            )
          ])
        ])
      )
    ])
  ],
  styleUrls: ['./lobby-slider.component.scss']
})
export class LobbySliderComponent {
  fkVideo1: any[];
  constructor(private footerServiceService: FooterServiceService , private dbService: NgxIndexedDBService ) { }
 
  ngOnInit(): void {
    this.getVideoDataLink(); 
    this.reloadSlider();

  } 

  reloadSlider(){
    clearInterval(this.interVar); 
    this.dbService.getAll('knowledgeasset').subscribe((data) => {  
      this._images  = data;
      this._images =  this._images.filter((node) =>{
        return node.isFeatured
      })
      this.lastIndex = this._images.length - 1; 
      this.interValCall();  
  });  
  }

      public _images = [];
      private _imagesNext = [];
      selectedIndex: number = 0;
      selectedNextIndex: number = 0;
      lastIndex: number
      interVar : any ;

  interValCall() {
     this.interVar =   setInterval(() => {
          if (this.selectedIndex == this.lastIndex) {
            this.selectedIndex = 0;
            this.selectedNextIndex = 0;
          }
          else {
            this.next()
          } 
      }, 5000)  
  }


  get images() {
    return [this._images[this.selectedIndex]];
  }
  get imagesNext() {
    return [this._imagesNext[this.selectedNextIndex]];
  }

  changeSlider(i) {
    clearInterval(this.interVar); 
    this.selectedIndex = i;
    this.selectedNextIndex = i;
    this.interValCall();
  }

  previous() {
    this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
    this.selectedNextIndex = Math.max(this.selectedNextIndex - 1, 0);
  }
  next() {
    this.selectedIndex = Math.min(
      this.selectedIndex + 1,
      this._images.length - 1
    );
    this.selectedNextIndex = Math.min(
      this.selectedNextIndex + 1,
      this._imagesNext.length - 1
    );

  }
  private getVideoDataLink() {
      this.footerServiceService.getVideoData().subscribe(
        data => { 
          this.dbService.clear("knowledgeasset") 
          data.forEach(element => {
            if (element.isFeatured) {
              this.dbService
              .add('knowledgeasset', element )
            } 
          });  

          if (  this._images.length==0){

            this.reloadSlider()
          }

        });
    }
}
