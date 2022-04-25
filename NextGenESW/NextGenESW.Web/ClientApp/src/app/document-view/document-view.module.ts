import { CollabService } from './collab/collab.service';
import { WiDocumentComponent } from './wi-document/wi-document.component';
import { DocumentViewRoutes } from './document-view.routing';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentViewComponent } from './document-view.component';
import { CdDocumentComponent } from './cd-document/cd-document.component';
import { CollabComponent } from './collab/collab.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PropertiesViewComponent } from './wi-document/properties-view/properties-view.component';
import { LessonLearnedViewComponent } from './wi-document/lesson-learned-view/lesson-learned-view.component';
import { ProcessMapEditDataService } from './../process-maps/process-map-edit/services/process-map-edit-data.service';
import { MAT_COLOR_FORMATS, NgxMatColorPickerModule, NGX_MAT_COLOR_FORMATS } from '@angular-material-components/color-picker';
import { DiagramGoJSModule } from '../diagram-gojs/diagram-gojs.module';
import { EffectsModule } from '@ngrx/effects';
import { ProcessMapsEffects } from '@app/process-maps/process-maps.effects';
import { StoreModule } from '@ngrx/store';
import * as fromProcessMaps from '@app/process-maps/process-maps.reducer';
import { ProcessMapsModule } from '../process-maps/process-maps.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    DocumentViewRoutes,
    FormsModule,
    ReactiveFormsModule,
    NgxMatColorPickerModule,
    DiagramGoJSModule,
    ProcessMapsModule,
    StoreModule.forFeature(
      fromProcessMaps.processMapsesFeatureKey,
      fromProcessMaps.reducer
    ),
    EffectsModule.forFeature([ProcessMapsEffects]),
  ],
  declarations: [
    DocumentViewComponent,
    WiDocumentComponent,
    CdDocumentComponent,
    CollabComponent,
    PropertiesViewComponent,
    LessonLearnedViewComponent
  ],
  providers: [  { provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS },CollabService,ProcessMapEditDataService],


})
export class DocumentViewModule {}
