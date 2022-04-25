import { CdkDragDrop } from '@angular/cdk/drag-drop';
import {
  Component, EventEmitter, Input, Output, OnInit, ViewContainerRef, ComponentFactory, ViewChildren, ViewChild,
  ComponentFactoryResolver,
  SimpleChange
} from '@angular/core';
import { TocService } from '@app/toc/toc.service';
import { Subscription } from 'rxjs';
import {
  Item, WICDdocList
} from '@app/toc/toc.model';
import { Router } from '@angular/router';
import { MatMenuTrigger } from "@angular/material/menu";
import { AddonsPopupComponent } from '@app/activity-page/activity-details/activity-components/addons-popup/addons-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { ExternalLinkComponent } from '@app/toc/toc-details/toc-toc/external-link/external-link.component';
import { Constants, documentPath, oldContentTypeCode, contentTypeCode } from '@environments/constants';

@Component({
  selector: 'app-toc-list-item',
  templateUrl: './toc-list-item.component.html',
  styleUrls: ['./toc-list-item.component.scss']
})
export class TocListItemComponent implements OnInit {
  @Input() item: Item;
  @Input() parentItem?: Item;
  @Input() public set connectedDropListsIds(ids: string[]) {
    this.allDropListsIds = ids;
  }
  // @Input() allExpandState;
  @Input() childExpandState = true;
  @Input() isEditableMode;
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

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
  public screenWidth: any;
  public screenHeight: any;
  @Output() deleteComponentEvent = new EventEmitter();
  @Output() panelExpandCollapseEvent = new EventEmitter();
  @Output() itemDrop: EventEmitter<CdkDragDrop<Item>>
  @Output() eksListEvent = new EventEmitter();
  @Output() updateEntireIndex = new EventEmitter();
  constructor(private router: Router,
    private tocService: TocService,
    public dialog: MatDialog) {
    this.allDropListsIds = [];
    this.itemDrop = new EventEmitter();
  }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
  }



  onDragDrop(event: CdkDragDrop<Item, Item>): void {
    this.showPlus = true;
    this.childExpandState = true;
    this.itemDrop.emit(event);
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

    let contentTypeValue = (contentType == "I" || contentType == "WI") ? "WI" : (contentType == "G" || contentType == "GB") ? "GB" : (contentType == "S" || contentType == "DS") ? "DS" : (contentType == "A" || contentType == "AP") ? "AP" : (contentType == "C" || contentType == "CG") ? "CG" : (contentType == "K" || contentType == "KP") ? "KP" : (contentType == "R" || contentType == "RC") ? "RC" : (contentType == "T" || contentType == "ToC" || contentType == "TOC") ? "TOC" : '';
    sessionStorage.setItem('componentType', contentTypeValue);
    sessionStorage.setItem('contentNumber', id);
    sessionStorage.setItem('contentType', 'published');
    sessionStorage.setItem('redirectUrlPath', 'search');
    sessionStorage.setItem('statusCheck', 'true');

    if (contentTypeValue === oldContentTypeCode.workInstruction || contentType === oldContentTypeCode.designStandard || contentType === oldContentTypeCode.guideBook) {
      //this.router.navigate([documentPath.publishViewPath, id]);
      window.open(documentPath.publishViewPath + '/' + id, '_blank');
    } else {
      //this.router.navigate([documentPath.publishViewPath, contentTypeValue, id]);
      window.open(documentPath.publishViewPath + '/' + contentTypeValue + '/' + id, '_blank');
    }

  }

  editItem(item) {
    if (item.content.assetType != 'Link') {
      item.content.isEdit = true;
    } else {
      const dialogRef = this.dialog.open(ExternalLinkComponent, {
        width: "50%",
        height: "38%",
        maxWidth: this.screenWidth + "px",
        maxHeight: this.screenHeight + "px",
        disableClose: true,
        data: {
          // doc: this.tocWICDdocList,
          isHeader: false,
          titleName: item.content.title,
          externalUrl: item.content.contentUrl,
          update: true
        }
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result && result !== 'No') {

          // this.header = result;
          // let content = {
          //   title: result,
          //   toctype: true
          // }
          // let parentEle = {
          //   name: 'Header',
          //   content: content,
          //   children: []
          // }
          let addedDetails = {
            item: result.title,
            parentItem: item,
            assetType: 'Link'
          }
          this.item.content.title = result.title;
          this.item.content.contentUrl = result.contentUrl;
          this.saveHeader(item);
          if(!this.showPlus) {
            this.childExpandState = true;
            this.showPlus = true;
          }
          this.eksListEvent.emit(addedDetails);
        }

      });
    }
  }

  saveHeader(item) {
    item.content.isEdit = false;
    let req = {
      tableOfContentTocid: item.content.tableOfContentTocid,
      title: item.content.title,
      contentUrl: item.content.contentUrl
    }
    this.subscription = this.tocService
      .updateHeaderTOC(req)
      .subscribe((res) => {

      });
  }

  checkContentType(item) {
    if (item.content.assetType === 'WI' || item.content.assetType === 'I') {
      return 'draged-list-wi';
    } else if (item.content.assetType === 'AP' || item.content.assetType === 'A') {
      return 'draged-list-ap';
    } else if (item.content.assetType === 'CG' || item.content.assetType === 'C') {
      return 'draged-list-cg';
    } else if (item.content.assetType === 'GB' || item.content.assetType === 'G') {
      return 'draged-list-gb';
    } else if (item.content.assetType === 'RC' || item.content.assetType === 'R') {
      return 'draged-list-rc';
    } else if (item.content.assetType === 'KP' || item.content.assetType === 'K') {
      return 'draged-list-kp';
    } else if (item.content.assetType === 'DS' || item.content.assetType === 'S') {
      return 'draged-list-ds';
    } else if (item.content.assetType === 'TOC' || item.content.assetType === 'ToC' || item.content.assetType === 'T') {
      return 'draged-list-toc';
    }
    return '';
  }
  handleInput(event: KeyboardEvent): void {
    event.stopPropagation();
  }

  navigationLink(linkUrl) {
    window.open(linkUrl, '_blank');
  }

  onContextMenu(event: MouseEvent, item: Item) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { 'item': item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  onContextMenuEKS(item) {
    this.addAddOns(item);
  }

  onContextMenuExternal(parentItem, isHeader) {
    const dialogRef = this.dialog.open(ExternalLinkComponent, {
      width: "50%",
      height: "38%",
      maxWidth: this.screenWidth + "px",
      maxHeight: this.screenHeight + "px",
      disableClose: true,
      data: {
        // doc: this.tocWICDdocList,
        isHeader: isHeader
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result !== 'No') {

        // this.header = result;
        // let content = {
        //   title: result,
        //   toctype: true
        // }
        // let parentEle = {
        //   name: 'Header',
        //   content: content,
        //   children: []
        // }
        let assetType = '';
        let item: any;
        let tocIdValue: any = '';
        if (result.popUp == 'externalLink') {
          assetType = 'Link';
          item = result;
        } else {
          assetType = 'Header';
          item = result;
          let chilArray = parentItem.children.filter(parent => {
            return parent.content.assetType == "Header"
          })
          let parentTocId = parentItem.content.tocid;
          let regExp = /\./;
          let value = parentTocId.match(regExp);
          if(value != null) {
            const childLength = `${parentTocId}.${chilArray.length + 1}`;
            tocIdValue = childLength.toString();
          } else {
            let constantValue = 0.1 + Number(`0.${chilArray.length}`);
            const childLength = Number(parentTocId) +  Number(constantValue);
            tocIdValue = childLength.toString();
          }
        }
        let addedDetails = {
          item: item,
          parentItem: parentItem,
          assetType: assetType,
          childTocId: tocIdValue
        }
        if(!this.showPlus) {
          this.childExpandState = true;
          this.showPlus = true;
        }
        this.eksListEvent.emit(addedDetails);
      }

    });
  }

  addAddOns(parentItem) {
    const dialogRef = this.dialog.open(AddonsPopupComponent, {
      width: "90%",
      height: "85%",
      maxWidth: this.screenWidth + "px",
      maxHeight: this.screenHeight + "px",
      data: {
        // doc: this.tocWICDdocList,
        ctContentId: '',
        ctTitle: '',
        ctDescription: '',
        type: "",
        message: 'ADD ONS',
        showEksPanel: false,
        disableObsoleteDocuments: true
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result !== 'No') {
        if (result && result.length) {
          result.forEach(element => {
            element.componenttype = element.assettypecode.toUpperCase();
            element.assetType = element.assettypecode.toUpperCase();
            element.contentId = element.contentnumber;
            element.toctype = false;
            let wICDdocListChild = new WICDdocList();

          });
          let addedDetails = {
            item: result,
            parentItem: parentItem,
            type: 'eks'
          }
          if(!this.showPlus) {
            this.childExpandState = true;
            this.showPlus = true;
          }
          this.eksListEvent.emit(addedDetails);
        }
      }
    });
  }
}

