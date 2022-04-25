import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { ActivityDetailsComponent } from './activity-details.component';

const imports = [
  CommonModule,
  SharedModule
];

const components = [
  ActivityDetailsComponent
];

@NgModule({
  declarations: [...components],
  exports: [
    ActivityDetailsComponent
  ],
  imports
})

export class ActivityDetailsModule { }
