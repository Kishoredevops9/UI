import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskCreationComponent } from './task-creation.component';
import { TaskCreationRoutes } from './task-creation-routing.module';
import { TaskCreationDetailsComponent } from './task-creation-details/task-creation-details.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './../shared/shared.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { TabOneContentComponent } from './task-creation-details/task-tab-one-content/task-tab-one-content.component';
import { TabTwoContentComponent } from './task-creation-details/task-tab-two-content/task-tab-two-content.component';
import { TabThreeContentComponent } from './task-creation-details/task-tab-three-content/task-tab-three-content.component';
import { TabFourContentComponent } from './task-creation-details/task-tab-four-content/task-tab-four-content.component';
import { TabFiveContentComponent } from './task-creation-details/task-tab-five-content/task-tab-five-content.component';
import { TopMenuTaskCreationComponent } from './task-creation-details/top-menu-task-creation/top-menu-task-creation.component';
import * as fromTaskCreationReducer from './task-creation.reducer';
import { TaskCrationPageService } from './task-creation.service';
import { TaskCreationEffects } from './task-creation.effects';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { FilterPipe } from './filter.pipe';
import { TreeviewModule } from 'ngx-treeview';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BlankMapComponent } from './blank-map/blank-map.component';
import { TabSixContentComponent } from './task-creation-details/task-tab-six-content/task-tab-six-content.component';
import { TaskPopupsComponent } from '@app/task-creation/task-creation-details/task-popups/task-popups.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TaskReducer, TaskBuildReducer } from './store/task.reducer';
import { TaskAddSwimlaneComponent } from './task-creation-details/task-add-swimlane/task-add-swimlane.component';
import { TooltipModule } from '@app/shared/_tooltip';

import {
  NgxUiLoaderModule,
  NgxUiLoaderConfig,
  SPINNER,
  POSITION,
  PB_DIRECTION,
} from 'ngx-ui-loader';
import { ExecutionListComponent } from './task-creation-details/task-tab-five-content/execution-list/execution-list.component';
import { ExecutionDetailsComponent } from './task-creation-details/task-tab-five-content/execution-details/execution-details.component';
import { ExceptionComponent } from './task-creation-details/task-tab-five-content/execution-details/exception/exception.component';
import { DeviationComponent } from './task-creation-details/task-tab-five-content/execution-details/deviation/deviation.component';
import { FileUploadComponent } from './task-creation-details/task-tab-five-content/file-upload/file-upload.component';
import { TaskTabSevenContentComponent } from './task-creation-details/task-tab-seven-content/task-tab-seven-content.component';
import { TaskApprovalWorkflowComponent } from './task-creation-details/task-tab-five-content/task-approval-workflow/task-approval-workflow.component';
import { ApprovalContentComponent } from './task-creation-details/task-tab-five-content/approval-content/approval-content.component';
import { ApproveSelectedActivityComponent } from './task-creation-details/task-tab-seven-content/approve-selected-activity/approve-selected-activity.component';
import { ActivityApprovalWorkflowComponent } from './task-creation-details/task-tab-seven-content/activity-approval-workflow/activity-approval-workflow.component';
import { DeviationApprovalDialogComponent } from './task-creation-details/task-tab-five-content/deviation-approval-dialog/deviation-approval-dialog.component';
import { DeviationApprovalWorkflowComponent } from './task-creation-details/task-tab-seven-content/deviation-approval-workflow/deviation-approval-workflow.component';
import { ActivityApprovalDialogComponent } from './task-creation-details/task-tab-five-content/activity-approval-dialog/activity-approval-dialog.component';
import { SendBackSelectedActivityComponent } from './task-creation-details/task-tab-seven-content/send-back-selected-activity/send-back-selected-activity.component';
import { SendBackDeviationComponent } from './task-creation-details/task-tab-seven-content/send-back-deviation/send-back-deviation.component';
import { TruncatePipe } from './task-creation-details/truncatePipe.pipe';
import { ProcessMapsModule } from '@app/process-maps/process-maps.module';
import { StepMapDialogComponent } from '@app/task-creation/task-creation-details/task-tab-five-content/step-map-dialog/step-map-dialog.component';
import { DiagramGoJSModule } from '../diagram-gojs/diagram-gojs.module';
import { MatTableModule } from '@angular/material/table';
import { ViewHistoryLogsComponent } from './task-creation-details/task-tab-five-content/execution-list/view-history-logs/view-history-logs.component';
import { ViewAllDocumentsModalComponent } from './task-creation-details/task-tab-five-content/execution-list/viewAllDocumentsModal/viewAllDocumentsModal.component';
import { RecallReviseDialogComponent } from './task-creation-details/task-tab-five-content/execution-list/recall-revise-dialog/recall-revise-dialog.component';
import { DeviationReportComponent } from './task-creation-details/task-tab-six-content/deviation-report/deviation-report.component';
import { UploadWeblinkDialogComponent } from './task-creation-details/task-tab-five-content/upload-weblink-dialog/upload-weblink-dialog.component';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {};

@NgModule({
  declarations: [
    TaskCreationComponent,
    TaskCreationDetailsComponent,
    TabOneContentComponent,
    TabTwoContentComponent,
    TabThreeContentComponent,
    TabFourContentComponent,
    TabFiveContentComponent,
    TopMenuTaskCreationComponent,
    FilterPipe,
    BlankMapComponent,
    TabSixContentComponent,
    TaskPopupsComponent,
    TaskAddSwimlaneComponent,
    ExecutionListComponent,
    ExecutionDetailsComponent,
    ExceptionComponent,
    DeviationComponent,
    FileUploadComponent,
    TaskApprovalWorkflowComponent,
    DeviationApprovalWorkflowComponent,
    TaskTabSevenContentComponent,
    ApprovalContentComponent,
    ApproveSelectedActivityComponent,
    ActivityApprovalWorkflowComponent,
    DeviationApprovalDialogComponent,
    ActivityApprovalDialogComponent,
    SendBackDeviationComponent,
    SendBackSelectedActivityComponent,
    TruncatePipe,
    StepMapDialogComponent,
    ViewHistoryLogsComponent,
    ViewAllDocumentsModalComponent,
    RecallReviseDialogComponent,
    DeviationReportComponent,
    UploadWeblinkDialogComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    TaskCreationRoutes,
    AngularEditorModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    TooltipModule,
    DiagramGoJSModule,
    MatTableModule,
    // StoreModule.forFeature(
    //   fromTaskCreationReducer.TaskCreationFeatureKey,
    //   fromTaskCreationReducer.reducer,    // need to discuss with deepak

    // ),

    StoreModule.forFeature('Task', TaskReducer),
    StoreModule.forFeature('TaskBuild', TaskBuildReducer),

    EffectsModule.forFeature([TaskCreationEffects]),
    TreeviewModule.forRoot(),
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    FlexLayoutModule,
    ProcessMapsModule,
  ],
  exports: [TabOneContentComponent, FilterPipe],
  providers: [TaskCrationPageService],
})
export class TaskCreationModule {}
