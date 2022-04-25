import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
import { NestedTreeControl } from "@angular/cdk/tree";
import { MatTreeNestedDataSource } from "@angular/material/tree";
//import { FoodNode } from '../properties.model';
import { Observable, Subscription } from 'rxjs';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { ActivityPageService } from '@app/activity-page/activity-page.service';
import { SharedService } from '@app/shared/shared.service';

interface FoodNode {
  name: string;
  rowNo: number;
  children?: FoodNode[];
  parentId: number;
  selectable: boolean;
}
const TREE_DATA: any = [];
/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  rowNo: number;
  level: number;
  parentId: number;
}


@Component({
  selector: 'app-discipine-tree',
  templateUrl: './discipine-tree.component.html',
  styleUrls: ['./discipine-tree.component.scss']
})
export class DiscipineTreeComponent implements OnInit {
  nodePath: any;
  @Output() selectedDisciplineCodes = new EventEmitter();
  @Input() discipline: any;
  @Input() checkednode: [];
  @Input() selectedDisciplineData: any;
  @Input() disciplineEvents: Observable<void>;
  @Output() setDisciplineData = new EventEmitter();
  @Input() flag: any = false;
  @Input() treedata: any;
  //treeControl = new NestedTreeControl<FoodNode>(node => node.children);
  //dataSource = new MatTreeNestedDataSource<FoodNode>();
  selectedDiscipline = {};
  element: any;
  public selectedBox: any = {};
  public tempTag: any = {};
  subscription: any;
  tempCheck: any = false
  markednode: any = [];


  ngOnChanges(changes: SimpleChanges) {

    // console.log(changes);
    if (changes.treedata && changes.treedata.currentValue) {
      this.dataSource.data = changes.treedata.currentValue;
    }
    if (changes.checkednode && changes.checkednode.currentValue) {
      this.tempTagItem = changes.checkednode.currentValue;
      this.selectedBox = {};
      this.tempTagItem.forEach((node) => {
        this.selectedBox[node.rowNo] = true;
      })
    }
  }

  private _transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      rowNo: node.rowNo,
      selectable: node.selectable,
      level: level,
      parentId: node.parentId,
    };
  }

  tempTagItem: any = [];
  

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
    this.disciplineEvents.subscribe((node) => {
      //  console.log(node);
      this.element = node;

      if (this.selectedBox.length) {
        this.selectedBox.forEach(element => {
          element[node['rowNo']] = false;
        });
      }
      if (this.element.isUnchecked) {
        this.selectedBox[node['rowNo']] = false;
      } else {
        this.selectedBox[node['rowNo']] = true;

      }
      this.filterdata(node);
    });
    // console.log('SelectedDiscipline ', this.selectedDisciplineData);

    // this.dataSource.data = this.discipline;
    // if(this.dataSource.data){
    //   Object.keys(this.dataSource.data).forEach(x => {
    //     this.setParent(this.dataSource.data[x], null);
    //   });
  
    //   this.dataSource.data.forEach(node => {
    //     this.disbaleParents(node);
    //   });
    // }
  
    // if (this.selectedDisciplineData != undefined) {
    //   this.selectedDiscipline['disciplineId'] = this.selectedDisciplineData.disciplineId;
    //   this.selectedDiscipline['subDisciplineId'] = this.selectedDisciplineData.subDisciplineId;
    //   this.selectedDiscipline['subSubDisciplineId'] = this.selectedDisciplineData.subSubDisciplineId;
    //   this.checkAllParentsSelectionForBind(this.selectedDisciplineData);
    //   // this.selectedDisciplineCodes.emit(this.selectedDiscipline);
    // }

    // this.nodePath = '';
  }

  filterdata(node) {
    let tempValue: any = {};
    if (this.tempTagItem.findIndex(el => el.rowNo === node.rowNo) >= 0) {

      this.tempTagItem = this.tempTagItem.filter((e) => {
        return e.rowNo != node.rowNo && this.selectedBox[e.rowNo] == true;
      })

    } else {
      this.selectedBox = {};
      this.selectedBox[node['rowNo']] = true;
      this.tempTagItem = [];
      tempValue["rowNo"] = node.rowNo;
      tempValue["name"] = node.name;
      tempValue["selectable"] = node.selectable;
      tempValue["parentId"] = node.parentId;
      this.tempTagItem = Object.assign([], this.tempTagItem);
      this.tempTagItem.push(tempValue);
    }
    this.setDisciplineData.emit(this.tempTagItem);
  }

  // hasChild = (_: number, node: FoodNode) =>
  //   !!node.children && node.children.length > 0;


  // setParent(data, parent) {
  //   data.parent = parent;
  //   if (data.children) {
  //     data.children.forEach(x => {
  //       this.setParent(x, data);
  //     });
  //   }
  // }

  // checkAllParents(node) {
  //   if (node.parent) {
  //     this.nodePath = node.parent.name + ' > ' + this.nodePath;
  //     const descendants = this.treeControl.getDescendants(node.parent);
  //     //node.parent.selected = descendants.every(child => child.selected);
  //     //node.parent.indeterminate = descendants.some(child => child.selected);
  //     this.checkAllParents(node.parent);
  //   }
  // }

  // todoItemSelectionToggle(checked, node) {

  //   console.log('Checked todoIteam  ', node);
  //   this.checkAllParentsSelection(node);
  //   node.selected = checked;
  //   this.nodePath = node.name;
  //   this.checkAllParents(node);
  //   this.selectedDiscipline['nodePath'] = this.nodePath;

  //   if (node.parent && node.parent.parent && node.parent.parent.parent) {
  //     this.selectedDiscipline['disciplineId'] = node.parent.parent.parent.id;
  //     this.selectedDiscipline['subDisciplineId'] = node.parent.parent.id;
  //     this.selectedDiscipline['subSubDisciplineId'] = node.parent.id;
  //     this.selectedDiscipline['subSubSubDisciplineId'] = node.id;
  //   } else if (node.parent && node.parent.parent) {
  //     this.selectedDiscipline['disciplineId'] = node.parent.parent.id;
  //     this.selectedDiscipline['subDisciplineId'] = node.parent.id;
  //     this.selectedDiscipline['subSubDisciplineId'] = node.id;
  //   } else if (node.parent) {
  //     this.selectedDiscipline['disciplineId'] = node.parent.id;
  //     this.selectedDiscipline['subDisciplineId'] = node.id;
  //   } else {
  //     this.selectedDiscipline['disciplineId'] = node.id;
  //   }
  //   this.selectedDisciplineCodes.emit(this.selectedDiscipline);
  // }

  // disbaleParents(node) {
  //   if (node.children.length > 0) {
  //     node.disabled = true;
  //     node.children.forEach((c1) => {
  //       if (c1.children.length > 0) {
  //         c1.disabled = true;
  //         c1.children.forEach((c2) => {
  //           if (c2.children.length > 0) {
  //             c2.disabled = true;
  //             c2.children.forEach((c3) => {
  //               c3.disabled = false;
  //             })
  //           } else {
  //             c2.disabled = false;
  //           }
  //         })
  //       } else {
  //         c1.disabled = false;
  //       }
  //     })
  //   } else {
  //     node.disabled = false;
  //   }
  // }

  // deselectAllNodes(node) {
  //   if (node) {
  //     node.selected = false;
  //     node.indeterminate = false;
  //     if (node.children.length > 0) {
  //       node.children.forEach((c1) => {
  //         c1.selected = false;
  //         c1.indeterminate = false;
  //         if (c1.children.length > 0) {
  //           c1.children.forEach((c2) => {
  //             c2.selected = false;
  //             c2.indeterminate = false;
  //             if (c2.children.length > 0) {
  //               c2.children.forEach((c3) => {
  //                 c3.selected = false;
  //                 c3.indeterminate = false;
  //               })
  //             }
  //           })
  //         }
  //       })
  //     }
  //   }
  // }
  // deSelectAll() {
  //   for (let i = 0; i < this.treeControl.dataNodes.length; i++) {
  //     if (this.treeControl.getDescendants(this.treeControl.dataNodes[i])) {
  //       this.checklistSelection.toggle(this.treeControl.dataNodes[i]);
  //     this.treeControl.expand(this.treeControl.dataNodes[i])
  //     }
  //   }
  // }

  // checkAllParentsSelection(node) {
  //   if (node) {
  //     this.dataSource.data.forEach(node => {
  //       this.deselectAllNodes(node);
  //     });
  //   }
  // }

  // selectAllNodesForBind(node) {

  //   if (node.id == this.selectedDisciplineData.disciplineId) {
  //     if (node.children.length) {
  //       node.indeterminate = true;

  //       node.children.forEach((c1) => {
  //         if (c1.id == this.selectedDisciplineData.subDisciplineId) {
  //           if (c1.children.length) {
  //             c1.indeterminate = true;
  //             c1.children.forEach((c2) => {
  //               if (c2.id == this.selectedDisciplineData.subSubDisciplineId) {
  //                 if (c2.children.length) {
  //                   c2.indeterminate = true;
  //                 } else {
  //                   c2.selected = true;
  //                 }


  //               }
  //             })
  //           } else {
  //             c1.selected = true;
  //           }


  //         }
  //       })
  //     } else {
  //       node.selected = true;
  //     }

  //   }


  // }

  // checkAllParentsSelectionForBind(node) {
  //   if (node) {
  //     this.dataSource.data.forEach(node => {
  //       this.selectAllNodesForBind(node);
  //     });
  //   }
  // }
}
