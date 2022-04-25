import { ActivatedRoute, Router } from '@angular/router';
import { ContentList } from './content-list.model';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output, ViewChild, ViewChildren } from '@angular/core';
import * as fromActions from './content-list.actions';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CollaborateDialogComponent } from './collaborate-dialog/collaborate-dialog.component';
import { PersistanceService } from '@app/shared/persistance.service';
import { SharedService } from '../../shared/shared.service';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup } from '@angular/forms';
import { ContentListService } from './content-list.service';
import { CreateDocumentService } from '@app/create-document/create-document.service';
import { environment } from '../../../environments/environment';
import { AdminService } from '@app/admin/admin.service';
import { ASSET_STATUSES, Constants, documentPath, oldContentTypeCode } from '@environments/constants';

import { RecordsService1 } from '../../shared/records1.service';
import { ContextService } from '../../../app/shared/component/global-panel/context/context.service';
import * as ContentDataActions from '@app/dashboard/content-list/shared/content-data.actions';
import { delay, filter } from 'rxjs/operators';
import { BaseComponent } from '@app/shared/component/base/base.component';
import { CONTENT_DATA_LOADING_STATUS, LOADING_TYPE } from './shared/content-data.reducer';
import { PaginationCachingDirective } from '@app/shared/directive/pagination-caching.directive';

@Component({
  selector: 'app-content-list',
  templateUrl: './content-list.component.html',
  styleUrls: [ './content-list.component.scss' ]
})
export class ContentListComponent extends BaseComponent implements OnInit, AfterViewInit {
  @ViewChild(PaginationCachingDirective) paginationCachingDirectives;
  contentList$: Observable<ContentList[]>;

  totalRecords: number = 0;
  pageRowCounts = [ 10, 20, 50, this.totalRecords ];

  dataSource: MatTableDataSource<ContentList> = new MatTableDataSource<ContentList>();
  public taskDataSource: any = [];

  isChecked: boolean = false;
  pendingArray = [];
  completeData = [];
  filterPopShow: boolean = false;
  uniqueContentFilterId = [];
  contentFilterQuery = {
    documentType: null,
    id: null,
    title: null,
    pwStatus: null,
    jc: null,
    updatedStartDate: null,
    updatedEndDate: null,
  };
  contentFilterArray = [];
  uniqueFilterName = [];

  uniqueDocType = [];
  uniqueId = [];
  uniqueTitle = [];
  uniqueStatus = [];
  uniqueFilterStatus = [];
  uniqueJC = [];
  tooltip: any;

  contentFilterForm: FormGroup;

  fullView = false;
  alreadyFullView = false;
  dialogTitle: 'Collaborate';
  isLoading: boolean;
  //datasource: ContentList[];
  id: any;
  documentType: string;
  contentId: number;
  flag = false;
  filteredCoauthor: any = [];
  coauthors: any = [];
  selectedcontentOwner: any;
  disableSubmit: boolean = true;
  globalContent: any = {};
  placeholder = 'COMMENT HERE';

  statusCheck: any = false;
  comment = '';
  requestComment = '';
  getFilterData: any;
  //getFilterDataRowCount: any;
  // Output event
  @Output() fullViewEvent = new EventEmitter();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ELEMENT_DATA: ContentList[];

  displayedColumns: string[] = [
    'documentType',
    'contentId',
    'version',
    'title',
    'pwStatus',
    'jc',
    'comments',
    'modified',
    'action'
  ];
  selectedUser:any;
  constructor(
    private store: Store<any>,
    private router: Router,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private persistanceService: PersistanceService,
    private sharedService: SharedService,
    private contentListService: ContentListService,
    private createDocumentService: CreateDocumentService,
    private route: ActivatedRoute,
    public AdminService: AdminService,
    private rservice: RecordsService1,
    private contextService: ContextService
  ) {
    super();
    this.contentFilterForm = new FormGroup({
      docType: new FormControl(),
      id: new FormControl(),
      title: new FormControl(),
      pwStatus: new FormControl(),
      jc: new FormControl(),
      updatedStartDate: new FormControl(),
      updatedEndDate: new FormControl(),
      uniqueContentInput: new FormControl(),
      uniqueNameInput: new FormControl(),


    });

    this.contentFilterQuery.documentType =
      this.contentFilterForm.get('docType');
    this.contentFilterQuery.id = this.contentFilterForm.get('id');
    this.contentFilterQuery.title = this.contentFilterForm.get('title');
    this.contentFilterQuery.pwStatus = this.contentFilterForm.get('pwStatus');
    this.contentFilterQuery.jc = this.contentFilterForm.get('jc');
    this.contentFilterQuery.updatedStartDate = this.contentFilterForm.get('updatedStartDate');
    this.contentFilterQuery.updatedEndDate = this.contentFilterForm.get('updatedEndDate');
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((data) => {
      if ( data.content == 'contentFullView' ) {
        this.fullView = data.content ? true : false;
        this.fullViewEvent.emit(this.fullView);
        this.getFilterData = sessionStorage.getItem('filter');
        if ( this.getFilterData ) {
          //Need to persist filtered value on click of back button
          this.bindingFilterValue();
          if ( this.taskDataSource.length > 0 ) {
            this.dataSource.data = this.taskDataSource;
            this.applyContentFilter();
          }
        }
        if (
          ((this.getFilterData && !data.content) ||
            (!this.getFilterData && data.content)) &&
          this.taskDataSource.length > 0
        ) {
          // If the content is not in full view then we need to show all the data
          this.dataSource.data = this.taskDataSource;
        }
      }else{
        this.removePaginationData();
      }
    });
    //this.store.dispatch(fromActions.loadContentLists());
    //this.loadContentList();
    this.sharedService.loadingValues$.subscribe((data) => {
      this.isLoading = data;

      if ( !data && this.flag ) {
        this.flag = false;
        if ( environment.dashboardContentFlag ) {
          this.router.navigate([ documentPath.draftViewPath, this.contentId ]);
        } else {
          window.open(
            documentPath.draftViewPath + '/' + this.contentId,
            '_blank'
          );
        }
      }
    });
    this.sharedService.publish$.subscribe((data) => {
      this.isLoading = true;
      var publishFlag;
      if ( !data && !publishFlag ) {
        publishFlag = true;
        this.store.dispatch(fromActions.loadContentLists());
      }
    });
  }

  ngAfterViewInit() {
    // this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.loadContentData();
  }

  loadContentData() {
    this.store.select(store => store.contentData.contentDataLoaded).pipe(
      this.unsubsribeOnDestroy,
      filter(status => status === CONTENT_DATA_LOADING_STATUS.INITIAL)
    ).subscribe(() => {
      if ( this.fullView ) {
        this.store.dispatch(ContentDataActions.loadContentData({
          implicitLoading: false,
          loadingType: LOADING_TYPE.FULL
        }));
      } else {
        this.store.dispatch(ContentDataActions.loadContentData({
          implicitLoading: false,
          loadingType: LOADING_TYPE.PARTIAL
        }));
      }
    });

    if ( environment.enableAutoRefreshYourContentWidget ) {
      this.store.select(store => store.contentData.contentDataLoaded).pipe(
        filter(status => status === CONTENT_DATA_LOADING_STATUS.LOADED || status === CONTENT_DATA_LOADING_STATUS.ERROR),
        delay(environment.loadingYourContentWidgetIntervalTimeInMs),
        this.unsubsribeOnDestroy
      ).subscribe(() => this.store.dispatch(ContentDataActions.loadContentData({
        implicitLoading: true,
        loadingType: this.fullView ? LOADING_TYPE.FULL: LOADING_TYPE.PARTIAL
      })));
    }

    this.store.select(store => store.contentData.allContentData).pipe(
      this.unsubsribeOnDestroy
    ).subscribe(dbData => {
      setTimeout(() => {
        if ( !dbData.length ) {
          return;
        }
        this.taskDataSource = dbData;
        this.totalRecords = this.taskDataSource.length;
        this.loadContentList();
      });
    });
  }

  // Load Content List data
  loadContentList() {
    let removeContents = [];
    let contentCounts = 0;
    if ( this.taskDataSource.length > 0 ) {
      this.taskDataSource.forEach((element) => {
        contentCounts = contentCounts + 1;
        if (
          element.documentType != 'M' && element.documentType != 'ProcessMap' &&
          element.documentType != 'N/A'
        ) {
          removeContents.push(element);
        }
        if ( this.taskDataSource.length == contentCounts ) {
          this.taskDataSource = removeContents;
        }
      });
      this.taskDataSource.sort(function (a, b) {
        var dateA = new Date(a.modified).getTime();
        var dateB = new Date(b.modified).getTime();
        return dateB - dateA;
      });
    }
    if ( !this.fullView ) {
      const documentList = this.taskDataSource.slice(0, 5);
      this.isLoading = false;
      this.dataSource.data = documentList;
    } else {
      this.isLoading = false;
      this.totalRecords = this.taskDataSource.length;
      this.getFilterData = sessionStorage.getItem('filter');
      this.dataSource.data = [...this.taskDataSource];
      this.rowCounters();
      this.completeData = this.dataSource.data;
      this.isChecked = false;
      this.uniqueFunction();
      if ( this.getFilterData && this.taskDataSource.length > 0 ) {
        this.bindingFilterValue();
        this.applyContentFilter();
        this.filterPopShow = true;
      }
    }

    this.AdminService.getAllToolTip().subscribe((data) => {
      this.tooltip = data;
      setTimeout(() => {
        this.setToolTip();
      }, 1000);
    });
  }

  setToolTip() {
    this.tooltip.forEach((element) => {
      var tid = element.tokenId.toString();
      let selector = document.querySelector('*[data-tooltip=\'' + tid + '\']');
      if ( selector ) {
        selector.setAttribute('tooltip', element.description);
        selector.setAttribute('ng-reflect-tooltip-value', element.description);
      }
    });
  }

  widgetFullView(value) {
    window.scrollTo(0, 0);
    //this.resetFilterPop();
    this.fullView = !this.fullView;
    this.fullViewEvent.emit(this.fullView);
    if ( this.fullView ) {
      // Routing should be changed based on the view
      if ( value === 'viewMore' ) {
        this.contentFilterForm.reset();
        this.getFilterData = sessionStorage.removeItem('filter');
      }
      this.router.navigate([ 'dashboard' ], {
        queryParams: { content: 'contentFullView' }
      });
      if ( !this.alreadyFullView ) {
        this.alreadyFullView = true;
        this.store.dispatch(ContentDataActions.loadContentData({
          implicitLoading: true,
          loadingType: LOADING_TYPE.REST
        }));
      }

    } else {
      this.router.navigate([ 'dashboard' ]);
      this.removePaginationData();
    }

    this.loadContentList();
  }

  // On Collaborate btn click open dialog
  onCollaborate(element: ContentList) {
    this.openDialog(element);
  }

  // On Publish Click action
  onPublish(element) {
    this.store.dispatch(
      fromActions.publishContentLists({ contentList: element })
    );
  }

  // On Preview Click action
  onPreview(element) {
    this.rservice.UpdateBroadcastMessage('true');
    // element.pwStatus && element.pwStatus.toLowerCase() === 'published'
    //   ? sessionStorage.setItem('contentType', 'published')
    //   : sessionStorage.setItem('contentType', 'draft');
    sessionStorage.setItem('contentType', element.pwStatus);
    sessionStorage.setItem('documentId', element.id);
    sessionStorage.setItem('documentversion', element.version);
    sessionStorage.setItem('documentcontentType', element.documentType);
    sessionStorage.setItem('documentcontentId', element.contentId);
    sessionStorage.setItem('documentcurrentUserEmail', element.creatorClockId);
    sessionStorage.setItem('contentNumber', element.contentId);
    sessionStorage.setItem('componentType', element.documentType);
    sessionStorage.setItem('title', element.title);
    sessionStorage.setItem('documentWorkFlowStatus', element.pwStatus);
    element.pwStatus && (element.pwStatus.toLowerCase() === 'published' || element.pwStatus.toLowerCase() === 'current' || element.pwStatus.toLowerCase() === 'obsolete')
      ? sessionStorage.setItem('documentStatusDetails', 'published')
      : sessionStorage.setItem('documentStatusDetails', 'draft');
    sessionStorage.setItem('documentClassificationDetails', element.jc);
    this.documentType = element.documentType;
    this.contentId = element.contentId;
    if (
      element.documentType == 'GB' ||
      element.documentType == 'WI' ||
      element.documentType == 'DS'
    ) {
      this.flag = true;
    }
    this.sharedService.setPreview(true);
    this.store.dispatch(
      fromActions.previewContentLists({ contentList: element })
    );
  }

  // Function To open a dialog
  openDialog(element) {
    if (
      element.documentType == 'Map' ||
      element.documentType == 'M' ||
      element.documentType == 'ProcessMaps'
    ) {
      let urlData = element.id.toString();
      const dialogRef = this.dialog.open(CollaborateDialogComponent, {
        width: '100%',
        maxWidth: '670px',
        panelClass: 'collab-dialog',
        data: {
          doc: {
            id: element.id,
            title: element.title,
            url: urlData,
            contentType: 'M',
            contentData: element
          }
        },
        disableClose: true
      });
    } else {
      const dialogRef = this.dialog.open(CollaborateDialogComponent, {
        width: '100%',
        maxWidth: '670px',
        panelClass: 'collab-dialog',
        data: {
          doc: {
            id: element.id,
            title: element.title,
            url: element.docUrl,
            contentType: element.documentType,
            outsourceable: element.outsourceable,
            exportAuthorityId: element.exportAuthorityId,
            contentData: element
          }
        },
        disableClose: true
      });
    }
  }

  // Route to the wi-document
  openViewDocument(element) {
    sessionStorage.setItem('title', element.title);
    sessionStorage.setItem('documentWorkFlowStatus', element.pwStatus);
    element.pwStatus && (element.pwStatus.toLowerCase() === 'published' || element.pwStatus.toLowerCase() === 'current' || element.pwStatus.toLowerCase() === 'obsolete')
      ? sessionStorage.setItem('documentStatusDetails', 'published')
      : sessionStorage.setItem('documentStatusDetails', 'draft');
    sessionStorage.setItem('documentClassificationDetails', element.jc);
    //this.router.navigate([`/document-view/view-document`, element.id, element.documentType]);
    this.router.navigate([ documentPath.publishViewPath, element.contentId ]);
  }

  openContent(element, revise = false, preview = false) {
    console.log('openContent', element);
    let getStatusValue = element.pwStatus.toLowerCase().trim();
    const pwStatus = getStatusValue.replace(',', '');
    sessionStorage.setItem('documentId', element.id);
    sessionStorage.setItem('documentversion', element.version);
    sessionStorage.setItem('documentcontentType', element.documentType);
    sessionStorage.setItem('documentWorkFlowStatus', element.pwStatus);
    sessionStorage.setItem('documentcontentId', element.contentId);
    sessionStorage.setItem('documentcurrentUserEmail', element.creatorClockId);
    sessionStorage.setItem('contentNumber', element.contentId);
    sessionStorage.setItem('componentType', element.documentType);
    sessionStorage.setItem('redirectUrlPath', 'dashboard');
    // sessionStorage.setItem('sfID', element.id);
    // sessionStorage.setItem('sfcontentId', element.contentId);
    // sessionStorage.setItem('sfversion', element.version ? element.version : '0');
    sessionStorage.setItem('version', element.version ? element.version : '0');
    // sessionStorage.setItem('sfcontentType', element.documentType);
    element.pwStatus && (pwStatus === 'published' || pwStatus === 'current')
      ? sessionStorage.setItem('documentStatusDetails', 'published')
      : sessionStorage.setItem('documentStatusDetails', 'draft');
    element.pwStatus && (pwStatus === 'published' || pwStatus === 'current' || pwStatus === 'obsolete')
      ? sessionStorage.setItem('statusCheck', 'true')
      : sessionStorage.setItem('statusCheck', 'false');
    element.pwStatus && (pwStatus === 'published' || pwStatus === 'current' || pwStatus === 'obsolete')
      ? sessionStorage.setItem('contentType', 'published')
      : sessionStorage.setItem('contentType', 'draft');
    // element.pwStatus && (pwStatus === 'published' || pwStatus === 'current')
    //   ? sessionStorage.setItem('sfStatus', 'published')
    //   : sessionStorage.setItem('sfStatus', 'draft');
    const documentStatus = (pwStatus === 'published' || pwStatus === 'current' || pwStatus === 'obsolete') ? 'published' : pwStatus;
    if ( element.pwStatus === ASSET_STATUSES.SUBMITTED_FOR_APPROVAL) {
      preview = true;
    }

    if (
      element.documentType == oldContentTypeCode.workInstruction ||
      element.documentType == oldContentTypeCode.guideBook ||
      element.documentType == oldContentTypeCode.designStandard
    ) {
      sessionStorage.setItem('title', element.title);
      sessionStorage.setItem('docUrl', element.docUrl);
      sessionStorage.setItem('documentClassificationDetails', element.jc);

      if (
        pwStatus && (pwStatus === 'published' || pwStatus === 'current' || pwStatus === 'obsolete')
      ) {
        if ( environment.dashboardContentFlag ) {
          this.router.navigate([
            documentPath.publishViewPath,
            element.contentId
          ],{
            queryParams: {
              revise
            }
          });
        } else {
          window.open(
            `${ documentPath.publishViewPath }/${ element.contentId }?revise=${ revise }`,
            '_blank'
          );
        }
      } else {
        if ( environment.dashboardContentFlag ) {
          this.router.navigate([ documentPath.draftViewPath, element.documentType ,element.contentId ], {
            queryParams: {
              id: element.id,
              contentType: element.documentType,
              status: documentStatus,
              version: element.version,
              revise,
              preview
            }
          });
        } else {
          window.open(
            `${ documentPath.draftViewPath }/${ element.documentType }/${ element.contentId }?id=${ element.id }&contentType=${ element.documentType }&status=${ documentStatus }&version=${ element.version }&revise=${ revise }`,
            '_blank'
            );
        }
      }
    } else if (
      element.documentType == 'sf' ||
      element.documentType == 'SF'
    ) {
      if ( element.pwStatus == 'Published' || element.pwStatus == 'Current' || element.pwStatus == 'Obsolete') {
        this.router.navigate([
          documentPath.publishViewPath,
          element.documentType,
          element.contentId
        ], {
          queryParams: {
            contentType: element.documentType,
            version: element.version,
            status: documentStatus,
            revise
          }
        });
      } else {
        this.router.navigate([
          documentPath.stepflowDraft,
          element.id
        ], {
          queryParams: {
            contentType: element.documentType,
            version: element.version,
            status: documentStatus,
            revise,
            preview
          }
        });
      }

    } else if (
      element.documentType == 'SP'
    ) {
      // window.open('/process-maps/create-progressmap/' + element.id, '_blank');

      if ( element.pwStatus == 'Published' || element.pwStatus == 'Current' || element.pwStatus == 'Obsolete' ) {
        this.router.navigate([
          documentPath.publishViewPath,
          element.documentType,
          element.contentId
        ],{
          queryParams: {
            contentType: element.documentType,
            version: element.version,
            status: documentStatus,
            revise
          }
        });
      } else {
        this.router.navigate([
          documentPath.stepDraft,
          element.documentType,
          element.id
        ], {
          queryParams: {
            contentType: element.documentType,
            version: element.version,
            status: documentStatus,
            revise,
            preview
          }
        });
      }
    } else {
      if ( element.pwStatus == 'Published' || element.pwStatus == 'Current' || element.pwStatus == 'Obsolete' ) {
        if ( environment.dashboardContentFlag ) {
          this.router.navigate([
            documentPath.publishViewPath,
            element.documentType,
            element.contentId
          ], {
            queryParams: {
              version: element.version,
              revise
            }
          });
        } else {
          window.open(
            `${ documentPath.publishViewPath }/${ element.documentType }/${ element.contentId }?version=${ element.version }&revise=${ revise }`,
            '_blank'
          );
        }
      } else {
        if ( environment.dashboardContentFlag ) {
          this.router.navigate([
            documentPath.publishViewPath,
            element.documentType,
            element.contentId
          ], {
            queryParams: {
              id: element.id,
              contentType: element.documentType,
              status: documentStatus,
              version: element.version,
              revise,
              preview
            }
          });
        } else {
          window.open(
            `${ documentPath.publishViewPath }/${ element.contentId }?id=${ element.id }&contentType=${ element.documentType }&status=${ documentStatus }&version=${ element.version }&revise=${ revise }`,
            '_blank'
          );
        }
      }
    }
  }

  openMaps(element) {
    // window.open('/process-maps/create-progressmap/' + element.id, '_blank');
    this.router.navigate([ '/process-maps/create-progressmap/', element.id ]);
  }

  // Open file in word Doc
  onSelect(data) {
    if ( data != '' ) {
      var url = 'ms-word:ofe|u|' + data;
      window.location.href = url;
    }
  }

  rowCounters() {
    this.pageRowCounts.splice(0, this.pageRowCounts.length);
    if ( this.totalRecords <= 10 ) {
      this.pageRowCounts.push(this.totalRecords);
    } else if ( this.totalRecords <= 20 ) {
      this.pageRowCounts.push(10, this.totalRecords);
    } else if ( this.totalRecords <= 50 ) {
      this.pageRowCounts.push(10, 20, this.totalRecords);
    } else if ( this.totalRecords > 50 ) {
      this.pageRowCounts.push(10, 20, 50, this.totalRecords);
    }

  }

  toogleChanges() {
    this.resetFilterPop();
    this.filterPopShow = false;
    if ( this.isChecked === true ) {
      this.pendingArray = [];
      this.dataSource.data.forEach((value) => {
        if ( value.pwStatus != 'Published' ) {
          this.pendingArray.push(value);
        }
      });
      this.dataSource.data = this.pendingArray;
    } else if ( this.isChecked === false ) {
      this.dataSource.data = this.completeData;
    }
    sessionStorage.removeItem('filter');
  }

  applyFilter(filterValue: string) {
    let filterUniqueStatus = this.uniqueStatus;
    const result = filterUniqueStatus.filter(a => a.toLowerCase()
    .startsWith(filterValue.toLowerCase()));
    this.uniqueFilterStatus = result;
  }

  clearFilter() {
    this.dataSource.filter = '';
  }

  filterpop() {
    this.filterPopShow = true;
  }

  closeFilterPop() {
    this.filterPopShow = false;
  }

  resetFilterPop() {
    this.contentFilterForm.reset();
    this.removePaginationData();
    // When form reset, need to apply manually
    // filter on contentId and name dropdown to reset
    // list of options to
    this.applyContentIdFilter('');
    this.applyNameFilter('');
    sessionStorage.removeItem('filter');
    this.dataSource.data = [...this.taskDataSource];
    if ( this.getFilterData ) {
      this.totalRecords = this.taskDataSource.length;
    }
  }

  applyContentIdFilter(filterValue: string) {
    this.uniqueContentFilterId = this.uniqueId.filter(a => a?.toString().toLowerCase()
      .includes(filterValue.toString().toLowerCase()));
  }

  applyNameFilter(filterValue: string) {
    let filterUniqueStatusNew = this.uniqueTitle;
    const result = filterUniqueStatusNew.filter(a => a.toString().toLowerCase()
    .includes(filterValue.toString().toLowerCase()));
    this.uniqueFilterName = result;
  }

  uniqueFunction() {
    let tasklistdata = this.taskDataSource;
    let documentTypeArray = [];
    let idArray = [];
    let titleArray = [];
    let statusArray = [];
    let jcArray = [];

    for ( let i in tasklistdata ) {
      documentTypeArray.push(tasklistdata[i].documentType);
      idArray.push(tasklistdata[i].contentId);
      titleArray.push(tasklistdata[i].title);
      statusArray.push(tasklistdata[i].pwStatus);
      jcArray.push(tasklistdata[i].jc);
    }

    this.uniqueDocType = documentTypeArray.filter(
      (elem, i, arr) => arr.indexOf(elem) === i && elem !== null
    );
    this.uniqueId = idArray.filter((elem, i, arr) => arr.indexOf(elem) === i);
    this.uniqueContentFilterId = this.uniqueId;

    this.uniqueTitle = titleArray.filter(
      (elem, i, arr) => arr.indexOf(elem) === i
    );
    this.uniqueStatus = statusArray.filter(
      (elem, i, arr) => arr.indexOf(elem) === i
    );
    this.uniqueFilterStatus = this.uniqueStatus;
    this.uniqueFilterName = this.uniqueTitle;

    this.uniqueJC = jcArray.filter((elem, i, arr) => arr.indexOf(elem) === i);
  }

  applyContentFilter() {
    this.removePaginationData();
    let arrayContentData = [];
    this.contentFilterArray = [];
    let dataholders = this.taskDataSource;
    let formData = JSON.stringify(this.contentFilterForm.value);
    sessionStorage.setItem('filter', formData);
    const isEmpty = Object.values(this.contentFilterForm.value).every(
      (x) => x === null || x === ''
    );
    if ( isEmpty ) {
      this.resetFilterPop();
    }

    dataholders.forEach((element) => {
      let emptyFlag = '';
      let checkingFlag = '';

      if (
        this.contentFilterForm.value.docType != '' &&
        this.contentFilterForm.value.docType != undefined &&
        this.contentFilterForm.value.docType != null
      ) {
        emptyFlag = emptyFlag + '1';
        if ( element.documentType === this.contentFilterForm.value.docType ) {
          checkingFlag = checkingFlag + '1';
        } else {
          checkingFlag = checkingFlag + '0';
        }
      } else {
        emptyFlag = emptyFlag + '0';
        checkingFlag = checkingFlag + '0';
      }

      if (
        this.contentFilterForm.value.id != '' &&
        this.contentFilterForm.value.id != undefined &&
        this.contentFilterForm.value.id != null
      ) {
        emptyFlag = emptyFlag + '1';
        if ( element.contentId && element.contentId.toLowerCase().includes(this.contentFilterForm.value.id.toLowerCase()) ) {
          checkingFlag = checkingFlag + '1';
        } else {
          checkingFlag = checkingFlag + '0';
        }
      } else {
        emptyFlag = emptyFlag + '0';
        checkingFlag = checkingFlag + '0';
      }

      if (
        this.contentFilterForm.value.title != '' &&
        this.contentFilterForm.value.title != undefined &&
        this.contentFilterForm.value.title != null
      ) {
        emptyFlag = emptyFlag + '1';
        if ( element.title && element.title.toLowerCase().includes(this.contentFilterForm.value.title.toLowerCase()) ) {
          checkingFlag = checkingFlag + '1';
        } else {
          checkingFlag = checkingFlag + '0';
        }
      } else {
        emptyFlag = emptyFlag + '0';
        checkingFlag = checkingFlag + '0';
      }

      if (
        this.contentFilterForm.value.pwStatus != '' &&
        this.contentFilterForm.value.pwStatus != undefined &&
        this.contentFilterForm.value.pwStatus != null
      ) {
        emptyFlag = emptyFlag + '1';
        if ( element.pwStatus === this.contentFilterForm.value.pwStatus ) {
          checkingFlag = checkingFlag + '1';
        } else {
          checkingFlag = checkingFlag + '0';
        }
      } else {
        emptyFlag = emptyFlag + '0';
        checkingFlag = checkingFlag + '0';
      }

      if (
        this.contentFilterForm.value.jc != '' &&
        this.contentFilterForm.value.jc != undefined &&
        this.contentFilterForm.value.jc != null
      ) {
        emptyFlag = emptyFlag + '1';
        if ( element.jc === this.contentFilterForm.value.jc ) {
          checkingFlag = checkingFlag + '1';
        } else {
          checkingFlag = checkingFlag + '0';
        }
      } else {
        emptyFlag = emptyFlag + '0';
        checkingFlag = checkingFlag + '0';
      }

      if ( this.contentFilterForm.value.updatedStartDate && this.contentFilterForm.value.updatedEndDate ) {
        emptyFlag = emptyFlag + '1';
        const modifiedDate = +new Date(element.modified);

        if ( modifiedDate >= +(this.contentFilterForm.value.updatedStartDate.setUTCHours(0, 0, 0, 0))
          && modifiedDate <= +this.contentFilterForm.value.updatedEndDate.setUTCHours(23, 59, 59, 999) ) {
          checkingFlag = checkingFlag + '1';
        } else {
          checkingFlag = checkingFlag + '0';
        }
      } else {
        emptyFlag = emptyFlag + '0';
        checkingFlag = checkingFlag + '0';
      }

      if ( emptyFlag == checkingFlag ) {
        this.contentFilterArray.push(element);
      }
    });

    arrayContentData = this.contentFilterArray;
    this.dataSource.data = [...arrayContentData];
  }

  /*
  onRequestApproval(element) {
      this.isLoading = true;
      this.contentListService.requestApproval(element).subscribe(
        (data) => {
          this.isLoading = false;
        },
        (error) => {
          console.error('There was an error!', error);
          this.isLoading = false;
        }
      );
  }
  */

  onRequestApproval(element) {
    if ( this.globalContent.documentType == 'ProcessMaps' ) {
      this.filteredCoauthor = [];
      this.dialog.closeAll();
      let element = this.globalContent;
      let approvalElement = {
        id: element.id,
        contentId: element.contentId,
        docUrl: element.docUrl,
        title: element.title,
        baer: element.baer,
        comments: this.requestComment,
        file: element.file,
        outsourceable: element.outsourceable,
        serverRedirectedEmbedUrl: element.serverRedirectedEmbedUrl,
        fileLeafRef: element.fileLeafRef,
        documentType: 'M',
        jc: element.jc,
        pwStatus: element.pwStatus,
        modified: element.modified,
        creatorClockId: element.creatorClockId,
        contentOwnerMail: element.contentOwnerMail
          ? element.contentOwnerMail
          : 'pwesw1@pwesw2.onmicrosoft.com'
      };

      let selectedAuthor = this.filteredCoauthor.find((data) => {
        return data.displayName == this.selectedcontentOwner;
      });
      if ( selectedAuthor ) {
        this.globalContent.contentOwnerId = selectedAuthor.userPrincipalName;
        this.globalContent.contentOwnerMail = selectedAuthor.userPrincipalName;
        this.globalContent.contentOwnerName = selectedAuthor.displayName;
      } else {
        this.globalContent.contentOwnerId =
          this.globalContent.contentOwnerId ||
          this.globalContent.contentOwnerMail;
        this.globalContent.contentOwnerMail =
          this.globalContent.contentOwnerId ||
          this.globalContent.contentOwnerMail;
      }
      this.globalContent['comments'] = this.requestComment;
      this.globalContent['documentType'] = 'M';
      this.globalContent['contentOwnerMail'] = this.globalContent[
        'contentOwnerMail'
        ]
        ? this.globalContent['contentOwnerMail']
        : 'pwesw1@pwesw2.onmicrosoft.com';
      (this.globalContent['ContentOwnerAADId'] = this.globalContent.Aadid
        ? this.globalContent.Aadid
        : ''),
        (this.filteredCoauthor = []);
      this.dialog.closeAll();

      this.isLoading = true;
    } else {
      let selectedAuthor = this.filteredCoauthor.find((data) => {
        return data.displayName == this.selectedcontentOwner;
      });
      if ( selectedAuthor ) {
        this.globalContent.contentOwnerId = selectedAuthor.userPrincipalName;
        this.globalContent.contentOwnerMail = selectedAuthor.userPrincipalName;
        this.globalContent.contentOwnerName = selectedAuthor.displayName;
      } else {
        this.globalContent.contentOwnerId =
          this.globalContent.contentOwnerId ||
          this.globalContent.contentOwnerMail;
        this.globalContent.contentOwnerMail =
          this.globalContent.contentOwnerId ||
          this.globalContent.contentOwnerMail;
      }
      let userProfileDataObj = JSON.parse(sessionStorage.getItem('userData'));
      this.globalContent.userName = userProfileDataObj.displayName;
      this.globalContent['comments'] = this.requestComment;
      (this.globalContent['ContentOwnerAADId'] = this.globalContent.Aadid
        ? this.globalContent.Aadid
        : ''),
        (this.filteredCoauthor = []);
      this.dialog.closeAll();
      this.isLoading = true;
    }

    this.contentListService.requestApproval(this.globalContent).subscribe(
      (data) => {
        this.isLoading = false;
        this.store.dispatch(ContentDataActions.resetContentData());
      },
      (error) => {
        console.error('There was an error!', error);
        this.isLoading = false;
      }
    );
  }

  openRequestModal(requestApprovalTemplate, element) {
    this.globalContent = { ...element };
    this.selectedcontentOwner =
      element.contentOwnerMail || element.contentOwnerId;
    this.disableSubmit = this.selectedcontentOwner ? false : true;
    this.requestComment = '';
    this.sharedService
      .getUserProfileByEmail(
        this.selectedcontentOwner,
        Constants.apiQueryString
      )
      .subscribe(
        (userProfileData) => {
          this.globalContent.contentOwnerName = userProfileData['displayName'];
          this.globalContent.Aadid = userProfileData['aadId'];
          this.selectedcontentOwner = userProfileData['displayName'];
        },
        (error) => {
          console.error('There was an error!', error);
        }
      );
    let dialogRef = this.dialog.open(requestApprovalTemplate, {
      width: '450px',
      height: '510px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  filterCoauthor(name) {
    if ( name && name.length == 3 ) {
      this.createDocumentService
        .retrieveCoauthor(name)
        .subscribe((response) => {
          this.filteredCoauthor = response['value'];
          this.disableSubmit = this.filteredCoauthor.length == 0;
        });
    } else if ( name.length == 0 ) {
      this.filteredCoauthor = [];
      this.disableSubmit = true;
    }
  }

  onCloseButtonClick() {
    this.dialog.closeAll();
    this.filteredCoauthor = [];
  }

  bindingFilterValue() {
    // Updating the form data using the previous filtered value
    let formDataCopy = JSON.parse(this.getFilterData);
    this.contentFilterForm.setValue({
      docType: formDataCopy['docType'],
      id: formDataCopy['id'],
      title: formDataCopy['title'],
      pwStatus: formDataCopy['pwStatus'],
      jc: formDataCopy['jc'],
      updatedStartDate: formDataCopy['updatedStartDate'],
      updatedEndDate: formDataCopy['updatedEndDate']
    });
  }

  removePaginationData() {
    this.paginationCachingDirectives?.removePaginationData();
  }
}
