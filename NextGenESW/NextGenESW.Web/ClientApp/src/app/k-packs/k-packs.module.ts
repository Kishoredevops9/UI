import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { KPacksDetailsComponent } from './k-packs-details/k-packs-details.component';
import { KPacksPurposeComponent } from './k-packs-details/k-packs-purpose/k-packs-purpose.component';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { KPacksRoutingModule } from './k-packs.routing';
import { TooltipModule } from '@app/shared/_tooltip';
import { NoSanitizePipe } from './k-packs-details/no-sanitize.pipe';

@NgModule({
  declarations: [KPacksDetailsComponent, KPacksPurposeComponent, NoSanitizePipe],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    AngularEditorModule,
    KPacksRoutingModule,
    TooltipModule
  ]
})
export class KPacksModule { }
