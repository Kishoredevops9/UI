import { Component, Inject, ViewChild, ViewEncapsulation, OnInit } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { MatMenuTrigger } from "@angular/material/menu";
import { MatDialog } from '@angular/material/dialog';
import { AdminService } from "../admin.service";
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AdminAddItemComponent } from '../admin-add-item/admin-add-item.component';
import { AdminContentDeleteComponent } from '../admin-content-delete/admin-content-delete.component';
import { debounce } from "@agentepsilon/decko";
import { deleteLinkByKey } from "@app/diagram-gojs/components/diagram/gojs/api/commands/delete";
import { connectableObservableDescriptor } from "rxjs/internal/observable/ConnectableObservable";
import { CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY_PROVIDER_FACTORY } from "@angular/cdk/overlay/overlay-directives";
interface TreeNode {
  id: string;
  index: number;
  children: TreeNode[];
  isExpanded?: boolean;
}
interface DropInfo {
  targetId: string;
  action?: string;
}
@Component({
  selector: 'app-admin-tree',
  templateUrl: './admin-tree.component.html',
  styleUrls: ['./admin-tree.component.scss']
})
export class AdminTreeComponent implements OnInit {
  currentLoggedUser: any = '';
  nodes: TreeNode[] = [];
  selected: any;
  isShowSpinner: boolean = false;
  updateContentForm: FormGroup;
  currentdate = new Date();
  dropTargetIds = [];
  nodeLookup = {};
  updateData;
  dropActionTodo: DropInfo = null;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  constructor(
    @Inject(DOCUMENT) private document: Document,
    public dialog: MatDialog,
    public adminService: AdminService,
    private formBuilder: FormBuilder,
  ) {
  }
  ngOnInit(): void {
    this.currentLoggedUser = sessionStorage.getItem('displayName');
    this.updateContentForm = this.formBuilder.group({
      'contentTitle': [null, Validators.required],
      'contentURL': [null, Validators.required],
      'contentModifiedOn': [null],
      'contentModifiedBy': [null]
    });
    this.loadGetDisciplines();
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

  loadGetDisciplines() {
    this.isShowSpinner = true;
    this.adminService.getDisciplines().subscribe((data: any) => {    

      console.log("===========");
      console.log(data)
      console.log("===========");

      let sortData  =  this.sortArray(data); 
      this.nodes = this.idToString(sortData);   
        this.prepareDragDrop(this.nodes);
        this.nodeSelect(this.nodes[0])
        this.elementClick(this.nodes[0])
        this.isShowSpinner = false;       
    });
  }
  deleteDisciplinesItems(item) {
    const adminManualsDeleteDialog = this.dialog.open(AdminContentDeleteComponent, {
      width: '500px',
      height: 'auto',
      data: {
        adminContentType: "Manuals",
        delAdminData: item,
      }
    });
    adminManualsDeleteDialog.afterClosed().subscribe((result) => {
      if (result == 'Yes') {
        this.adminService.removeDisciplines(item.id).subscribe((data) => {
          if (data) {
            this.updateContentForm.reset();
            let TempNode = this.removeFromTree({ "children": this.nodes }, item.id)
            this.nodes = TempNode.children;
          }
        });
      }
    });
  }
  removeFromTree(parent, childNameToRemove) {
    let _this = this;
    if (parent.children) {
      parent.children = parent.children
        .filter(function (child) { return child.id != childNameToRemove })
        .map(function (child) {
          return _this.removeFromTree(child, childNameToRemove)
        });
    }
    return parent;
  }
  addNewDisciplinesItem(item, action: string) {
    let parentId: any = null;
    if (item.parentDisciplineId) {
      parentId = action == 'Add New SubItem' ? item.id : item.parentDisciplineId
    } else {
      parentId = action == 'Add New SubItem' ? item.id : null
    }
    const disciplinesAddNewItem = this.dialog.open(AdminAddItemComponent, {
      width: '670px',
      height: 'auto',
      data: {
        adminContentType: "Disciplines",
        adminTitle: action
      }
    });
    disciplinesAddNewItem.afterClosed().subscribe((result) => {
      if (result != 'Close') {
        const addElement = {
          userName: this.currentLoggedUser,
          index: (item.index + 1),
          parentDisciplineId: parentId,
          title: result.popupTitle,
          disciplineUrl: result.popupURL,
          isActive: true,
          createdUser: this.currentLoggedUser,
          lastUpdateDateTime: this.currentdate,
          lastUpdateUser: this.currentLoggedUser
        }
        this.adminService.addDisciplines(addElement).subscribe((data) => {
          if (data) {
            // this.nodes = this.InsertNode(this.nodes, data)
            this.loadGetDisciplines();
          }
        });
      }
    });
  }
  InsertNode(nodes, Obj) {
    if (!Obj.parentDisciplineId) {
      nodes.push(Obj)
    }
    else {
      nodes.forEach(element => {
        if (element.id == Obj.parentDisciplineId) {
          if (element.children == null) element.children = [];
          element.children.push(Obj)
        }
        if (element.children && element.children.length) {
          this.InsertNode(element.children, Obj)
        }
      });
    }
    return nodes;
  }
  elementClick(elementData) {
    const finalDate = this.getModifiDate(elementData);
    this.updateData = elementData;
    this.updateContentForm.patchValue({
      contentTitle: elementData.title,
      contentURL: elementData.disciplineUrl,
      contentModifiedOn: finalDate,
      contentModifiedBy: elementData.userName
    });
  }
  nodeSelect(item) {
    this.selected = item;
  };
  selectlistActive(item) {
    return this.selected === item;
  };
  getModifiDate(data: any) {
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
  @debounce(50)
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
      this.adminService.updateMultipleDisciplines( XTX ).subscribe((NODEDATA)=>{
        console.log(NODEDATA)
      })
   }



  updateIndex() {
    this.nodes = [...this.updt( this.nodes )] 

    this.fileInRoot(  [...this.nodes] )
 
    this.clearDragInfo();
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
  onReset() {
    this.elementClick(this.updateData);
  }
  onConetntSave() {
    const rawResult = this.updateContentForm.getRawValue();
    const updateManualsData = {
      id: this.updateData.id,
      userName: rawResult.contentModifiedBy,
      index: this.updateData.index,
      parentDisciplineId: rawResult.parentDisciplineId,
      title: rawResult.contentTitle,
      disciplineUrl: rawResult.contentURL,
      isActive: this.updateData.isActive,
      createdUser: this.updateData.createdUser,
      lastUpdateDateTime: this.currentdate,
      lastUpdateUser: this.currentLoggedUser
    }
    this.isShowSpinner = true;
    this.adminService.updateDisciplines(updateManualsData).subscribe((data) => {
      this.isShowSpinner = false;
      this.loadGetDisciplines();
      this.updateContentForm.reset();
    });
  }
}
