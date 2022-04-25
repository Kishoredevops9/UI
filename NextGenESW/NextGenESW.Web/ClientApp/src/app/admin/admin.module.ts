import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminDisciplinesComponent } from './admin-disciplines/admin-disciplines.component';
import { AdminManualsComponent } from './admin-manuals/admin-manuals.component';
import { AdminMapsComponent } from './admin-maps/admin-maps.component';
import { MatCardModule } from '@angular/material/card';
import { AdminContentComponent } from './admin-content/admin-content.component';
import { MatSelectModule } from '@angular/material/select';
import { AdminTreeComponent } from './admin-tree/admin-tree.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AdminAddItemComponent } from './admin-add-item/admin-add-item.component';
import { AdminFooterLinksComponent } from './admin-footer-links/admin-footer-links.component';
import { SharedModule } from '@app/shared/shared.module';

import { MatMenuModule} from '@angular/material/menu';
import { AdminContentDeleteComponent } from './admin-content-delete/admin-content-delete.component';
import { AdminAnnouncementsComponent } from './admin-announcements/admin-announcements.component';
import { FeedbackManagementComponent } from './feedback-management/feedback-management.component';
import { FeedbackCommentsComponent } from './feedback-comments/feedback-comments.component';
import {MatTabsModule} from '@angular/material/tabs';
import { KnowledgeAssetComponent } from '@app/knowledge-asset/knowledge-asset.component';
import { OpenFeedbackComponent } from './open-feedback/open-feedback.component';
import { HelpUserguidesComponent } from './help-userguides/help-userguides.component';
import { AdminTooltipComponent } from './admin-tooltip/admin-tooltip.component';
import { AdminMasterSearchComponent } from './admin-master-search/admin-master-search.component';
import { AdminHelpOnThisPageComponent } from './admin-help-on-this-page/admin-help-on-this-page.component';
import { AdminUserGuidesComponent } from './admin-user-guides/admin-user-guides.component';
import { AddHelpItemComponent } from './add-help-item/add-help-item.component';
import { AdminGuardService } from '@app/admin-guard.service';
import { ExceptionHandlingComponent } from '@app/admin/exception-handling/exception-handling.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';



@NgModule({
  declarations: [AdminDisciplinesComponent,
    AdminContentComponent, AdminAddItemComponent,
    AdminManualsComponent, AdminMapsComponent, AdminTreeComponent, AdminFooterLinksComponent, AdminContentDeleteComponent, FeedbackManagementComponent, AdminAnnouncementsComponent, FeedbackCommentsComponent, KnowledgeAssetComponent, OpenFeedbackComponent, HelpUserguidesComponent, AdminTooltipComponent, AdminMasterSearchComponent, AdminHelpOnThisPageComponent, AdminUserGuidesComponent, AddHelpItemComponent, ExceptionHandlingComponent  ],
    imports: [
        CommonModule,
        AdminRoutingModule,
        MatCardModule,
        MatSelectModule,
        DragDropModule,
        FlexLayoutModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        MatMenuModule,
        SharedModule,
        MatTabsModule,
        NgxUiLoaderModule

    ],
  providers: [

    AdminGuardService
  ]
})
export class AdminModule { }
