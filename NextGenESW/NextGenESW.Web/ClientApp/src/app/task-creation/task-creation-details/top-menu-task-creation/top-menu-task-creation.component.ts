import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { TaskCrationPageService } from "../../task-creation.service"
import { NgxUiLoaderService } from "ngx-ui-loader";
import { Observable } from 'rxjs';
import { TaskItemsList } from '@app/dashboard/task-items-list/task-items-list.model';
import { Store } from '@ngrx/store';
import { TaskItemsListState } from '@app/dashboard/task-items-list/task-items-list.reducer';
import { ActivatedRoute } from '@angular/router';
import { TaskItemsListService } from '@app/dashboard/task-items-list/task-items-list.service'

@Component({
  selector: 'top-menu-task-creation',
  templateUrl: './top-menu-task-creation.component.html',
  styleUrls: ['./top-menu-task-creation.component.scss'],
})
export class TopMenuTaskCreationComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  loading = 0;
  constructor(
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private taskService: TaskCrationPageService,
    private ngxService: NgxUiLoaderService,
    private store: Store<TaskItemsListState>,
    private taskServiceLoad: TaskItemsListService
  ) { }

  taskItemsList$: Observable<TaskItemsList[]>;
  currentTask: any;
  addToOption: boolean = false;
  ngOnInit(): void {

    this.taskServiceLoad.getTaskList().subscribe((taskData) => {

      let userTask = taskData.map((node) => {

        return node.id
      })

      this.currentTask = this.route.snapshot.params['id'];

      this.addToOption = (userTask.indexOf( parseInt(this.currentTask)) < 0) ? true : false;

  



    })









  }

  addToTask() {

    let email = sessionStorage.getItem('userMail');
  

    this.loading = 1;
    this.taskService.createusertasks({
      "userName": email,
      "taskId":  this.currentTask,
    }).subscribe((data) => {
      console.log(data)
      this.loading = 2;
      this._snackBar.open('Task added successfully', '', {
        duration: 500,
        panelClass: ['blue-snackbar'],
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });


    })



  }

}
