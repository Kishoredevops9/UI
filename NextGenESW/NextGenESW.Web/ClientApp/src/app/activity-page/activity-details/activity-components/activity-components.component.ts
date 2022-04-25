
import { Component, OnInit, Input, Output, EventEmitter, Inject, ViewEncapsulation } from '@angular/core';
// import { demoData, TreeNode, DropInfo } from "./data";
import { DOCUMENT } from "@angular/common";
import { debounce } from "@agentepsilon/decko";
import { ActivityPageService } from '../../activity-page.service';
import { Router, ActivatedRoute } from '@angular/router';
import  {compact, map} from 'lodash';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDragEnter,
  CdkDragExit,
} from '@angular/cdk/drag-drop';
import {
  DisciplineCodeList,
  componentWICDdocList,
  ComponentActivityPage,
  activityCompnentIframe,
  Item,
  WICDdocList,
  componentMessages,
} from '../../activity-page.model';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
//import { Subscription } from 'rxjs';
import { AddonsPopupComponent } from './addons-popup/addons-popup.component';
import { ConfirmDeleteComponent } from './confirm-delete/confirm-delete.component';
import { ContentCommonService } from '@app/shared/content-common.service';
import { assetTypeConstantValue, oldContentTypeCode } from '@environments/constants';
import { ExternalLinkComponent } from '@app/toc/toc-details/toc-toc/external-link/external-link.component';
import { Subject, Subscription } from 'rxjs';
import { environment } from '@environments/environment';
import { ASSET_STATUSES } from '@environments/constants';
import { RecordsService } from '../../../shared/records.service';
import { AddonsPopupSearchComponent } from '@app/shared/component/addons-popup-search/addons-popup-search.component';

@Component({
  selector: 'app-activity-components',
  templateUrl: './activity-components.component.html',
  styleUrls: ['./activity-components.component.scss'],
})
export class ActivityComponentsComponent implements OnInit {
  ASSET_STATUSES = ASSET_STATUSES;
  hclenv = environment.hclenv;
  eventsSubject: Subject<void> = new Subject<void>();
  header: any;
  public screenWidth: any;
  public screenHeight: any;
  toggleSearch: boolean = false;
  isShowIframebox: boolean = false;
  listArrowBtn: boolean = false;
  isEditableMode: boolean = true;
  mode: any = 'Edit';
  dataUrls;
  movedElement: any;
  id;
  contentNo;
  contentId: string = '';
  currentIndex;
  activityContainerId: number;
  dragDropSavedIframeId = [];
  iframId;
  searchText = '';
  title: string = '';
  ctTitle: any = '';
  ctDescription: any = '';
  ctContentId: any = '';
  isLoading: boolean = false;
  done = [];
  activityTabs;
  activityPageComponentId: number;
  // containerId;
  childLevel: number = 0;
  @Input() disableForm: boolean;
  @Input() globalData;
  bindData = false;
  @Output() updateLastModifiedDate = new EventEmitter<string>();
  componentWICDdocList: componentWICDdocList[];
  private subscription: Subscription;
  existingHierarchy: any;
  childHirerachy = [];
  childNode = [];
  treeStructure = [];
  lastItem = [];
  items = [];
  dragItems:any;
  type: any;
  contentSelected: boolean = false;
  itemAdded: any = false;
  docStatus= ASSET_STATUSES.DRAFT;
  contentTypeAP: string = 'AP';
  createComponentResponse: any;
  public parentItem: Item;
  public contentForUpdate: any;
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

  constructor(
    private activityPageService: ActivityPageService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router,
    private contentCommonService: ContentCommonService,
    private _snackBar: MatSnackBar,
    private rservice: RecordsService,
    @Inject(DOCUMENT) private document: Document
  ) {
    const wICDdocList = new WICDdocList();
    wICDdocList.title = '';
    this.parentItem = new Item({ name: '', content: wICDdocList });
   }

  //  emitEventToChild() {
  //   this.eventsSubject.next();
  // }
  ngOnInit(): void {
console.log(this.globalData, 'this.globalData 1111')

    this.itemAdded = false;
    this.contentSelected = false;
    this.items = ['EKS Addons'];
    this.childLevel = 0;

    this.treeStructure = [];

    this.route.params.subscribe((param) => {
      if (param['contentId']) {
        this.id = param['contentId'] ? param['contentId'] : '';
        this.contentId = param['contentId'] ? param['contentId'] : '';
      } else if (param['id']) {
        this.id = param['id'] ? param['id'] : '';
      }
      //console.log("activity components this.id", this.id);
    });

    if (this.id) {
      // this.loadActivityComponent();
    } else {
      //this.type = 'AP';
      sessionStorage.setItem('statusCheck', 'false');
    }

    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
  }

  ngOnChanges(event) {
    //console.log('this.docStatus', this.docStatus)
    if (
      event.globalData.currentValue &&
      event.globalData.previousValue != event.globalData.currentValue
    ) {
      if (!(Object.keys(this.globalData).length === 0)) {
        this.docStatus = event.globalData.currentValue.assetStatus;
        // if(event.globalData.currentValue.editMode) {
        //   this.docStatus = 1;
        // } else {
        //   this.docStatus = 2;
        // }
        //this.activityTabs = event.globalData.currentValue;
        this.isLoading = true;
        this.loadActivityComponent(event.globalData.currentValue);
      }
    }

  }

  hasChildList(element) {
    let childArray = [];
    let hasSiblings = element.childList.length;
    element.childList.forEach((childL1) => {
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
    childElement.push(
      new Item({
        name: wICDdocListChild.contentType,
        content: wICDdocListChild,
        children: [],
      })
    );

    if (this.childNode.length > 0) {
      this.setParent(this.childNode, child);
    } else {
      this.childNode.push(
        new Item({
          name: wICDdocList.contentType,
          content: wICDdocList,
          children: childElement,
        })
      );
    }
  }
  setParent(data, child) {
    // data.children = parent;
    if (data) {
      data.forEach((x) => {
        if (x.content.activityContainerId !== child.parentActivityContainerId) {
          this.setParent(x.children, child);
        } else {
          let wICDdocListChild = new WICDdocList();
          wICDdocListChild = this.renderItem(wICDdocListChild, child);
          x.children.push(
            new Item({
              name: wICDdocListChild.contentType,
              content: wICDdocListChild,
              children: [],
            })
          );
          return;
        }
      });
    } else {
      if (
        data.content.activityContainerId === child.parentActivityContainerId
      ) {
        let wICDdocListChild = new WICDdocList();
        wICDdocListChild = this.renderItem(wICDdocListChild, child);
        data[0].children.push(
          new Item({
            name: wICDdocListChild.contentType,
            content: wICDdocListChild,
            children: [],
          })
        );
      }
    }
  }

  renderChild(childList, child) {
    let wICDdocList = new WICDdocList();
    wICDdocList = this.renderItem(wICDdocList, child);
    childList.push(
      new Item({ name: wICDdocList.contentType, content: wICDdocList })
    );

    return childList;
  }

  renderItem(wICDdocList, element) {
    // this.componentWICDdocList = this.componentWICDdocList.filter((existingChild) => {
    //   if (existingChild.title !== element.title) {
    //     return element;
    //   }
    // });
    if (Number(element.contentTypeId) == 1) {
      wICDdocList.contentType = 'WI';
    } else if (Number(element.contentTypeId) == 2) {
      wICDdocList.contentType = 'GB';
    } else if (Number(element.contentTypeId) == 6) {
      wICDdocList.contentType = 'AP';
    } else if (Number(element.contentTypeId) == 5) {
      wICDdocList.contentType = 'RD';
    } else if (Number(element.contentTypeId) == 9) {
      wICDdocList.contentType = 'KP';
    } else if (Number(element.contentTypeId) == 10) {
      wICDdocList.contentType = 'CG';
    } else if (Number(element.contentTypeId) == 11) {
      wICDdocList.contentType = 'ToC';
    } else if (Number(element.contentTypeId) == 12) {
      wICDdocList.contentType = 'RC';
    } else if (Number(element.contentTypeId) == 13) {
      wICDdocList.contentType = 'SF';
    }else if (Number(element.contentTypeId) == 14) {
      wICDdocList.contentType = 'SP';
    } else if (Number(element.contentTypeId) == 3) {
      wICDdocList.contentType = 'DS';
    } else if (Number(element.contentTypeId) == 15) {
      wICDdocList.contentType = 'EX';
    }else {
      wICDdocList.contentType = 'M';
    }

    wICDdocList.activityContainerId = element.activityContainerId;
    wICDdocList.assetContentId = element.assetContentId;
    wICDdocList.ActivityPageId = element.activityPageId;
    wICDdocList.contentId = element.contentId;
    wICDdocList.contentItemId = element.contentItemId;
    wICDdocList.contentNo = element.contentNo;
    wICDdocList.contentTypeId = element.contentTypeId;
    wICDdocList.CreatedOn = element.createdOn;
    wICDdocList.guidance = element.guidance;
    wICDdocList.CreatorClockId = element.creatorClockId;
    wICDdocList.ModifiedOn = element.modifiedOn;
    wICDdocList.ModifierClockId = element.modifierClockId;
    wICDdocList.orderNo = element.orderNo;
    wICDdocList.parentActivityContainerId = element.parentActivityContainerId;
    wICDdocList.title = element.title;
    wICDdocList.uS_JC = element.uS_JC;
    wICDdocList.url = element.url;
    wICDdocList.version = element.version;
    wICDdocList.assetStatus = element.assetStatus;
    wICDdocList.assetStatusId = element.assetStatusId;
    wICDdocList.originalItem = element;
    return wICDdocList;
  }

  // Starts Component Addition Method
  onCreateComponent(params) {
    if (params['content']['componenttype'] === 'A' || params['content']['contentType'] === 'A') {
      return "APContentNotAdded";
    }
    let compRequest = [];
    compRequest.push(this.componentParameters(params.content, 0));
    this.isLoading = true;
    this.activityPageService.createComponent(compRequest).subscribe((data) => {
      console.log('data',data);
      this.isLoading = false;
      let container = JSON.stringify(data);
      this.itemAdded = false;
      let containerId = JSON.parse(container);
      params.content.activityContainerId = containerId.activityContainerId;
      this.contentForUpdate.content.push(data[0]);
      this.parentItem.children.push(
        new Item({ name: containerId.assetType, content: containerId })
      );

      this.updateLastModifiedDate.emit(data['propertiesLastUpdateDateTime']);
      return containerId;
    });
  }

  panelExpandCollapse(state) {
    this.itemAdded = state;
  }

  onUpdateComponent(params, movingItem) {
    let compRequest = [];
    let createContReq = {};
    createContReq = this.componentParameters(
      params.content,
      params.content.parentActivityContainerId
    );

    if (params.children.length) {
      let compRequestChildL1 = [];
      params.children.forEach((childL1) => {
        compRequestChildL1.push(
          this.componentParameters(
            childL1.content,
            params.content.activityContainerId
          )
        );
      });

      createContReq['ChildList'] = compRequestChildL1;
    }
    compRequest.push(createContReq);
    // this.fetchParent(params);
    this.getParent(this.childNode, movingItem);

    this.activityPageService.UpdateComponent(compRequest).subscribe((data) => {
      console.log(data);
      let container = JSON.stringify(data);
      let containerId = JSON.parse(container);
      this.activityContainerId = containerId.activityContainerId;
      this.updateLastModifiedDate.emit(data['propertiesLastUpdateDateTime']);
      // params.orderId = currentId;
      // params.activityContainerId = this.activityContainerId;
    });
  }

  fetchParent(params) {
    let droppedContainerId = params.content.activityContainerId;
    let abort = false;
    for (let c0 = 0; c0 < this.parentItem.children.length && !abort; c0++) {
      this.existingHierarchy = [this.parentItem.children[c0].content];
      if (this.existingHierarchy[0].activityContainerId == droppedContainerId) {
        let params = this.componentParameters(
          this.parentItem.children[c0].children[0].content,
          this.parentItem.content.activityContainerId
        );
        this.existingHierarchy[0].ChildList = [params];
        abort = true;
        break;
      } else {
        if (this.parentItem.children[c0].children.length > 0) {
          let childrenLevel1 = this.parentItem.children[c0].children;
          for (let c1 = 0; c1 < childrenLevel1.length && !abort; c1++) {
            this.existingHierarchy[0].ChildList = [childrenLevel1[c1].content];
            if (
              childrenLevel1[c1].content.activityContainerId ==
              droppedContainerId
            ) {
              // this.existingHierarchy.ChildList[0].ChildList = [childrenLevel1[c1].children[0].content];
              let params = this.componentParameters(
                childrenLevel1[c1].children[0].content,
                childrenLevel1[c1].content.activityContainerId
              );
              this.existingHierarchy[0].ChildList[0].ChildList = [params];
              abort = true;
              break;
            } else {
              if (this.parentItem.children[c1].children.length > 0) {
                let childrenLevel2 = this.parentItem.children[c1].children;
                for (let c2 = 0; c2 < childrenLevel2.length && !abort; c2++) {
                  this.existingHierarchy[0].ChildList.ChildList = [
                    childrenLevel2[c2].content,
                  ];
                  if (
                    childrenLevel1[c2].content.activityContainerId ==
                    droppedContainerId
                  ) {
                    // this.existingHierarchy.ChildList[0].ChildList[0].ChildList = [childrenLevel2[c2].children[0].content];
                    let params = this.componentParameters(
                      childrenLevel2[c2].children[0].content,
                      childrenLevel2[c2].content.activityContainerId
                    );
                    this.existingHierarchy[0].ChildList[0].ChildList[0].ChildList =
                      [params];
                    abort = true;
                    break;
                  }
                }
              }
            }
          }
        }
      }
      // const element = array[index];
    }
  }

  componentParameters(content, parentId) {
    let createCompReq = {};
    createCompReq = content;
    createCompReq['parentActivityContainerId'] = parentId;
    createCompReq['ContentNo'] = createCompReq['contentid'];
    const componentTypeValue =
      createCompReq['assettypecode'] || createCompReq['contentType'];
    createCompReq['assettypecode'] = assetTypeConstantValue(componentTypeValue);
    if (this.id) {
      createCompReq['activityPageId'] = this.activityTabs.id;
    } else {
      createCompReq['activityPageId'] = this.activityPageComponentId;
    }
    createCompReq['createdOn'] = new Date();
    createCompReq['modifiedOn'] = new Date();
    return createCompReq;
  }

  onDragDrop(event: CdkDragDrop<Item>) {
    event.container.element.nativeElement.classList.remove('active');
    if (this.canBeDropped(event)) {
      const movingItem: Item = event.item.data;
      event.container.data.children.push(movingItem);
      event.previousContainer.data.children =
        event.previousContainer.data.children.filter(
          (child) => child.uId !== movingItem.uId
        );
      this.onUpdateComponent(event.container.data, movingItem);
    } else {
      moveItemInArray(
        event.container.data.children,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  canBeDropped(event: CdkDragDrop<Item, Item>): boolean {
    const movingItem: Item = event.item.data;

    return (
      event.previousContainer.id !== event.container.id &&
      this.isNotSelfDrop(event) &&
      !this.hasChild(movingItem, event.container.data) &&
      this.hasTwoChild(movingItem, event.container.data)
    );
  }

  isNotSelfDrop(
    event: CdkDragDrop<Item> | CdkDragEnter<Item> | CdkDragExit<Item>
  ): boolean {
    return event.container.data.uId !== event.item.data.uId;
  }

  hasChild(parentItem: Item, childItem: Item): boolean {
    const hasChild = parentItem.children.some(
      (item) => item.uId === childItem.uId
    );
    return hasChild
      ? true
      : parentItem.children.some((item) => this.hasChild(item, childItem));
  }

  hasTwoChild(parentItem: Item, childItem: Item): boolean {
    if (
      parentItem.children &&
      parentItem.children.length &&
      parentItem.children[0].children &&
      parentItem.children[0].children.length
    ) {
      this._snackBar.open("'Maximum two childs are allowed!", 'x', {
        duration: 5000,
      });
      return false;
    } else {
      return true;
    }
  }

  iframeDataDisplayed(id) {
    this.listArrowBtn = !this.listArrowBtn;
    this.isShowIframebox = !this.isShowIframebox;
    this.getIframeId(id);
  }

  getIframeId(id) {
    this.activityPageService.getComponentIframeID(id).subscribe((data) => {
      let displayTabData = JSON.stringify(data);
      let tabData = JSON.parse(displayTabData);
      tabData.forEach((dd) => {
        if (dd.displayTab == 'Purpose') {
          this.dataUrls = dd.extractedDocUrl;
        }
      });
    });
  }

  deleteComponent(item) {
    if (item.children.length > 0) {
      const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
        width: '42%',
        data: {
          message: componentMessages.deleteConfirmation,
          message1: componentMessages.deleteConfirmation1
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result && result !== 'No') {
          this.isLoading = true;
          this.deleteChild(item);
          this.activityPageService
            .deleteComponent(item.content.contentNumber || item.content.activityContainerId)
            .subscribe((data) => {
              this.pushChild(item);
              if (data) {
                const a = JSON.stringify(data);
                let updatedValue = {
                  data: '',
                };
                updatedValue.data = JSON.parse(a);
                this.updateLastModifiedDate.emit(updatedValue.data);
              }
              this.isLoading = false;
            }, ()=>{
              this.isLoading = false;
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
        if (result && result !== 'No') {
          this.isLoading = true;
          this.activityPageService
            .deleteComponent(item.content.activityContainerId)
            .subscribe((data) => {
              this.pushChild(item);
              if (data) {
                const a = JSON.stringify(data);
                let updatedValue = {
                  data: '',
                };
                updatedValue.data = JSON.parse(a);
                this.updateLastModifiedDate.emit(updatedValue.data);
              }
              if (item.content.parentActivityContainerId == 0) {
                this.parentItem.children = this.parentItem.children.filter(
                  (subChild) => {
                    if (
                      subChild.content.activityContainerId !==
                      item.content.activityContainerId
                    ) {
                      return item;
                    }
                  }
                );
              } else {
                this.getParent(this.parentItem.children, item);
              }
              this.isLoading = false;
            }, ()=>{
              this.isLoading = false;
            });
        }
      });
    }
  }

  deleteChild(element) {
    element.children.forEach((childL1) => {
      if (childL1.childList && childL1.childList.length) {
        this.deleteChild(childL1);
      }
      this.activityPageService
        .deleteComponent(childL1.content.activityContainerId)
        .subscribe((data) => {
          this.pushChild(childL1);
        });
    });
  }

  getParent(element, child) {
    element.forEach((childL1) => {
      if (
        childL1.content.activityContainerId ===
        child.content.parentActivityContainerId
      ) {
        childL1.children = childL1.children.filter((subChild) => {
          if (
            subChild.content.activityContainerId !==
            child.content.activityContainerId
          ) {
            return child;
          }
        });
        // childL1.children = [];
        return;
      }
      if (childL1.children && childL1.children.length) {
        this.getParent(childL1.children, child);
      }
    });
  }

  checkChild(item) {
    this.parentItem.children = this.parentItem.children.filter((child) => {
      if (child.uId !== item.uId) {
        return child;
      } else {
        this.pushChild(item);
      }
    });
  }

  pushChild(item) {
    // this.componentWICDdocList.push(item.content);
  }

  selectAddOns(type) {
    this.contentSelected = true;
    this.type = type;
  }

  addAddOns(type) {
    console.log('-----hclenv---',this.hclenv);
    this.rservice.UpdateBroadcastMessage('true');
    const currentContentIdList = compact(map(this.parentItem.children,'content.contentNo'));

    const dialogRef = this.dialog.open(AddonsPopupComponent, {
      width: '90%',
      height: '85%',
      maxWidth: '100%',
      data: {
        // doc: this.componentWICDdocList,
        ctContentId: this.ctContentId,
        ctTitle: this.ctTitle,
        ctDescription: this.ctDescription,
        type: '',
        message: 'ADD ONS',
        showEksPanel: false,
        disableAPSFSP: 'AP_SF_SP_Not',
        restrictedContentIds: currentContentIdList,
        disableObsoleteDocuments: true
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.rservice.UpdateBroadcastMessage('false');
      console.log("result", result);
      let data = this.parentItem;
      let increment = this.parentItem.children.length;
      //if(this.hclenv == 'hcl'){
        if(result[0].type == 'PW Wiki'){
          let Id = '';
          let content = {
            version:result[0].version,
            title: result[0].title,
            contentUrl: result[0].link0,
            url:result[0].link0,
            assettypecode:'EX',
            assetType: 'Link'
          }
          let parentEle = {
            name: 'Link',
            content: content,
            children: []
          }
          this.onCreateComponent2(parentEle, true, Id);

        }
     // }
      else{
      if (result && result !== 'No') {
        if (result && result.length) {
          let orderNum;
          result.forEach((element) => {
            orderNum = ++increment;
            var element = { ...element }
            element['orderNo'] = orderNum;
            element.componenttype = element.assettypecode.toUpperCase();
            element.contentType = element.assettypecode.toUpperCase();
            element.contentId = element.contentid;
            let parentEle = {
              name: '',
              content: element,
              children: [],
            };

            this.createComponentResponse = this.onCreateComponent(parentEle);
            this.pushChild(parentEle);

            // this.componentWICDdocList = this.componentWICDdocList.filter((child) => {
            //   if (child.title !== element.title) {
            //     return child;
            //   }
            // });
          });
        }
        if (this.createComponentResponse == "APContentNotAdded") {
          this._snackBar.open("'Selected AP Can Not be Added in the Activities Component!", 'x', {
            duration: 5000,
          });
        } else {
          this._snackBar.open("'Selected Addons added in the components!", 'x', {
            duration: 5000,
          });
        }
      }
      if (result) {
        const a = JSON.stringify(result);
        let updatedValue = {
          data: '',
        };
        updatedValue.data = JSON.parse(a);
        this.updateLastModifiedDate.emit(updatedValue.data);
        this.getParent(this.parentItem.children, result);
      }
      }



    });
  }

  openAddonsPopupSearch() {
    this.rservice.UpdateBroadcastMessage('true');
    const currentContentIdList = compact(map(this.parentItem.children,'content.contentNo'));

    const dialogRef = this.dialog.open(AddonsPopupSearchComponent, {
      width: '90%',
      maxWidth: '100%',
      data: {
        // doc: this.componentWICDdocList,
        ctContentId: this.ctContentId,
        ctTitle: this.ctTitle,
        ctDescription: this.ctDescription,
        type: '',
        message: 'ADD ONS',
        showEksPanel: false,
        disableAPSFSP: 'AP_SF_SP_Not',
        popupType: 'AP_SF_SP_Not',
        existingContentIds: currentContentIdList,
        disableObsoleteDocuments: true
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.rservice.UpdateBroadcastMessage('false');
      console.log("result", result);
      let data = this.parentItem;
      let increment = this.parentItem.children.length;
      //if(this.hclenv == 'hcl'){
        if(result[0].type == 'PW Wiki'){
          let Id = '';
          let content = {
            version:result[0].version,
            title: result[0].title,
            contentUrl: result[0].link0,
            url:result[0].link0,
            assettypecode:'EX',
            assetType: 'Link'
          }
          let parentEle = {
            name: 'Link',
            content: content,
            children: []
          }
          this.onCreateComponent2(parentEle, true, Id);

        }
      else{
      if (result && result !== 'No') {
        if (result && result.length) {
          let orderNum;
          result.forEach((element) => {
            orderNum = ++increment;
            var element = { ...element }
            element['orderNo'] = orderNum;
            element.componenttype = element.assettypecode.toUpperCase();
            element.contentType = element.assettypecode.toUpperCase();
            element.contentId = element.contentid;
            let parentEle = {
              name: '',
              content: element,
              children: [],
            };

            this.createComponentResponse = this.onCreateComponent(parentEle);
            this.pushChild(parentEle);
          });
        }
        if (this.createComponentResponse == "APContentNotAdded") {
          this._snackBar.open("'Selected AP Can Not be Added in the Activities Component!", 'x', {
            duration: 5000,
          });
        } else {
          this._snackBar.open("'Selected Addons added in the components!", 'x', {
            duration: 5000,
          });
        }
      }
      if (result) {
        const a = JSON.stringify(result);
        let updatedValue = {
          data: '',
        };
        updatedValue.data = JSON.parse(a);
        this.updateLastModifiedDate.emit(updatedValue.data);
        this.getParent(this.parentItem.children, result);
      }}
    });
  }

  loadActivityComponent(res) {
    // if ((this.id && this.id > 0) || sessionStorage.getItem('contentType') && sessionStorage.getItem('contentType').toLowerCase() != "published") {
    //   this.contentNo = (this.id && this.id > 0) ? this.id : sessionStorage.getItem('documentId') ? sessionStorage.getItem('documentId') : 0;
    //   var documentcontentId = sessionStorage.getItem('documentcontentId') ? sessionStorage.getItem('documentcontentId') : '0';
    //   var documentversion = sessionStorage.getItem('documentversion') ? sessionStorage.getItem('documentversion') : '1';
    //   var documentStatusDetails = sessionStorage.getItem('documentStatusDetails') ? sessionStorage.getItem('documentStatusDetails').toLowerCase() : 'draft';
    //   var documentcontentType = this.contentTypeAP;
    // } else {
    //   this.contentNo = (this.id && this.id > 0) ? this.id : sessionStorage.getItem('documentId') ? sessionStorage.getItem('documentId') : 0;
    //   var documentcontentId = (this.contentId && this.contentId.length > 0) ? this.contentId : sessionStorage.getItem('contentNumber') ? sessionStorage.getItem('contentNumber') : '0';
    //   var documentversion = "0";
    //   var documentStatusDetails = sessionStorage.getItem('contentType') ? sessionStorage.getItem('contentType').toLowerCase() : 'published';
    //   var documentcontentType = this.contentTypeAP;
    // }

    // let statusCheck = sessionStorage.getItem('statusCheck');
    // const userEmail = sessionStorage.getItem('userMail');
    // const url = this.router.url.split("/");
    // var redirectionPath = sessionStorage.getItem('redirectUrlPath');

    // if (this.id) {
    //  this.contentCommonService.getActivityPageData(this.contentNo, documentcontentType, documentStatusDetails, documentcontentId, documentversion, userEmail).subscribe((res) => {
    this.activityTabs = res;
      this.bindData = true;
    this.parentItem.children = []; //During Save As/Revision the new contents are appending to the existing arrays so the entries are duplicated
    this.activityTabs.content &&
      this.activityTabs.content.forEach((childL1) => {
        if (childL1.childList && childL1.childList.length) {
          this.hasChildList(childL1);
          let wICDdocList = new WICDdocList();
          wICDdocList = this.renderItem(wICDdocList, childL1);
          this.parentItem.children.push(
            new Item({
              name: this.childNode[0].content.contentType,
              content: this.childNode[0].content,
              children: this.childNode[0].children,
            })
          );
          this.childNode = [];
        } else {
          let wICDdocList = new WICDdocList();
          wICDdocList = this.renderItem(wICDdocList, childL1);
          this.parentItem.children.push(
            new Item({
              name: wICDdocList.contentType,
              content: wICDdocList,
              children: [],
            })
          );
        }
      });
    this.isLoading = false;

  }


  addExternalAddOns(type) {
    this.rservice.UpdateBroadcastMessage('true');
    const dialogRef = this.dialog.open(ExternalLinkComponent, {
      width: "50%",
      height: "38%",
      maxWidth: this.screenWidth + "px",
      maxHeight: this.screenHeight + "px",
      disableClose: true,
      data: {
        isHeader: type
      }
      // data: {
      //   // doc: this.componentWICDdocList,
      //   ctContentId: this.ctContentId,
      //   ctTitle: this.ctTitle,
      //   ctDescription: this.ctDescription,
      //   type: '',
      //   message: 'ADD ONS',
      //   showEksPanel: false,
      // },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.rservice.UpdateBroadcastMessage('false');
      if (result && result !== 'No') {
        this.header = result.contentUrl;
        let assetType = type ? 'Header' : 'Link';
        if (result.popUp == 'externalLink') {
          let Id = '';
          let content = {
            title: result.title,
            contentUrl: result.contentUrl,
            url:result.contentUrl,
            assettypecode:'EX',
            //toctype: false,
            assetType: assetType
          }
          let parentEle = {
            name: assetType,
            content: content,
            children: []
          }
          this.onCreateComponent1(parentEle, true, Id);
        } else if (result.popUp == 'addHeader') {
          this.addHeader1(result);
        }
      }

      if (result) {
        const a = JSON.stringify(result);
        let updatedValue = {
          data: '',
        };
        updatedValue.data = JSON.parse(a);
        this.updateLastModifiedDate.emit(updatedValue.data);
        this.getParent(this.parentItem.children, result);
      }

    });
  }

  onCreateComponent2(params, isHeader, Id) {
    console.log("params", params);
    console.log("isHeader", isHeader);
    console.log("Id", Id);
    console.log("assettypecode", params.content.assettypecode);
    console.log("params.content", params.content);
    let compRequest = [];
    compRequest.push(this.componentParameters1(params.content, 0, isHeader));
    //compRequest[0].contentId = tocId;
    this.isLoading = true;
    this.activityPageService.createComponent(compRequest).subscribe((data) => {
      console.log('--data',data);
      this.isLoading = false;
      let container = JSON.stringify(data);
      this.itemAdded = false;
      let containerId = JSON.parse(container);
      params.content.activityContainerId = containerId.activityContainerId;
      this.parentItem.children.push(
        new Item({ name: containerId.assetType, content: containerId })
      );

      this.updateLastModifiedDate.emit(data['propertiesLastUpdateDateTime']);
      return containerId;
    });
  }

  onCreateComponent1(params, isHeader, Id) {
    console.log("params", params);
    console.log("isHeader", isHeader);
    console.log("Id", Id);
    console.log("assettypecode", params.content.assettypecode);
    console.log("params.content", params.content);
    let compRequest = [];
    compRequest.push(this.componentParameters1(params.content, 0, isHeader));
    //compRequest[0].contentId = tocId;
    this.isLoading = true;
    this.activityPageService.createComponent(compRequest).subscribe((data) => {
      // this.itemAdded = false;
      // this.header = '';
      // let container = JSON.stringify(data[0]);
      // let containerId = JSON.parse(container);
      // this.contentForUpdate.content.push(data[0]);
      // this.parentItem.children.push(new Item({ name: containerId.assetType, content: containerId }));
      // this.isLoading = false;
      // this.emitEventToChild()
      console.log('--data',data);
      this.isLoading = false;
      let container = JSON.stringify(data);
      this.itemAdded = false;
      let containerId = JSON.parse(container);
      params.content.activityContainerId = containerId.activityContainerId;
      this.contentForUpdate.content.push(data[0]);
      this.parentItem.children.push(
        new Item({ name: containerId.assetType, content: containerId })
      );

      this.updateLastModifiedDate.emit(data['propertiesLastUpdateDateTime']);
      return containerId;
    });
  }


  addHeader1(event) {
    console.log("event", event);

    let content = {
      title: event.title,
      //toctype: true,
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
    let parentAPId = parentArray.length + 1;
    this.onCreateComponent1(
      parentEle, true, parentAPId.toString()
    );
  }


  componentParameters1(content, parentId, isHeader) {
    let createCompReq = {};
    // createCompReq = content;
    console.log("content.assettypecode", content.assettypecode);
    console.log("content", content);
    console.log("parentId", parentId);
    console.log("isHeader", isHeader);
    createCompReq['parentActivityContainerId'] = parentId;
    //createCompReq['assetType'] = content.assetType;
    //createCompReq['assettypecode'] = content.assetTypeId;
    createCompReq['ContentNo'] = content.contentId;
    console.log("this.id", this.id);
    console.log("this.id", this.globalData.id);
    console.log("createCompReq", createCompReq);
    if (this.id || this.globalData && this.globalData.id > 0) {
      createCompReq['activityPageId'] = (this.globalData.id) ? this.globalData.id : this.activityTabs.id;
    } else {
      createCompReq['activityPageId'] = 0;
    }
    //createCompReq['toctype'] = isHeader;
    createCompReq['createdDateTime'] = new Date();
    createCompReq['lastUpdateDateTime'] = new Date();

    if (content.assetType == 'Link') {
      //createCompReq['tocid'] = null;
      createCompReq['title'] = content.title;
      createCompReq['contentUrl'] = content.contentUrl;
      createCompReq['url'] = content.contentUrl;
      createCompReq['assettypecode'] = content.assettypecode;
    } else if (content.assetType == 'Header') {
      //createCompReq['tocid'] = null;
      createCompReq['title'] = this.header;
    } else {
      //createCompReq['tocid'] = content.tocid;
      createCompReq['activityPageId'] = this.activityTabs.id;
      createCompReq['activityPageId'] = this.activityPageComponentId;
      createCompReq['title'] = content.title;
    }
    createCompReq['createdDateTime'] = new Date();
    createCompReq['lastUpdateDateTime'] = new Date();
    createCompReq['createdUser'] = localStorage.getItem("userMail");
    createCompReq['lastUpdateUser'] = localStorage.getItem("userMail");
    return createCompReq;
  }





}
