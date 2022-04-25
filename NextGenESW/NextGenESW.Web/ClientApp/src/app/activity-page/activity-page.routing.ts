import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ActivityPageComponent } from './activity-page.component';
import { ActivityDetailsComponent } from './activity-details/activity-details.component';
// import { ActivityLessonLearnedComponent } from './activity-details/activity-lesson-learned/activity-lesson-learned.component';

const routes: Routes = [
  {
    path: 'activity-page/:id', component: ActivityPageComponent,
    data: {
      module: 'Activity Details'
    }
  },
  {
    path: ':id', component: ActivityDetailsComponent,
    data: {
      module: 'Activity Details'
    }
  }
  // { path: 'activity-page/:id/LessonLearned', component: ActivityLessonLearnedComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ActivityPageRoutes { }
