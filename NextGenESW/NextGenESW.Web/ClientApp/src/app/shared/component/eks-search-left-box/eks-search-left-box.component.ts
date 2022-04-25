import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges, ViewChild } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { ActivityPageService } from '@app/activity-page/activity-page.service';
import { SharedService } from '@app/shared/shared.service';
import { Observable, Subscription } from 'rxjs';

interface FoodNode {
  name: string;
  id: number;
  children?: FoodNode[];
  parentId: number;
}
const TREE_DATA: any = [];
/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  id: number;
  level: number;
  parentId: number;
}

@Component({
  selector: 'eks-search-app-left-box',
  templateUrl: './eks-search-left-box.component.html',
  styleUrls: ['./eks-search-left-box.component.scss']
})
export class EKSSearchLeftBoxComponent implements OnInit {

  @Output() tagdata = new EventEmitter();
  @ViewChild('tree') tree;
  @Input() treedata: any;
  @Input() checkednode: [];
  @Input() flag: any = false;
  public selectedBox: any = {};
  public tempTag: any = {};
  subscription: any;
  tempCheck: any = false
  markednode: any = [];
  element: any;
  private eventsSubscription: Subscription;
  @Input() delevents: Observable<void>;
  @Input() expendOpt : number;
  expendType : number
  

  ngOnChanges(changes: SimpleChanges) {
    console.log("eks-search-app-left-box", changes);
   
    if (changes.treedata && changes.treedata.currentValue) {
      this.dataSource.data = changes.treedata.currentValue;  
      console.log("this.dataSource.data", this.dataSource.data);
      if (this.expendType==1){
        this.treeControl.expandAll();
      } 
      else{
        this.treeControl.collapseAll();
      }   
    }

    if (changes.expendOpt && changes.expendOpt.currentValue) {
      if( changes.expendOpt.currentValue ){  
        this.expendType = changes.expendOpt.currentValue; 
        console.log(changes.expendOpt.currentValue)     
     
        // if (changes.expendOpt.currentValue == 1){
        //   this.treeControl.expandAll();
        // }
        // else {
        //   this.treeControl.collapseAll();
        // }
       
     
     
      }
      
    }
    


    if (changes.checkednode && changes.checkednode.currentValue) {
      this.tempTagItem = changes.checkednode.currentValue;
      this.selectedBox = {};
      this.tempTagItem.forEach((node) => {
        this.selectedBox[node.id] = true;
      })
    }
  }

  private _transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      id: node.id,
      level: level,
      parentId: node.parentId,
    };
  }

  tempTagItem: any = [];
  filterdata(node) {

     
    let tempValue: any = {};
    if (this.tempTagItem.findIndex(el => el.id === node.id) >= 0) {

      this.tempTagItem = this.tempTagItem.filter((e) => {
        return e.id != node.id && this.selectedBox[e.id] == true;
      })

    } else {
      tempValue["id"] = node.id;
      tempValue["name"] = node.name;
      tempValue["parentId"] = node.parentId;
      this.tempTagItem = Object.assign([], this.tempTagItem);
      this.tempTagItem.push(tempValue);
    }
    this.tagdata.emit(this.tempTagItem);
  }

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    this._transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
  constructor(private activityPageService: ActivityPageService,
    private SharedService: SharedService

  ) {
    this.dataSource.data = TREE_DATA;
  }

  ngOnInit(): void {
    this.delevents && this.delevents.subscribe((node) => {
      console.log(node);
      this.element = node;
      console.log("this.element", this.element);
      if (this.element.isUnchecked) {
        this.selectedBox[node['id']] = false;
      } else {
        this.selectedBox[node['id']] = true;
       
      }
      this.filterdata(node);
    });
  }

}
