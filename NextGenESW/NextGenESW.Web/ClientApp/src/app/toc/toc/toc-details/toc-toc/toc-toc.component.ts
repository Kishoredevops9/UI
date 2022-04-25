import { Component, OnInit, Input, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  CdkDragDrop,
  moveItemInArray,
  CdkDragEnter, CdkDragExit
} from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, Subscription } from 'rxjs';
import { tocWICDdocList, Item, componentMessages, WICDdocList } from '@app/toc/toc.model';
import { TocService } from '@app/toc/toc.service';
import { AddonsPopupComponent } from '@app/activity-page/activity-details/activity-components/addons-popup/addons-popup.component';
import { ExternalLinkComponent } from '@app/toc/toc-details/toc-toc/external-link/external-link.component';
import { ConfirmDeleteComponent } from '@app/activity-page/activity-details/activity-components/confirm-delete/confirm-delete.component';
import { ActivityPageService } from '@app/activity-page/activity-page.service';
import { SharedService } from '@app/shared/shared.service';
import { ContentCommonService } from '@app/shared/content-common.service';
import { assetTypeConstantValue } from '@environments/constants';
import { AddonsPopupSearchComponent } from '@app/shared/component/addons-popup-search/addons-popup-search.component';

@Component({
  selector: 'app-toc-toc',
  templateUrl: './toc-toc.component.html',
  styleUrls: ['./toc-toc.component.scss']
})
export class TocTocComponent implements OnInit {
  eventsSubject: Subject<void> = new Subject<void>();
  @Input() disableForm: boolean;
  private subscription: Subscription;
  items = [];
  contentSelected: boolean = false;
  type: any;
  ctContentId: any = '';
  ctTitle: any = '';
  ctDescription: any = '';
  header: any;
  rootElement: any;
  id;
  contentId: string = '';
  contentNo;
  tocTabData;
  isLoading: boolean = false;
  childNode = [];
  tableOfContentTocid: number;
  activityPageComponentId: number;
  // tocWICDdocList: tocWICDdocList[];
  public parentItem: Item;
  public contentForUpdate: any;
  movedElement: any;
  panelOpenState: boolean = false;
  allExpandState = true;
  isEditableMode: boolean = false;
  mode: any = 'Edit';
  contentTypes: any;
  contentTypeTOC: string = 'TOC';
  itemAdded: any = false;
  docStatus: number = 1;
  public screenWidth: any;
  public screenHeight: any;
  version: string;
  status: string;
  @Input() globalData;
  bindData = false;
  public get connectedDropListsIds(): string[] {
    return this.getIdsRecursive(this.parentItem).reverse();
  }

  getIdsRecursive(item: Item): string[] {
    let ids = [item.uId];
    if (item.children) {
      item.children.forEach((childItem) => { ids = ids.concat(this.getIdsRecursive(childItem)) });
    }
    return ids;
  }

  constructor(private route: ActivatedRoute,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private tocService: TocService,
    private activityPageService: ActivityPageService,
    private contentCommonService: ContentCommonService,
    private sharedService: SharedService) {
    const wICDdocList = new WICDdocList();
    wICDdocList.title = '';
    this.parentItem = new Item({ name: '', content: wICDdocList });
  }

  emitEventToChild() {
    this.eventsSubject.next();
  }

  ngOnInit(): void {
    this.itemAdded = false;
    this.contentSelected = false;
    this.items = ['EKS Addons'];
    this.subscription = this.tocService
      .getContentTypes()
      .subscribe((res) => {
        this.contentTypes = res;
        this.sharedService.contentType = res;
      });

    this.route.params.subscribe((param) => {
      //console.log("param toc toc", param);
      this.route.queryParams.subscribe(urlParam => {

        if (urlParam && urlParam['id'] && urlParam['id'] > 0) {
          this.id = (urlParam['id'] && urlParam['id'] > 0) ? urlParam['id'] : 0;
          this.contentTypeTOC = (urlParam['contentType']) ? urlParam['contentType'] : 'KP';
          this.version = (urlParam['version']) ? urlParam['version'] : sessionStorage.getItem('version');
          this.status = (urlParam['status']) ? urlParam['status'].toLowerCase() : 'draft';
          this.contentId = param['contentId'] ? param['contentId'] : '';
        } else if (param['contentId']) {
          this.id = param['contentId'];
          this.contentId = param['contentId'] ? param['contentId'] : '';
          this.version = param['version'] ? param['version'] : sessionStorage.getItem('version');
        } else if (param['id']) {
          this.id = param['id'] ? param['id'] : 0;
        }
      });

    });

    if (this.id) {
      this.loadTOCTOCData();
    } else {
      this.type = 'ToC';
      sessionStorage.setItem('statusCheck', "false");
    }

    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
  }

  ngOnChanges(event) {
    if (
      event.globalData.currentValue &&
      event.globalData.previousValue != event.globalData.currentValue
    ) {
      if (!(Object.keys(this.globalData).length === 0)) {
        this.docStatus = event.globalData.currentValue.assetStatusId;
        this.isEditableMode = false;
      }
    }
  }


  renderTree() {
    if (this.tocTabData && this.tocTabData.content) {
      this.tocTabData.content.forEach(childL1 => {
        if (childL1.childList && childL1.childList.length) {
          this.hasChildList(childL1);
          let wICDdocList = new WICDdocList();
          wICDdocList = this.renderItem(wICDdocList, childL1);

          this.parentItem.children.push(new Item({
            name: this.childNode[0].content.assetType,
            content: this.childNode[0].content,
            children: this.childNode[0].children
          }));
          this.childNode = [];
        } else {
          let wICDdocList = new WICDdocList();
          wICDdocList = this.renderItem(wICDdocList, childL1);

          this.parentItem.children.push(new Item({
            name: wICDdocList.assetType,
            content: wICDdocList,
            children: []
          }));
        }
      });
    }
  }

  hasChildList(element) {
    let childArray = [];
    let hasSiblings = element.childList.length;
    element.childList.forEach(childL1 => {
      this.placeNode(element, childL1);
      if (childL1.childList && childL1.childList.length) {
        this.hasChildList(childL1);
      }
    });
  }

  placeNode(parent, child) {
    let childElement = [];
    let wICDdocList = new WICDdocList();
    wICDdocList = this.renderItem(wICDdocList, parent);

    let wICDdocListChild = new WICDdocList();
    wICDdocListChild = this.renderItem(wICDdocListChild, child);
    childElement.push(new Item({ name: wICDdocListChild.assetType, content: wICDdocListChild, children: [] }));

    if (this.childNode.length > 0) {
      this.setParent(this.childNode, child);

    } else {
      this.childNode.push(new Item({ name: wICDdocList.assetType, content: wICDdocList, children: childElement }));
    }

  }
  setParent(data, child) {
    // data.children = parent;
    if (data) {
      data.forEach(x => {
        if (x.content.tableOfContentTocid !== child.parentTableOfContentTocid) {
          this.setParent(x.children, child);
        } else {
          let wICDdocListChild = new WICDdocList();
          wICDdocListChild = this.renderItem(wICDdocListChild, child);
          x.children.push(new Item({ name: wICDdocListChild.assetType, content: wICDdocListChild, children: [] }));
          return;
        }
      });
    }
    else {
      if (data.content.tableOfContentTocid === child.parentTableOfContentTocid) {
        let wICDdocListChild = new WICDdocList();
        wICDdocListChild = this.renderItem(wICDdocListChild, child);
        data[0].children.push(new Item({ name: wICDdocListChild.assetType, content: wICDdocListChild, children: [] }));
      }
    }
  }

  renderChild(childList, child) {
    let wICDdocList = new WICDdocList();
    wICDdocList = this.renderItem(wICDdocList, child);
    childList.push(new Item({ name: wICDdocList.assetType, content: wICDdocList }));

    return childList;
  }

  renderItem(wICDdocList, element) {
    // this.tocWICDdocList = this.tocWICDdocList.filter((existingChild) => {
    //   if (existingChild.title !== element.title) {
    //     return element;
    //   }
    // });

    if (element.toctype && !element.assetType) {
      wICDdocList.assetType = 'Header';
    } else {
      // if (Number(element.contentTypeId) == 1) {
      //   wICDdocList.contentType = 'WI';
      // } else if (Number(element.contentTypeId) == 2) {
      //   wICDdocList.contentType = 'GB';
      // } else if (Number(element.contentTypeId) == 6) {
      //   wICDdocList.contentType = 'AP';
      // } else if (Number(element.contentTypeId) == 5) {
      //   wICDdocList.contentType = 'RD';
      // } else if (Number(element.contentTypeId) == 10) {
      //   wICDdocList.contentType = 'CG';
      // } else if (Number(element.contentTypeId) == 11) {
      //   wICDdocList.contentType = 'ToC';
      // } else if (Number(element.contentTypeId) == 12) {
      //   wICDdocList.contentType = 'RC';
      // }
      if (element.assetType == "Header" || element.assetType == "Link") {
        wICDdocList.assetType = element.assetType;
      } else {
        wICDdocList.assetType = assetTypeConstantValue(element.assetType);
      }
    }

    wICDdocList.isEdit = false;
    wICDdocList.tableOfContentTocid = element.tableOfContentTocid;
    wICDdocList.tocid = element.tocid;
    wICDdocList.contentId = element.contentId;
    wICDdocList.tableOfContentId = element.tableOfContentId;
    wICDdocList.createdUser = element.createdUser;
    wICDdocList.createdDateTime = element.createdDateTime;
    wICDdocList.effectiveFrom = element.effectiveFrom;
    wICDdocList.lastUpdateDateTime = element.lastUpdateDateTime;
    wICDdocList.lastUpdateUser = element.lastUpdateUser;
    wICDdocList.parentTableOfContentTocid = element.parentTableOfContentTocid;
    wICDdocList.title = element.title;
    wICDdocList.contentUrl = element.contentUrl;
    wICDdocList.version = element.version;
    return wICDdocList;
  }

  addNewItem(wICDdocList, element) {
    // this.tocWICDdocList = this.tocWICDdocList.filter((existingChild) => {
    //   if (existingChild.title !== element.title) {
    //     return element;
    //   }
    // });
    wICDdocList.assetType = element.componenttype;
    wICDdocList.assetTypeId = element.contenttypeid;
    element.toctype = false;
    wICDdocList.isEdit = false;
    wICDdocList.contentId = element.contentid;
    wICDdocList.createdUser = localStorage.getItem("userMail");;
    wICDdocList.createdDateTime = new Date();
    wICDdocList.effectiveFrom = element.lastupdate;
    wICDdocList.lastUpdateDateTime = new Date();
    wICDdocList.lastUpdateUser = localStorage.getItem("userMail");
    wICDdocList.parentTableOfContentTocid = 0;
    wICDdocList.title = element.title;
    return wICDdocList;
  }

  selectAddOns(type) {
    this.contentSelected = true;
    this.type = type;
  }

  addAddOns(type) {
    const dialogRef = this.dialog.open(AddonsPopupComponent, {
      width: "90%",
      height: "85%",
      maxWidth: this.screenWidth + "px",
      maxHeight: this.screenHeight + "px",
      data: {
        // doc: this.tocWICDdocList,
        ctContentId: this.ctContentId,
        ctTitle: this.ctTitle,
        ctDescription: this.ctDescription,
        type: "",
        message: 'ADD ONS',
        showEksPanel: false,
        disableObsoleteDocuments: true
      }

    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result !== 'No') {
        if (result && result.length) {
          let tocId = '';
          result.forEach(element => {
            element.componenttype = element.assettypecode.toUpperCase();
            element.assetType = element.assettypecode.toUpperCase();
            element.contentId = element.contentid;
            element.toctype = false;
            let wICDdocListChild = new WICDdocList();
            wICDdocListChild = this.addNewItem(wICDdocListChild, element);
            let parentEle = { name: wICDdocListChild.assetType, content: wICDdocListChild, children: [] };
            this.onCreateComponent(
              parentEle, true, tocId
            );
          });


        }
        this._snackBar.open("'Selected Addons added in the ToC!", 'x', {
          duration: 5000,
        });
      }

    });
  }

  onOpenAddonsPopupSearch() {
    const dialogRef = this.dialog.open(AddonsPopupSearchComponent, {
      width: "90%",
      maxWidth: this.screenWidth + "px",
      maxHeight: this.screenHeight + "px",
      data: {
        // doc: this.tocWICDdocList,
        ctContentId: this.ctContentId,
        ctTitle: this.ctTitle,
        ctDescription: this.ctDescription,
        type: "",
        message: 'ADD ONS',
        showEksPanel: false,
        disableObsoleteDocuments: true
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result !== 'No') {
        if (result && result.length) {
          let tocId = '';
          result.forEach(element => {
            element.componenttype = element.assettypecode.toUpperCase();
            element.assetType = element.assettypecode.toUpperCase();
            element.contentId = element.contentid;
            element.toctype = false;
            let wICDdocListChild = new WICDdocList();
            wICDdocListChild = this.addNewItem(wICDdocListChild, element);
            let parentEle = { name: wICDdocListChild.assetType, content: wICDdocListChild, children: [] };
            this.onCreateComponent(
              parentEle, true, tocId
            );
          });


        }
        this._snackBar.open("'Selected Addons added in the ToC!", 'x', {
          duration: 5000,
        });
      }

    });
  }

  addExternalAddOns(type) {
    const dialogRef = this.dialog.open(ExternalLinkComponent, {
      width: "50%",
      height: "38%",
      maxWidth: this.screenWidth + "px",
      maxHeight: this.screenHeight + "px",
      disableClose: true,
      data: {
        isHeader: type
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result !== 'No') {
        this.header = result.contentUrl;
        let assetType = type ? 'Header' : 'Link';
        if (result.popUp == 'externalLink') {
          let tocId = '';
          let content = {
            title: result.title,
            contentUrl: result.contentUrl,
            toctype: false,
            assetType: assetType
          }
          let parentEle = {
            name: assetType,
            content: content,
            children: []
          }
          this.onCreateComponent(parentEle, true, tocId);
        } else if (result.popUp == 'addHeader') {
          this.addHeader(result);
        }
      }

    });
  }

  onCreateComponent(params, isHeader, tocId) {
    let compRequest = [];
    compRequest.push(this.componentParameters(params.content, 0, isHeader));
    compRequest[0].tocid = tocId;
    this.isLoading = true;
    this.tocService.CreateNewToc(compRequest).subscribe((data) => {
      this.itemAdded = false;
      this.header = '';
      let container = JSON.stringify(data[0]);
      let containerId = JSON.parse(container);
      this.contentForUpdate.content.push(data[0]);
      this.parentItem.children.push(new Item({ name: containerId.assetType, content: containerId }));
      this.isLoading = false;
      this.emitEventToChild()
    });
  }

  panelExpandCollapse(state) {
    this.itemAdded = state;
  }

  addHeader(event) {
    let content = {
      title: event.title,
      toctype: true,
      assetType: 'Header'
    }
    let parentEle = {
      name: 'Header',
      content: content,
      children: []
    }
    let parentArray = this.contentForUpdate.content.filter(parent => {
      return parent.assetType == "Header"
    })
    let parentTocId = parentArray.length + 1;
    this.onCreateComponent(
      parentEle, true, parentTocId.toString()
    );
  }

  onDragDrop(event: CdkDragDrop<Item>) {




    event.container.element.nativeElement.classList.remove('active');
    if (this.canBeDropped(event)) {
      const movingItem: Item = event.item.data;
      event.container.data.children.push(movingItem);
      event.previousContainer.data.children = event.previousContainer.data.children.filter((child) => child.uId !== movingItem.uId);

      event.container.data.content.tableOfContentTocid = event.container.data.content.tableOfContentTocid ? event.container.data.content.tableOfContentTocid : 0;
      this.contentForUpdate.content.forEach(element => {
        if (element.tableOfContentTocid === event.item.data.content.tableOfContentTocid) {
          this.movedElement = element;
          this.contentForUpdate.content = this.contentForUpdate.content.filter((child) => child.tableOfContentTocid !== event.item.data.content.tableOfContentTocid);

        } else {
          this.findRemovedElement(element, event.item.data.content.tableOfContentTocid, event.container.data.content.tableOfContentTocid);
        }
      });
      if (event.container.data.content.tableOfContentTocid === 0) {
        this.movedElement.parentTableOfContentTocid = 0;
        this.contentForUpdate.content.push(this.movedElement);
      } else {
        this.contentForUpdate.content.forEach(element => {
          this.updateRemovedElement(element, event.item.data.content.tableOfContentTocid, event.container.data.content.tableOfContentTocid);
        });
      }
      this.updateIndexValue(this.parentItem);


    } else {
      moveItemInArray(
        event.container.data.children,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  findRemovedElement(contentTree, movedId, movedToId) {
    if (contentTree.childList.length) {
      let index = 0;
      contentTree.childList.forEach(childL1 => {
        if (childL1.tableOfContentTocid === movedId) {
          this.movedElement = childL1;
          contentTree.childList = contentTree.childList.filter((child) => child.tableOfContentTocid !== movedId);

        } else {
          this.findRemovedElement(childL1, movedId, movedToId);
        }
      });
    }
  }

  updateRemovedElement(contentTree, movedId, movedToId) {
    if (contentTree.tableOfContentTocid === movedToId) {
      this.movedElement.parentTableOfContentTocid = contentTree.tableOfContentTocid;
      contentTree.childList.push(this.movedElement);
    }
    if (contentTree.childList.length) {
      contentTree.childList.forEach(childL1 => {
        this.updateRemovedElement(childL1, movedId, movedToId);
      });
    }
  }

  canBeDropped(event: CdkDragDrop<Item, Item>): boolean {
    const movingItem: Item = event.item.data;

    return event.previousContainer.id !== event.container.id
      && this.isNotSelfDrop(event)
      && !this.hasChild(movingItem, event.container.data);
  }

  isNotSelfDrop(event: CdkDragDrop<Item> | CdkDragEnter<Item> | CdkDragExit<Item>): boolean {
    return event.container.data.uId !== event.item.data.uId;
  }

  hasChild(parentItem: Item, childItem: Item): boolean {
    const hasChild = parentItem.children.some((item) => item.uId === childItem.uId);
    return hasChild ? true : parentItem.children.some((item) => this.hasChild(item, childItem));
  }

  onUpdateComponent() {
    // let compRequest = [];
    // let createContReq = {};

    // createContReq = this.componentParameters(params.content, params.content.parentTableOfContentTocid, false);

    // if (params.children.length) {
    //   let compRequestChildL1 = [];
    //   params.children.forEach(childL1 => {
    //     compRequestChildL1.push(this.componentParameters(childL1.content, params.content.tableOfContentTocid, false));
    //   });

    //   createContReq['ChildList'] = compRequestChildL1;
    // }
    // compRequest.push(createContReq);
    // // this.fetchParent(params);
    // this.getParent(this.childNode, movingItem);
    this.isLoading = true;
    this.tocService.updateTableOfContent(this.contentForUpdate.content).subscribe((data) => {
      let tocData = JSON.stringify(data);
      let updatedTocArray = JSON.parse(tocData);
      updatedTocArray.forEach(updatedParentNode => {
        this.parentItem.children.forEach(existingParentNode => {
          this.updateChildNode(updatedParentNode, existingParentNode);
        })
      })
      this.isLoading = false;
      // this.tocTabData.content = data;
      // this.parentItem.children = [];
      // this.childNode = [];
      // this.renderTree();
    });
  }

  componentParameters(content, parentId, isHeader) {
    let createCompReq = {};
    // createCompReq = content;

    createCompReq['parentTableOfContentTocid'] = parentId;
    createCompReq['assetType'] = content.assetType;
    createCompReq['assetTypeId'] = content.assetTypeId;
    createCompReq['contentId'] = content.contentId;
    createCompReq['version'] = content.version;
    //console.log("this.id", this.id, this.globalData.id)
    if (this.id || this.globalData && this.globalData.id > 0) {
      createCompReq['tableOfContentId'] = (this.globalData.id) ? this.globalData.id : this.tocTabData.id;
    } else {
      createCompReq['tableOfContentId'] = 0;
    }
    createCompReq['toctype'] = isHeader;
    createCompReq['createdDateTime'] = new Date();
    createCompReq['lastUpdateDateTime'] = new Date();

    if (content.assetType == 'Link') {
      createCompReq['tocid'] = null;
      createCompReq['title'] = content.title;
      createCompReq['contentUrl'] = content.contentUrl;
    } else if (content.assetType == 'Header') {
      createCompReq['tocid'] = null;
      createCompReq['title'] = this.header;
    } else {
      createCompReq['tocid'] = content.tocid;
      createCompReq['title'] = content.title;
    }
    createCompReq['createdDateTime'] = new Date();
    createCompReq['lastUpdateDateTime'] = new Date();
    createCompReq['createdUser'] = localStorage.getItem("userMail");
    createCompReq['lastUpdateUser'] = localStorage.getItem("userMail");
    return createCompReq;
  }

  getParent(element, child) {
    element.forEach(childL1 => {
      if (childL1.content.tableOfContentTocid === child.content.parentTableOfContentTocid) {
        childL1.children = childL1.children.filter((subChild) => {
          if (subChild.content.tableOfContentTocid !== child.content.tableOfContentTocid) {
            return subChild;
          }
        });
        return;
      } else {
        return;
      }
      if (childL1.children && childL1.children.length) {
        this.getParent(childL1.children, child);
      }

    });
  }
  getContentUpdateParent(element, child) {
    element.forEach(childL1 => {
      if (childL1.tableOfContentTocid === child.content.parentTableOfContentTocid) {
        childL1.childList = childL1.childList.filter((subChild) => {
          if (subChild.tableOfContentTocid !== child.content.tableOfContentTocid) {
            return subChild;
          }
        });
        return;
      }
      if (childL1.childList && childL1.childList.length) {
        this.getContentUpdateParent(child, childL1.childList);
      }

    });
  }

  deleteComponent(item) {
    if (item.children.length > 0) {
      const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
        width: '42%',
        data: {
          message: componentMessages.deleteConfirmation,
          message1: componentMessages.deleteConfirmation1
        }
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result && result != 'No') {
          this.deleteChild(item);
          this.isLoading = true;
          this.tocService.deleteTableOfContent(item.content.tableOfContentTocid).subscribe((data) => {
            this.pushChild(item);
            if (item.content.parentTableOfContentTocid == 0) {
              this.parentItem.children = this.parentItem.children.filter((subChild) => {
                if (subChild.content.tableOfContentTocid !== item.content.tableOfContentTocid) {
                  return subChild;
                }
              });
              this.contentForUpdate.content = this.contentForUpdate.content.filter((subChild) => {
                if (subChild.tableOfContentTocid !== item.content.tableOfContentTocid) {
                  return subChild;
                }
              });
            } else {
              this.getParent(this.parentItem.children, item);
              this.getContentUpdateParent(this.contentForUpdate.content, item);
            }
            this.updateIndexValue(this.parentItem);
            this.updateCreateUpdateIndexValue(this.contentForUpdate.content);
            this.isLoading = false;
            this.emitEventToChild()
          });
        }

      });
    } else {
      const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
        width: '42%',
        data: {
          message1: componentMessages.deleteConfirmation1
        }
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result && result != 'No') {
          this.isLoading = true;
          this.tocService.deleteTableOfContent(item.content.tableOfContentTocid).subscribe((data) => {
            this.pushChild(item);
            if (item.content.parentTableOfContentTocid == 0) {
              this.parentItem.children = this.parentItem.children.filter((subChild) => {
                if (subChild.content.tableOfContentTocid !== item.content.tableOfContentTocid) {
                  return subChild;
                }
              });
              this.contentForUpdate.content = this.contentForUpdate.content.filter((subChild) => {
                if (subChild.tableOfContentTocid !== item.content.tableOfContentTocid) {
                  return subChild;
                }
              });
            } else {
              this.getParent(this.parentItem.children, item);
              this.getContentUpdateParent(this.contentForUpdate.content, item);
            }
            this.updateIndexValue(this.parentItem);
            this.updateCreateUpdateIndexValue(this.contentForUpdate.content);
            this.isLoading = false;
            this.emitEventToChild()
          });
        }
      });
    }
  }

  eksList(content) {
    if (content.type == 'eks') {
      content.item.forEach(element => {
        element.componenttype = element.assettypecode.toUpperCase();
        element.assetType = element.assettypecode.toUpperCase();
        element.contentId = element.contentnumber;
        element.toctype = false;
        let wICDdocListChild = new WICDdocList();
        wICDdocListChild = this.addNewItem(wICDdocListChild, element);
        let parentEle = { name: wICDdocListChild.assetType, content: wICDdocListChild, children: [] };
        this.addSubComponent(
          parentEle, content.parentItem.content.tableOfContentTocid, false, content.parentItem, content.childTocId
        );
      });
    }
    else if (content.assetType == 'Link' || content.assetType == 'Header') {
      this.header = content.item;
      let contentVal = {
        title: (content.item.title) ? (content.item.title) : (content['parentItem']['content']['title']) ? content['parentItem']['content']['title'] : '',
        contentUrl: (content.item.contentUrl) ? (content.item.contentUrl) : (content['parentItem']['content']['contentUrl']) ? content['parentItem']['content']['contentUrl'] : '',
        toctype: false,
        assetType: content.assetType
      }
      this.header = content.item.contentUrl;
      let parentEle = {
        name: content.assetType,
        content: contentVal,
        children: []
      }
      //if (content['parentItem']['content']['tableOfContentTocid'] == 0) {
      this.addSubComponent(
        parentEle, content.parentItem.content.tableOfContentTocid, true, content.parentItem, content.childTocId
      );
      //}
    }
  }

  addSubComponent(params, parentId, isHeader, parent, childTocId) {
    let compRequest = [];
    compRequest.push(this.componentParameters(params.content, parentId, isHeader));
    compRequest[0].tocid = childTocId;
    this.isLoading = true;
    this.tocService.CreateNewToc(compRequest).subscribe((data) => {
      // data[0].tocid = childTocId;
      this.contentForUpdate.content.forEach(element => {
        if (element.tableOfContentTocid === data[0]['parentTableOfContentTocid']) {
          // element.content
          element.childList.push(data[0]);
        } else {
          this.findParentElement(element, data[0]['parentTableOfContentTocid'], data);
        }
      });

      // this.contentForUpdate.content.push(data[0]);
      this.itemAdded = false;
      this.header = '';

      let container = JSON.stringify(data[0]);
      let containerId = JSON.parse(container);
      containerId.assetType = params.content.assetType ? params.content.assetType : 'Header';
      parent.children.push(new Item({ name: containerId.assetType, content: containerId }));
      // this.onUpdateComponent();
      this.isLoading = false;
    });



  }

  findParentElement(contentTree, movedId, data) {
    if (contentTree.childList.length) {
      contentTree.childList.forEach(childL1 => {
        if (childL1.tableOfContentTocid === movedId) {
          childL1.childList.push(data[0]);

        } else {
          this.findParentElement(childL1, movedId, data);
        }
      });
    }
  }

  deleteChild(element) {
    element.children.forEach(childL1 => {
      if (childL1.childList && childL1.childList.length) {
        this.deleteChild(childL1);
      }
      this.tocService.deleteTableOfContent(childL1.content.tableOfContentTocid).subscribe((data) => {
        this.pushChild(childL1);
      });
    });
  }

  pushChild(item) {
    // if (item.content.assetType !== 'Header') {
    //   this.tocWICDdocList.push(item.content);
    // }

  }

  openCloseAllPanels() {
    this.allExpandState = !this.allExpandState
  }

  editableMode() {
    this.isEditableMode = !this.isEditableMode;
    if (this.isEditableMode) {
      this.mode = 'Done';
    } else {
      this.isLoading = true;
      this.tocService.updateTableOfContent(this.contentForUpdate.content).subscribe((data) => {
        let tocData = JSON.stringify(data);
        this.mode = 'Edit';
        this.isLoading = false;
      });
    }
  }

  loadTOCTOCData() {

    if ((this.id && this.id > 0) || (sessionStorage.getItem('contentType') && sessionStorage.getItem('contentType').toLowerCase() != 'published')) {
      this.contentNo = (this.id && this.id > 0) ? this.id : sessionStorage.getItem('documentId') ? sessionStorage.getItem('documentId') : 0;
      var documentcontentId = (this.contentId && this.contentId.length > 0) ? this.contentId : sessionStorage.getItem('documentcontentId') ? sessionStorage.getItem('documentcontentId') : '0';
      var documentversion = (this.version) ? this.version : '0';
      var documentcontentType = this.contentTypeTOC;
      var documentStatusDetails = 'draft'
    } else {
      this.contentNo = sessionStorage.getItem('documentId') ? sessionStorage.getItem('documentId') : 0;
      var documentcontentId = (this.contentId && this.contentId.length > 0) ? this.contentId : sessionStorage.getItem('contentNumber');
      var documentversion = (this.version) ? this.version : "0";
      var documentcontentType = this.contentTypeTOC;
      var documentStatusDetails = 'published'
    }

    const userEmail = sessionStorage.getItem('userMail');
    this.isLoading = true;

    if (this.id) {
      this.contentCommonService.getTableOfContentData(this.contentNo, documentcontentType, documentStatusDetails, documentcontentId, '2', userEmail).subscribe(
        (res) => {
          this.tocTabData = res;
          this.contentForUpdate = res;
          this.isLoading = false;
          this.renderTree();
          this.updateIndexValue(this.parentItem);
          this.bindData = true;
        },
        (error) => {
          this.isLoading = false;
          this.dialog.closeAll();
          console.error('There was an error!', error);
          if (error.status == 403) {
            //alert("Access Denied!");
            this.isLoading = false;
            // if (redirectionPath == "search") {
            //   this.router.navigate(['_search'], { queryParams: { q: url[2] } })
            // } else {
            //   this.router.navigate(['dashboard']);
            // }
          }
        });
    }
  }
  updateChildNode(updatedParentNode, existingParentNode) {
    if (updatedParentNode.childList.length > 0) {
      updatedParentNode.childList.forEach(updatedChildNode => {
        existingParentNode.children.forEach(existingChildNode => {
          if (updatedChildNode.childList.length > 0 && updatedChildNode.tableOfContentTocid == existingChildNode.content.tableOfContentTocid) {
            existingParentNode.content.tocid = updatedParentNode.tocid;
            this.updateChildNode(updatedChildNode, existingChildNode);
          } else if (updatedChildNode.tableOfContentTocid == existingChildNode.content.tableOfContentTocid) {
            existingParentNode.content.tocid = updatedParentNode.tocid;
            existingChildNode.content.tocid = updatedChildNode.tocid;
          }
        })
      })
    } else if (updatedParentNode.tableOfContentTocid == existingParentNode.content.tableOfContentTocid) {
      existingParentNode.content.tocid = updatedParentNode.tocid;
    }
  }
  updateIndexValue(data) { // Update Binding obj
    let index = 0;
    data.children.forEach((parent) => {
      if (parent.content.assetType == "Header") {
        index = index + 1;
        parent.content.tocid = index.toString();
        if (parent.children.length > 0) {
          this.updateChildrenValue(parent.children, parent);
        }
      }

    })
  }
  updateChildrenValue(child, parent) {
    let childIndex = 0;
    child.forEach((childnode, index) => {
      if (childnode.content.assetType == "Header") {
        childIndex = childIndex + 1;
        if (childnode.children.length == 0) {
          childnode.content.tocid = `${parent.content.tocid}.${childIndex}`;  //child parent.children.length
        } else {
          childnode.content.tocid = `${parent.content.tocid}.${childIndex}`;
          this.updateChildrenValue(childnode.children, childnode);
        }
      }
    })
  }
  updateCreateUpdateIndexValue(data) { //Update Payload obj
    let index = 0;
    data.forEach((parent) => {
      if (parent.assetType == "Header") {
        index = index + 1;
        parent.tocid = index.toString();
        if (parent.length > 0) {
          this.updateCreateUpdateChildrenValue(parent.childList, parent);
        }
      }

    })
  }
  updateCreateUpdateChildrenValue(child, parent) {
    let childIndex = 0;
    child.forEach((childnode, index) => {
      if (childnode.assetType == "Header") {
        childIndex = childIndex + 1;
        if (childnode.childList.length == 0) {
          childnode.tocid = `${parent.tocid}.${childIndex}`;  //child parent.children.length
        } else {
          childnode.tocid = `${parent.tocid}.${childIndex}`;
          this.updateCreateUpdateChildrenValue(childnode.childList, childnode);
        }
      }
    })
  }
  updateEntireIndex(event) { //  Reordering after DragDrop
    const content = JSON.parse(event);
    this.contentForUpdate.content.forEach(element => {
      if (element.tableOfContentTocid === content.dragElementId) {
        this.movedElement = element;
        this.contentForUpdate.content = this.contentForUpdate.content.filter((child) => child.tableOfContentTocid !== content.dragElementId);
      } else {
        this.findRemovedElement(element, content.dragElementId, content.targetElementId);
      }
    });
    if (content.targetElementId == 0) {
      this.movedElement.parentTableOfContentTocid = 0;
      this.contentForUpdate.content.push(this.movedElement);
    } else {
      this.contentForUpdate.content.forEach(element => {
        this.updateRemovedElement(element, content.dragElementId, content.targetElementId);
      });
    }
    this.updateIndexValue(this.parentItem);
    this.updateCreateUpdateIndexValue(this.contentForUpdate.content);
  }
}
