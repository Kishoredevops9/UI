import { Component, OnInit, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from "@angular/common";
import { MatMenuTrigger } from "@angular/material/menu"; 
// import { debounce } from "@agentepsilon/decko";
import { LobbyHomeService } from '../../lobby-home/lobby-home.service';
import { MatDialog } from '@angular/material/dialog';
import { AdminContentDeleteComponent } from '../admin-content-delete/admin-content-delete.component';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { LobbyHomeComponent } from '../../lobby-home/lobby-home/lobby-home.component';


interface TreeNode {
  id: string;
  children?: TreeNode[];
  isExpanded?:boolean;

  userName: string;
  title: string;
  description: string;
  url: string;
  type: string;
  version: number;
  isActive: boolean;
  createdDateTime: string;
  createdUser: string;
  lastUpdateDateTime: string;
  lastUpdateUser: string;
}

interface DropInfo {
    targetId: string;
    action?: string;
}

@Component({
  selector: 'app-admin-footer-links',
  templateUrl: './admin-footer-links.component.html',
  styleUrls: ['./admin-footer-links.component.scss']
})

export class AdminFooterLinksComponent implements OnInit {


    footerData;
    updateContentForm: FormGroup;
    updateData;
    currentLoggedUser;
    isShowSpinner: boolean = false;
    nodes:TreeNode[] = [];
    selected:any;
    lobbyLoad: LobbyHomeComponent;

    ngOnInit(): void {
      this.loadGetAllFooters();
      this.currentLoggedUser = sessionStorage.getItem('displayName');
      console.log(this.currentLoggedUser);

      this.updateContentForm = this.formBuilder.group({
        'contentTitle': [null, Validators.required],
        'contentURL': [null, Validators.required],
        'footerDescription': [null, Validators.required],
        'contentModifiedOn': [null],
        'contentModifiedBy': [null]
      });
  
    }

    @ViewChild(MatMenuTrigger)
    contextMenu: MatMenuTrigger;
  
    contextMenuPosition = { x: '0px', y: '0px' };
  
    onContextMenu(event: MouseEvent, item: any) {
      event.preventDefault();
      this.contextMenuPosition.x = event.clientX + 'px';
      this.contextMenuPosition.y = event.clientY + 'px';
      this.contextMenu.menuData = { 'item': item };
      this.contextMenu.menu.focusFirstItem('mouse');
      this.contextMenu.openMenu();
    }


    /*
    deleteNode(){

        this.nodes.length = 1
    }

    addNode(){ 

        this.nodes.push(  {
            id: 'item' + Date.now(),
            children:[]
          })

          this.prepareDragDrop(this.nodes);

    }

  nodes: TreeNode[] = [ 
    {
      id: 'item 1',
      children:[]
    },
    {
      id: 'item 2',
      children:[
        {
          id: 'item 2.1',
          children:[]
        },
          {
          id: 'item 2.2',
          children:[]
        },
          {
          id: 'item 2.3',
          children:[]
        }
      ]
    },
    {
      id: 'item 3',
      children:[]
    }
  ];
  */
  // ids for connected drop lists
  dropTargetIds = [];
  nodeLookup = {};
  dropActionTodo: DropInfo = null;

  constructor(@Inject(DOCUMENT) private document: Document,
  private lobbyHomeService: LobbyHomeService,
  public deleteFooterItem: MatDialog,
  private formBuilder: FormBuilder,
  ) {
  //    this.prepareDragDrop(this.nodes);
  }

  prepareDragDrop(nodes: TreeNode[]) {
      nodes.forEach(node => {
          const id = node.id.toString();
          this.dropTargetIds.push(id);
          this.nodeLookup[id] = node;
          //this.prepareDragDrop(node.children);
      });
  }

 
  // @debounce(50)
  dragMoved(event) {
    /*
      let e = this.document.elementFromPoint(event.pointerPosition.x,event.pointerPosition.y);
        
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
          // before
          this.dropActionTodo["action"] = "before";
      } else if (event.pointerPosition.y - targetRect.top > 2 * oneThird) {
          // after
          this.dropActionTodo["action"] = "after";
      } else {
          // inside
          this.dropActionTodo["action"] = "inside";
      }
      this.showDragInfo();
    */  
  }


  drop(event) {
    /*
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
      let currentdate = new Date();
      const updateData = {
        id: draggedItem.id,
        userName: draggedItem.userName,
        index: draggedItem.index,
        title: draggedItem.title,
        
        description: draggedItem.description,
        url: draggedItem.url,
        type: draggedItem.type,
        version: draggedItem.version,
        isActive: draggedItem.isActive,
        createdDateTime: draggedItem.createdDateTime,
        createdUser: draggedItem.createdUser,
        lastUpdateDateTime: currentdate,
        lastUpdateUser: this.currentLoggedUser
      }



      this.isShowSpinner = true;
      this.lobbyHomeService.updateFooterLinks(updateData).subscribe( (data) => {
        this.isShowSpinner = false;
        this.loadGetAllFooters();
        this.updateContentForm.reset();
      });


      this.clearDragInfo(true)
    */  
  }
  getParentNodeId(id: string, nodesToSearch: TreeNode[], parentId: string): string {
      for (let node of nodesToSearch) {
          if (node.id == id) return parentId;
          //let ret = this.getParentNodeId(id, node?.children, node.id);
          //if (ret) return ret;
      }
      return null;
  }
  showDragInfo() {
      // this.clearDragInfo();
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


  loadGetAllFooters(){
    this.isShowSpinner = true;
    this.lobbyHomeService.getAllFooterLinks().subscribe( node => {
      this.isShowSpinner = false;
        this.nodes = (node as unknown as TreeNode[]);      
        this.selected = this.nodes;                  
        //this.prepareDragDrop(this.nodes);
        console.log(this.nodes);
        if(this.nodes.length > 0){
          this.updateData = this.nodes[0];
          const finalDate = this.getModifiDate(this.nodes[0]);
          this.updateContentForm.patchValue({
            contentTitle: this.nodes[0].title,
            contentURL: this.nodes[0].url,
            footerDescription: this.nodes[0].description,
            contentModifiedOn: finalDate,
            contentModifiedBy: this.nodes[0].lastUpdateUser
          });
          this.nodeSelect(this.nodes[0]);
          this.selectlistActive(this.nodes[0]);
        }
        if(node){
          this.lobbyLoad?.loadFooterLinks();
        }
      });
  }

  nodeSelect(item) {
    this.selected = item; 
  };
  selectlistActive(item) {
      return this.selected === item;
  };
  
  deleteFooterLinks(deleteElem){

    const adminFooterLinksDeleteDialog = this.deleteFooterItem.open(AdminContentDeleteComponent, {
      width: '500px',
      height: 'auto',
      data: {
        adminContentType: "FooterLinks",
        delAdminData: deleteElem,
      }
    });

    adminFooterLinksDeleteDialog.afterClosed().subscribe((result) => {
      console.log(result);
      if( result == 'Yes'){
        this.lobbyHomeService.removeFooterLinks(deleteElem.id).subscribe( (data) => {
          console.log(data);
          if(data){
            this.updateContentForm.reset();
            this.loadGetAllFooters();
          }
        });  
      }
    });

  }



  footerElementClick(footerElementData){
    console.log(footerElementData);
    const finalDate = this.getModifiDate(footerElementData);
    this.updateData = footerElementData;
    this.updateContentForm.patchValue({
      contentTitle: footerElementData.title,
      contentURL: footerElementData.url,
      footerDescription: footerElementData.description,
      contentModifiedOn: finalDate,
      contentModifiedBy: footerElementData.lastUpdateUser
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

  onReset(){
    this.footerElementClick(this.updateData);
  }

  onConetntSave(){

    const rawResult = this.updateContentForm.getRawValue();
    console.log(rawResult);
    let currentdate = new Date();
    const updateFooterData = {
      id: this.updateData.id,
      userName: this.updateData.userName,
      title: rawResult.contentTitle,
      description: rawResult.footerDescription,
      url: rawResult.contentURL,
      type: this.updateData.type,
      version: this.updateData.version,
      isActive: this.updateData.isActive,
      createdDateTime: this.updateData.createdDateTime,
      createdUser: this.updateData.createdUser,
      lastUpdateDateTime: currentdate,
      lastUpdateUser: this.currentLoggedUser
    }

    this.lobbyHomeService.updateFooterLinks(updateFooterData).subscribe( (data) => {
      console.log(data);
      this.loadGetAllFooters();
      this.updateContentForm.reset();
    });

  }
}
