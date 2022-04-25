import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RelatedContentComponent } from './related-content.component';
import { RelatedContentPurposeComponent } from './related-content-details/related-content-purpose/related-content-purpose.component';

import { RelatedContentDetailsComponent } from './related-content-details/related-content-details.component';
import { SharedModule } from '@app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ContentsComponent } from './related-content-details/contents/contents.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { RelatedContentRoutingRoutingModule } from './related-content-routing-routing.module';

@NgModule({
  declarations: [
    RelatedContentComponent,
    RelatedContentDetailsComponent,
    ContentsComponent,
    RelatedContentPurposeComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    AngularEditorModule,
    FlexLayoutModule,
    MatButtonModule,
    RelatedContentRoutingRoutingModule
  ],
})
export class RelatedContentModule {}
