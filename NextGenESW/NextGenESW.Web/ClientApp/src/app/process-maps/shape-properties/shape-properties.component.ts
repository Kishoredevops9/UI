import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { SharedService } from '@app/shared/shared.service';

@Component({
  selector: 'app-shape-properties',
  templateUrl: './shape-properties.component.html',
  styleUrls: ['./shape-properties.component.scss']
})
export class ShapePropertiesComponent implements OnInit {

  private  componentData: any = { };
  public aType:any = null;
  @Input() data: any;  
  ngOnChanges(changes: SimpleChange) {
     this.sharedService.setEditActivityData(changes['data'].currentValue);   
        if (changes['data'] && changes['data'].currentValue) {   
              this.componentData = changes['data'].currentValue;      
              this.aType =  ( this.componentData.activityTypeId )
              console.log('1233333',changes['data'].currentValue);
             if (this.aType==5)  { 

             }
             else if ( this.aType == 3  ){ 
             }
             else { 
             }

        }
  
  }
  
  constructor( private sharedService: SharedService) { 
    this.componentData = {}
    

  }

  ngOnInit(): void {
    console.log("shape property emit")
  }

}
