import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GuideBookComponent } from './guide-book.component';
import { GuideDetailsComponent } from './guide-details/guide-details.component';
import { GuidePropertiesComponent } from './guide-details/guide-properties/guide-properties.component';
import { GuideLessonLearnedComponent } from './guide-details/guide-lesson-learned/guide-lesson-learned.component';
import { SharedModule } from '@app/shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { GuideBookRoutingModule } from './guide-book-routing.module';



@NgModule({
  declarations: [
    GuideBookComponent,
    GuideDetailsComponent,
    GuidePropertiesComponent,    
    GuideLessonLearnedComponent    
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    GuideBookRoutingModule    
  ],
})
export class GuideBookModule { }
