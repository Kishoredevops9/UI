import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  Output,
  EventEmitter,
  ViewChild,
  ɵConsole,
} from '@angular/core';
import {
  addGroup,
  deleteProcessMapGroup,
  deleteSwimlane,
  updateProcessMapGroup,
  updateProcessMapGroups,
} from './../process-maps.actions';
import { ActivityGroup, ProcessMap } from './../process-maps.model';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';
import * as fromActions from '../process-maps.actions';
import { Update } from '@ngrx/entity';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Store, select } from '@ngrx/store';
import { ProcessMapsState } from '../process-maps.reducer';
import { selectSelectedProcessMapGroups, selectSelectedProcessMap } from '@app/reducers';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Observable, observable } from 'rxjs';
// import { GroupModifyComponent } from '../group-modify/group-modify.component';
import { MatMenuTrigger } from '@angular/material/menu';
import { actionInternal } from '@circlon/angular-tree-component/lib/mobx-angular/mobx-proxy';
import { ProcessMapEditComponent } from '../process-map-edit/process-map-edit.component';
import { ProcessMapsService } from "../process-maps.service";
import { SharedService } from '@app/shared/shared.service';
/* Tree Node Interface */
interface TreeNode {
  name : string
  id: number;
  activityTypeId?: number;
  icon: string;
  children?: TreeNode[];
  color?: string,
  sequenceNumber?: number; 
}

/** Flat node with expandable and level information */
interface FlatNode {  
  expandable: boolean;
  name : string;
  icon: string;
  level: number;
  id: number;
  activityTypeId: number;
  sequenceNumber : number;
  //color: string;
}

/* Tree Data Initialization */
const TREE_DATA: TreeNode[] = [];

@Component({
  selector: 'app-process-map-tree',
  templateUrl: './process-map-tree.component.html',
  styleUrls: ['./process-map-tree.component.scss'],
})
export class ProcessMapTreeComponent implements OnInit {

  activityData:any;
  public uppernode: any;
  public innernode: any = { level: 1 };
  public shapeProperty  : any ;
  menuX: number = 0;
  menuY: number = 0;
 
  @ViewChild(MatMenuTrigger, { static: false }) menu: MatMenuTrigger;
  onTriggerContextMenu(event, node) {

    console.log( (event.target as Element).scrollTop)

    event.preventDefault();
    this.innernode = node;
    this.menuX = event.x - 70;
    this.menuY = (event.y - 100) + window.scrollY;
    this.menu.closeMenu() // close existing menu first.
    this.menu.openMenu()
  }

  @Output() activityId: EventEmitter<any> = new EventEmitter();
  @Output() shapeData: EventEmitter<any> = new EventEmitter();
  private _transformer = (node: TreeNode, level: number) => {
   
    return {
      expandable: !!node.children && node.children.length > 0,
      name : node.name ,
      level: level,
      icon: node.icon,
      id: node.id,
      activityTypeId: node.activityTypeId,
      color: node.color,
      sequenceNumber :  node.sequenceNumber
    };
  };
  processMapId: number;
  groupId: number;
  groups: ActivityGroup[] = [];
  treeControl = new FlatTreeControl<FlatNode>(
    (node) => node.level,
    (node) => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children
  


  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);


 

  @Input() selectedActivityId: number;
  treeData: any;
  initalRender = true;
  activeNode;
  isChecked;
  constructor(
    private store: Store<ProcessMapsState>,
    private mapEditComponent: ProcessMapEditComponent,
    private ProcessMapsService : ProcessMapsService,
    private sharedService: SharedService
    ) {

    this.dataSource.data = TREE_DATA;
    this.loadProcessMap();
    this.store
      .select(selectSelectedProcessMapGroups)
      .subscribe((activityGroups) => {      
        this.groups = [...activityGroups];
        this.treeControl.expand(this.treeControl.dataNodes[0]);

      });
    this.mapEditComponent.processMapId;
  }

  hasChild = (_: number, node: FlatNode) => node.expandable;

  ngOnInit(): void { 
    this.treeControl.expand(this.treeControl.dataNodes[0]);
   
  }
  //load processmap data from store
  loadProcessMap() {
    this.store
      .pipe(select(selectSelectedProcessMap))
      .subscribe((processMap) => {
    if (processMap){
      this.treeData =  JSON.parse(JSON.stringify(processMap)); 
      this.treeData['name'] = this.treeData.title;
          if (this.treeData){
            this.dataSource.data = this.generateTreeData(this.treeData);    
              this.treeControl.expandAll(); 
              
              if (  this.dataSource.data && this.dataSource.data[0] 
                && this.dataSource.data[0]['children'] && 
                this.dataSource.data[0]['children'][0]  &&
                 this.dataSource.data[0]['children'][0]['children']  && 
                 this.dataSource.data[0]['children'][0]['children'][0] 
                 
                 ){

                this.sendId(this.dataSource.data[0]['children'][0]['children'][0])    
              }
              



              let d  = this.treeControl.dataNodes.find( (node) => { 
               return  node.level == 2
              }) 
              this.sendId(d)    
          }
        }
      });
    }


    //emit Object  to Shape node 


    
findId($id) {  
  return   this.dataSource.data[0].children.find( (node) => { 
    if (node.children){
      console.log('333',node.children);
    return node.children.find(  (n) => {  
      return n.id == $id
    })
  }
  })
}

  sendToShape(node) { 
    if (node.level == 1) {
      let nData = this.treeData.swimLanes.find((n) => {
        return n.id == node.id
      })
      this.shapeProperty = nData;
      this.shapeData.emit(  this.shapeProperty  )
    }
    else if (node.level == 2) {
      let nData = this.treeData.activityBlocks.find((n) => {
        return n.id == node.id
      })

      this.shapeProperty = nData;
      this.shapeData.emit(  this.shapeProperty  )
    }  
  }


  //emit id to second node
  sendId($node) {
    let node = { ...$node }

 
    console.log(node)
    this.activityId.emit(node)
    this.sendToShape(node)
    node['pid'] = this.dataSource.data[0].id;
   


  }
  //
  ngOnChanges(changes: SimpleChanges) {

    if (this.selectedActivityId) {

      this.onSelectLeaf(this.selectedActivityId);
    } else {
      this.activeNode = undefined;
      this.treeControl.collapseAll();
    
    }
  }

  /* Generate Root Node of Tree */
  private generateTreeData(nodeData) {
    let treeModel: Array<TreeNode>;
    treeModel = [
      {
        id: nodeData.id,
        name: nodeData.name,
        icon: 'map',
        children: this.createswimLanes(
          nodeData.swimLanes,
          nodeData.activityBlocks
        ),
      },
    ];
    return treeModel;
  }

  /* Generate Activity Group Node of Tree */
  createswimLanes(swimLanesArray, activitList) {
 


    let groupNodes: Array<TreeNode>;
    for (const j in swimLanesArray) {
      if (swimLanesArray.hasOwnProperty(j)) {
        let childNodes: Array<TreeNode>;
        const swimLaneId = swimLanesArray[j].id;
        let activityArray;
        if (activitList)
          activityArray = activitList.filter(
            (x) => x.swimLaneId === swimLaneId
          );



        const nodeData = {
          id: swimLanesArray[j].id,
          name:   swimLanesArray[j].name,
          icon: 'layers',
          sequenceNumber : swimLanesArray[j].sequenceNumber,
                 
        };

     
        if (activityArray) {
          childNodes = this.createActivityModel(activityArray);
        }

 

        groupNodes = this.prepareNode(groupNodes, nodeData, childNodes);
      }
    }
    return groupNodes;
  }

  /* Generate Activity Node of Tree */
  createActivityModel(activityArray) {
    let activityNodes: Array<TreeNode>;



    for (const i in activityArray) {
      if (activityArray.hasOwnProperty(i)) {
        const nodeData = {
          id: activityArray[i].id,
          name: activityArray[i].name,
          icon: '',
          color: activityArray[i].color,
          sequenceNumber :  activityArray[i].sequenceNumber,
        };
        switch (activityArray[i].activityTypeId) {
          case 1:
            nodeData.icon = 'stop_circle';
            break;
          case 2:
            nodeData.icon = 'check_box_outline_blank';
            break;
          case 3:
            nodeData.icon = 'code';
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

  /* Generate Common Node of Tree */
  prepareNode(treeModel, nodeData, childNodes?) {
    if (!treeModel) {
      treeModel = [
        {
          id: nodeData.id,
          name: nodeData.name,
          icon: nodeData.icon,
          children: childNodes ? childNodes : null,
          color: nodeData.color ? nodeData.color : null,
          sequenceNumber : nodeData.sequenceNumber ? nodeData.sequenceNumber : null,
        },
      ];
    } else {
      treeModel.push({
        id: nodeData.id,
        name: nodeData.name,
        icon: nodeData.icon,
        children: childNodes ? childNodes : null,
        color: nodeData.color ? nodeData.color : null,
        sequenceNumber : nodeData.sequenceNumber ? nodeData.sequenceNumber : null,
      });
    }
    return treeModel;
  }

  //On selectedActivity change
  onSelectLeaf(id) {

    this.treeControl.collapseAll();
    let leafs = this.treeControl.dataNodes.filter((node) => node.level == 2);
    let selectedNode = leafs.find((node) => node.id == id);
    this.expandParent(selectedNode);
    this.activeNode = selectedNode;
  }

  //Recursively opens all parents to make leaf visible
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
        this.treeControl.expand(currentNode);
        return this.expandParentRecursive(currentNode);
      }
    }
  }

  @Output() onSelectionChanged = new EventEmitter<number | undefined>();

  //on leaf click, select specified leaf
  onLeafClicked(node) {
    this.activeNode = node;
    this.onSelectionChanged.emit(node.id);
  }

  deleteActivityTree(innernode) {
    const activityId = innernode.id;
    this.store.dispatch(
      fromActions.deleteProcessMapActivity({ id: activityId })
    );
  }
  //on group click, deselect everything
  onGroupClicked(node) {
    this.activeNode = undefined;
    this.onSelectionChanged.emit(undefined);
  }

 
  moveUpDataUpdate($obj){
 
    this.treeData.swimLanes.map( function(node){ 
      if ( Object.keys($obj).indexOf(node.id.toString()) > -1 ){  
        node.sequenceNumber = $obj[node.id.toString()]
      }
    })


     this.ProcessMapsService.editProcessMapUpAndDown(this.treeData).subscribe((data)=>{ 
      console.log("Update...");
     })   
  }


  moveUpFunction() {
    let currentNode = this.innernode; 
    let currentIndex;
    let previousElement;
    let tempObj = {};
    this.treeData.swimLanes.forEach(element => {
      if (element.id === currentNode.id) { 
        currentIndex = this.treeData.swimLanes.indexOf(element);
        if (currentIndex != 0) {
          previousElement = this.treeData.swimLanes[(currentIndex - 1)];  
          tempObj[previousElement['id'] ] = element['sequenceNumber'];
          tempObj[element['id'] ] = previousElement['sequenceNumber'];   
          this.moveUpDataUpdate(tempObj)
          this.treeData.swimLanes[(currentIndex - 1)] = currentNode;
          this.treeData.swimLanes[(currentIndex)] = previousElement;       
          this.dataSource.data = this.generateTreeData(this.treeData);
          this.treeControl.expand(this.treeControl.dataNodes[0]);
        }
      }
    }); 
  }
 
  moveDownFunction() {
    let downNode = this.innernode;
    let returnflag = "";
    let tempObj = {};
    this.treeData.swimLanes.forEach(ele => {
      if (returnflag == "1") {
        return
      }
      let presentIndex;
      let nextElement;
      if (ele.id === downNode.id) {
        presentIndex = this.treeData.swimLanes.indexOf(ele);
        if (presentIndex != this.treeData.swimLanes.length - 1) {
          nextElement = this.treeData.swimLanes[(presentIndex + 1)];
          tempObj[nextElement['id'] ] = ele['sequenceNumber'];
          tempObj[ele['id'] ] = nextElement['sequenceNumber'];   
          this.moveUpDataUpdate(tempObj)
          this.treeData.swimLanes[presentIndex] = nextElement;
          this.treeData.swimLanes[(presentIndex + 1)] = downNode;
          this.dataSource.data = this.generateTreeData(this.treeData);
          this.treeControl.expand(this.treeControl.dataNodes[0]);
          returnflag = "1";
          console.log(presentIndex);
          return;
        }
      }
    });
  }
  treeGroupModify() {
    this.mapEditComponent.onSwimlaneInsert();
    console.log("erwerwer")
  }
  treeAddActivityShape() {
    let Data  = {...this.innernode}
      if ( this.innernode.level==1 ){
        Data['cid']  =  Data['id'] 
     }
     else {    
      Data['cid']  =  this.findId( Data['id'] ).id

     }
     delete Data.id;
     delete Data.name;
     this.mapEditComponent.onAddActivity(Data); 
     console.log('add',Data);   
  }
  treeEditActivityShape() {
     let editD = this.sharedService.getEditActivityData();
     this.mapEditComponent.onAddActivity(editD); 
     console.log('edit',editD);
  }

  onDeleteGroup(innernode) {
    this.mapEditComponent;
    this.store.dispatch(
      deleteSwimlane({id: innernode.id })
    );

    //Updates the name of the group in the database
    // const update: Update<ActivityGroup> = {
    //   id: this.groupId,
    //   changes: this.updateGroupsForm.value,
    // };

    // this.store.dispatch(
    //   updateProcessMapGroup({ mapId: this.processMapId, activityGroup: update })
    // );
    // this.updateGroupsForm.reset();
    // this.updateButton = false;
    // this.addButton = true;

  }

  editSwimlane(swimlaneDetails){
    this.mapEditComponent.editMapSwimlane(swimlaneDetails);
  }

}
