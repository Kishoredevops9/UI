import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminContentComponent } from './admin-content/admin-content.component';
import { AdminDisciplinesComponent } from './admin-disciplines/admin-disciplines.component';
import { AdminManualsComponent } from './admin-manuals/admin-manuals.component';
import { AdminMapsComponent } from './admin-maps/admin-maps.component';
import { FeedbackManagementComponent } from './feedback-management/feedback-management.component';
import { OpenFeedbackComponent } from './open-feedback/open-feedback.component';
import { HelpUserguidesComponent } from './help-userguides/help-userguides.component';
import { AdminMasterSearchComponent } from './admin-master-search/admin-master-search.component'
import { AdminGuardService } from '@app/admin-guard.service';
import { ExceptionHandlingComponent } from '@app/admin/exception-handling/exception-handling.component';

const routes: Routes = [
  { path: '', redirectTo: 'disciplines', pathMatch: 'full'    },
  { path: 'disciplines', component: AdminDisciplinesComponent },
  { path: 'manuals', component: AdminManualsComponent },
  { path: 'maps', component: AdminMapsComponent } ,
  { path: 'content', component: AdminContentComponent, data :  { 'id' : "9022" } ,  canActivate: [AdminGuardService] },
  { path: 'feedback-management', component: FeedbackManagementComponent },
  { path: 'open-feedback', component: OpenFeedbackComponent },
  { path: 'help-userguides-management', component: HelpUserguidesComponent, data :  { 'id' : "9019" } },
  { path: 'master-search', component: AdminMasterSearchComponent, data :  { 'id' : "9018" }  },
  { path: 'error-handling', component: ExceptionHandlingComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AdminRoutingModule { }
