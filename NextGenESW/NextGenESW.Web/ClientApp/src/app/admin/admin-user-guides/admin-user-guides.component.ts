import { Component, OnInit, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { AdminAddItemComponent } from '../admin-add-item/admin-add-item.component';
import { MatDialog } from '@angular/material/dialog';
import { DOCUMENT } from "@angular/common";
import { MatMenuTrigger } from "@angular/material/menu";
import { debounce } from "@agentepsilon/decko";
import { LobbyHomeService } from '../../lobby-home/lobby-home.service';
import { AdminContentDeleteComponent } from '../admin-content-delete/admin-content-delete.component';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AdminService } from '../admin.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';


interface TreeNode {
  id: string;
  children?: TreeNode[];
  isExpanded?:boolean;
  userName: any,
  index: number;
  parentGuideId: number;
  title: string;
  userGuideUrl: string;
  createdDateTime: string;
  lastUpdateDateTime: string;
  lastUpdateUser: string;
  fileUpload: string;
}



interface DropInfo {
    targetId: string;
    action?: string;
}

@Component({
  selector: 'app-admin-user-guides',
  templateUrl: './admin-user-guides.component.html',
  styleUrls: ['./admin-user-guides.component.scss']
})

export class AdminUserGuidesComponent implements OnInit {

  manualsData;
  updateContentForm: FormGroup;
  updateData;
  nodes:TreeNode[] = [];
  isShowSpinner: boolean = false;
  selected:any;

  addResult;
  selectedFiles: FileList;
  fileInfos: Observable<any>;
  currentFile: File;
  progress = 0;
  message = '';
  eventData;

  ngOnInit(): void {


    this.updateContentForm = this.formBuilder.group({
      'contentTitle': [null, Validators.required],
      'contentURL': [null, Validators.required],
      'contentModifiedOn': [null],
      'contentModifiedBy': [null],
      'thumbnailImgString': [null]
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

  // ids for connected drop lists
  dropTargetIds = [];
  nodeLookup = {};
  dropActionTodo: DropInfo = null;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    public addItem: MatDialog,
    public deleteItem: MatDialog,
    private lobbyHomeService: LobbyHomeService,
    private formBuilder: FormBuilder,
    private serviceAdmin: AdminService,

    ) {
      this.loadGetManuals();

  }

  sortArray(array) {
    array.sort((a, b) => a.index - b.index);
    array.forEach(a => {
      if (a.children && a.children.length > 0)
        this.sortArray(a.children)
    })
    return array;
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

  // prepareDragDrop(nodes: TreeNode[]) {
  //     nodes.forEach(node => {
  //         const id = node.id.toString();
  //         this.dropTargetIds.push(id);
  //         this.nodeLookup[id] = node;
  //         this.prepareDragDrop(node.children);
  //     });
  // }

  prepareDragDrop(nodes: TreeNode[]) {
    nodes.forEach(node => {
      this.dropTargetIds.push(node.id);
      this.nodeLookup[node.id] = node;
      this.prepareDragDrop(node.children);
    });
  }

  @debounce(50)
  dragMoved(event) {
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

      // let currentdateTime = new Date();
      // const updateData = {
      //   id: draggedItem.id,
      //   userName: draggedItem.userName,
      //   index: draggedItem.index,
      //   title: draggedItem.title,
      //   userGuideUrl: draggedItem.userGuideUrl,
      //   createdDateTime: draggedItem.createdDateTime,
      //   lastUpdateDateTime: currentdateTime,
      //   lastUpdateUser: sessionStorage.getItem('displayName'),
      //   fileUpload: draggedItem.fileUpload
      // }
      // this.isShowSpinner = true;
      // this.serviceAdmin.updateUserGuides(updateData).subscribe( (data) => {
      //   // console.log(data);
      //   this.isShowSpinner = false;
      //   this.loadGetManuals();
      //   this.updateContentForm.reset();
      // });

      // this.clearDragInfo(true)
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
        parentGuideId : pid 
        })
        if (element.children && element.children.length){
          STS(  element.children , element.id ) 
        } 
      }); 
    } 
    STS(nods,null)   
    console.log(XTX);
    //API Call for Multiple UserGuide Updates
    this.serviceAdmin.UpdateAllEksUserGuide( XTX ).subscribe((NODEDATA)=>{
      console.log(NODEDATA);
      if(NODEDATA){
        this.isShowSpinner = false;
        
      }
    });
    
  }



  updateIndex() {
    this.isShowSpinner = true;
    
    this.nodes = [...this.updt( this.nodes )] 

    this.fileInRoot(  [...this.nodes] )
 
    this.clearDragInfo();
  }


  getParentNodeId(id: string, nodesToSearch: TreeNode[], parentId: string): string {
      for (let node of nodesToSearch) {
          if (node.id == id) return parentId;
          let ret = this.getParentNodeId(id, node?.children, node.id);
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

  // loadGetManuals(){

  //   this.isShowSpinner = true;
  //   this.serviceAdmin.getAllUserGuides().subscribe( (data) => {
  //     this.nodes = ( data as unknown as TreeNode[]);
  //     this.isShowSpinner = false;
  //     this.selected = this.nodes;
  //     this.prepareDragDrop(this.nodes);

  //     if(this.nodes.length > 0 ){
  //       this.updateData = this.nodes[0];
  //       const finalDate = this.getModifiDate(this.nodes[0]);
  //       this.updateContentForm.patchValue({
  //         contentTitle: this.nodes[0].title,
  //         contentURL: this.nodes[0].userGuideUrl,
  //         contentModifiedOn: finalDate,
  //         contentModifiedBy: this.nodes[0]?.lastUpdateUser
  //       });
  //       this.nodeSelect(this.nodes[0]);
  //       this.selectlistActive(this.nodes[0]);
  //     }

  //   });

  // }

  
  loadGetManuals(){

    this.isShowSpinner = true;
    this.serviceAdmin.getAllUserGuides().subscribe( (data) => {
      let sortData  =  this.sortArray(data); 
      this.nodes = this.idToString(sortData);   
        this.prepareDragDrop(this.nodes);
        this.nodeSelect(this.nodes[0])
        this.elementClick(this.nodes[0])
        this.isShowSpinner = false;       

  
      this.selected = this.nodes;
    });

  }

  addNewManualItem(item:any, action:string){
    let parentId:any=null;
    if(item.parentGuideId) {
      parentId = action == 'Add New Submenu' ? item.id : item.parentGuideId;
    } else {
      parentId = action == 'Add New Submenu' ? item.id : '';
    }
    this.eventData = item;
    // console.log("item", item);
    // console.log("parentId", parentId);
    const adminManualsAddNewItem = this.addItem.open(AdminAddItemComponent, {
      width: '670px',
      height: 'auto',
      data: {
        adminContentType: "UserGuides",
        adminTitle: action
      }
    });

    adminManualsAddNewItem.afterClosed().subscribe((result) => {
      let currentDate = new Date();
      // console.log(result);
      if(result != 'Close' && result != undefined){
        this.isShowSpinner = true;
        this.addResult = result;
        this.onAddAssetFetured(parentId);
      }
    });

  }


  onAddAssetFetured(parentId:any): void {
    let result = this.addResult;
    let currentDate = new Date();

    const addElements = {
      title: result.popupTitle,
      userGuideUrl: result.popupURL,
      userName: sessionStorage.getItem('displayName'),
      userMail: sessionStorage.getItem('userMail'),
      index: (this.eventData.index + 1),
      ParentGuideId: parentId,
      //createdDateTime: currentDate,
      //lastUpdateDateTime: currentDate,
      lastUpdateUser: sessionStorage.getItem('displayName'),
      fileUpload: ""
    }

    this.progress = 0;
    this.currentFile = result.thumbnailImgString?.item(0);
    //console.log("onAddAssetFetured", this.currentFile, addElements);
    this.isShowSpinner = true;
    this.serviceAdmin.upload(this.currentFile, addElements, "eksuserguides/CreateEksUserGuide").subscribe(
      event => {

        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * event.loaded / event.total);
        } else if(event instanceof HttpResponse) {
          this.message = event.body.message;
          this.fileInfos = this.serviceAdmin.getFiles();
        }
        this.loadGetManuals();
      },
      err => {
        this.progress = 0;
        this.message = 'Could not upload the file!';
        this.currentFile = undefined;
      }
    );


  }

  deleteManualsItems(deleteElem){

    const adminManualsDeleteDialog = this.deleteItem.open(AdminContentDeleteComponent, {
      width: '500px',
      height: 'auto',
      data: {
        adminContentType: "UserGuides",
        delAdminData: deleteElem,
      }
    });

    adminManualsDeleteDialog.afterClosed().subscribe((result) => {
      // console.log(result);
      if( result == 'Yes'){
        this.isShowSpinner = true;
        this.serviceAdmin.deleteUserGuides(deleteElem.id).subscribe( (data) => {
          // console.log(data);
          if(data){
            this.updateContentForm.reset();
            let TempNode = this.removeFromTree({ "children": this.nodes }, deleteElem.id)
            this.nodes = TempNode.children;

            this.isShowSpinner = false;
            
            this.loadGetManuals();
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
      contentURL: elementData.userGuideUrl,
      contentModifiedOn: finalDate,
      contentModifiedBy: elementData.lastUpdateUser
    });
  }

  getModifiDate(data:any) {
    if(data.lastUpdateDateTime){
      // console.log("inside if");
      let readDate = data?.lastUpdateDateTime.split('-');
      let readDay, readMonth, readYear, finalDate;
      readYear = readDate[0];
      readMonth = readDate[1];
      readDay = readDate[2].split('T')[0];
      finalDate = readMonth + '/' + readDay + '/' + readYear;
      return finalDate;
    }

    return "04/13/2021"
  }

  onReset(){
    this.elementClick(this.updateData);
  }

  onConetntSave(){
    this.isShowSpinner = true;
    let currentdateTime = new Date();
    const rawResult = this.updateContentForm.getRawValue();
    // console.log(rawResult);
    this.currentFile = this.selectedFiles?.item(0);
    const updateManualsData = {
      id: this.updateData.id,
      title: rawResult.contentTitle,
      userGuideUrl: rawResult.contentURL,
      userName: this.updateData.userName,
      index: this.updateData.index,
      createdDateTime: this.updateData.createdDateTime,
      //lastUpdateDateTime: currentdateTime,
      lastUpdateUser: sessionStorage.getItem('displayName'),
      fileUpload: ""
    }

    this.serviceAdmin.updateAssetsWithUpload(this.currentFile, updateManualsData, "eksuserguides/UpdateEksUserGuide").subscribe(
      event => {
        if(event){
          // console.log(event);
          this.updateContentForm.reset();
          this.loadGetManuals();
        }


        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * event.loaded / event.total);
        } else if(event instanceof HttpResponse) {
          this.message = event.body.message;
          this.fileInfos = this.serviceAdmin.getFiles();
        }

      },
      err => {
        this.progress = 0;
        this.message = 'Could not upload the file!';
        this.currentFile = undefined;
      }
    );

  }

  // File Selection
  onFileChanged(event) {
    this.selectedFiles = event.target.files;
    // console.log(this.selectedFiles);
  }



}
