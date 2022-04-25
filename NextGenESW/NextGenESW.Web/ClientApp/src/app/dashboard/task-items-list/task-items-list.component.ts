import { Component, OnInit, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { TaskItemsList } from './task-items-list.model';
import { Store, select } from '@ngrx/store';
import { TaskItemsListService } from './task-items-list.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { TabOneContentService } from '../../task-creation/task-creation-details/task-tab-one-content/task-tab-one-content.service';
import { ActivityPageService } from '@app/activity-page/activity-page.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { delay, filter } from 'rxjs/operators';
import { LOADING_TYPE, TASK_ITEMS_LIST_LOADING_STATUS } from './shared/task-items-list.reducer';
import * as TaskItemsListActions from './shared/task-items-list.actions';
import { environment } from '@environments/environment';
import { BaseComponent } from '@app/shared/component/base/base.component';
import * as TodoDataActions from '@app/dashboard/todo-items-list/shared/todo-data.actions';
import { filterItemsBySearchTerm } from '@app/shared/utils/search';

@Component({
  selector: 'app-task-items-list',
  templateUrl: './task-items-list.component.html',
  styleUrls: ['./task-items-list.component.scss']
})
export class TaskItemsListComponent extends BaseComponent implements OnInit, AfterViewInit {

  filterPopShow: boolean = false;
  filterArray = [];
  filterForm: FormGroup;
  allUniqueTaskIds: string[] = [];
  fUniqueTaskIds: string[] = [];
  uniquePrgm = [];
  allUniqueNames: string[] = [];
  fUniqueNames: string[] = [];
  uniqueEngSec = [];
  uniqueIpt = [];
  dataList: any;

  totalRecords: number = 0;

  dataSource: MatTableDataSource<TaskItemsList>;

  pageRowCounts = [10, 20, 50, this.totalRecords];

  constructor(private store: Store<any>,
    private ngxService: NgxUiLoaderService,
    private tabOneContentService: TabOneContentService,
    private activityPageService: ActivityPageService,
    private router: Router,
    private taskListService: TaskItemsListService
  ) {
    super();
    this.filterForm = new FormGroup({
      idFilter: new FormControl(),
      prgmFilter: new FormControl(),
      nameFilter: new FormControl(),
      engSecFilter: new FormControl(),
      iptFilter: new FormControl(),
      idSearchTerm: new FormControl(),
      nameSearchTerm: new FormControl(),
    });
  }

  public taskDataSource: any;

  fullView = false;
  alreadyFullView = false;

  @Output() fullViewEvent = new EventEmitter();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = [
    'taskReaid',
    'title',
    'engineModelTagId',
    'engineSectionDescription',
    'completed',
    'action'

  ];

  allEngineSec;
  taskCreationEngineModels;
  engineModelGroupDropDownList;
  tagList;
  engineSectionList;

  ngOnInit(): void {
    this.loadEngineData();
  }

  ngAfterViewInit(): void {
    this.loadTodoItemsData();
  }

  loadEngineData() {
    this.activityPageService
      .getTagList()
      .subscribe((res) => {
        this.taskCreationEngineModels = res.filter(x => x.name == 'Engine Models');
        this.engineModelGroupDropDownList = this.taskCreationEngineModels[0].children;
        this.tagList = res;
      });

  }

  calculatePercentage() {
    var completedCount = 125;
    var count = 199;
    return (completedCount / count) * 100;
  }

  loadTodoItemsData() {
    this.store.select(store => store.taskItemsListData.taskItemsListDataLoaded).pipe(
      this.unsubsribeOnDestroy,
      filter(status => status === TASK_ITEMS_LIST_LOADING_STATUS.INITIAL)
    ).subscribe(() => {
      if (this.fullView) {
        this.store.dispatch(TaskItemsListActions.loadTaskItemsList({
          implicitLoading: false,
          loadingType: LOADING_TYPE.FULL
        }));
      } else {
        this.store.dispatch(TaskItemsListActions.loadTaskItemsList({
          implicitLoading: false,
          loadingType: LOADING_TYPE.PARTIAL
        }));
      }
    });

    if (environment.enableAutoRefreshYourTaskWidget) {
      this.store.select(store => store.taskItemsListData.taskItemsListDataLoaded).pipe(
        filter(status => status === TASK_ITEMS_LIST_LOADING_STATUS.LOADED || status === TASK_ITEMS_LIST_LOADING_STATUS.ERROR),
        delay(environment.loadingYourContentWidgetIntervalTimeInMs),
        this.unsubsribeOnDestroy
      ).subscribe(() => this.store.dispatch(TaskItemsListActions.loadTaskItemsList({
        implicitLoading: true,
        loadingType: this.fullView ? LOADING_TYPE.FULL : LOADING_TYPE.PARTIAL
      })));
    }

    this.store.select(store => store.taskItemsListData.allTaskItemsListData).pipe(
      this.unsubsribeOnDestroy
    ).subscribe(dbData => {
      setTimeout(() => {
        if (!dbData.length) {
          return;
        }
        this.dataList = dbData;
        this.totalRecords = this.dataList.length;
        this.loadTaskItemsList();
      });
    });
  }

  loadTaskItemsList() {
    const data = [...this.dataList];
    if (!this.fullView) {
      this.taskDataSource = data.slice(0, 5);
      let taskDataSourceData = this.taskDataSource.map((item: any) =>
        Object.assign({}, item, { activityPercentage: ((item.activityApprovedCount / item.activityCount) * 100) })
      );
      this.dataSource = new MatTableDataSource(taskDataSourceData);
    } else {
      this.dataList = data;
      this.taskDataSource = data;
      let taskDataSourceData = this.taskDataSource.map((item: any) =>
        Object.assign({}, item, { activityPercentage: ((item.activityApprovedCount / item.activityCount) * 100) })
      );
      this.dataSource = new MatTableDataSource(taskDataSourceData);
      this.totalRecords = data.length;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.rowCounters();
      this.uniqueFunction();
    }
  }

  widgetFullView() {
    this.resetFilterPop();
    this.fullView = !this.fullView;
    this.fullViewEvent.emit(this.fullView);
    if (this.fullView) {
      if (!this.alreadyFullView) {
        this.alreadyFullView = true;
        this.store.dispatch(TaskItemsListActions.loadTaskItemsList({
          implicitLoading: true,
          loadingType: LOADING_TYPE.REST
        }));
      }
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

    this.dataSource.paginator.pageSizeOptions = this.pageRowCounts;

  }

  taskNavigate(element) {
    console.log(element);
    this.router.navigate(['/task/edit-task/', element.id]);
    // window.open('/task/edit-task/'+ element.id, '_blank');
  }

  clearFilter() {
    this.dataSource.filter = '';
  }

  filterpopTask() {
    this.filterPopShow = true;
  }

  closeFilterPop() {
    this.filterPopShow = false;
  }

  resetFilterPop() {

    // this.filterPopShow = false;

    //this.dataSource.filter = '';
    this.filterForm.reset();
    this.onChangeIdSearchTermFilter('');
    this.onChangeNameSearchTermFilter('');
    this.dataSource = new MatTableDataSource(this.dataList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }

  uniqueFunction() {
    let listdata = this.dataList;
    console.log(listdata);
    let idArray = [];
    let prgmArray = [];
    let nameArray = [];
    let engSecArray = [];
    let iptArray = [];

    for (let i in listdata) {
      idArray.push(listdata[i].taskReaid);
      prgmArray.push(listdata[i].engineModelTagName);
      nameArray.push(listdata[i].title);
      engSecArray.push(listdata[i].engineSectionDescription);
      iptArray.push(listdata[i].ipt);
    }
    console.log(idArray, prgmArray, nameArray, engSecArray, iptArray);

    this.allUniqueTaskIds = idArray.filter((elem, i, arr) => arr.indexOf(elem) === i);
    this.fUniqueTaskIds = this.allUniqueTaskIds;
    this.uniquePrgm = prgmArray.filter((elem, i, arr) => arr.indexOf(elem) === i);
    this.allUniqueNames = nameArray.filter((elem, i, arr) => arr.indexOf(elem) === i);
    this.fUniqueNames = this.allUniqueNames;
    this.uniqueEngSec = engSecArray.filter((elem, i, arr) => arr.indexOf(elem) === i);
    this.uniqueIpt = iptArray.filter((elem, i, arr) => arr.indexOf(elem) === i);

  }

  onChangeIdSearchTermFilter(searchTerm: string) {
    this.fUniqueTaskIds = filterItemsBySearchTerm(this.allUniqueTaskIds, searchTerm);
  }

  onChangeNameSearchTermFilter(searchTerm: string) {
    this.fUniqueNames = filterItemsBySearchTerm(this.allUniqueNames, searchTerm);
  }

  applyFilter() {

    let arrayData = [];
    this.filterArray = [];
    let dataholders = this.dataList;

    dataholders.forEach(element => {
      let nonEmptyFlag = '';
      let conditionFlag = '';

      if (this.filterForm.value.idFilter != '' && this.filterForm.value.idFilter != undefined && this.filterForm.value.idFilter != null) {
        nonEmptyFlag = nonEmptyFlag + '1';
        if (element.taskReaid === this.filterForm.value.idFilter) {
          conditionFlag = conditionFlag + '1';
        } else {
          conditionFlag = conditionFlag + '0';
        }
      } else {
        nonEmptyFlag = nonEmptyFlag + '0';
        conditionFlag = conditionFlag + '0';
      }

      if (this.filterForm.value.prgmFilter != '' && this.filterForm.value.prgmFilter != undefined && this.filterForm.value.prgmFilter != null) {
        nonEmptyFlag = nonEmptyFlag + '1';
        if (element.engineModelTagName === this.filterForm.value.prgmFilter) {
          conditionFlag = conditionFlag + '1';
        } else {
          conditionFlag = conditionFlag + '0';
        }
      } else {
        nonEmptyFlag = nonEmptyFlag + '0';
        conditionFlag = conditionFlag + '0';
      }

      if (this.filterForm.value.nameFilter != '' && this.filterForm.value.nameFilter != undefined && this.filterForm.value.nameFilter != null) {
        nonEmptyFlag = nonEmptyFlag + '1';
        if (element.title === this.filterForm.value.nameFilter) {
          conditionFlag = conditionFlag + '1';
        } else {
          conditionFlag = conditionFlag + '0';
        }
      } else {
        nonEmptyFlag = nonEmptyFlag + '0';
        conditionFlag = conditionFlag + '0';
      }

      if (this.filterForm.value.engSecFilter != '' && this.filterForm.value.engSecFilter != undefined && this.filterForm.value.engSecFilter != null) {
        nonEmptyFlag = nonEmptyFlag + '1';
        if (element.engineSectionDescription === this.filterForm.value.engSecFilter) {
          conditionFlag = conditionFlag + '1';
        } else {
          conditionFlag = conditionFlag + '0';
        }
      } else {
        nonEmptyFlag = nonEmptyFlag + '0';
        conditionFlag = conditionFlag + '0';
      }

      if (this.filterForm.value.iptFilter != '' && this.filterForm.value.iptFilter != undefined && this.filterForm.value.iptFilter != null) {
        nonEmptyFlag = nonEmptyFlag + '1';
        if (element.ipt === this.filterForm.value.iptFilter) {
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

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }

  removeTaskList(element) {

    let param = {
      'userId': sessionStorage.getItem('userMail'),
      'taskId': element.id
    };
    this.taskListService.removeTaskList(param).subscribe((data) => {
      if (data) {
        this.store.dispatch(TaskItemsListActions.resetTaskItemsList());
      }
    });
  }

}
