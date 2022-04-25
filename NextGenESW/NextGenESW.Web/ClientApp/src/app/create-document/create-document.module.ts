import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './../shared/shared.module';
import { CreateDocumentRoutes } from './create-document-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateDocumentComponent } from './create-document.component';
import { WiDetails } from './wi-create-document/wi-details.component';
import { WiLessonLearnedComponent } from './wi-create-document/wi-lesson-learned/wi-lesson-learned.component';
import { StoreModule } from '@ngrx/store';
import * as fromCreateDocument from './create-document.reducer';
import { EffectsModule } from '@ngrx/effects';
import { CreateDocumentEffects } from './create-document.effects';

@NgModule({
  imports: [
    CommonModule,
    CreateDocumentRoutes,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    StoreModule.forFeature(fromCreateDocument.createDocumentsFeatureKey, fromCreateDocument.reducer),
    EffectsModule.forFeature([CreateDocumentEffects])
  ],
  declarations: [CreateDocumentComponent, WiDetails, WiLessonLearnedComponent],
  exports: [] 
})
export class CreateDocumentModule { }
