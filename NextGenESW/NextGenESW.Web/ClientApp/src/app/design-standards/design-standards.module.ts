import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesignPropertiesComponent } from './design-details/design-properties/design-properties.component';
import { DesignLessonLearnedComponent } from './design-details/design-lesson-learned/design-lesson-learned.component';
import { DesignDetailsComponent } from './design-details/design-details.component';
import { DesignStandardsComponent } from './design-standards.component';
import { SharedModule } from '@app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DesignStandardsRoutingModule } from './design-standards-routing.module';

@NgModule({
  declarations: [
    DesignPropertiesComponent,
    DesignLessonLearnedComponent,
    DesignStandardsComponent,
    DesignDetailsComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    DesignStandardsRoutingModule,
  ],
})
export class DesignStandardsModule {}
