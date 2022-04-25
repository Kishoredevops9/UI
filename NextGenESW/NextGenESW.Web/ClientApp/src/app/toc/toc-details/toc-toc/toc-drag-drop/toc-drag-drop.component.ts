import {
  Component,
  OnInit,
  ViewEncapsulation,
  Inject,
  Input,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { debounce } from '@agentepsilon/decko';
import  {compact, map} from 'lodash';
import {
  tocWICDdocList,
  Item,
  componentMessages,
  WICDdocList,
} from '@app/toc/toc.model';
import { MatMenuTrigger } from '@angular/material/menu';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { TocService } from '@app/toc/toc.service';
import { MatDialog } from '@angular/material/dialog';
import { AddonsPopupComponent } from '@app/activity-page/activity-details/activity-components/addons-popup/addons-popup.component';
import { ExternalLinkComponent } from '../external-link/external-link.component';
import { documentPath, oldContentTypeCode } from '@environments/constants';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddonsPopupSearchComponent } from '@app/shared/component/addons-popup-search/addons-popup-search.component';

@Component({
  selector: 'app-toc-drag-drop',
  templateUrl: './toc-drag-drop.component.html',
  styleUrls: ['./toc-drag-drop.component.scss'],
})
export class TocDragDropComponent implements OnInit {
  private eventsSubscription: Subscription;
  private _node: Item[];

  @Input() events: Observable<void>;
  @Input() expendevents: Observable<void>;

  @Input() set nodes(value) {
    this._node = value;
    this.prepareDragDrop(value);
  }

  get nodes() {
    return this._node;
  }
  @Input() bindData;
  // ids for connected drop lists
  dropTargetIds = [];
  nodeLookup = {};
  dropActionTodo = null;
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  @Input() item: Item;
  @Input() parentItem?: Item;
  @Input() public set connectedDropListsIds(ids: string[]) {
    this.allDropListsIds = ids;
  }
  @Input() childExpandState = true;
  @Input() isEditableMode;
  @Output() eksListEvent = new EventEmitter();
  @Output() deleteComponentEvent = new EventEmitter();
  @Output() updateEntireIndex = new EventEmitter();
  private subscription: Subscription;
  content = [];
  blockExpansion = true;
  showPlus: boolean = true;
  public get connectedDropListsIds(): string[] {
    return this.allDropListsIds.filter((id) => id !== this.item.uId);
  }
  public allDropListsIds: string[];

  get dragDisabled(): boolean {
    return !this.parentItem;
  }

  get parentItemId(): string {
    return this.dragDisabled ? '' : this.parentItem.uId;
  }
  isValidEm:any;
  public screenWidth: any;
  public screenHeight: any;
  @Output() panelExpandCollapseEvent = new EventEmitter();
  public cType: any =
    [
      {
        "name": "Work Instructions",
        "code": "I",
        "assetType" : 'WI'
      },
      {
        "name": "Work Instructions",
        "code": "WI",
        "assetType" : 'WI'
      },
      {
        "name": "Guide Book",
        "code": "G",
        "assetType" : 'GB'
      },
      {
        "name": "Guide Book",
        "code": "GB",
        "assetType" : 'GB'
      },
      {
        "name": "Design Standards",
        "code": "DS",
        "assetType" : 'DS'
      },
      {
        "name": "Design Standards",
        "code": "S",
        "assetType" : 'DS'
      },
      {
        "name": "STEP Flow",
        "code": "SF",
        "assetType" : 'SF'
      },
      {
        "name": "STEP Flow",
        "code": "F",
        "assetType" : 'SF'
      },
      {
        "name": "Activity Page",
        "code": "AP",
        "assetType" : 'AP'
      },
      {
        "name": "Activity Page",
        "code": "A",
        "assetType" : 'AP'
      },
      {
        "name": "Knowledge Pack",
        "code": "KP",
        "assetType" : 'KP'
      },
      {
        "name": "Knowledge Pack",
        "code": "K",
        "assetType" : 'KP'
      },
      {
        "name": "Criteria Group",
        "code": "CG",
        "assetType" : 'CG'
      },
      {
        "name": "Criteria Group",
        "code": "C",
        "assetType" : 'CG'
      },
      {
        "name": "Table Of Content",
        "code": "TOC",
        "assetType" : 'TOC'
      },
      {
        "name": "Table Of Content",
        "code": "T",
        "assetType" : 'TOC'
      },
      {
        "name": "Related Content",
        "code": "RC",
        "assetType" : 'RC'
      },
      {
        "name": "Related Content",
        "code": "R",
        "assetType" : 'RC'
      },
      {
        "name": "STEP",
        "code": "SP",
        "assetType" : 'SP'
      },
      {
        "name": "STEP",
        "code": "P",
        "assetType" : 'SP'
      }
    ];
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private tocService: TocService,
    public dialog: MatDialog,
    private ngxService: NgxUiLoaderService,
    private _snackBar: MatSnackBar
  ) {
    this.nodes && this.prepareDragDrop(this.nodes);
  }
  ngOnInit(): void {
    this.nodes && this.prepareDragDrop(this.nodes);


    this.eventsSubscription = this.events.subscribe(() =>  {

      console.log("node added")
      this.prepareDragDrop(this.nodes);

    }  );


    this.expendevents.subscribe((data) =>  {
      this.nodes =  this.expendChange( this.nodes  , data);
      this.prepareDragDrop(this.nodes)
    }  );




  }

  isValidURL(url){
    if(!this.isValidEm){
      this.isValidEm = document.createElement('input');
      this.isValidEm.setAttribute('type', 'url');
    }
    this.isValidEm.value = url;
    return this.isValidEm.validity.valid;
  }

  getExternalLink(url){
    let externalLink = this.isValidURL(url) ? url : "http://"+url;
    return externalLink;
  }

  getID($i) {
    let d = this.cType.find((node) => {
      return node.code == $i
    })

    return d.assetType
  }

  // getID($i) {
  //   let d = this.cType.find((node) => {
  //     return node.code == $i
  //   })

  //   return d.assetType
  // }

  expendChange($arg, data) {
    $arg.map((node) => {

      if (node.children) {
        this.expendChange(node.children, data)
      }
      node['isExpanded'] = data
    })
    return $arg;
  }





  ngOnChanges(event) {
    if (event.bindData && event.bindData.currentValue == true) {

      this.prepareDragDrop(this.nodes);
    }

  }

  prepareDragDrop(nodes: Item[]) {
    setTimeout(()=>{
      nodes.forEach((node) => {
        this.dropTargetIds.push(node.id);
        this.nodeLookup[node.id] = node;
        this.prepareDragDrop(node.children);
      });
    },500)
  }

  @debounce(50)
  dragMoved(event) {
    if (!this.isEditableMode) return;
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
      // before
      this.dropActionTodo['action'] = 'before';
    } else if (event.pointerPosition.y - targetRect.top > 2 * oneThird) {
      // after
      this.dropActionTodo['action'] = 'after';
    } else {
      // inside
      this.dropActionTodo['action'] = 'inside';
    }
    this.showDragInfo();
  }

  drop(event) {
    if (!this.isEditableMode){
      console.log("Not in editable mode");
      return;
    }
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
    let parentContainer = this.nodeLookup[targetListId];
    if ( this.dropActionTodo?.action === 'inside' ) {
      parentContainer = this.nodeLookup[this.dropActionTodo.targetId];
    }
    if ( !this.canDrop(draggedItem, parentContainer?.children || this.nodes) ) {
      return;
    }
    let i = oldItemContainer.findIndex((c) => c.id === draggedItemId);
    oldItemContainer.splice(i, 1);
    let targetId = 0;
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
        targetId =
          this.nodeLookup[this.dropActionTodo.targetId].content
            .tableOfContentTocid;
        break;
    }
    this.clearDragInfo(true);
    const container = {
      targetElementId: targetId,
      dragElementId: draggedItem.content.tableOfContentTocid | 0,
    };
    this.updateEntireIndex.emit(JSON.stringify(container));


    let Param = this.DataChangeValue(this.nodes, 0);
    console.log(    Param)
    this.ngxService.startLoader("dragdrop");
    this.tocService.updateTableOfContent(Param).subscribe((data) => {
      this.ngxService.stopLoader("dragdrop");
    }, (err) => {
      this._snackBar.open("Error in API", "X");
      this.ngxService.stopLoader("dragdrop");
    })

  }


  DataChangeValue($arg, $parentTableOfContentTocid) {
    $arg.map((node,index) => {
      for (const property in node.content) {
        node[property] = node.content[property]
      }
      if (node.children) {
        this.DataChangeValue(node.children, node.tableOfContentTocid)
      }
      node['parentTableOfContentTocid'] = $parentTableOfContentTocid;
      node['childList'] = node.children;
      node['orderNo'] = index
    })
    return $arg;
  }

  getParentNodeId(id: string, nodesToSearch: Item[], parentId: string): string {
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
  onContextMenu(event: MouseEvent, item: Item) {
    event.preventDefault();
    if ( !this.isEditableMode ) {
      return;
    }
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }
  onContextMenuEKS(item) {
    this.addAddOns(item);
  }
  addAddOns(parentItem) {
    const currentContentIdList = compact(map(parentItem.children, 'content.contentId'));
    const dialogRef = this.dialog.open(AddonsPopupComponent, {
      width: '90%',
      height: '85%',
      maxWidth: this.screenWidth + 'px',
      maxHeight: this.screenHeight + 'px',
      data: {
        // doc: this.tocWICDdocList,
        ctContentId: '',
        ctTitle: '',
        ctDescription: '',
        type: '',
        message: 'ADD ONS',
        showEksPanel: false,
        restrictedContentIds: currentContentIdList,
        disableObsoleteDocuments: true
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result !== 'No') {
        if (result && result.length) {
          result.forEach((element) => {
            element.componenttype = element.assettypecode.toUpperCase();
            element.assetType = element.assettypecode.toUpperCase();
            element.contentId = element.contentnumber;
            element.toctype = false;
            let wICDdocListChild = new WICDdocList();
          });
          let addedDetails = {
            item: result,
            parentItem: parentItem,
            type: 'eks',
          };
          if (!this.showPlus) {
            this.childExpandState = true;
            this.showPlus = true;
          }
          this.eksListEvent.emit(addedDetails);
        }
      }
    });
  }

  onOpenAddonsPopupSearch(parentItem) {
    const currentContentIdList = compact(map(parentItem.children, 'content.contentId'));
    const dialogRef = this.dialog.open(AddonsPopupSearchComponent, {
      width: '90%',
      maxWidth: this.screenWidth + 'px',
      maxHeight: this.screenHeight + 'px',
      data: {
        // doc: this.tocWICDdocList,
        ctContentId: '',
        ctTitle: '',
        ctDescription: '',
        type: '',
        message: 'ADD ONS',
        showEksPanel: false,
        existingContentIds: currentContentIdList,
        disableObsoleteDocuments: true
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result !== 'No') {
        if (result && result.length) {
          result.forEach((element) => {
            element.componenttype = element.assettypecode.toUpperCase();
            element.assetType = element.assettypecode.toUpperCase();
            element.contentId = element.contentnumber;
            element.toctype = false;
            let wICDdocListChild = new WICDdocList();
          });
          let addedDetails = {
            item: result,
            parentItem: parentItem,
            type: 'eks',
          };
          if (!this.showPlus) {
            this.childExpandState = true;
            this.showPlus = true;
          }
          this.eksListEvent.emit(addedDetails);
        }
      }
    });
  }

  onContextMenuExternal(parentItem, isHeader) {
    const dialogRef = this.dialog.open(ExternalLinkComponent, {
      width: '50%',
      height: '38%',
      maxWidth: this.screenWidth + 'px',
      maxHeight: this.screenHeight + 'px',
      disableClose: true,
      data: {
        isHeader: isHeader,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result !== 'No') {
        let assetType = '';
        let item: any;
        let tocIdValue: any = '';
        if (result.popUp == 'externalLink') {
          assetType = 'Link';
          item = result;
        } else {
          assetType = 'Header';
          item = result;
          let chilArray = parentItem.children.filter((parent) => {
            return parent.content.assetType == 'Header';
          });
          let parentTocId = parentItem.content.tocid;
          let regExp = /\./;
          let value = parentTocId.match(regExp);
          if (value != null) {
            const childLength = `${parentTocId}.${chilArray.length + 1}`;
            tocIdValue = childLength.toString();
          } else {
            let constantValue = 0.1 + Number(`0.${chilArray.length}`);
            const childLength = Number(parentTocId) + Number(constantValue);
            tocIdValue = childLength.toString();
          }
        }
        let addedDetails = {
          item: item,
          parentItem: parentItem,
          assetType: assetType,
          childTocId: tocIdValue,
        };
        if (!this.showPlus) {
          this.childExpandState = true;
          this.showPlus = true;
        }
        this.eksListEvent.emit(addedDetails);
      }
    });
  }
  deleteItem(item) {
    this.deleteComponentEvent.emit(item);
  }

  deleteComponent(item) {
    this.deleteComponentEvent.emit(item);
  }

  eksList(item) {
    this.eksListEvent.emit(item);
  }

  panelExpandCollapse(state) {
    this.showPlus = state;
    this.panelExpandCollapseEvent.emit(state);
    this.childExpandState = state;
  }

  headerStyle(parent): string {
    if (!parent.name) {
      return 'header-content';
    }

    return 'header';
  }

  isEditableModeEnabled(): string {
    if (!this.isEditableMode) {
      this.childExpandState = true;
      return 'disabled-pointer';
    }
    return '';
  }

  navigateTo(contentType, id) {
    let contentTypeValue =
      contentType == 'I' || contentType == 'WI'
        ? 'WI'
        : contentType == 'G' || contentType == 'GB'
          ? 'GB'
          : contentType == 'S' || contentType == 'DS'
            ? 'DS'
            : contentType == 'A' || contentType == 'AP'
              ? 'AP'
              : contentType == 'C' || contentType == 'CG'
                ? 'CG'
                : contentType == 'K' || contentType == 'KP'
                  ? 'KP'
                  : contentType == 'R' || contentType == 'RC'
                    ? 'RC'
                    : contentType == 'T' || contentType == 'ToC' || contentType == 'TOC'
                      ? 'TOC'
                      : '';
    sessionStorage.setItem('componentType', contentTypeValue);
    sessionStorage.setItem('contentNumber', id);
    sessionStorage.setItem('contentType', 'published');
    sessionStorage.setItem('redirectUrlPath', 'search');
    sessionStorage.setItem('statusCheck', 'true');

    if (
      contentTypeValue === oldContentTypeCode.workInstruction ||
      contentType === oldContentTypeCode.designStandard ||
      contentType === oldContentTypeCode.guideBook
    ) {
      //this.router.navigate([documentPath.publishViewPath, id]);
      window.open(documentPath.publishViewPath + '/' + id, '_blank');
    } else {
      //this.router.navigate([documentPath.publishViewPath, contentTypeValue, id]);
      window.open(
        documentPath.publishViewPath + '/' + contentTypeValue + '/' + id,
        '_blank'
      );
    }
  }

  editItem(item) {
    if (item.content.assetType != 'Link') {
      item.content.isEdit = true;
    } else {
      const dialogRef = this.dialog.open(ExternalLinkComponent, {
        width: '50%',
        height: '38%',
        maxWidth: this.screenWidth + 'px',
        maxHeight: this.screenHeight + 'px',
        disableClose: true,
        data: {
          // doc: this.tocWICDdocList,
          isHeader: false,
          titleName: item.content.title,
          externalUrl: item.content.contentUrl,
          update: true,
        },
      });

      dialogRef.afterClosed().subscribe((result) => {


        if (result && result !== 'No') {

          if (result.popUp=='externalLink'){
            console.log(result)
            console.log(item)
            result['tableOfContentTocid'] = item.content.tableOfContentTocid
            this.tocService
              .updateHeaderTOC(result)
              .subscribe((res) => {

                item.content.title = res['title'];
                item.content.contentUrl = res['contentUrl'];


              });

          }
          else {
            let addedDetails = {
              item: result.title,
              parentItem: item,
              assetType: 'Link',
            };
            this.item.content.title = result.title;
            this.item.content.contentUrl = result.contentUrl;
            this.saveHeader(item);
            if (!this.showPlus) {
              this.childExpandState = true;
              this.showPlus = true;
            }
            this.eksListEvent.emit(addedDetails);
          }



        }
      });
    }
  }

  saveHeader(item) {
    item.content.isEdit = false;
    let req = {
      tableOfContentTocid: item.content.tableOfContentTocid,
      title: item.content.title,
      contentUrl: item.content.contentUrl,
    };
    this.subscription = this.tocService
      .updateHeaderTOC(req)
      .subscribe((res) => { });
  }

  checkContentType(item) {
    if (item.content.assetType === 'WI' || item.content.assetType === 'I') {
      return 'draged-list-wi';
    } else if (
      item.content.assetType === 'AP' ||
      item.content.assetType === 'A'
    ) {
      return 'draged-list-ap';
    } else if (
      item.content.assetType === 'CG' ||
      item.content.assetType === 'C'
    ) {
      return 'draged-list-cg';
    } else if (
      item.content.assetType === 'GB' ||
      item.content.assetType === 'G'
    ) {
      return 'draged-list-gb';
    } else if (
      item.content.assetType === 'RC' ||
      item.content.assetType === 'R'
    ) {
      return 'draged-list-rc';
    } else if (
      item.content.assetType === 'KP' ||
      item.content.assetType === 'K'
    ) {
      return 'draged-list-kp';
    } else if (
      item.content.assetType === 'DS' ||
      item.content.assetType === 'S'
    ) {
      return 'draged-list-ds';
    } else if (
      item.content.assetType === 'TOC' ||
      item.content.assetType === 'ToC' ||
      item.content.assetType === 'T'
    ) {
      return 'draged-list-toc';
    }
    else if ( item.content.assetType === 'SP' || item.content.assetType === 'P') {
      return 'draged-list-sp';
    }
    else if (  item.content.assetType === 'SF' || item.content.assetType === 'F') {
      return 'draged-list-sf';
    }
    return '';
  }
  handleInput(event: KeyboardEvent): void {
    event.stopPropagation();
  }

  navigationLink(linkUrl) {
    window.open(linkUrl, '_blank');
  }

  canDrop(draggedItem, newContainer) {
    const draggedContentId = draggedItem?.content?.contentId;
    return newContainer?.every(item => {
      const itemContentId = item?.content?.contentId;
      if ( !itemContentId || !draggedContentId ) {
        return true;
      }
      return itemContentId !== draggedContentId || item.id === draggedItem.id;
    });
  }
}
