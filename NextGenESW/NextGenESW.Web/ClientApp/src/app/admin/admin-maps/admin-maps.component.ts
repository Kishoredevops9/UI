import { Component, Inject, ViewChild, ViewEncapsulation, OnInit } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { MatMenuTrigger } from "@angular/material/menu";
import { MatDialog } from '@angular/material/dialog';
import { AdminService } from "../admin.service";
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AdminAddItemComponent } from '../admin-add-item/admin-add-item.component';
import { AdminContentDeleteComponent } from '../admin-content-delete/admin-content-delete.component';
import { StepPageSearchComponent } from "@app/process-maps/step-page-search/step-page-search.component";
 

interface TreeNode {
  id: string;
  index: number;
  check?:boolean;
  children: TreeNode[];
  isExpanded?: boolean;
}
interface DropInfo {
  targetId: string;
  action?: string;
}

@Component({
  selector: 'app-admin-maps',
  templateUrl: './admin-maps.component.html',
  styleUrls: ['./admin-maps.component.scss']
})
export class AdminMapsComponent implements OnInit {
    currentLoggedUser:any ='';
    nodes:TreeNode[] = [];
    updateContentForm: FormGroup;    
    isShowSpinner: boolean = false;
    // ids for connected drop lists
    dropTargetIds = [];
    nodeLookup = {};
    updateData;
    dropActionTodo: DropInfo = null;
    currentdate = new Date();
    @ViewChild(MatMenuTrigger)
    contextMenu: MatMenuTrigger;
    contextMenuPosition = { x: '0px', y: '0px' };
    selected:any;
    addselectNode:any=[];
    removeselectNode:any=[];
    removeMultipleData:any=[];
    removeMultipleBtn:boolean;
    constructor(
        @Inject(DOCUMENT) private document: Document, 
        public dialog: MatDialog,
        public adminService : AdminService,
        private formBuilder: FormBuilder,
        public searchDialog: MatDialog

    )  {
        this.loadGetMaps();
       }

    ngOnInit(): void {
      this.currentLoggedUser = sessionStorage.getItem('displayName');
        this.updateContentForm = this.formBuilder.group({
          'contentTitle': [null, Validators.required],
          'contentURL': [null, Validators.required],
          'contentModifiedOn': [null],
          'contentModifiedBy': [null]
        });
      }

    

    onContextMenu(event: MouseEvent, item: any) {
        event.preventDefault();
        this.contextMenuPosition.x = event.clientX + 'px';
        this.contextMenuPosition.y = event.clientY + 'px';
        this.contextMenu.menuData = { 'item': item };
        this.contextMenu.menu.focusFirstItem('mouse');
        this.contextMenu.openMenu();
    }

    sortArray(array) {
      array.sort((a, b) => a.index - b.index);
      array.forEach(a => {
        if (a.children && a.children.length > 0)
          this.sortArray(a.children)
      })
      return array;
    }
  
    loadGetMaps() {
    //  this.isShowSpinner = true;
      this.adminService.getMaps().subscribe((data: any) => {    
        let sortData  =  this.sortArray(data); 
        this.nodes = this.idToString(sortData);   
          this.prepareDragDrop(this.nodes);
          this.nodeSelect(this.nodes[0])
          this.elementClick(this.nodes[0])
          this.isShowSpinner = false;       
      });
    }

    selectNode( node: TreeNode,value:boolean ) : void {
      console.log("selectNode", node);
      this.removeselectNode = [];
      if(value) {
        this.addselectNode.push(node.id);
      } else {
        this.removeselectNode.push(node.id);
      }
      this.check(node,value);   
      this.removeMultipleStepFlow();   
    }

    check(node:any,value:boolean)
    {
      node.check=value;
      let nodeChildren = node.children ? node.children : [];
      nodeChildren.forEach(x=>
      {
        this.check(x,value);
        if(value) {
          this.addselectNode.push(x.id);
        } else {
          this.removeselectNode.push(x.id);
        }        
      })
    }

    removeMultipleStepFlow() {
      let addselectNode = this.addselectNode.sort(function(a, b){return a-b});
      let removeselectNode = this.removeselectNode.sort(function(a, b){return a-b});      
      const results = addselectNode.filter(function(objOne) {
        return !removeselectNode.some(function(objTwo) {
            return objOne == objTwo;
        });
      });
      
      this.removeMultipleData = results;
      this.addselectNode = results;
      this.removeMultipleBtn = results.length > 0 ? true : false;      
    }

    deleteStepFlowItem() {
      
      console.log("this.addselectNode", this.addselectNode);
      const adminManualsDeleteDialog = this.dialog.open(AdminContentDeleteComponent, {
        width: '500px',
        height: 'auto',
        data: {
          adminContentType: "Manuals",
          delAdminData: "Manuals",
          delMultipleData: true,
        }
      });
  
      adminManualsDeleteDialog.afterClosed().subscribe((result) => {
        //console.log(result);
        if( result == 'Yes'){
          this.isShowSpinner = true;
          this.adminService.removeMultipleMaps(this.addselectNode).subscribe( (data) => {
            this.isShowSpinner = false;
            if(data){
              this.updateContentForm.reset();
              let selectNode = this.addselectNode;
              selectNode.forEach(element => {
                let TempNode  = this.removeFromTree( {    "children" : this.nodes } ,  element )
                this.nodes = TempNode.children;  
              }); 
              this.removeselectNode = [];
              this.addselectNode=[];
              this.removeMultipleBtn = false;    
            }
          });  
        }
      });

    }

 
    deleteMapsItems(item) {

      const adminManualsDeleteDialog = this.dialog.open(AdminContentDeleteComponent, {
        width: '500px',
        height: 'auto',
        data: {
          adminContentType: "Manuals",
          delAdminData: item,
        }
      });
  
      adminManualsDeleteDialog.afterClosed().subscribe((result) => {
        //console.log(result);
        if( result == 'Yes'){
          this.isShowSpinner = true;
          this.adminService.removeMaps(item.id).subscribe( (data) => {
            //console.log(data);
            this.isShowSpinner = false;
            if(data){
              this.updateContentForm.reset();
            // this.loadGetMaps();
            let TempNode  = this.removeFromTree( {    "children" : this.nodes } ,  item.id )
            this.nodes = TempNode.children;  
          }
          });  
        }
      });
  
    }

    removeFromTree(parent, childNameToRemove){
      let _this = this;
    if (parent.children){   
     parent.children = parent.children
         .filter(function(child){ return child.id != childNameToRemove})
         .map(function(child){ 
           
           return _this.removeFromTree(child, childNameToRemove)  
         
         
         });}
     return parent;  
   }



    addNewMapsItem(item, action:string) {
   
      let parentId:any=null;
      if(item.parentMapId) {
        parentId = action == 'Add New Submenu' ? item.id : item.parentMapId
      } else {
        parentId = action == 'Add New Submenu' ? item.id : null
      }
        const MapsAddNewItem = this.dialog.open(AdminAddItemComponent, {
          width: '670px',
          height: 'auto',
          data: {
            adminContentType: "STEP Flow",
            adminTitle: action
          }
        });
    
        MapsAddNewItem.afterClosed().subscribe((result) => {
          if(result != 'Close'){
            const addElement = {
              userName: this.currentLoggedUser,
              index: (item.index + 1),
              parentMapId: parentId,
              title: result.popupTitle,
              mapUrl: result.popupURL,
              assetContentId : result.assetContentId,   
              version :  result.version, 
              isActive : true,              
              createdUser : this.currentLoggedUser,
              lastUpdateDateTime: this.currentdate,
              lastUpdateUser: this.currentLoggedUser        
            }
            //console.log(addElement);
            this.isShowSpinner = true;
            this.adminService.addMaps(addElement).subscribe( (data) => {
              //console.log(data);
              this.isShowSpinner = false;
              if(data){               
                console.log("----------------------");
                console.log(data);
                console.log("----------------------");      
                this.nodes =  this.InsertNode( this.nodes , data)
                // this.loadGetMaps();
              }
            });
          }  
        });
    
      }

      InsertNode( nodes  , Obj ){
        if (! Obj.parentMapId){

          nodes.push(Obj)

        }
        else{
 
       
      nodes.forEach(element => {
         if (element.id == Obj.parentMapId) {
          if (element.children==null) element.children = [];
          element.children.push(Obj)  
         }
         if (element.children && element.children.length ){
          this.InsertNode( element.children ,Obj )
         }        
      });     
      
    }
      return nodes;  
  }
      nodeSelect(item) {
        this.selected = item; 
      };
      selectlistActive(item) {
          return this.selected === item;
      };
    
    elementClick(elementData){
      const finalDate = this.getModifiDate(elementData);
      this.updateData = elementData;
      this.updateContentForm.patchValue({
        contentTitle: elementData.title,
        contentURL: elementData.mapUrl,
        contentModifiedOn: finalDate,
        contentModifiedBy: elementData.userName
      });
    }

    getModifiDate(data:any) {
      let readDate = data.lastUpdateDateTime.split('-');
      let readDay, readMonth, readYear, finalDate;
      readYear = readDate[0];
      readMonth = readDate[1];
      readDay = readDate[2].split('T')[0];
      finalDate = readMonth + '/' + readDay + '/' + readYear; 
      return finalDate;
    }

    idToString(data) {
      return data.map(({ type, children = [], ...rest }) => {
        const o = { ...rest };
        o.id = o.id.toString()
        o.children = o.children || [];
        if (children.length) o.children = this.idToString(children);
        return o;
      });
    }

  prepareDragDrop(nodes: TreeNode[]) {
    nodes.forEach((node) => {
      this.dropTargetIds.push(node.id);
      this.nodeLookup[node.id] = node;
      this.prepareDragDrop(node.children);
    });
  }
  updt(n){

    n.map((node, index) => {
       node.index = index;
       if (node.children && node.children.length){ this.updt(node.children) }
     })
     return n;

   }

   fileInRoot(nods){ 
    var XTX = [];  
    function STS(data,pid){ 
      data.forEach(element => { 
        XTX.push({
        id : element.id,
        index : element.index,
        parentDisciplineId : pid 
        })
        if (element.children && element.children.length){
          STS(  element.children , element.id ) 
        } 
      }); 
    } 
    STS(nods,null)   

    console.log( XTX)
      this.adminService.updateMultipleMaps( XTX ).subscribe((NODEDATA)=>{
        console.log(NODEDATA)
      })
   }

  updateIndex() {
    this.nodes = [...this.updt( this.nodes )] 

    this.fileInRoot(  [...this.nodes] )
 
    this.clearDragInfo();
  }
  dragMoved(event) {
    let e = this.document.elementFromPoint(event.pointerPosition.x, event.pointerPosition.y);
    if (!e) {
      this.clearDragInfo();
      return;
    }
    let container = e.classList.contains("node-item") ? e : e.closest(".node-item");
    if (!container) {
      this.clearDragInfo();
      return;
    }
    this.dropActionTodo = {
      targetId: container.getAttribute("data-id")
    };
    const targetRect = container.getBoundingClientRect();
    const oneThird = targetRect.height / 3;
    if (event.pointerPosition.y - targetRect.top < oneThird) {
      this.dropActionTodo["action"] = "before";
    } else if (event.pointerPosition.y - targetRect.top > 2 * oneThird) {
      this.dropActionTodo["action"] = "after";
    } else {
      this.dropActionTodo['action'] = 'inside';
    }
    this.showDragInfo();
  }


  drop(event) {
    if (!this.dropActionTodo) return;
    const draggedItemId = event.item.data;
    const parentItemId = event.previousContainer.id;
    const targetListId = this.getParentNodeId(this.dropActionTodo.targetId, this.nodes, 'main');
    console.log(
      '\nmoving\n[' + draggedItemId + '] from list [' + parentItemId + ']',
      '\n[' + this.dropActionTodo.action + ']\n[' + this.dropActionTodo.targetId + '] from list [' + targetListId + ']');
    const draggedItem = this.nodeLookup[draggedItemId];
    draggedItem['index'] = parseInt(this.dropActionTodo.targetId);
    const oldItemContainer = parentItemId != 'main' ? this.nodeLookup[parentItemId].children : this.nodes;
    const newContainer = targetListId != 'main' ? this.nodeLookup[targetListId].children : this.nodes;
    let i = oldItemContainer.findIndex(c => c.id === draggedItemId);
    oldItemContainer.splice(i, 1);
    switch (this.dropActionTodo.action) {
      case 'before':
      case 'after':
        const targetIndex = newContainer.findIndex(c => c.id === this.dropActionTodo.targetId);
        if (this.dropActionTodo.action == 'before') {
          newContainer.splice(targetIndex, 0, draggedItem);
        } else {
          newContainer.splice(targetIndex + 1, 0, draggedItem);
        }
        break;
      case 'inside':
        this.nodeLookup[this.dropActionTodo.targetId].children.push(draggedItem)
        this.nodeLookup[this.dropActionTodo.targetId].isExpanded = true;
        break;
    }
    this.updateIndex();
  }
    getdraggedData(item:any) {
      const pushItem:any = [item];
        const pushData = [];    
        pushItem.forEach(node => {
          pushData.push(node);
          const childData = node.children
          childData.forEach(childData => {
            pushData.push(childData);
            const childDataOne = childData.children
            childDataOne.forEach(childDataOne => {
              pushData.push(childDataOne);
              const childDataTwo = childDataOne.children
              childDataTwo.forEach(childDataTwo => {
                pushData.push(childDataTwo);    
              });     
            });    
          });
        });
        // console.log("this.nodeLookup", this.nodeLookup);
        // console.log("this.nodes", this.nodes);
        let updatePushData:any = [];
        pushData.forEach(item => {
          const updateData = {
            id: item.id,
            userName: item.userName,
            index: item.index,
            parentMapId: item.parentMapId,
            title: item.title,
            mapUrl: item.mapUrl,
            isActive: item.isActive,
            createdUser: item.createdUser,
            lastUpdateDateTime: this.currentdate,
            lastUpdateUser: this.currentLoggedUser
          }
          updatePushData.push(updateData);
        }); 
        //console.log("updatePushData", updatePushData);
        this.isShowSpinner = true;
        this.adminService.updateMultipleMaps(updatePushData).subscribe( (data) => {
          this.isShowSpinner = false;
          this.loadGetMaps();
          this.updateContentForm.reset();
        });
        this.clearDragInfo(true)
    }
    getParentNodeId(id: string, nodesToSearch: TreeNode[], parentId: string): string {
        for (let node of nodesToSearch) {
            if (node.id == id) return parentId;
            let ret = this.getParentNodeId(id, node.children, node.id);
            if (ret) return ret;
        }
        return null;
    }
    showDragInfo() {
        this.clearDragInfo();
        if (this.dropActionTodo) {
            this.document.getElementById("node-" + this.dropActionTodo.targetId).classList.add("drop-" + this.dropActionTodo.action);
        }
    }
    clearDragInfo(dropped = false) {
        if (dropped) {
            this.dropActionTodo = null;
        }
        this.document
            .querySelectorAll(".drop-before")
            .forEach(element => element.classList.remove("drop-before"));
        this.document
            .querySelectorAll(".drop-after")
            .forEach(element => element.classList.remove("drop-after"));
        this.document
            .querySelectorAll(".drop-inside")
            .forEach(element => element.classList.remove("drop-inside"));
    }

    
    
    onReset(){
      this.elementClick(this.updateData);
    }
  
    onConetntSave(){
  
      const rawResult = this.updateContentForm.getRawValue();
      //console.log(rawResult);
      const updateManualsData = {
        id: this.updateData.id,
        userName: rawResult.contentModifiedBy,
        index: this.updateData.index,
        parentMapId: rawResult.parentMapId,
        title: rawResult.contentTitle,
        mapUrl: rawResult.contentURL,
        isActive: this.updateData.isActive,
        createdUser: this.updateData.createdUser,
        lastUpdateDateTime: this.currentdate,
        lastUpdateUser: this.currentLoggedUser
      }
      //console.log(updateManualsData, "onConetntSave");
      this.isShowSpinner = true;
      this.adminService.updateMaps(updateManualsData).subscribe( (data) => {
        //console.log(data);
        this.isShowSpinner = false;
        this.loadGetMaps();
        this.updateContentForm.reset();
      });
  
      
    }


     
  openSearchDialog() {
    
    const searchDialogRef = this.searchDialog.open(StepPageSearchComponent, {
      width: '90%',
      height: '90%',
      data: {
        "doc" : {"contentType" : 'F'}
        }
    });

    searchDialogRef.afterClosed().subscribe(result => {
         console.log(result)
         console.log( result.title )
         this.updateContentForm.get("contentTitle").patchValue(result.title +" "+ result.contentid);
         this.updateContentForm.get("contentURL").patchValue("/view-document/SF/"+ result.contentid);
      //  this.addItemForm.get("assetContentId").patchValue( result.contentid);
      //  this.addItemForm.get("version").patchValue(  result.version );
    });


  }




}

function debounce(arg0: number) {
  throw new Error("Function not implemented.");
}
