import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';

import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Store, select } from '@ngrx/store';
import { ProcessMapsState } from '../process-maps.reducer';
import { selectSelectedProcessMap } from '@app/reducers';
import { Observable, observable } from 'rxjs';

/* Tree Node Interface */
interface TreeNode {
  name: string;
  id: number;
  activityTypeId?: number;
  icon: string;
  children?: TreeNode[];
}

/** Flat node with expandable and level information */
interface FlatNode {
  expandable: boolean;
  name: string;
  icon: string;
  level: number;
  id: number;
  activityTypeId: number
}

/* Tree Data Initialization */
const TREE_DATA: TreeNode[] = [];

@Component({
  selector: 'app-process-map-milestone-tree',
  templateUrl: './process-map-milestone-tree.component.html',
  styleUrls: ['./process-map-milestone-tree.component.scss']
})
export class ProcessMapMilestoneTreeWComponent implements OnInit {

  private _transformer = (node: TreeNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      icon: node.icon,
      id: node.id,
      activityTypeId: node.activityTypeId
    };
  };

  treeControl = new FlatTreeControl<FlatNode>(
    (node) => node.level,
    (node) => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  @Input() selectedActivityId: number
  treeData: any;
  initalRender = true
  activeNode
  isChecked
  constructor(private store: Store<ProcessMapsState>,) {
    this.dataSource.data = TREE_DATA;
    this.loadProcessMap();
  }

  hasChild = (_: number, node: FlatNode) => node.expandable;



  ngOnInit(): void {
    
  }

  //load processmap data from store
  loadProcessMap() {
    this.store.pipe(select(selectSelectedProcessMap)).subscribe(processMap => {
      this.treeData = processMap;
      if (this.treeData)
         this.dataSource.data = this.generateTreeData(this.treeData);
    })
  }

  ngOnChanges(changes: SimpleChanges) {

    if (this.selectedActivityId) {
      this.onSelectLeaf(this.selectedActivityId);
    }
    else {
      this.activeNode = undefined;
      this.treeControl.collapseAll();
    }
  }

  /* Generate Activity Node of Tree */
  createActivityModel(activityArray) {
    let activityNodes: Array<TreeNode>;
    for (const i in activityArray) {
      if (activityArray.hasOwnProperty(i)) {
        const nodeData = {
          id: activityArray[i].id,
          name: activityArray[i].name,
          icon: ''
        };
        switch (activityArray[i].activityTypeId) {
          case 1:
            nodeData.icon = 'stop_circle';
            break;
          case 2:
            nodeData.icon = 'check_box_outline_blank';
            break;
          case 3:
            nodeData.icon = 'priority_high';
            break;
          case 4:
            nodeData.icon = 'stop';
            break;
          default:
            nodeData.icon = 'arrow_forward';
        }
        activityNodes = this.prepareNode(activityNodes, nodeData);
      }
    }
    return activityNodes;
  }

  /* Root of tree*/
  private generateTreeData(nodeData) {
    let milestones = nodeData.activities.filter((activity) => activity.activityTypeId == 4)
    let treeModel: Array<TreeNode>;

    treeModel = [
      {
        id: nodeData.id,
        name: nodeData.name,
        icon: "map",
        children: this.createMilestones(nodeData, milestones),
      },
    ];
    return treeModel;
  }

  /* level 1, Milestones */
  createMilestones(map, milestones) {
    let milestoneNodes: Array<TreeNode>;
    for (const j in milestones) {
      if (milestones.hasOwnProperty(j)) {
        let childNodes: Array<TreeNode>;
        const milestoneId = milestones[j].id;
        const nodeData = {
          id: milestones[j].id,
          name: milestones[j].name,
          icon: "stop"
        };

        childNodes = this.createActivityGroup(milestoneId, map);

        milestoneNodes = this.prepareNode(milestoneNodes, nodeData, childNodes);
      }
    }
    return milestoneNodes;
  }

  /* level 2, Groups that contains activities belong to the specified milestone */
  createActivityGroup(milestoneId, map) {
    let activityGroupsArray = []
    for (const activity of map.activities) {
      if (activity.milestoneId == milestoneId) {
        if (!activityGroupsArray.some((group) => group.id == activity.swimLaneId)) {
          activityGroupsArray.push(map.activityGroups.find((group) => group.id == activity.swimLaneId))
        }
      }
    }
    let groupNodes: Array<TreeNode>;
    for (const j in activityGroupsArray) {
      if (activityGroupsArray.hasOwnProperty(j)) {
        let childNodes: Array<TreeNode>;
        const swimLaneId = activityGroupsArray[j].id;
        const activityList = map.activities.filter(x => x.swimLaneId === swimLaneId && x.milestoneId === milestoneId);
        const nodeData = {
          id: activityGroupsArray[j].id,
          name: activityGroupsArray[j].name,
          icon: "layers"
        };
        childNodes = this.createActivityModel(activityList);
        groupNodes = this.prepareNode(groupNodes, nodeData, childNodes);
      }
    }
    return groupNodes;
  }


  /* Generate Common Node of Tree */
  prepareNode(treeModel, nodeData, childNodes?) {
    if (!treeModel) {
      treeModel = [
        {
          id: nodeData.id,
          name: nodeData.name,
          icon: nodeData.icon,
          children: childNodes ? childNodes : null,
        },
      ];
    } else {
      treeModel.push({
        id: nodeData.id,
        name: nodeData.name,
        icon: nodeData.icon,
        children: childNodes ? childNodes : null,
      });
    }
    return treeModel;
  }

  //When selected Activity changes
  onSelectLeaf(id) {
    this.treeControl.collapseAll()
    let leafs = this.treeControl.dataNodes.filter(node => node.level == 3 || node.level == 1);
    let selectedNode = leafs.find(node => node.id == id);
    if(selectedNode){
      //Opens all it's parent so leaf is visible
      this.expandParent(selectedNode);
    }
    this.activeNode = selectedNode;
  }

  //Recursively opens all the leafs parent to make leaf visible
  expandParent(node: FlatNode) {
    const currentLevel = this.treeControl.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    return this.expandParentRecursive(node);
  }
  expandParentRecursive(node: FlatNode) {
    const currentLevel = this.treeControl.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];
      if (this.treeControl.getLevel(currentNode) < currentLevel) {
        this.treeControl.expand(currentNode)
        return this.expandParentRecursive(currentNode);
      }
    }
  }

  @Output() onSelectionChanged = new EventEmitter<number | undefined>();

  //The click event of leaf node
  onLeafClicked(node) {
    this.activeNode = node;
    this.onSelectionChanged.emit(node.id);
  }

  //The click event of root node
  onGroupClicked(node) {
    if(node.level == 1){
      this.activeNode = node;
      this.onSelectionChanged.emit(node.id);
    }
    else{
      this.activeNode = undefined;
      this.onSelectionChanged.emit(undefined);
    }
  }

  //Determines which styling to use for the group level
  groupClass(node){
    if(this.activeNode == node){
      return 'background-highlight-group';
    }else if(this.activeNode){
      return 'clickable';
    }
  }

}
