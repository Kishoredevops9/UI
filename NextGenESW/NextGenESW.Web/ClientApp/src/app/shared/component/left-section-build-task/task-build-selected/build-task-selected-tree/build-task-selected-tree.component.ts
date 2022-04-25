import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import {StepflowService} from '@app/process-maps/step-flow/stepflow.service';
import { AddDisciplinePopupComponent } from '../../add-discipline-popup/add-discipline-popup.component';
import { NewActivityPopupComponent } from '../../new-activity-popup/new-activity-popup.component';

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

@Component({
  selector: 'app-build-task-selected-tree',
  templateUrl: './build-task-selected-tree.component.html',
  styleUrls: ['./build-task-selected-tree.component.scss']
})
export class BuildTaskSelectedTreeComponent implements OnInit {

  @Input() sfId;
  @Input() sfFS;
  fullScreen:boolean;
  item : any = null;
  public cType: any =
  [
    {
      "contentTypeId": 0,
      "name": "Work Instructions",
      "code": "C",
      "status": null,
      "createdOn": null,
      "creatorClockID": null,
      "modifiedOn": null,
      "modifierClockID": null
    },
    {
      "contentTypeId": 1,
      "name": "Work Instructions",
      "code": "WI",
      "status": null,
      "createdOn": null,
      "creatorClockID": null,
      "modifiedOn": null,
      "modifierClockID": null
    },
    {
      "contentTypeId": 2,
      "name": "Guide Book",
      "code": "GB",
      "status": null,
      "createdOn": null,
      "creatorClockID": null,
      "modifiedOn": null,
      "modifierClockID": null
    },
    {
      "contentTypeId": 3,
      "name": "Design Standards",
      "code": "DS",
      "status": null,
      "createdOn": null,
      "creatorClockID": null,
      "modifiedOn": null,
      "modifierClockID": null
    },
    {
      "contentTypeId": 4,
      "name": "ProcessMaps",
      "code": "M",
      "status": null,
      "createdOn": null,
      "creatorClockID": null,
      "modifiedOn": null,
      "modifierClockID": null
    },
    {
      "contentTypeId": 5,
      "name": "Refernce Doc",
      "code": "RD",
      "status": null,
      "createdOn": null,
      "creatorClockID": null,
      "modifiedOn": null,
      "modifierClockID": null
    },
    {
      "contentTypeId": 6,
      "name": "Activity Page",
      "code": "AP",
      "status": null,
      "createdOn": null,
      "creatorClockID": null,
      "modifiedOn": null,
      "modifierClockID": null
    },
    {
      "contentTypeId": 7,
      "name": "Video",
      "code": null,
      "status": null,
      "createdOn": null,
      "creatorClockID": null,
      "modifiedOn": null,
      "modifierClockID": null
    },
    {
      "contentTypeId": 8,
      "name": "Tasks",
      "code": null,
      "status": null,
      "createdOn": null,
      "creatorClockID": null,
      "modifiedOn": null,
      "modifierClockID": null
    },
    {
      "contentTypeId": 9,
      "name": "Knowledge Pack",
      "code": "KP",
      "status": null,
      "createdOn": null,
      "creatorClockID": null,
      "modifiedOn": null,
      "modifierClockID": null
    },
    {
      "contentTypeId": 10,
      "name": "Criteria Group",
      "code": "CG",
      "status": null,
      "createdOn": null,
      "creatorClockID": null,
      "modifiedOn": null,
      "modifierClockID": null
    },
    {
      "contentTypeId": 11,
      "name": "Table Of Content",
      "code": "TOC",
      "status": null,
      "createdOn": null,
      "creatorClockID": null,
      "modifiedOn": null,
      "modifierClockID": null
    },
    {
      "contentTypeId": 12,
      "name": "Related Content",
      "code": "RC",
      "status": null,
      "createdOn": null,
      "creatorClockID": null,
      "modifiedOn": null,
      "modifierClockID": null
    },
    {
      "contentTypeId": 13,
      "name": "Step Flow",
      "code": "SF",
      "status": null,
      "createdOn": null,
      "creatorClockID": null,
      "modifiedOn": null,
      "modifierClockID": null
    },
    {
      "contentTypeId": 14,
      "name": "Step",
      "code": "SP",
      "status": null,
      "createdOn": null,
      "creatorClockID": null,
      "modifiedOn": null,
      "modifierClockID": null
    }
  ];


  stObj  : any ={ 
    "A" : "A",
    "C"  : "CG",
    "SF" : "SF",
    "SP"  : "SP",
    "G"  : "GB",
    "I" : "WI",
    "K" : "KP",
    "M" : "PM",
    "S" : "DS",
    "R" : "RC",
    "D" : "D",
    "T" : "TC"

  }



  loading :  boolean  = true;
  constructor(   public dialog: MatDialog,
    public StepflowService  : StepflowService,
    @Inject(DOCUMENT) private document: Document
    ) { 





  }


  addActivitySF(item){

    item =  Object.assign( item , { stepFlowId : this.sfId }  )

    
    this.dialog.open(NewActivityPopupComponent, 
    {height: '280px',
    width: '500px',
    data: item});
  }

  


  addDisciplineSF(item){


     
   item =  Object.assign( item , { stepFlowId : this.sfId }  )

   console.log("======")
   console.log(this.sfId)
   console.log(item)
   console.log("======")




    const dialogRef = this.dialog.open(AddDisciplinePopupComponent, {
      height: '215px',
      width: '500px',
      data: item
    });
    dialogRef.afterClosed().subscribe((result) => {
      if(result == 'SAVE'){
        this.loading = true;
        this.StepflowService.getStepFlowBycid(this.sfId).subscribe((node:any)=>{ 
            this.item =   node.StepFlow[0].Steps;
            console.log(this.item) 

            this.item.map((node)=>{

              if (node.KnowledgeAssetId == item.KnowledgeAssetId){

                node.active = true;
              }
              
            })
            
            this.loading = false;
        })
      }
    });
  }


  ngOnChanges(event) {
    this.fullScreen = this.sfFS;

  }
  

  ngOnInit(): void {

    this.StepflowService.getStepFlowBycid(this.sfId).subscribe((node:any)=>{ 

      console.log(node)
  
      // if (node.hasOwnProperty("stepFlowJson")){

      //   console.log("Data found")
        


        this.item =   node.StepFlow[0].Steps;
        this.loading = false;
  

     
      // else{ 
      //   console.log("Data not found")
      //   this.item = [];
      //   this.loading = false;
      // }





    },()=>{
      this.loading = false;

    })
  }
  getID($i) {
    let d = this.cType.find((node) => {
      return node.contentTypeId == $i
    })
    
 

    return d.code
  }
  

}
