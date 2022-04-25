import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { Store } from '@ngrx/store';
import { ContentListsState } from '@app/dashboard/content-list/content-list.reducer';
import { Router, ActivatedRoute } from '@angular/router';
import { TaskCrationPageService } from '../task-creation.service';
import { HttpHelperService } from '@app/shared/http-helper.service';
import { ContextService } from '@app/shared/component/global-panel/context/context.service';
import { SharedService } from '@app/shared/shared.service';
import { TaskDiagramExportService } from './services/task-diagram-export.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeleteComponent } from '@app/activity-page/activity-details/activity-components/confirm-delete/confirm-delete.component';
import { BaseContentDetailComponent } from '@app/shared/component/base-content-detail/base-content-detail.component';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
@Component({
  selector: 'app-task-creation-details',
  templateUrl: './task-creation-details.component.html',
  styleUrls: ['./task-creation-details.component.scss'],
  providers: [
    TaskDiagramExportService
  ]
})
export class TaskCreationDetailsComponent extends BaseContentDetailComponent implements OnInit {
  @ViewChildren(MatTab) tabs;
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  private destroyed$ = new Subject();
  items: any;
  AuthTaskUser: any;
  AccessingTaskAuthorized: any;
  CreatingTaskAuthorized: any;
  ExecutingTaskAuthorized: any;
  loading = false;
  // selectedIndex = 0;
  contentType: string = 'T';
  isChecked: boolean = false;
  id;
  titleData: string;
  hasTaskCreated: any = true;
  hasBuildCreated: any = true;
  type: string = 'T';
  docStatus = 'draft';
  executionTab: boolean = false;
  activityStatus: any;
  counterEnable: boolean = true;
  taskActivityCount: number = 0;
  selectedActivityIndex;
  lastIndexOfActivityDocNum: number;
  firstIndexOfActivityDocNum: number;
  listFlowViewStatus: boolean = false;
  broadCastMessage: any = '';
  property : any ;
  public cCode: any = {
    AP: '#30A62A',
    WI: '#9D5A83',
    CG: '#17b4ef',
    RD: '#E3B900',
    RC: '#E3B900',
    PM: '#DF4B09',
    TC: 'FFC400',
  };
  globalData;
  documentCreateStatus = false;
  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    private taskCreationService: TaskCrationPageService,
    public SharedService: SharedService,
    private diagramExportService: TaskDiagramExportService,
    public dialog: MatDialog,
  ) {
    super(router, route, SharedService);
    this.SharedService.resiveMessage.subscribe((data) => {
      if ( this.tabGroup ) {
        this.tabGroup.selectedIndex = data;
      }
    });
  }
  serviceCall(id, userEmailData) {
    this.taskCreationService.GetTaskAuthorizations(id, userEmailData).subscribe((data) => {
      this.AuthTaskUser = data;
      if (this.AuthTaskUser.isAccessingTaskAuthorized == false) {
        this.router.navigate(['_tasksearch'], { queryParams: { q: '', rp: '' } })
      }
    })
  }
  propertyData($event){
this.property = $event;

  }
  closeTaskConfirm() {

    this.taskCreationService.GetCloseTasksConfirmation(this.id).subscribe((data: any) => {
      const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
        width: '42%',
        data: {
          message: `Do you want to close the task?`,
          title: data['confirmMessage']
        }
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result == 'Yes') {
          let Obj = {
            "taskId": this.id,
            "userId": localStorage.getItem('logInUserEmail')
          }
          this.taskCreationService.exeCloseTask(Obj).subscribe((data) => {
            console.log(data)
            window.location.reload();
          })
        }
      })
    })
  }

  reopenTask(){

    const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
      width: '42%',
      data: {
        message: `Do you want to reopen the task?`

      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'Yes') {
        let Obj = {
          "taskId": this.id,
          "userId": localStorage.getItem('logInUserEmail')
        }
        this.taskCreationService.reopenTask(Obj).subscribe((data) => {
          window.location.reload();
        })
      }
    })




  }
  ngOnInit(): void {
    let userEmailData = localStorage.getItem('logInUserEmail');
    this.route.params.subscribe((param) => {
      this.id = parseInt(param['id']) | 0;
      setTimeout(() => {
        let userEmailData = localStorage.getItem('logInUserEmail');
        if (userEmailData) {
          this.serviceCall(this.id, userEmailData)
        }
      }, 5000)
    });
    if (this.id) {
      this.taskCreationService.GetTaskAuthorizations(this.id, userEmailData).subscribe((data) => {
        this.AuthTaskUser = data;
        this.AuthTaskUser.taskId;
        this.AuthTaskUser.isAccessingTaskAuthorized;
        this.AuthTaskUser.isCreatingTaskAuthorized;
        this.AuthTaskUser.isExecutingTaskAuthorized;
        if (this.AuthTaskUser.isAccessingTaskAuthorized == false) {
          alert("'You are not Authorized to access the selected Task!");
          this.router.navigate(['_tasksearch'], { queryParams: { q: '', rp: '' } })
        }
      })
    }
    this.getAllActivityStatus();
    this.addItem(event);
    this.taskCreationService.autoRefresh$.subscribe(() => {
      this.getAllActivityStatus();
    });
  }
  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
  titleOutput(titleData) {
    this.titleData = titleData;
  }
  public availIndex: any = { 0: true };
  onTabChanged($event) {
    super.onTabChanged($event);
    let previewTab = this.route.snapshot.queryParams['tab'];
    if(previewTab != 'Execution') {
      localStorage.setItem('previewTab', previewTab);
    } else {
      localStorage.removeItem('previewTab');
    }
    this.availIndex[$event.index] = true;
    this.SharedService.chipmessage.emit({ tabindex: $event });
    this.isChecked = false;
    if ($event.index === 4) {
      this.executionTab = true;
      this.listFlowViewStatus = true;
    } else {
      this.executionTab = false;
      this.listFlowViewStatus = false;
    }
  }
  taskCreatedOutput(hasTaskCreated) {
    this.hasTaskCreated = hasTaskCreated;
  }
  addItem(items) {
    this.items = items;
    if (this.items && this.items.isAccessingTaskAuthorized == false) {
      this.AccessingTaskAuthorized = false;
    }
    else {
      this.AccessingTaskAuthorized = true;
    }
    if (this.items && this.items.isCreatingTaskAuthorized == false) {
      this.CreatingTaskAuthorized = false;
    }
    else {
      this.CreatingTaskAuthorized = true;
    }
    if (this.items && this.items.isExecutingTaskAuthorized == false) {
      this.ExecutingTaskAuthorized = false;
    }
    else {
      this.ExecutingTaskAuthorized = true;
    }
  }
  buildTaskCreatedOutput(hasBuildCreated) {
    this.hasBuildCreated = hasBuildCreated;
  }
  nextTab(value) {
    this.selectedIndex = value + 1;
  }
  getGlobalData(value) {
    console.log("getGlobalData", value)
    this.globalData = value;
  }
  openListView() {
    this.isChecked = false;
  }
  handleOnToggleChange() {
    this.isChecked = !this.isChecked;
  }
  private getAllActivityStatus() {
    if (this.id && this.id > 0) {
      this.taskCreationService
        .getAllActivitiesStatus(this.id)
        .subscribe((res) => {
          const data = JSON.parse(JSON.stringify(res));
          this.taskActivityCount = 0;
          data.forEach((el) => {
            this.taskActivityCount += el.documentNumber;
            const status = el.status.toLowerCase();
            if (status == 'not started') {
              el['order'] = '1';
            } else if (status == 'work-in-progress') {
              el['order'] = '2';
            } else if (status == 'completed') {
              el['order'] = '3';
            } else if (status == 'deviations approved') {
              el['order'] = '4';
            } else if (status == 'submitted') {
              el['order'] = '5';
            } else if (status == 'approved') {
              el['order'] = '6';
            } else if (status == 'not assigned') {
              el['order'] = '7';
            }
          });
          this.activityStatus = data.sort(function (a, b) {
            return a.order - b.order;
          });
          let filteredItems = this.activityStatus.filter((item) => {
            return item.documentNumber > 0;
          });
          let lastItem = filteredItems[filteredItems.length - 1];
          let firstItem = filteredItems[0];
          this.lastIndexOfActivityDocNum = lastItem?.order - 1;
          this.firstIndexOfActivityDocNum = firstItem?.order - 1;
          this.activityStatus.forEach((el, index) => {
            const status = el.status;
            if (status == 'Not Started') {
              if (el.documentNumber == this.taskActivityCount) {
                this.selectedActivityIndex = index;
              }
            } else if (status == 'Work-In-Progress') {
              if (el.documentNumber == this.taskActivityCount) {
                this.selectedActivityIndex = index;
              }
            } else if (status == 'Completed') {
              if (el.documentNumber == this.taskActivityCount) {
                this.selectedActivityIndex = index;
              }
            } else if (status == 'Deviations Approved') {
              if (el.documentNumber == this.taskActivityCount) {
                this.selectedActivityIndex = index;
              }
            } else if (status == 'Submitted') {
              if (el.documentNumber == this.taskActivityCount) {
                this.selectedActivityIndex = index;
              }
            } else if (status == 'Approved') {
              if (el.documentNumber == this.taskActivityCount) {
                this.selectedActivityIndex = index;
              }
            } else if (status == 'Not Assigned') {
              if (el.documentNumber == this.taskActivityCount) {
                this.selectedActivityIndex = index;
              }
            }
          });
          this.activityStatus.pop();
        });
    }
  }
  onDiagramPDFExportClick() {
    this.diagramExportService.exportAsPDF();
  }
  onDiagramSVGExportClick() {
    this.diagramExportService.exportAsSVG();
  }
  onDiagramPNGExportClick() {
    this.diagramExportService.exportAsPNG();
  }
}
