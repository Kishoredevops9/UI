
import {
  Component,
  OnInit,
  ViewEncapsulation,
  Inject,
  Input,
  ViewChild,
  Output,
  EventEmitter,
  ViewContainerRef,
  ComponentFactory,
  ComponentFactoryResolver,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { debounce } from '@agentepsilon/decko';
import { Item, WICDdocList } from '../../../activity-page.model';
import { MatMenuTrigger } from '@angular/material/menu';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { TocService } from '@app/toc/toc.service';
import { MatDialog } from '@angular/material/dialog';
import { AddonsPopupComponent } from '@app/activity-page/activity-details/activity-components/addons-popup/addons-popup.component';
import { AddGuidanceComponent } from '@app/activity-page/activity-details/activity-components/add-guidance/add-guidance.component';
import { ContentDetailsComponent } from '@app/activity-page/activity-details/activity-components/content-details/content-details.component';
// import { ExternalLinkComponent } from '..';
import { documentPath, oldContentTypeCode } from '@environments/constants';
import { ActivityPageService } from '../../../activity-page.service';
import { ContentCommonService } from '@app/shared/content-common.service';
import { SharedService } from '@app/shared/shared.service';
import { ExternalLinkComponent } from '@app/toc/toc-details/toc-toc/external-link/external-link.component';
import { I } from '@angular/cdk/keycodes';
import { ASSET_STATUSES } from '@environments/constants';
import { RecordsService } from '../../../../shared/records.service';


@Component({
  selector: 'app-activity-drag-drop',
  templateUrl: './activity-drag-drop.component.html',
  styleUrls: ['./activity-drag-drop.component.scss'],
})
export class ActivityDragDropComponent implements OnInit {
  ASSET_STATUSES = ASSET_STATUSES;
  public contentForUpdate: any;

  itemAdded: any = false;
  @Input() nodes: Item[];
  @Input() bindData;
  @Output() dragDropData = new EventEmitter();
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
  isEditableMode: boolean = true;
  @Input() docStatus;
  @Output() eksListEvent = new EventEmitter();
  @Output() deleteComponentEvent = new EventEmitter();
  @Output() updateEntireIndex = new EventEmitter();
  @ViewChild('contentDetails', { read: ViewContainerRef }) rowContainers;
  publishedValue: boolean = false;
  expanded: boolean = false;
  private subscription: Subscription;
  content = [];
  activityData: any = [];
  isLoading: boolean = false;
  blockExpansion = true;
  showPlus: boolean = true;
  draDropValue: any;

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
  public screenWidth: any;
  public screenHeight: any;
  @Output() panelExpandCollapseEvent = new EventEmitter();

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private tocService: TocService,
    private activityPageService: ActivityPageService,
    private contentCommonService: ContentCommonService,
    public dialog: MatDialog,
    private resolver: ComponentFactoryResolver,
    private sharedService: SharedService,
    private rservice: RecordsService,

  ) {
    this.nodes && this.prepareDragDrop(this.nodes);
  }


  ngOnInit(): void {

    this.nodes && this.prepareDragDrop(this.nodes);
    this.prepareDragDrop(this.nodes);
  this.sharedService.dragDropAP.subscribe(draDropValue => {
    this.isEditableMode =  draDropValue;
   console.log("ngOnInit", this.isEditableMode);
   if(this.docStatus === ASSET_STATUSES.PUBLISHED || this.docStatus === ASSET_STATUSES.CURRENT || this.docStatus === ASSET_STATUSES.OBSOLETE || this.docStatus === ASSET_STATUSES.APPROVED_WAITING_FOR_JC){
    this.isEditableMode=false;
  }
});

if(this.isEditableMode==undefined){
  this.isEditableMode=true;
}
console.log('this.nodes', this.nodes)

  }

  ngOnChanges(event) {
    if(this.docStatus === ASSET_STATUSES.PUBLISHED || this.docStatus === ASSET_STATUSES.CURRENT || this.docStatus === ASSET_STATUSES.OBSOLETE || this.docStatus === ASSET_STATUSES.APPROVED_WAITING_FOR_JC){
      this.isEditableMode=false;
    } else {
      this.isEditableMode=true;
    }
    this.prepareDragDrop(this.nodes);
    if (event.bindData && event.bindData.currentValue == true) {
      this.prepareDragDrop(this.nodes);
      // this.isEditableMode = false;
    }
    // console.log("ngOnChanges", this.isEditableMode);
  }

  prepareDragDrop(nodes: Item[]) {
    nodes.forEach((node) => {
      this.dropTargetIds.push(node.id);
      this.nodeLookup[node.id] = node;
      this.prepareDragDrop(node.children);
    });
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

    if (!this.isEditableMode) {
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


   this.sharedService.apDragDropData(this.nodes);
    //  console.log( JSON.stringify(   Param))
    this.isLoading = true;
    this.activityPageService.updateActivityList(Param).subscribe((data) => {
      //   console.log(data)
      this.isLoading = false;
    }, (err) => {
      this.isLoading = false;
      //   console.log(err)
    })

  }

  DataChangeValue($arg, $parentActivityContainerId) {
    $arg.map((node) => {
      for (const property in node.content) {
        node[property] = node.content[property]
      }
      if (node.children) {
        this.DataChangeValue(node.children, node.activityContainerId)
      }
      node['parentActivityContainerId'] = $parentActivityContainerId;
      node['childList'] = node.children;
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
  // onContextMenuExternal(parentItem, isHeader) {
  //   const dialogRef = this.dialog.open(ExternalLinkComponent, {
  //     width: '50%',
  //     height: '38%',
  //     maxWidth: this.screenWidth + 'px',
  //     maxHeight: this.screenHeight + 'px',
  //     disableClose: true,
  //     data: {
  //       isHeader: isHeader,
  //     },
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result && result !== 'No') {
  //       let assetType = '';
  //       let item: any;
  //       let tocIdValue: any = '';
  //       if (result.popUp == 'externalLink') {
  //         assetType = 'Link';
  //         item = result;
  //       } else {
  //         assetType = 'Header';
  //         item = result;
  //         let chilArray = parentItem.children.filter((parent) => {
  //           return parent.content.assetType == 'Header';
  //         });
  //         let parentTocId = parentItem.content.tocid;
  //         let regExp = /\./;
  //         let value = parentTocId.match(regExp);
  //         if (value != null) {
  //           const childLength = `${parentTocId}.${chilArray.length + 1}`;
  //           tocIdValue = childLength.toString();
  //         } else {
  //           let constantValue = 0.1 + Number(`0.${chilArray.length}`);
  //           const childLength = Number(parentTocId) + Number(constantValue);
  //           tocIdValue = childLength.toString();
  //         }
  //       }
  //       let addedDetails = {
  //         item: item,
  //         parentItem: parentItem,
  //         assetType: assetType,
  //         childTocId: tocIdValue,
  //       };
  //       if (!this.showPlus) {
  //         this.childExpandState = true;
  //         this.showPlus = true;
  //       }
  //       this.eksListEvent.emit(addedDetails);
  //     }
  //   });
  // }
  expandChildItemDetails(item, action) {
    this.expanded = !this.expanded;
    if (action === 'collapse') {
      this.rowContainers.clear();
    } else {
      this.rowContainers.clear();
      const container = this.rowContainers;
      const factory: ComponentFactory<any> =
        this.resolver.resolveComponentFactory(ContentDetailsComponent);
      const inlineComponent = container.createComponent(factory);
      inlineComponent.instance.contentInfo = item.content;
      inlineComponent.instance.docStatus = this.docStatus;
    }
  }
  myButton(item) {
    this.rowContainers.clear();
    const container = this.rowContainers;
    const factory: ComponentFactory<any> =
      this.resolver.resolveComponentFactory(ContentDetailsComponent);
    const inlineComponent = container.createComponent(factory);
    inlineComponent.instance.contentInfo = item.content;
    inlineComponent.instance.docStatus = this.docStatus;
  }


  deleteItem(item) {
    this.deleteComponentEvent.emit(item);
    this.nodes && this.prepareDragDrop(this.nodes);
  }

  deleteComponent(item) {
    this.deleteComponentEvent.emit(item);
    this.nodes && this.prepareDragDrop(this.nodes);
  }

  // eksList(item) {
  //   this.eksListEvent.emit(item);
  // }

  panelExpandCollapse(state) {
    this.showPlus = state;
    this.panelExpandCollapseEvent.emit(state);
    this.childExpandState = state;
  }

  headerStyle(parent): string {
    if (!parent.name) {
      return 'header-content';
    }
    return '';
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
    this.rservice.UpdateBroadcastMessage('true');
    console.log(' edit ext link',item);
    if (item.content.contentType != 'EX') {
      item.content.isEditableMode = true;
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
          externalUrl: item.content.url,
          url: item.content.url,
          update: true,
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        this.rservice.UpdateBroadcastMessage('false');

        if (result && result !== 'No') {
          let addedDetails = {
            item: result.title,
            parentItem: item,
            assetType: 'Link',
            url: result.url,
          };
          console.log(' edit ext link', item);
          console.log(' item.content', item.content);
          item.content.title = result.title;
          item.content.url = result.contentUrl;
          //item.content.url = result.url;

          this.saveHeader(item);
          if (!this.showPlus) {
            this.childExpandState = true;
            this.showPlus = true;
          }
          this.eksListEvent.emit(addedDetails);
        }
      });
    }
  }

  saveHeader(item) {
    item.content.isEditableMode = false;

    let req = {
      activityContainerId: item?.content?.activityContainerId,
      title: item?.content?.title,
      url: item?.content?.url
    };
    this.isLoading = true;
    this.activityPageService
      .updateExternalLink(req)
      .subscribe((data) => {
        item.content.originalItem.title = item.content.title;
        item.content.originalItem.url = item.content.url;
        this.isLoading = false;
      }, () => {
        this.isLoading = false;
      });
  }

  checkContentType(item) {
    if (item.content.contentType === 'WI' || item.content.contentType === 'I') {
      return 'draged-list-wi';
    } else if (
      item.content.contentType === 'AP' ||
      item.content.contentType === 'A'
    ) {
      return 'draged-list-ap';
    } else if (
      item.content.contentType === 'CG' ||
      item.content.contentType === 'C'
    ) {
      return 'draged-list-cg';
    } else if (
      item.content.contentType === 'SF' ||
      item.content.contentType === 'F'
    ) {
      return 'draged-list-sf';
    } else if (
      item.content.contentType === 'SP' ||
      item.content.contentType === 'P' ||
      item.content.contentType === 'M'
    ) {
      return 'draged-list-sp';
    }
    else if (
      item.content.contentType === 'GB' ||
      item.content.contentType === 'G'
    ) {
      return 'draged-list-gb';
    } else if (
      item.content.contentType === 'RC' ||
      item.content.contentType === 'R'
    ) {
      return 'draged-list-rc';
    } else if (
      item.content.contentType === 'KP' ||
      item.content.contentType === 'K'
    ) {
      return 'draged-list-kp';
    } else if (
      item.content.contentType === 'DS' ||
      item.content.contentType === 'S'
    ) {
      return 'draged-list-ds';
    } else if (
      item.content.contentType === 'TOC' ||
      item.content.contentType === 'ToC' ||
      item.content.contentType === 'T'
    ) {
      return 'draged-list-toc';
    }
    else if (
      item.content.contentType === 'EX' ||
      item.content.contentType === 'EX' ||
      item.content.contentType === 'EX'
    ) {
      return 'draged-list-ex';
    }
    return '';
  }
  handleInput(event: KeyboardEvent): void {
    event.stopPropagation();
  }

  navigationLink(linkUrl) {
    window.open(linkUrl, '_blank');
  }


  handleOnContentIDClick(contentData) {
    let element = contentData.content;
    const contID = element.assetContentId || element.contentNo;
    //let contentType = (element.contentType == "I") ? "WI" : (element.contentType == "G") ? "GB" : (element.contentType == "S") ? "DS" : (element.contentType == "A") ? "AP" : (element.contentType == "C") ? "CG" : (element.contentType == "K") ? "KP" : (element.contentType == "R") ? "RC" : (element.contentType == "T") ? "TOC" : '';
    sessionStorage.setItem('componentType', element.contentType);
    sessionStorage.setItem('contentNumber', contID);
    sessionStorage.setItem('contentType', 'published');
    sessionStorage.setItem('version', contentData.content.version);

    if (element.contentType == 'I' || element.contentType == 'G' || element.contentType == 'S' || element.contentType == 'D' || element.contentType == "WI" || element.contentType == "GB" || element.contentType == "DS") {
      //this.router.navigate([documentPath.publishViewPath, contID]);
      window.open('view-document/' + contID, '_blank');
    } else if (element.contentType === 'M' || element.contentType === 'Map') {
      //this.router.navigate(['/process-maps/edit', contID]);
      window.open('/process-maps/edit' + contID, '_blank');
    } else if (element.contentType === 'F' || element.contentType === 'SF') {
      // this.router.navigate(['/process-maps/create-progressmap', contID]);
      window.open('/process-maps/create-progressmap' + contID, '_blank');
    }
    // else {
    //   //var assetTypecode = (element.contentType === 'A') ? "AP" : (element.contentType === 'K') ? "KP" : (element.contentType === 'T') ? "TOC" : (element.contentType === 'R') ? "RC" : (element.contentType === 'C') ? "CG" : '';
    //   // this.router.navigate([documentPath.publishViewPath, element.contentType, contID]);
    //   window.open('view-document/' + element.contentType + '/' + contID, '_blank');
    // }
    else if (element.contentType === 'A' || element.contentType === 'AP' || element.contentType === 'K' || element.contentType === 'KP' || element.contentType === 'T' || element.contentType === 'TOC' || element.contentType === 'R' || element.contentType === 'RC' || element.contentType === 'C' || element.contentType === 'CG') {
      //var assetTypecode = (element.contentType === 'A') ? "AP" : (element.contentType === 'K') ? "KP" : (element.contentType === 'T') ? "TOC" : (element.contentType === 'R') ? "RC" : (element.contentType === 'C') ? "CG" : '';
      // this.router.navigate([documentPath.publishViewPath, element.contentType, contID]);
      window.open('view-document/' + element.contentType + '/' + contID, '_blank');
    }else{
      if(contentData.name =="EX"){
        window.open(contentData.content.url,'_blank');
      }

    }
  }
  // add guidance

  addGuidance(type) {
    const dialogRef = this.dialog.open(AddGuidanceComponent, {
      width: '38%',
      height: '50%',
      maxWidth: '900%',
      data: {
        data: type,
        // ctContentId: this.ctContentId,
        // ctTitle: this.ctTitle,
        // ctDescription: this.ctDescription,

      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("result", result);



    });
  }

}
