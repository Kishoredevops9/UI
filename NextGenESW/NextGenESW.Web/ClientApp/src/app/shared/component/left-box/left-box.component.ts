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
  rootParentId?: number;
  assetContentId?: string,
  version?: number
}

const TREE_DATA: any = [];
/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  id: number;
  level: number;
  parentId: number;
  assetContentId?: string,
  version?: number
}

@Component({
  selector: 'app-left-box',
  templateUrl: './left-box.component.html',
  styleUrls: ['./left-box.component.scss']
})
export class LeftBoxComponent implements OnInit {
  @Input() treedata: any;
  @Input() checkednode: [];
  @Input() flag: any = false;
  @Input() allowSelectAll: any = false;
  @Input() delevents: Observable<any>;
  @Input() loadDropdownData: Observable<void>;
  @Input() expendOpt: number;

  @Output() tagdata = new EventEmitter();

  public selectedBox: any = {};
  public tempTag: any = {};
  subscription: any;
  tempCheck: any = false
  markednode: any = [];
  element: any;
  private eventsSubscription: Subscription;
  expendType: number;
  allItemSelected = {};
  indetermineState = {};

  ngOnChanges(changes: SimpleChanges) {
    // console.log(changes);
    if (changes.treedata && changes.treedata.currentValue) {
      this.dataSource.data = changes.treedata.currentValue;
    }

    if (changes.checkednode && changes.checkednode.currentValue ) {
      this.tempTagItem = [ ...changes.checkednode.currentValue ];
      this.selectedBox = {};
      this.tempTagItem.forEach((node) => {
        this.selectedBox[node.id] = true;
      });
      this.computeCheckboxState();
    }

    if (changes.treedata && changes.treedata.currentValue) {
      this.dataSource.data = changes.treedata.currentValue;
      this.toggleTreeView();
    }

    if (changes.expendOpt && changes.expendOpt.currentValue) {
      if (changes.expendOpt.currentValue) {
        this.expendType = changes.expendOpt.currentValue;
        this.toggleTreeView();
      }
    }
  }

  /**
   * Tree should be expaned or collapsed
   * when expandType or treeData changes
   */
  toggleTreeView() {
    if (this.expendType === 1) {
      this.treeControl.expandAll();
    } else {
      this.treeControl.collapseAll();
    }
  }

  private _transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      id: node.id,
      level: level,
      parentId: node.parentId,
      rootParentId: node.rootParentId,
      assetContentId: node.assetContentId,
      version: node.version
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
      tempValue["assetContentId"] = node.assetContentId;
      tempValue["version"] = node.version;
      tempValue["rootParentId"] = node.rootParentId;
      this.tempTagItem = Object.assign([], this.tempTagItem);
      this.tempTagItem.push(tempValue);
    }
    this.tagdata.emit(this.tempTagItem);
  }

  treeControl = new FlatTreeControl<ExampleFlatNode>(node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  constructor(private activityPageService: ActivityPageService,
    private SharedService: SharedService
  ) {
    this.dataSource.data = TREE_DATA;
  }

  ngOnInit(): void {
    this.delevents && this.delevents.subscribe((node) => {
      if ( !node ) {
        this.selectedBox = {};
        this.tempTagItem = [];
        return;
      }
      this.element = node;
      this.selectedBox[node['id']] = false;
      this.filterdata(node);
    });

    if (this.loadDropdownData) {
      this.loadDropdownData.subscribe((tagList) => {
        if (this.tempTagItem.length == 0) {
          this.tempTagItem = tagList;
          this.tempTagItem.forEach(el => {
            this.selectedBox[el['id']] = true;
          });
          this.computeCheckboxState();
        }
      });
    }
  }

  toggleAllSelection(node) {
    const findingNode = this.getNodeById(this.treedata, node.id);
    if ( this.allItemSelected[node.id] ) {
      this.setRecursiveNode(this.selectedBox, this.allItemSelected, findingNode, true);
    } else {
      this.setRecursiveNode(this.selectedBox, this.allItemSelected, findingNode, false);
    }
    this.emitSelectedNodes();
  }

  getNodeById(nodeList, nodeId) {
    const findingNode = nodeList?.find(node => `${ node.id }` === `${ nodeId }`);
    if ( findingNode ) {
      return findingNode;
    }

    for ( const node of nodeList ) {
      if ( node.children ) {

        const findingChildNode = this.getNodeById(node.children, nodeId);
        if ( findingChildNode ) {
          return findingChildNode;
        }
      }
    }
  }

  setRecursiveNode(selectedBox, allItemSelected, node, value) {
    if ( !node?.children?.length ) {
      selectedBox[node.id] = value;
    } else {
      allItemSelected[node.id] = value;
      node.children.forEach(item => {
        this.setRecursiveNode(selectedBox, allItemSelected, item, value);
      });
    }
  }

  computeCheckboxState(parentNode = null, children = null) {
    children = children || this.dataSource.data;
    const findingSelectedNodes = children.filter(node => {
      if ( node.children?.length ) {
        this.computeCheckboxState(node, node.children);
        return this.allItemSelected[node.id];
      } else {
        return this.selectedBox[node.id];
      }
    });
    const findingIndetermineNodes = children.filter(node => this.indetermineState[node.id]);
    if ( parentNode ) {
      this.allItemSelected[parentNode.id] = findingSelectedNodes.length === children.length && !findingIndetermineNodes.length;
      this.indetermineState[parentNode.id] = !!(findingSelectedNodes.length < children.length && (findingSelectedNodes.length || findingIndetermineNodes.length));
    }
  }

  emitSelectedNodes() {
    const currentNodes = Object.keys(this.selectedBox).reduce((prev, current) => {
      if ( this.selectedBox[current] ) {
        const node = this.getNodeById(this.treedata, current);
        if ( node ) {
          prev = [ ...prev, { ...node } ];
        }
      }
      return prev;
    }, []);
    this.tagdata.emit(currentNodes);
  }
}
