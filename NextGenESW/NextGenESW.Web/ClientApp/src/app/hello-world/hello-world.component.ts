import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hello-world',
  template: ` <div>
  Hello World!</div>`,
  styles: [`div{
    left:38vw;
    top:20vh;
    position:absolute;
    text-align: left;
    font-size: 26px;
    font-family: 'BarlowSemiCondensed-SemiBold', sans-serif;
    letter-spacing: 0.83px;
    color: #353E56;
    text-transform: capitalize;
    opacity: 1;
  }`]
})
export class HelloWorldComponent implements OnInit {
  
  constructor() { }

  ngOnInit(): void { }


}
