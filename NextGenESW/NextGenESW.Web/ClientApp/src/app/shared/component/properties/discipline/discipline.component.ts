import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { ActivityPageService } from '@app/activity-page/activity-page.service';
import { SharedService } from '@app/shared/shared.service';
import { cloneDeep } from 'lodash';
import { Observable, Subscription } from 'rxjs';
import { MatCheckboxChange } from '@angular/material/checkbox';

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
  selector: 'discipline',
  templateUrl: './discipline.component.html',
  styleUrls: [ './discipline.component.scss' ]
})
export class DisciplineComponent implements OnInit {

  @Output() setDisciplineData = new EventEmitter();

  @Input() treedata: any;
  @Input() checkednode = [];
  @Input() flag: any = false;
  @Input() multiflag: any = false;
  disciplineList: FoodNode[] = [];
  public selectedBox: any = {};
  public tempTag: any = {};
  subscription: any;
  tempCheck: any = false;
  markednode: any = [];
  element: any;
  private eventsSubscription: Subscription;
  @Input() disciplineEvents: Observable<void>;
  disciplineSearchText = '';

  ngOnChanges(changes: SimpleChanges) {

    // console.log(changes);
    if ( changes.treedata && changes.treedata.currentValue ) {
      this.dataSource.data = changes.treedata.currentValue;
    }
    if ( changes.checkednode && changes.checkednode.currentValue ) {
      this.tempTagItem = changes.checkednode.currentValue;
      this.selectedBox = {};
      this.tempTagItem.forEach((node) => {
        this.selectedBox[node.rowNo] = true;
      });
    }
  }

  private _transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      rowNo: node.rowNo,
      selectable: node.selectable,
      level: level,
      parentId: node.parentId
    };
  };

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
    //console.log("multiflag", this.multiflag);
    this.disciplineEvents && this.disciplineEvents.subscribe((node) => {
      //  console.log(node);
      this.element = node;

      if ( this.selectedBox.length ) {
        this.selectedBox.forEach(element => {
          element[node['rowNo']] = false;
        });
      }
      if ( this.element.isUnchecked ) {
        this.selectedBox[node['rowNo']] = false;
      } else {
        this.selectedBox[node['rowNo']] = true;

      }
      this.filterdata(node);
    });

  }

  filterdata(node) {

    let tempValue: any = {};
    if ( this.tempTagItem.findIndex(el => el.rowNo === node.rowNo) >= 0 ) {

      this.tempTagItem = this.tempTagItem.filter((e) => {
        return e.rowNo != node.rowNo && this.selectedBox[e.rowNo] == true;
      });

    } else {
      this.selectedBox = {};
      this.selectedBox[node['rowNo']] = true;
      this.tempTagItem = [];
      tempValue['rowNo'] = node.rowNo;
      tempValue['name'] = node.name;
      tempValue['selectable'] = node.selectable;
      tempValue['parentId'] = node.parentId;
      this.tempTagItem = Object.assign([], this.tempTagItem);
      this.tempTagItem.push(tempValue);
    }
    this.setDisciplineData.emit(this.tempTagItem);
  }

  addDisciplineList(event: MatCheckboxChange, elementData): void {
    const disciplineList: any = elementData;
    const checked = event.checked;
    if ( disciplineList && checked ) {
      this.disciplineList.push({
        name: disciplineList.name,
        parentId: disciplineList.parentId,
        rowNo: disciplineList.rowNo,
        selectable: disciplineList.selectable
      });
    } else {
      this.removeDisciplineList(disciplineList);
    }
    this.setDisciplineData.emit(this.disciplineList);
  }

  removeDisciplineList(dataList: any): void {
    const index = this.disciplineList.findIndex((element, index) => {
      if ( element.rowNo === dataList.rowNo ) {
        return true;
      }
    });
    if ( index >= 0 ) {
      this.disciplineList.splice(index, 1);
    }

  }

  searchDiscipline(e) {
    this.dataSource.data = this.filterSearch(cloneDeep(this.treedata), e.target.value);
  }

  filterSearch(data, searchText) {
    if ( !searchText ) {
      return data;
    }

    if ( !data ) {
      return [];
    }
    const filteredData = data.filter(item => {
      return item.children?.length || (item.selectable && this.checkNameContain(item.name, searchText));
    });
    filteredData.forEach(item => {
      item.children = this.filterSearch(item.children, searchText);
    });
    return filteredData.filter(item => {
      return item.children?.length || (item.selectable && this.checkNameContain(item.name, searchText));
    });
  }

  checkNameContain(name, searchText) {
    return new RegExp(searchText.toLocaleLowerCase()).test(name.toLocaleLowerCase());
  }
}
