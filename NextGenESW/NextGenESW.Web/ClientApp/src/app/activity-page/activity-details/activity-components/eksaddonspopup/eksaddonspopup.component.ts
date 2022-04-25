import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ActivityPageService } from '@app/activity-page/activity-page.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { documentPath } from '@environments/constants';
import { Router } from '@angular/router';
import { TodoItemsListService } from '@app/dashboard/todo-items-list/todo-items-list.service';
import { environment } from '@environments/environment';
import { TaskCrationPageService } from '@app/task-creation/task-creation.service';
import { SharedService } from '@app/shared/shared.service';
import { DOCUMENT } from '@angular/common';
import { debounce } from '@agentepsilon/decko';
import { ConfirmDeleteComponent } from "@app/activity-page/activity-details/activity-components/confirm-delete/confirm-delete.component"
import { EksaddonsConfirmpopupComponent } from '@app/shared/component/left-section-build-task/eksaddons-confirmpopup/eksaddons-confirmpopup.component';
import { AddonsPopupSearchComponent } from '@app/shared/component/addons-popup-search/addons-popup-search.component';
import { AddonsPopupTabDict } from '@app/shared/component/addons-popup-search/addons-popup-search.utils';
import { map } from 'rxjs/operators';
export interface TreeNode {
  id: string;
  children: TreeNode[];
  isExpanded?: boolean;
}

export interface DropInfo {
  targetId: string;
  action?: string;
}

export var demoData: TreeNode[] = [
  {
    id: 'item 1',
    children: [],
  },
  {
    id: 'item 2dsdsdsd ',
    children: [
      {
        id: 'item 2.1',
        children: [],
      },
      {
        id: 'item 2.2',
        children: [],
      },
      {
        id: 'item 2.3',
        children: [],
      },
    ],
  },
  {
    id: 'item 3',
    children: [],
  },
];



@Component({
  selector: 'app-eksaddonspopup',
  templateUrl: './eksaddonspopup.component.html',
  styleUrls: ['./eksaddonspopup.component.scss']
})
export class EksaddonspopupComponent implements OnInit {

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginator2') paginator2: MatPaginator;
  @ViewChild('paginator3') paginator3: MatPaginator;
  pageRowCounters = environment.pageRowCounters;
  isLoading = false;
  addons: any;
  allData = [];
  selectedAddons = [];
  ctTitle: any = '';
  ctDescription: any = '';
  ctContentId: any = '';
  addonsTable$: any;
  eksGlobalData$: any = '';
  items = ['EKS Addons'];
  type: any;
  contentSelected: boolean = false;
  showEksPanel: boolean = false;
  displayedColumns: string[] = ['title', 'contentid', 'componenttype', 'purpose'];
  globalDisplayedColumns: string[] = ['arrow', 'title', 'type', 'link', 'publishDate'];
  pwPlayDisplayedColumns: string[] = ['arrow', 'title', 'description', 'count', 'publishDate'];
  ekssearchWICDDoc: any;
  eksRecords = [];
  apiError: any = false;
  private subscription: Subscription;
  loading: boolean;
  chckbk: any = {}

  eksSearchDataCreated: any = '';
  eksSearchCountCreated: any;
  eksSearchTitleCreated: any = '';
  eksLeftSearchDataCreated: any = '';
  selectedIndex = 0;
  leftSideContentData;
  eksAddOnSearchData;
  eksAddOnInternalSearchData;
  eksGlobalSearchData;
  eksGlobalSearchCount;
  eksPWPlayData$: any = '';
  eksPWPlaySearchCount;
  eksPWPlaySearchData;
  startAt: number = 0;
  startEnd: number = 10;
  pageSize: number = 10;
  globalLength: number = 0;
  searchTerm: any;
  tabstatus: any = 1;
  ContainerItems: any = [];
  containerLoading: boolean;
  rootObject: any = [];

  constructor(private dialogRef: MatDialogRef<EksaddonspopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private todoItemsListService: TodoItemsListService,
    private activityPageService: ActivityPageService,
    public TaskCrationPageService: TaskCrationPageService,
    public SharedService: SharedService,
    @Inject(DOCUMENT) private document: Document,
    public dialog: MatDialog
  ) {
    // this.allData = data.doc;
    this.ctContentId = data.ctContentId;
    this.type = data.type;
    this.ctTitle = data.ctTitle;
    this.ctDescription = data.ctDescription;
    this.showEksPanel = data.showEksPanel;
    //  this.prepareDragDrop(this.nodes);
    console.log("data::::", data);
  }

  public cCode: any = {
    "WI": "#9D5A83",
    "GB": "#008A90",
    "DS": "#8800BA",
    "M": "#DF4B09",
    "AP": "#30A62A",
    "KP": "#404040",
    "CG": "#17b4ef",
    "TC": "#FFC400",
    "RD": "#E3B900",
    "TOC": "#034796",
    "RC": "#FFC400",
    "C": "#000000"
  }

  public cType: any =
    [
      {
        "contentTypeId": 0,
        "name": "Work Instructions",
        "code": "C",
        "status": null,
        "createdOn": null,
        "creatorClockID": null,
        "modifiedOn": null,
        "modifierClockID": null
      },
      {
        "contentTypeId": 1,
        "name": "Work Instructions",
        "code": "WI",
        "status": null,
        "createdOn": null,
        "creatorClockID": null,
        "modifiedOn": null,
        "modifierClockID": null
      },
      {
        "contentTypeId": 2,
        "name": "Guide Book",
        "code": "GB",
        "status": null,
        "createdOn": null,
        "creatorClockID": null,
        "modifiedOn": null,
        "modifierClockID": null
      },
      {
        "contentTypeId": 3,
        "name": "Design Standards",
        "code": "DS",
        "status": null,
        "createdOn": null,
        "creatorClockID": null,
        "modifiedOn": null,
        "modifierClockID": null
      },
      {
        "contentTypeId": 4,
        "name": "ProcessMaps",
        "code": "M",
        "status": null,
        "createdOn": null,
        "creatorClockID": null,
        "modifiedOn": null,
        "modifierClockID": null
      },
      {
        "contentTypeId": 5,
        "name": "Refernce Doc",
        "code": "RD",
        "status": null,
        "createdOn": null,
        "creatorClockID": null,
        "modifiedOn": null,
        "modifierClockID": null
      },
      {
        "contentTypeId": 6,
        "name": "Activity Page",
        "code": "AP",
        "status": null,
        "createdOn": null,
        "creatorClockID": null,
        "modifiedOn": null,
        "modifierClockID": null
      },
      {
        "contentTypeId": 7,
        "name": "Video",
        "code": null,
        "status": null,
        "createdOn": null,
        "creatorClockID": null,
        "modifiedOn": null,
        "modifierClockID": null
      },
      {
        "contentTypeId": 8,
        "name": "Tasks",
        "code": null,
        "status": null,
        "createdOn": null,
        "creatorClockID": null,
        "modifiedOn": null,
        "modifierClockID": null
      },
      {
        "contentTypeId": 9,
        "name": "Knowledge Pack",
        "code": "KP",
        "status": null,
        "createdOn": null,
        "creatorClockID": null,
        "modifiedOn": null,
        "modifierClockID": null
      },
      {
        "contentTypeId": 10,
        "name": "Criteria Group",
        "code": "CG",
        "status": null,
        "createdOn": null,
        "creatorClockID": null,
        "modifiedOn": null,
        "modifierClockID": null
      },
      {
        "contentTypeId": 11,
        "name": "Table Of Content",
        "code": "TOC",
        "status": null,
        "createdOn": null,
        "creatorClockID": null,
        "modifiedOn": null,
        "modifierClockID": null
      },
      {
        "contentTypeId": 12,
        "name": "Related Content",
        "code": "RC",
        "status": null,
        "createdOn": null,
        "creatorClockID": null,
        "modifiedOn": null,
        "modifierClockID": null
      },
      {
        "contentTypeId": 13,
        "name": "STEP Flow",
        "code": "SF",
        "status": null,
        "createdOn": null,
        "creatorClockID": null,
        "modifiedOn": null,
        "modifierClockID": null
      },
      {
        "contentTypeId": 14,
        "name": "STEP",
        "code": "SP",
        "status": null,
        "createdOn": null,
        "creatorClockID": null,
        "modifiedOn": null,
        "modifierClockID": null
      }
    ];
  fl: any = {
    "SP": true,
    "A": true,
    "D": true,
    "WI": true,
    "CG": true,
    "GB": true,
    "RC": true,
    "C": true,
    "SL": true
  };

  //function start 

  nodes: TreeNode[]

  // ids for connected drop lists
  dropTargetIds = [];
  nodeLookup = {};
  dropActionTodo: DropInfo = null;


  prepareDragDrop(nodes: TreeNode[]) {


    nodes && nodes.forEach((node) => {
      this.dropTargetIds.push(node.id);
      this.nodeLookup[node.id] = node;
      if (node.hasOwnProperty('children')) {
        this.prepareDragDrop(node.children);

      }


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

  getID($i) {
    let d = this.cType.find((node) => {
      return node.contentTypeId == $i
    })

    return d?.code
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
  //functon stop


  ngOnInit(): void {

    this.SharedService.eksLoadAll.emit();

    this.apiError = false;
    this.contentSelected = false;
    console.log("ngOnInit this.type", this.type);
    if (!this.showEksPanel && this.type != '') {
      this.eksRecords = [];
      this.isLoading = true;
      this.subscription = this.activityPageService
        .getEkssearchWICDDocList(this.ctContentId, this.type, this.ctTitle, this.ctDescription)
        .subscribe((res) => {
          this.ekssearchWICDDoc = res;
          this.isLoading = false;
          if (this.ekssearchWICDDoc.hits.hits.length) {
            this.ekssearchWICDDoc.hits.hits.forEach(element => {
              this.eksRecords.push(element._source)
            });
          }
          this.addonsTable$ = this.eksRecords;
          this.eksAddOnSearchData = [...this.addonsTable$]
          this.eksSearchCountCreated = (this.eksRecords.length > 0) ? this.eksRecords.length : 0;
          this.eksAddOnInternalSearchData = new MatTableDataSource(this.addonsTable$);
          this.eksAddOnInternalSearchData.paginator = this.paginator;
        }, (error) => {
          console.error('There was an error!', error);
          this.apiError = true;
        });
    }
    this.loadContainerItems()
  }



  updateMapSet($array, parentContainerItemId) {


    $array.map((node, i) => {

      node["id"] = node.tempId;
      node['index'] = i;
      node['parentContainerItemId'] = parentContainerItemId;
      node['LastUpdateUser'] = sessionStorage.getItem("userMail")

      this.rootObject.push(node)

      if (node.hasOwnProperty('children') && node.children && node.children.length) {
        this.updateMapSet(node.children, node.tempId)
      }
    })

    return this.rootObject;
  }


  saveNested() {
    this.rootObject = [];
    let updateObj =
    {
      "stepFlowId": this.data.activity.stepFlowId,
      "taskId": parseInt(window.location.href.split("/").pop()),
      "containerItems": this.updateMapSet(this.nodes, null)
    }
    console.log(JSON.stringify(updateObj))

    this.activityPageService.updatetaskspecificcontaineritems(updateObj).subscribe((res) => {


      this.loadContainerItems()
      this.dialogRef.close();
    },
      (err) => {
        console.log(err)

      }
    );


  }

  deleteContainer($item) {
    console.log($item)
    const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
      width: '42%',
      data: {
        message: "Are you sure you want to delete!",
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'Yes') {
        this.activityPageService.deleteContainerItems($item.tempId).subscribe((res) => {
          console.log(res)
          this.loadContainerItems()
        }, (err) => {
          console.log(err)
        })

      }
    });
  }


  contentTypeId($i) {
    let d = this.cType.find((node) => {
      return node.code == $i
    })

    return d?.contentTypeId
  }

  mapSet($array) {
    $array.map((node) => {
      let tempId = node.id + " " + Math.random();
      node["tempId"] = node.id;
      node["id"] = tempId;
      node["contentTypeId"] = this.contentTypeId(node.documentCode);
      node["isExpanded"] = true;
      if (node.hasOwnProperty('children') && node.children && node.children.length) {
        this.mapSet(node.children)
      }
    })
    return $array;
  }

  loadContainerItems() {
    this.containerLoading = true;
    console.log(this.data.activity)
    this.activityPageService.getContainerItems(this.data.activity.KnowledgeAssetId).subscribe((nodes: any) => {
      console.log("====================================")

      this.ContainerItems = this.mapSet(nodes);
      this.nodes = this.ContainerItems
      this.prepareDragDrop(this.nodes);
      this.containerLoading = false;
      console.log("this.nodes", this.nodes);
    }, err => {
      console.log(err)
    })



  }

  closeModal(button: any) {
    this.dialogRef.close(button);
  }

  onChange(event, element) {
    if (event.checked) {
      this.selectedAddons.push(element)
    } else {
      this.selectedAddons = this.selectedAddons.filter((child) => {
        if (child.title !== element.title) {
          return child;
        }
      });
    }
  }

  selectAddOns(type) {
    this.contentSelected = true;
    this.type = type;
  }

  submit() {
    // this.dialogRef.close(this.selectedAddons);
    const dialogRef = this.dialog.open(EksaddonsConfirmpopupComponent, {
      width: '42%'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'Yes') {
        this.containerLoading = true;
        let data = this.data.activity
        let getData: any = this.selectedAddons;
        let pushData: any = [];
        getData.forEach(function (item: any) {
          let tableModel: any = {
            activityPageId: data.KnowledgeAssetId,
            assetContentId: item.contentid,
            createdUser: sessionStorage.getItem('userMail'),
          };
          pushData.push(tableModel);
        });


        const param = {
          taskId: parseInt(window.location.href.split("/").pop()),
          stepFlowId: data.stepFlowId,
          containerItems: pushData
        }
        this.loading = true;
        this.TaskCrationPageService.createtaskspecificcontainer(param).subscribe(res => {
          this.loading = false;
          this.chckbk = {};
          this.selectedAddons = [];
          this.SharedService.electedEKSreload.emit(data);
          this.loadContainerItems()
        }, (error) => {
          this.loading = false;
        })
        this.tabstatus = 1;

      }
    });


  }

  getSearchContentType(contentType) {
    this.leftSideContentData = [...this.eksAddOnSearchData]
    let contentTypeContentData = this.leftSideContentData.filter(function (element) {
      return contentType.indexOf(element.assettypecode) > -1;
    });
    this.addonsTable$ = (contentTypeContentData.length >= 0 && contentType.length > 0) ? contentTypeContentData : (this.leftSideContentData.length > 0) ? this.leftSideContentData : '';
    this.eksSearchCountCreated = this.addonsTable$.length;
    this.eksAddOnInternalSearchData = new MatTableDataSource(this.addonsTable$);
    this.eksAddOnInternalSearchData.paginator = this.paginator;
  }

  getSearchFilterType(contentType) {

    console.log(contentType)
    this.leftSideContentData = [...this.eksAddOnSearchData]
    let contentPhaseId = contentType.phaseid;
    let contentTagId = contentType.tagsid;
    let contentTypeFilterData = this.leftSideContentData.filter(function (element) {
      return contentTagId.indexOf(element.tagsid) > -1;
    });
    //console.log("contentTypeFilterData addon length", contentTypeFilterData.length);
    this.addonsTable$ = (contentTypeFilterData.length > 0) ? contentTypeFilterData : (this.leftSideContentData.length > 0) ? this.leftSideContentData : '';
    this.eksSearchCountCreated = this.addonsTable$.length;
    this.eksAddOnInternalSearchData = new MatTableDataSource(this.addonsTable$);
    this.eksAddOnInternalSearchData.paginator = this.paginator;
  }

  eksSearchOutput(eksSearchOutput) {
    this.addonsTable$ = eksSearchOutput;
    this.eksAddOnSearchData = [...this.addonsTable$]
    this.eksAddOnInternalSearchData = new MatTableDataSource(this.addonsTable$);
    this.eksAddOnInternalSearchData.paginator = this.paginator;
  }

  // eksGlobalSearchOutput(eksGlobalSearchOutput) {
  //   this.eksGlobalData$ = eksGlobalSearchOutput;
  //   this.eksGlobalSearchCount = this.eksGlobalData$.length;
  //   this.eksGlobalSearchData = new MatTableDataSource(this.eksGlobalData$);
  //   this.eksGlobalSearchData.paginator = this.paginator2;
  // }

  eksGlobalSearchTermOutput(eksGlobalSearchTermOutput) {
    this.searchTerm = (eksGlobalSearchTermOutput && eksGlobalSearchTermOutput.length > 0) ? eksGlobalSearchTermOutput : '';
    (this.searchTerm && this.searchTerm.length > 0) ? this.getEKSGloablSearchData() : '';
  }

  getEKSGloablSearchData() {
    if (this.searchTerm && this.searchTerm.length > 0) {
      let textbox = this.searchTerm.split("&tags=&a")[0].split("searchText=")[1];

      //this.todoItemsListService.getGlobalSearchDataLocal(this.searchTerm, this.startAt, this.startEnd, this.pageSize).subscribe(data => {
      this.todoItemsListService.getGlobalSearchDataOnCall(textbox, this.startAt, this.startEnd, this.pageSize).subscribe(data => {
        this.eksGlobalData$ = data['results'];
        this.eksGlobalSearchData = new MatTableDataSource(this.eksGlobalData$);
        this.eksGlobalSearchData.paginator = this.paginator2;
        if (this.globalLength === 0) { this.globalLength = (data['total_results'] > 0) ? data['total_results'] : 0; }
        this.eksGlobalSearchCount = (data['total_results'] > 0) ? data['total_results'] : 0;
      });
    }
  }

  eksAddonGlobalSearchPagination(event: PageEvent) {
    this.startAt = (event.pageSize * event.pageIndex) + 1;
    this.startEnd = (event.pageIndex + 1) * event.pageSize;
    this.pageSize = event.pageSize;
    this.globalLength = this.globalLength;
    this.getEKSGloablSearchData();
    console.log("this.pageSize, this.startAt + this.startEnd + this.globalLength", this.pageSize, this.startAt, this.startEnd, this.globalLength);
  }

  eksPWPlaySearchOutput(eksPWPlaySearchOutput) {
    this.eksPWPlayData$ = eksPWPlaySearchOutput;
    this.eksPWPlaySearchCount = this.eksPWPlayData$.length;
    this.eksPWPlaySearchData = new MatTableDataSource(this.eksPWPlayData$);
    this.eksPWPlaySearchData.paginator = this.paginator3;
  }

  eksSearchCount(eksSearchCount) {
    this.eksSearchCountCreated = eksSearchCount + ' Result';
  }

  eksSearchTitle(eksSearchTitle) {
    this.eksSearchTitleCreated = eksSearchTitle;
  }

  eksLeftSearchData(eksLeftSearchData) {
    this.eksLeftSearchDataCreated = eksLeftSearchData;
  }

  nextTab(redirect) {
    if (redirect) {
      this.selectedIndex = this.selectedIndex + 1;
    }
  }

  onTabClick(indexNumber) {
    setTimeout(() => {
      switch (indexNumber) {
        case 0:
          !this.eksAddOnInternalSearchData.paginator
            ? (this.eksAddOnInternalSearchData.paginator = this.paginator)
            : null;
          break;
        case 1:
          !this.eksGlobalSearchData.paginator
            ? (this.eksGlobalSearchData.paginator = this.paginator2)
            : null;
          break;
        case 2:
          !this.eksPWPlaySearchData.paginator
            ? (this.eksPWPlaySearchData.paginator = this.paginator3)
            : null;
          break;
      }
    });
  }

  handleOnContentIDClick(element) {
    let contentType = (element.assettypecode == "I") ? "WI" : (element.assettypecode == "G") ? "GB" : (element.assettypecode == "S") ? "DS" : (element.assettypecode == "A") ? "AP" : (element.assettypecode == "C") ? "CG" : (element.assettypecode == "K") ? "KP" : (element.assettypecode == "R") ? "RC" : (element.assettypecode == "T") ? "TOC" : '';
    sessionStorage.setItem('componentType', contentType);
    sessionStorage.setItem('contentNumber', element.contentid);
    sessionStorage.setItem('contentType', 'published');
    sessionStorage.setItem('redirectUrlPath', 'search');
    sessionStorage.setItem('statusCheck', 'true');

    if (element.assettypecode == 'I' || element.assettypecode == 'G' || element.assettypecode == 'S' || element.assettypecode == 'D') {
      //this.router.navigate([documentPath.publishViewPath, element.contentid]);
      window.open(documentPath.publishViewPath + '/' + element.contentid, '_blank');
    } else if (element.assettypecode === 'M' || element.assettypecode === 'Map') {
      window.open('/process-maps/edit/' + element.contentnumber, '_blank');
      //this.router.navigate(['/process-maps/edit', element.contentnumber]);
    } else {
      var assetTypecode = (element.assettypecode === 'A') ? "AP" : (element.assettypecode === 'K') ? "KP" : (element.assettypecode === 'T') ? "TOC" : (element.assettypecode === 'R') ? "RC" : (element.assettypecode === 'C') ? "CG" : (element.assettypecode === 'P') ? "SP" : (element.assettypecode === 'F') ? "SF" : '';
      window.open(documentPath.publishViewPath + '/' + assetTypecode + '/' + element.contentid, '_blank');
      //this.router.navigate([documentPath.publishViewPath, assetTypecode, element.contentid]);
    }
  }

  openAddonsPopupSearch() {
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
        hiddenAddonsTabs: [AddonsPopupTabDict.Global, AddonsPopupTabDict.PwPlay],
        disableObsoleteDocuments: true,
        submitConfirmationResolve: () => {
          const dialogRef = this.dialog.open(EksaddonsConfirmpopupComponent, {
            width: '42%'
          });

          return dialogRef.afterClosed().pipe(map(result => result === 'Yes'))
        }
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result !== 'No') {
        this.containerLoading = true;
        let currentActivity = this.data.activity;
        const sltContainerItems = result.map(item => ({
          activityPageId: currentActivity.KnowledgeAssetId,
          assetContentId: item.contentid,
          createdUser: sessionStorage.getItem('userMail'),
        }))

        const param = {
          taskId: parseInt(window.location.href.split("/").pop()),
          stepFlowId: currentActivity.stepFlowId,
          containerItems: sltContainerItems
        }

        this.loading = true;

        this.TaskCrationPageService.createtaskspecificcontainer(param).subscribe(res => {
          this.loading = false;
          this.SharedService.electedEKSreload.emit(currentActivity);
          this.loadContainerItems()
        }, (error) => {
          this.loading = false;
        })
      }
    })
  }
}
