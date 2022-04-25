import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { AdminAddItemComponent } from '../admin-add-item/admin-add-item.component';
import { MatDialog } from '@angular/material/dialog';
import { DOCUMENT } from '@angular/common';
import { MatMenuTrigger } from '@angular/material/menu';
import { debounce } from '@agentepsilon/decko';
import { LobbyHomeService } from '@app/lobby-home/lobby-home.service';
import { AdminContentDeleteComponent } from '../admin-content-delete/admin-content-delete.component';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
interface TreeNode {
  id: string;
  index : number;
  children: TreeNode[];
  isExpanded?: boolean;
}
interface DropInfo {
  targetId: string;
  action?: string;
}
@Component({
  selector: 'app-admin-manuals',
  templateUrl: './admin-manuals.component.html',
  styleUrls: ['./admin-manuals.component.scss'],
})
export class AdminManualsComponent implements OnInit {
  manualsData;
  updateContentForm: FormGroup;
  updateData;
  nodes: TreeNode[] = [];
  isShowSpinner: boolean = false;
  selected: any;
  currentNodeLen:any;
  onReset() {
    this.elementClick(this.updateData);
  }
  ngOnInit() {
    this.updateContentForm = this.formBuilder.group({
      contentTitle: [null, Validators.required],
      contentURL: [null, Validators.required],
      contentModifiedOn: [null],
      contentModifiedBy: [null],
    });
    this.loadGetManuals();
  }
  nodeSelect(item) {
    console.log(item)
    this.selected = item;
  }
  selectlistActive(item) {
    return this.selected === item;
  };
  elementClick(elementData) {
    const finalDate = this.getModifiDate(elementData);
    this.updateData = elementData;
    this.updateContentForm.patchValue({
      contentTitle: elementData.title,
      contentURL: elementData.manualUrl,
      contentModifiedOn: finalDate,
      contentModifiedBy: elementData.lastUpdateUser,
    });
  }
  getModifiDate(data: any) {
    let readDate = data.lastUpdateDateTime.split('-');
    let readDay, readMonth, readYear, finalDate;
    readYear = readDate[0];
    readMonth = readDate[1];
    readDay = readDate[2].split('T')[0];
    finalDate = readMonth + '/' + readDay + '/' + readYear;
    return finalDate;
  }
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  onContextMenu(event: MouseEvent, item: any) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }
  dropTargetIds = [];
  nodeLookup = {};
  dropActionTodo: DropInfo = null;
  constructor(
    @Inject(DOCUMENT) private document: Document,
    public addItem: MatDialog,
    public deleteItem: MatDialog,
    private lobbyHomeService: LobbyHomeService,
    private formBuilder: FormBuilder
  ) { }
  prepareDragDrop(nodes: TreeNode[]) {
    nodes.forEach((node) => {
      this.dropTargetIds.push(node.id);
      this.nodeLookup[node.id] = node;
      this.prepareDragDrop(node.children);
    });
  }
  @debounce(50)
  dragMoved(event) {
    let e = this.document.elementFromPoint(
      event.pointerPosition.x,
      event.pointerPosition.y
    );
    if (!e) {
      this.clearDragInfo();
      return;
    }
    let container = e.classList.contains('node-item')
      ? e
      : e.closest('.node-item');
    if (!container) {
      this.clearDragInfo();
      return;
    }
    this.dropActionTodo = {
      targetId: container.getAttribute('data-id'),
    };
    const targetRect = container.getBoundingClientRect();
    const oneThird = targetRect.height / 3;
    if (event.pointerPosition.y - targetRect.top < oneThird) {
      this.dropActionTodo['action'] = 'before';
    } else if (event.pointerPosition.y - targetRect.top > 2 * oneThird) {
      this.dropActionTodo['action'] = 'after';
    } else {
    //  console.log("Inside not allow")
   //   this.dropActionTodo['action'] = 'inside';
    }
    this.showDragInfo();
  }
  drop(event) {
    if (!this.dropActionTodo) return;
    const draggedItemId = event.item.data;
    const parentItemId = event.previousContainer.id;
    const targetListId = this.getParentNodeId(
      this.dropActionTodo.targetId,
      this.nodes,
      'main'
    );
    console.log(
      '\nmoving\n[' + draggedItemId + '] from list [' + parentItemId + ']',
      '\n[' +
      this.dropActionTodo.action +
      ']\n[' +
      this.dropActionTodo.targetId +
      '] from list [' +
      targetListId +
      ']'
    );
    const draggedItem = this.nodeLookup[draggedItemId];
    const oldItemContainer =
      parentItemId != 'main'
        ? this.nodeLookup[parentItemId].children
        : this.nodes;
    const newContainer =
      targetListId != 'main'
        ? this.nodeLookup[targetListId].children
        : this.nodes;
    let i = oldItemContainer.findIndex((c) => c.id === draggedItemId);
    oldItemContainer.splice(i, 1);
    switch (this.dropActionTodo.action) {
      case 'before':
      case 'after':
        const targetIndex = newContainer.findIndex(
          (c) => c.id === this.dropActionTodo.targetId
        );
        if (this.dropActionTodo.action == 'before') {
          newContainer.splice(targetIndex, 0, draggedItem);
        } else {
          newContainer.splice(targetIndex + 1, 0, draggedItem);
        }
        break;
      case 'inside':
        this.nodeLookup[this.dropActionTodo.targetId].children.push(
          draggedItem
        );
        this.nodeLookup[this.dropActionTodo.targetId].isExpanded = true;
        break;
    }
    
    this.updateIndex()
  }

  updateIndex(){ 

     
    this.nodes.map((node,index)=>{
          node.index = index;
          this.lobbyHomeService.updateManuals(node).subscribe( (data) => {
            
          });

    })

    if(this.nodes.length != this.currentNodeLen) {
      this.loadGetManuals();
    }
    console.log(this.nodes)




    if(this.nodes.length != this.currentNodeLen) {
      this.loadGetManuals();
    }
    
    this.clearDragInfo(true);
  }





  getParentNodeId(
    id: string,
    nodesToSearch: TreeNode[],
    parentId: string
  ): string {
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
      this.document
        .getElementById('node-' + this.dropActionTodo.targetId)
        .classList.add('drop-' + this.dropActionTodo.action);
    }
  }
  clearDragInfo(dropped = false) {
    if (dropped) {
      this.dropActionTodo = null;
    }
    this.document
      .querySelectorAll('.drop-before')
      .forEach((element) => element.classList.remove('drop-before'));
    this.document
      .querySelectorAll('.drop-after')
      .forEach((element) => element.classList.remove('drop-after'));
    this.document
      .querySelectorAll('.drop-inside')
      .forEach((element) => element.classList.remove('drop-inside'));
  }
  onConetntSave() {
    let currentdateTime = new Date();
    const rawResult = this.updateContentForm.getRawValue();
    console.log(rawResult);
    const updateManualsData = {
      id: this.updateData.id,
      title: rawResult.contentTitle,
      manualUrl: rawResult.contentURL,
      userName: this.updateData.userName,
      index: this.updateData.index,
      createdDateTime: this.updateData.createdDateTime,
      lastUpdateDateTime: currentdateTime,
      lastUpdateUser: sessionStorage.getItem('displayName'),
    };
    this.isShowSpinner = true;
    this.lobbyHomeService.updateManuals(updateManualsData).subscribe((data) => {
      this.isShowSpinner = false;
      console.log(data);
      this.updateContentForm.reset();
    });
  }
  addNewManualItem(eventData) {
    console.log(eventData);
    const adminManualsAddNewItem = this.addItem.open(AdminAddItemComponent, {
      width: '670px',
      height: 'auto',
      data: {
        adminContentType: 'Manuals',
      },
    });
    adminManualsAddNewItem.afterClosed().subscribe((result) => {
      console.log(result);
      let currentDate = new Date();
      const addElement = {
        title: result.popupTitle,
        manualUrl: result.popupURL,
        userName: sessionStorage.getItem('displayName'),
        userMail: sessionStorage.getItem('userMail'),
        index: eventData.index + 1,
        createdDateTime: currentDate,
        lastUpdateDateTime: currentDate,
        lastUpdateUser: sessionStorage.getItem('displayName'),
      };
      console.log(addElement);
      this.lobbyHomeService.addManuals(addElement).subscribe((data) => {
        console.log(data);
        if (data) {
          this.loadGetManuals();
        }
      });
    });
  }
  deleteManualsItems(deleteElem) {
    const adminManualsDeleteDialog = this.deleteItem.open(
      AdminContentDeleteComponent,
      {
        width: '500px',
        height: 'auto',
        data: {
          adminContentType: 'Manuals',
          delAdminData: deleteElem,
        },
      }
    );
    adminManualsDeleteDialog.afterClosed().subscribe((result) => {
      console.log(result);
      if (result == 'Yes') {
        this.lobbyHomeService.removeManuals(deleteElem.id).subscribe((data) => {
          console.log(data);
          if (data) {
            this.updateContentForm.reset();
            this.loadGetManuals();
          }
        });
      }
    });
  }
  loadGetManuals() {
    this.isShowSpinner = true;
    this.lobbyHomeService.getAllBrowseManuals().subscribe((data: any) => {
      data.map((node) => {
        node.id = node.id.toString();
        node.children = node.children || [];
      })

      let sortData = data.sort(function(a, b){
        return a.index - b.index;
    });
      this.currentNodeLen = sortData.length;
      this.nodes = sortData;
      this.prepareDragDrop(this.nodes);
      this.nodeSelect( this.nodes[0] )
      this.elementClick( this.nodes[0]  ) 
      this.isShowSpinner = false;
    });
  }
}
