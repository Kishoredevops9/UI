import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { TodoItemsList } from './todo-items-list.model';
import { Observable, merge } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from '@environments/environment';
import { Constants, documentPath, oldContentTypeCode, contentTypeCode, DATE_FORMAT, ASSET_STATUSES } from '@environments/constants';
import { TodoItemsListService } from './todo-items-list.service';
import { DatePipe } from '@angular/common';
import { delay, filter } from 'rxjs/operators';
import { TODO_DATA_LOADING_STATUS, LOADING_TYPE } from './shared/todo-data.reducer';
import * as TodoDataActions from '@app/dashboard/todo-items-list/shared/todo-data.actions';
import { BaseComponent } from '@app/shared/component/base/base.component';
import { ContentList } from '@app/dashboard/content-list/content-list.model';
import * as ContentDataActions from '@app/dashboard/content-list/shared/content-data.actions';
import { PaginationCachingDirective } from '@app/shared/directive/pagination-caching.directive';
let datePipe = new DatePipe("en-US");
@Component({
  selector: 'app-todo-items-list',
  templateUrl: './todo-items-list.component.html',
  styleUrls: ['./todo-items-list.component.scss'],
})
export class TodoItemsListComponent extends BaseComponent implements OnInit, AfterViewInit {
  @ViewChild(PaginationCachingDirective) paginationCachingDirectives;
  todoItemslist$: Observable<TodoItemsList[]>;
  dataList: any;
  isLoading = true;

  totalRecords: number = 0;
  pageRowCounts = [10, 20, 50, this.totalRecords];

  filterPopShow: boolean = false;

  filterQuery = {
    action: null,
    type: null,
    contentId: null,
    name: null,
    requestDateStart: null,
    requestDateEnd: null,
  };
  filterArray = [];

  filterForm: FormGroup;

  uniqueAction = [];
  uniqueType = [];
  uniqueContentId = [];
  uniqueContentFilterId = [];
  uniqueName = [];
  uniqueFilterName = [];

  showHideForm: FormGroup;

  fullView = false;
  alreadyFullView = false;
  action = null;
  type = null;
  contentId = null;
  version = null;
  name = null;
  requestDateStart = null;
  requestDateEnd = null;
  done = null;
  cbValues = null;

  dataSource: MatTableDataSource<TodoItemsList> = new MatTableDataSource<TodoItemsList>();

  displayedColumns: string[] = [
    'actionName',
    'contentCode',
    'contentId',
    'version',
    'name',
    'dueDate',
    'done',
  ];
  getFilterData: any;
  todoData = [];
  // Output Event
  @Output() fullViewEvent = new EventEmitter();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private store: Store<any>,
    private ngxService: NgxUiLoaderService,
    private router: Router,
    private route: ActivatedRoute,
    private todoItemsListService: TodoItemsListService,
  ) {
    super();

    this.showHideForm = new FormGroup({
      actionName: new FormControl(true),
      contentCode: new FormControl(true),
      contentId: new FormControl(true),
      name: new FormControl(true),
      requestDateStart: new FormControl(),
      requestDateEnd: new FormControl(),
      done: new FormControl(true),
    });
    this.action = this.showHideForm.get('actionName');
    this.type = this.showHideForm.get('contentCode');
    this.contentId = this.showHideForm.get('contentId');
    this.name = this.showHideForm.get('name');
    this.requestDateStart = this.showHideForm.get('requestDateStart');
    this.requestDateEnd = this.showHideForm.get('requestDateEnd');
    this.done = this.showHideForm.get('done');

    this.filterForm = new FormGroup({
      actionFilter: new FormControl(),
      typeFilter: new FormControl(),
      contentIdFilter: new FormControl(),
      nameFilter: new FormControl(),
      requestDateStartFilter: new FormControl(),
      requestDateEndFilter: new FormControl(),
      uniqueContentInput: new FormControl(),
      uniqueNameInput: new FormControl(),
    });

    this.filterQuery.action = this.filterForm.get('actionFilter');
    this.filterQuery.type = this.filterForm.get('typeFilter');
    this.filterQuery.contentId = this.filterForm.get('contentIdFilter');
    this.filterQuery.name = this.filterForm.get('nameFilter');
    this.filterQuery.requestDateStart = this.filterForm.get('requestDateStartFilter');
    this.filterQuery.requestDateEnd = this.filterForm.get('requestDateEndFilter');
  }

  ngOnInit() {
    const location = window.location.href;
    const isFullViewUrl = location.includes("todoFullView");
    this.fullView = isFullViewUrl;
    //this.store.dispatch(fromActions.loadTodoItemsList());
    this.loadToDoItemsList();
    this.route.queryParams.subscribe((data) => {
      if (data.content == "todoFullView") {
        this.fullView = data.content ? true : false;
        this.fullViewEvent.emit(this.fullView);
        this.getFilterData = sessionStorage.getItem('filter');
        if (this.dataList && this.dataList.length > 0) {
          this.dataSource.data = this.todoData;
        }
        if (this.getFilterData) { //Need to persist filtered value on click of back button
          this.dataList = this.todoData;
          this.totalRecords = this.todoData && this.todoData.length;
          this.bindingFilterValue();
          if (this.dataList && this.dataList.length > 0) {
            this.applyFilter();
          }
        }
      } else {
        this.removePaginationData();
      }
    }
    )
  }

  ngAfterViewInit() {
    let o1: Observable<boolean> = this.action.valueChanges;
    let o2: Observable<boolean> = this.type.valueChanges;
    let o6: Observable<boolean> = this.contentId.valueChanges;
    let o3: Observable<boolean> = this.name.valueChanges;
    let o4: Observable<boolean> = this.requestDateStart.valueChanges;
    let o5: Observable<boolean> = this.requestDateEnd.valueChanges;
    let o7: Observable<boolean> = this.done.valueChanges;

    merge(o1, o2, o3, o4, o5, o6, o7).subscribe((v) => {
      this.columnDefinitions[0].hide = this.action.value;
      this.columnDefinitions[1].hide = this.type.value;
      this.columnDefinitions[2].hide = this.contentId.value;
      this.columnDefinitions[3].hide = this.name.value;
      this.columnDefinitions[4].hide = this.requestDateStart.value && this.requestDateEnd.value;
      this.columnDefinitions[5].hide = this.done.value;
    });
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.loadTodoItemsData();
  }

  // Update Collaborate To do List
  updateCollaborateToDoTast(element: any, event) {
    console.log(event.checked);
    if (event.checked) {
    }
  }

  loadTodoItemsData(){
    this.store.select(store => store.todoData.todoDataLoaded).pipe(
      this.unsubsribeOnDestroy,
      filter(status => status === TODO_DATA_LOADING_STATUS.INITIAL)
    ).subscribe(() => {
      if ( this.fullView ) {
        this.store.dispatch(TodoDataActions.loadTodoData({
          implicitLoading: false,
          loadingType: LOADING_TYPE.FULL
        }));
      } else {
        this.store.dispatch(TodoDataActions.loadTodoData({
          implicitLoading: false,
          loadingType: LOADING_TYPE.PARTIAL
        }));
      }
    });

    if ( environment.enableAutoRefreshYourTodoWidget ) {
      this.store.select(store => store.todoData.todoDataLoaded).pipe(
        filter(status => status === TODO_DATA_LOADING_STATUS.LOADED || status === TODO_DATA_LOADING_STATUS.ERROR),
        delay(environment.loadingYourContentWidgetIntervalTimeInMs),
        this.unsubsribeOnDestroy
      ).subscribe(() => this.store.dispatch(TodoDataActions.loadTodoData({
        implicitLoading: true,
        loadingType: this.fullView ? LOADING_TYPE.FULL: LOADING_TYPE.PARTIAL
      })));
    }

    this.store.select(store => store.todoData.allTodoData).pipe(
      this.unsubsribeOnDestroy
    ).subscribe(dbData => {
      setTimeout(() => {
        if ( !dbData.length ) {
          return;
        }
        this.todoData = dbData;
        this.totalRecords = this.todoData.length;
        this.loadToDoItemsList();
      });
    });
  }
  // Load To Do Items List
  loadToDoItemsList() {
    let data = [ ...this.todoData ];
    this.isLoading = false;
    if ( !this.fullView ) {
      //Removing Map from Todo Widget

      if ( Array.isArray(data) && data.length ) {
        this.sortFunction(data);
        this.dataList = data.slice(0, 5);
        this.dataSource.data = this.dataList;
      }
    } else {
      //Removing Map from Todo Widget
      let dataRemover = data;
      let tempdata = [];
      let datacounts = 0;
      dataRemover.forEach((elem) => {
        datacounts = datacounts + 1;
        if ( elem.contentCode != 'M' && elem.contentCode != 'N/A' && elem.contentCode != 'ProcessMap' && elem.contentCode != 'ProcessMaps' ) {
          tempdata.push(elem);
        }
        if ( dataRemover.length == datacounts ) {
          data = tempdata;
        }
      });

      if ( Array.isArray(data) && data.length ) {
        this.sortFunction(data);
        this.todoData = [ ...data ];
        this.dataList = data;
        this.dataSource.data = [ ...data ];
        this.totalRecords = data.length;
        this.rowCounters();

        this.uniqueFunction();
        this.getFilterData = sessionStorage.getItem('filter');
        if ( this.getFilterData && this.dataList.length > 0 ) { //Need to persist filtered value on click of back button
          this.bindingFilterValue();
          this.applyFilter();
          this.filterPopShow = true;
        } else {
          this.filterPopShow = false;
        }
      }
    }
  }

  applyContentIdFilter(filterValue: string) {
    this.uniqueContentFilterId = this.uniqueContentId.filter(a => a?.toString().toLowerCase()
      .includes(filterValue.toString().toLowerCase()));
  }

  applyNameFilter(filterValue: string) {
    let filterUniqueStatus = this.uniqueName;
    const result = filterUniqueStatus.filter(a => a.toString().toLowerCase()
    .includes(filterValue.toString().toLowerCase()));
    this.uniqueFilterName = result;
  }

  applyFilter() {
    let arrayData = [];
    this.filterArray = [];
    let dataholders = this.dataList;
    let formData = JSON.stringify(this.filterForm.value);
    sessionStorage.setItem('filter', formData);
    const isEmpty = Object.values(this.filterForm.value).every(x => (x === null || x === ''));
    if (isEmpty) {
      this.resetFilterPop();
    }
    dataholders.forEach((element) => {
      let nonEmptyFlag = '';
      let conditionFlag = '';

      if (
        this.filterForm.value.actionFilter != '' &&
        this.filterForm.value.actionFilter != undefined &&
        this.filterForm.value.actionFilter != null
      ) {
        nonEmptyFlag = nonEmptyFlag + '1';
        if (element.actionName === this.filterForm.value.actionFilter) {
          conditionFlag = conditionFlag + '1';
        } else {
          conditionFlag = conditionFlag + '0';
        }
      } else {
        nonEmptyFlag = nonEmptyFlag + '0';
        conditionFlag = conditionFlag + '0';
      }

      if (
        this.filterForm.value.typeFilter != '' &&
        this.filterForm.value.typeFilter != undefined &&
        this.filterForm.value.typeFilter != null
      ) {
        nonEmptyFlag = nonEmptyFlag + '1';
        if (element.contentCode === this.filterForm.value.typeFilter) {
          conditionFlag = conditionFlag + '1';
        } else {
          conditionFlag = conditionFlag + '0';
        }
      } else {
        nonEmptyFlag = nonEmptyFlag + '0';
        conditionFlag = conditionFlag + '0';
      }

      if (
        this.filterForm.value.contentIdFilter != '' &&
        this.filterForm.value.contentIdFilter != undefined &&
        this.filterForm.value.contentIdFilter != null
      ) {
        nonEmptyFlag = nonEmptyFlag + '1';
        if (element.contentId === this.filterForm.value.contentIdFilter) {
          conditionFlag = conditionFlag + '1';
        } else {
          conditionFlag = conditionFlag + '0';
        }
      } else {
        nonEmptyFlag = nonEmptyFlag + '0';
        conditionFlag = conditionFlag + '0';
      }

      if (
        this.filterForm.value.nameFilter != '' &&
        this.filterForm.value.nameFilter != undefined &&
        this.filterForm.value.nameFilter != null
      ) {
        nonEmptyFlag = nonEmptyFlag + '1';
        if (element.name === this.filterForm.value.nameFilter) {
          conditionFlag = conditionFlag + '1';
        } else {
          conditionFlag = conditionFlag + '0';
        }
      } else {
        nonEmptyFlag = nonEmptyFlag + '0';
        conditionFlag = conditionFlag + '0';
      }
      if ( this.filterForm.value.requestDateStartFilter && this.filterForm.value.requestDateEndFilter ) {
        nonEmptyFlag = nonEmptyFlag + '1';
        const dueDate = +new Date(element.dueDate);

        if ( dueDate >= +(this.filterForm.value.requestDateStartFilter.setUTCHours(0, 0, 0, 0))
          && dueDate <= +this.filterForm.value.requestDateEndFilter.setUTCHours(23, 59, 59, 999) ) {
          conditionFlag = conditionFlag + '1';
        } else {
          conditionFlag = conditionFlag + '0';
        }
      } else {
        nonEmptyFlag = nonEmptyFlag + '0';
        conditionFlag = conditionFlag + '0';
      }

      if (nonEmptyFlag == conditionFlag) {
        this.filterArray.push(element);
      }
    });

    arrayData = this.filterArray;
    this.dataSource.data = arrayData;
  }

  clearFilter() {
    this.dataSource.filter = '';
  }

  widgetFullView(value) {
    //this.resetFilterPop();
    this.fullView = !this.fullView;
    this.fullViewEvent.emit(this.fullView);
    if (this.fullView) { // Routing should be changed based on the view
      if (value === 'viewMore') {
        this.resetFilterPop();
      }
      this.router.navigate(['dashboard'], { queryParams: { content: 'todoFullView' } });

      if ( !this.alreadyFullView ) {
        this.alreadyFullView = true;
        this.store.dispatch(TodoDataActions.loadTodoData({
          implicitLoading: true,
          loadingType: LOADING_TYPE.REST
        }));
      }
    } else {
      this.router.navigate(['dashboard']);
      this.removePaginationData();
    }
    this.loadToDoItemsList();
  }

  getDisplayedColumns(): string[] {
    return this.columnDefinitions
      .filter((col) => col.hide)
      .map((col) => col.def);
  }

  columnDefinitions = [
    { def: 'actionName', label: 'Action', hide: !this.action },
    { def: 'contentCode', label: 'Type', hide: !this.type },
    { def: 'contentId', label: 'content Id', hide: !this.contentId },
    { def: 'version', label: 'Version', hide: !this.version },
    { def: 'name', label: 'Name', hide: !this.name },
    { def: 'dueDate', label: 'Due Date', hide: !this.requestDateStart && !this.requestDateEnd },
    { def: 'done', label: 'Done', hide: !this.done },
  ];

  // Function to open Document in ms word
  onSelect(data) {
    console.log("onSelect", data);

    sessionStorage.setItem('documentId', data.id);
    sessionStorage.setItem('documentversion', data.version);
    sessionStorage.setItem('documentcontentType', data.contentCode);
    sessionStorage.setItem('documentcontentId', data.contentId);
    sessionStorage.setItem('documentWorkFlowStatus', data.contentStatus);
    sessionStorage.setItem('documentStatusDetails', "draft");
    sessionStorage.setItem('title', data.name);
    sessionStorage.setItem('statusCheck', "false");
    sessionStorage.setItem('contentType', "draft");
    sessionStorage.setItem('contentNumber', data.contentId);
    sessionStorage.setItem('componentType', data.contentCode);
    sessionStorage.setItem('redirectUrlPath', 'dashboard');
    // sessionStorage.setItem('sfID', data.id);
    // sessionStorage.setItem('sfcontentId', data.contentId);
    // sessionStorage.setItem('sfversion', data.version);
    // sessionStorage.setItem('sfStatus', 'draft');
    // sessionStorage.setItem('sfcontentType', data.contentCode);
    if (data.contentCode == 'WI' || data.contentCode == 'DS' || data.contentCode == 'GB') {
      if (environment.dashboardContentFlag) {
        this.router.navigate([documentPath.draftViewPath, data.contentCode, data.contentId], {
          queryParams: {
            id: data.id,
            contentType: data.contentCode,
            status: 'draft',
            version: data.version
          }
        });
      } else {
        window.open(`${ documentPath.draftViewPath }/${ data.contentCode }/${ data.contentId }?id=${ data.id }&contentType=${ data.contentCode }&status=${ 'draft' }&version=${ data.version }`, '_blank');
      }
    } else if (data.contentCode == "M" || data.contentCode == "ProcessMaps" ) {
      // window.open('/process-maps/create-progressmap/' + data.id, '_blank');
      // this.router.navigate(['/process-maps/create-progressmap/' + data.id]);

      this.router.navigate([
        documentPath.publishViewPath,
        data.contentCode,
        data.contentId
      ]);

    }
   // process-maps/

   else if (  data.contentCode == "SF") {

    this.router.navigate([
      "process-maps",
      "create-progressmap",
      data.id
    ], {
      queryParams: {
        id: data.id,
        contentType: data.contentCode,
        version: data.version,
        status: 'draft'
      }
    });

   }
    else if (  data.contentCode == "SP") {
          this.router.navigate([
            "process-maps",
            data.contentCode,
            data.id
          ], {
            queryParams: {
              id: data.id,
              contentType: data.contentCode,
              version: data.version,
              status: 'draft'
            }
          });
    }
    else if (  data.contentCode == "T") {
      this.router.navigate(['/task/edit-task/', data.taskId]);
    }
    else {
      if (environment.dashboardContentFlag) {
        this.router.navigate([documentPath.publishViewPath, data.contentCode, data.contentId], {
          queryParams: {
            contentType: data.contentCode,
            version: data.version,
            status: 'draft',
            id: data.id
          }
        });
      } else {
        window.open(`${ documentPath.publishViewPath }/${ data.contentId }?id=${ data.id }&contentType=${ data.contentCode }&version=${ data.version }&status=draft`, '_blank');
      }
    }

  }

  onMapSelect(data) {
    if (
      data.contentCode === 'Map' ||
      data.contentCode === 'M' ||
      data.contentCode === 'm' ||
      data.contentCode === 'map' ||
      data.contentCode === 'SF' ||
      data.contentCode === 'sf' ||
      data.contentCode === 'Step Flow' ||
      data.contentCode === 'step flow'
    ) {
      console.log('Maps Select in TODO', data);
      this.router.navigate(['/process-maps/create-progressmap/', data.id]);
      // window.open('/process-maps/create-progressmap/' + data.id, '_blank');

    }
  }

  rowCounters() {
    this.pageRowCounts.splice(0, this.pageRowCounts.length);
    if (this.totalRecords <= 10) {
      this.pageRowCounts.push(this.totalRecords);
    } else if (this.totalRecords <= 20) {
      this.pageRowCounts.push(10, this.totalRecords);
    } else if (this.totalRecords <= 50) {
      this.pageRowCounts.push(10, 20, this.totalRecords);
    } else if (this.totalRecords > 50) {
      this.pageRowCounts.push(10, 20, 50, this.totalRecords);
    }

    if (this.dataSource.paginator) {
      this.dataSource.paginator.pageSizeOptions = this.pageRowCounts;
    }
  }

  filterpop() {
    this.filterPopShow = true;
  }

  closeFilterPop() {
    this.filterPopShow = false;
  }

  resetFilterPop() {
    // this.filterPopShow = false;

    //this.dataSource.filter = '';
    this.filterForm.value.uniqueContentInput = '';
    this.filterForm.value.uniqueNameInput = '';
    this.applyContentIdFilter('');
    this.applyNameFilter('');
    this.filterForm.reset();
    this.getFilterData = sessionStorage.removeItem('filter');
    this.dataSource = new MatTableDataSource(this.dataList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    if (this.getFilterData) {
      this.totalRecords = this.todoData.length;
    }
  }

  addFilter() {
    this.filterPopShow = false;
  }

  uniqueFunction() {
    let listdata = this.dataList;
    let actionArray = [];
    let typeArray = [];
    let contentIdArray = [];
    let nameArray = [];

    for (let i in listdata) {
      actionArray.push(listdata[i].actionName);
      typeArray.push(listdata[i].contentCode);
      contentIdArray.push(listdata[i].contentId);
      nameArray.push(listdata[i].name);
    }

    this.uniqueAction = actionArray.filter(
      (elem, i, arr) => arr.indexOf(elem) === i
    );
    this.uniqueType = typeArray.filter(
      (elem, i, arr) => arr.indexOf(elem) === i
    );
    this.uniqueContentId = contentIdArray.filter(
      (elem, i, arr) => arr.indexOf(elem) === i
    );
    this.uniqueContentFilterId = this.uniqueContentId;
    this.uniqueName = nameArray.filter(
      (elem, i, arr) => arr.indexOf(elem) === i
    );
    this.uniqueFilterName = this.uniqueName;
  }



  bindingFilterValue() { // Updating the form data using the previous filtered value
    let formDataCopy = JSON.parse(this.getFilterData);
    this.filterForm.setValue({
      actionFilter: formDataCopy['actionFilter'],
      requestDateStartFilter: formDataCopy['requestDateStartFilter'],
      requestDateEndFilter: formDataCopy['requestDateEndFilter'],
      nameFilter: formDataCopy['nameFilter'],
      typeFilter: formDataCopy['typeFilter'],
      contentIdFilter: formDataCopy['contentIdFilter'],
      uniqueContentInput: formDataCopy['uniqueContentInput'],
      uniqueNameInput: formDataCopy['uniqueNameInput']
    });
  }
  sortFunction(data) {
    data.sort( function(a,b) {
    var dateA = new Date(a.dueDate).getTime();
    var dateB = new Date(b.dueDate).getTime();
    return dateB > dateA ? 1 : -1;
    })
  };

  removePaginationData() {
    this.paginationCachingDirectives?.removePaginationData();
  }
}

