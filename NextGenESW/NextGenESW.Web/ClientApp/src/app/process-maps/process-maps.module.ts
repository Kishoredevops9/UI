import { GroupModifyComponent } from './group-modify/group-modify.component';
import { ProcessMapEditComponent } from './process-map-edit/process-map-edit.component';
import { ProcessMapAddComponent } from './process-map-add/process-map-add.component';
import { ProcessMapsRoutes } from './process-maps.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcessMapsComponent } from './process-maps.component';
import { StoreModule } from '@ngrx/store';
import * as fromProcessMaps from './process-maps.reducer';
import { EffectsModule } from '@ngrx/effects';
import { ProcessMapsEffects } from './process-maps.effects';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { GojsAngularModule } from 'gojs-angular';
import { ActivityAddComponent } from './activity-add/activity-add.component';
import { ProcessMapMetaDataModifyComponent } from './process-map-metadata-modify/process-map-metadata-modify.component';
import { ProcessMapTreeComponent } from './process-map-tree/process-map-tree.component';

import { ProcessMapMilestoneTreeWComponent } from './process-map-milestone-tree/process-map-milestone-tree.component';
import { ActivityMetadataModifyComponent } from './activity-metadata-modify/activity-metadata-modify.component';
import { MatCardModule } from '@angular/material/card';
// import { MatMenuTrigger } from '@angular/material/menu';
import { MAT_COLOR_FORMATS, NgxMatColorPickerModule, NGX_MAT_COLOR_FORMATS } from '@angular-material-components/color-picker';
import { ShapePropertiesComponent } from './shape-properties/shape-properties.component';
import { TreeModule } from '@circlon/angular-tree-component';
import { SubMapSearchComponent } from './sub-map-search/sub-map-search.component';
import { ActivityPageSearchComponent } from './activity-page-search/activity-page-search.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CreateFromExistingSearchMapComponent } from './create-from-existing-search-map/create-from-existing-search-map.component';
import { NgxDnDModule } from '@swimlane/ngx-dnd';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { MatTableModule } from '@angular/material/table';
import { MapPurposeComponent } from './map-purpose/map-purpose.component';
import { PhaseAddComponent } from './phase-add/phase-add.component';
import { ProcessMapEditDataService } from './process-map-edit/services/process-map-edit-data.service';
import { NgxUiLoaderModule, NgxUiLoaderConfig } from "ngx-ui-loader";
import { AddConnectorComponent } from './add-connector/add-connector.component';
import {ActivityDetailsModule} from "@app/process-maps/activity-details/activity-details.module";
import { DiagramGoJSModule } from '../diagram-gojs/diagram-gojs.module';
import { StepFlowComponent } from './step-flow/step-flow.component';
import { StepComponent } from './step-flow/step/step.component';
import { StepTreeComponent } from './step-flow/step/step-tree/step-tree.component';
import { AddStepModelboxComponent } from './step-flow/add-step-modelbox/add-step-modelbox.component';
import { StepPurposeComponent } from './step-flow/step/step-purpose/step-purpose.component';
import { StepExportComplianceComponent } from './step-flow/step/step-export-compliance/step-export-compliance.component';
import { AddDisciplineModelboxComponent } from './step-flow/add-discipline-modelbox/add-discipline-modelbox.component';
import { AddActivityModelboxComponent } from './step-flow/add-activity-modelbox/add-activity-modelbox.component';
import { TreeconfirmboxComponent } from './step-flow/step/step-tree/treeconfirmbox/treeconfirmbox.component';
import { StepFlowMapComponent } from './step-flow/step/step-flow-map/step-flow-map.component';
import { StepMapComponent } from './step-flow/step/step-map/step-map.component';
import { TaskExecutionMapComponent } from '@app/process-maps/task-execution-map/task-execution-map.component';
import { PublicStepComponent } from '@app/process-maps/public-step/public-step.component';
import { StepPublicPurposeComponent } from './step-public-purpose/step-public-purpose.component';
import { AddStepPopupComponent } from './step-flow/add-step-popup/add-step-popup.component';
import { StepPageSearchComponent } from './step-page-search/step-page-search.component'

const ngxUiLoaderConfig: NgxUiLoaderConfig = {

};


@NgModule({
  declarations: [
    ProcessMapsComponent,
    ProcessMapAddComponent,
    ProcessMapEditComponent,
    ActivityAddComponent,
    GroupModifyComponent,
    ProcessMapMetaDataModifyComponent,
    ProcessMapTreeComponent,
    ProcessMapMilestoneTreeWComponent,
    ActivityMetadataModifyComponent,
    SubMapSearchComponent,
    ActivityPageSearchComponent,
    ShapePropertiesComponent,
    CreateFromExistingSearchMapComponent,
    MapPurposeComponent,
    PhaseAddComponent,
    AddConnectorComponent,
    StepFlowComponent,
    StepComponent,
    StepTreeComponent,
    AddStepModelboxComponent,
    StepPurposeComponent,
    StepExportComplianceComponent,
    AddDisciplineModelboxComponent,
    AddActivityModelboxComponent,
    TreeconfirmboxComponent,
    StepFlowMapComponent,
    StepMapComponent,
    TaskExecutionMapComponent,
    PublicStepComponent,
    StepPublicPurposeComponent,
    AddStepPopupComponent,
    StepPageSearchComponent
  ],
  imports: [
    CommonModule,
    NgxMatColorPickerModule,
    SharedModule,
    ReactiveFormsModule,
    ActivityDetailsModule,
    FormsModule,
    ProcessMapsRoutes,
    GojsAngularModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    TreeModule,
    FlexLayoutModule,
    NgxDnDModule.forRoot(),
    StoreModule.forFeature(
      fromProcessMaps.processMapsesFeatureKey,
      fromProcessMaps.reducer
    ),
    EffectsModule.forFeature([ProcessMapsEffects]),
    AngularEditorModule,
    MatTableModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    DiagramGoJSModule
  ],
  providers: [
    {provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS},
    ProcessMapEditDataService
  ],
    exports: [
        TaskExecutionMapComponent,
        StepMapComponent
    ]
})
export class ProcessMapsModule {}
