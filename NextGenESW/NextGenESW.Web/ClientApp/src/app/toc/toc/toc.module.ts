import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { TocDetailsComponent } from './toc-details/toc-details.component';
import { TocPurposeComponent } from './toc-details/toc-purpose/toc-purpose.component';
import { TocPageComponent } from './toc-page.component';
import { TocTocComponent } from './toc-details/toc-toc/toc-toc.component';
import { SharedModule } from '@app/shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { TocRoutingModule } from './toc-routing.routing';
import { TocListItemComponent } from './toc-details/toc-toc/toc-list-item/toc-list-item.component';
import { ExternalLinkComponent } from './toc-details/toc-toc/external-link/external-link.component';
import { TocDragDropComponent } from './toc-details/toc-toc/toc-drag-drop/toc-drag-drop.component';


@NgModule({  
  imports: [
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    AngularEditorModule,
    TocRoutingModule
  ],
  declarations: [TocDetailsComponent, TocPurposeComponent, TocTocComponent, TocPageComponent, TocListItemComponent, ExternalLinkComponent, TocDragDropComponent]
})
export class TocModule { }
