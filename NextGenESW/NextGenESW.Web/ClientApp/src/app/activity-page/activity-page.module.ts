import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ActivityPageComponent } from './activity-page.component';
import { SharedModule } from '@app/shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ActivityPageRoutes } from './activity-page.routing';
import { ActivityDetailsComponent } from './activity-details/activity-details.component';
import { ActivityPurposeComponent } from './activity-details/activity-purpose/activity-purpose.component';
import { ActivityComponentsComponent } from './activity-details/activity-components/activity-components.component';
import { ListItemComponent } from './activity-details/activity-components/list-item/list-item.component';
import { AddonsPopupComponent } from './activity-details/activity-components/addons-popup/addons-popup.component';
import { ContentDetailsComponent } from './activity-details/activity-components/content-details/content-details.component';
import { ActivityLessonLearnedComponent } from './activity-details/activity-lesson-learned/activity-lesson-learned.component';
import { ConfirmDeleteComponent } from './activity-details/activity-components/confirm-delete/confirm-delete.component';
import { ActivityGeneralGuidanceComponent } from './activity-details/activity-general-guidance/activity-general-guidance.component';
import { ExternalWorkComponent } from './activity-details/external-work/external-work.component';
import { EksaddonspopupComponent } from './activity-details/activity-components/eksaddonspopup/eksaddonspopup.component';
import { ActivityDragDropComponent } from './activity-details/activity-components/activity-drag-drop/activity-drag-drop.component'
import { AddGuidanceComponent } from './activity-details/activity-components/add-guidance/add-guidance.component'
@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        SharedModule,
        ReactiveFormsModule,
        FormsModule,
        AngularEditorModule,
        ActivityPageRoutes,
    ],
    declarations: [
        ActivityPageComponent,
        ActivityDetailsComponent,
        ActivityPurposeComponent,
        ActivityComponentsComponent,
        ListItemComponent,
        AddonsPopupComponent,
        ContentDetailsComponent,
        ActivityLessonLearnedComponent,
        ConfirmDeleteComponent,
        ActivityGeneralGuidanceComponent,
        ExternalWorkComponent,
        EksaddonspopupComponent,
        ActivityDragDropComponent,
        AddGuidanceComponent,
    ]
})
export class ActivitypageModule{}


