import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CriteriaGroupComponent } from './criteria-group.component';
import { CriteriaGroupRoutes } from './criteria-group-routing.module';
import { CriteriaDetailsComponent } from './criteria-details/criteria-details.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './../shared/shared.module';
import { CriteriaPropertiesComponent } from './criteria-details/criteria-properties/criteria-properties.component';
import { CriteriaPurposeComponent } from './criteria-details/criteria-purpose/criteria-purpose.component';
import { CriteriaLessonLearnedComponent } from './criteria-details/criteria-lesson-learned/criteria-lesson-learned.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { CriteriaComponent } from './criteria-details/criteria/criteria.component';
import { DefinitionsComponent } from './criteria-details/definitions/definitions.component';
import { IntentBasisValidationComponent } from './criteria-details/intent-basis-validation/intent-basis-validation.component';
import { ReferencesComponent } from './criteria-details/references/references.component';
import { NatureOfChangeComponent } from './criteria-details/nature-of-change/nature-of-change.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';



@NgModule({
  declarations: [
    CriteriaGroupComponent,
    CriteriaDetailsComponent,
    CriteriaPropertiesComponent,
    CriteriaPurposeComponent,
    CriteriaLessonLearnedComponent,
    CriteriaComponent,
    DefinitionsComponent,
    IntentBasisValidationComponent,
    ReferencesComponent,
    NatureOfChangeComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    CriteriaGroupRoutes,
    AngularEditorModule,
    MatDatepickerModule, MatInputModule,MatNativeDateModule
  ],
})
export class CriteriaGroupModule { }
