import { TaskCreationDetailsComponent } from '@app/task-creation/task-creation-details/task-creation-details.component';
import { TabOneContentComponent } from '@app/task-creation//task-creation-details/task-tab-one-content/task-tab-one-content.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', component: TaskCreationDetailsComponent },
  {
    path: 'create-task',
    component: TaskCreationDetailsComponent,
    data: { id: '9004' },
  },
  {
    path: 'create-task/:id',
    component: TaskCreationDetailsComponent,
    data: { id: '9004' },
  },
  //{ path: ':id', component: TaskCreationDetailsComponent },
  { path: 'edit-task/:id', component: TaskCreationDetailsComponent },
  { path: 'view-task-creation/:id', component: TabOneContentComponent },
  { path: 'edit-task-creation/:id', component: TabOneContentComponent },
  { path: 'create-existing-task', component: TabOneContentComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskCreationRoutes {}
