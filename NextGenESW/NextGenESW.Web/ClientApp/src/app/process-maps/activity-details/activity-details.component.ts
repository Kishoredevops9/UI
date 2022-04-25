import { Component, Input, OnInit, SimpleChange, ViewChild } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';

import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { ProcessMapsService } from '../process-maps.service';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';


interface ExampleFlatNode {
  expandable: boolean;
  title: string;
  level: number;
  contentTypeId: number;
}


interface FoodNode {
  title: string;
  contentTypeId: number;
  childList?: FoodNode[];
}

@Component({
  selector: 'app-activity-details',
  templateUrl: './activity-details.component.html',
  styleUrls: ['./activity-details.component.scss']
})



export class ActivityDetailsComponent implements OnInit {


  @ViewChild('tree') tree;
  @Input() data: string[];
  public loading: boolean = false;
  public nodata:any = false;
  public TREE_DATA: any;
  public  activityProcessMapIDdata :any = { }
  public cCode: any = {
    "AP": "#30A62A",
    "WI": "#9D5A83",
    "CG": "#17b4ef",
    "RD": "#E3B900",
    "RC": "#E3B900"
  }

  public contentIDS: any = [
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
      "name": "Map-SwimLane Diagrams",
      "code": null,
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
      "code": null,
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
    }
  ];

  getDetailByID($id) {

    $id = $id || 1;
    return this.contentIDS.find((node) => {
      return node.contentTypeId == $id;
      console.log('nodeId', node.contentTypeId)
    })

  }


  // public  TREE_DATA:any =    [
  //   {
  //     title: 'Fruit',
  //     childList: [
  //       {title: 'Apple'},
  //       {title: 'Banana'},
  //       {title: 'Fruit loops',  childList: [
  //         {title: 'a'},
  //         {title: 'Banabna'},
  //         {title: 'cdd'},
  //       ] },
  //     ]
  //   }, {
  //     title: 'Vegetables',
  //     childList: [
  //       {
  //         title: 'Green',
  //         childList: [
  //           {title: 'Broccoli'},
  //           {title: 'Brussels sprouts'},
  //         ]
  //       }, {
  //         title: 'Orange',
  //         childList: [
  //           {title: 'Pumpkins'},
  //           {title: 'Carrots'},
  //         ]
  //       },
  //     ]
  //   },
  // ];




  private _transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.childList && node.childList.length > 0,
      title: node.title,
      level: level,
      contentTypeId: node.contentTypeId
    };
  }

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    this._transformer, node => node.level, node => node.expandable, node => node.childList);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  public psub : any;
  constructor(public ProcessMapsService: ProcessMapsService) {


  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;



  showNewTree(data,pid,aid){





    let newData = JSON.parse(JSON.stringify(data)).find((node) => {
      return (node.id == aid) && (node.activityDocuments.length)
    })
    if (newData && newData.activityTypeId == 5) {
      let activePageID = newData.activityDocuments[0]['activityPageId'];
   this.psub =    this.ProcessMapsService.getactivityDetailByID(activePageID).subscribe((d) => {
        this.loading = false;
        d['childList'] = [...d['content']]
        this.TREE_DATA = [d]
        this.dataSource.data = this.TREE_DATA
        setTimeout(() => {
          this.tree.treeControl.expandAll();
        }, 100)
      })
    }
    else {
      this.loading = false;
      this.dataSource.data = [];

    }

  }

  ngOnChanges(changes: SimpleChange) {
    if (changes['data'] && changes['data'].currentValue) {
      let pid = changes['data'].currentValue.pid;
      let aid = changes['data'].currentValue.id;

      if (this.psub){

        this.psub.unsubscribe();

      }
      this.loading = true;

      if( Object.keys(this.activityProcessMapIDdata).indexOf(pid.toString()) < 0 ){
        this.ProcessMapsService.getActivitiesByProcessmapID(pid).subscribe((data) => {
         this.showNewTree(data,pid,aid)
         this.activityProcessMapIDdata[pid] = data;
        })
      }
      else{
        this.showNewTree(this.activityProcessMapIDdata[pid],pid,aid)
      }
    }
  }

    ngOnInit(): void {
      }


}
