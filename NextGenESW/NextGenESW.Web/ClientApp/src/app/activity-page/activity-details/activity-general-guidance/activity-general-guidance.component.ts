
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActivityPageService } from '@app/activity-page/activity-page.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';

import { ASSET_STATUSES } from '@environments/constants';

import { RecordsService } from './../../../../app/shared/records.service';

@Component({
  selector: 'app-activity-general-guidance',
  templateUrl: './activity-general-guidance.component.html',
  styleUrls: ['./activity-general-guidance.component.scss']
})
export class ActivityGeneralGuidanceComponent implements OnInit {
  ASSET_STATUSES = ASSET_STATUSES;
  criteriaGroupID;
  loading = false;
  wiGuidence= '';
  cgGuidence= '';
  rowData = {};
  @Output() updateGeneralGuidanceField = new EventEmitter();
  docStatus = ASSET_STATUSES.DRAFT;
  @Input() globalData;
  valueNew = 0;
 // @Output() updateIntentBasisValidationField = new EventEmitter();
  constructor(
    private route: ActivatedRoute,
    private activityPageService: ActivityPageService,
    private rservice: RecordsService,
  ) {
    this.route.params.subscribe((param) => {
      this.criteriaGroupID = (this.globalData && this.globalData.id > 0) ? this.globalData.id : (param['contentId']);
    });
  }

  checkFocusOut(){
    this.rservice.UpdateBroadcastMessage('false');
  }
  checkValueChange(){
    this.rservice.UpdateBroadcastMessage('true');
  }
  ngOnDestroy() {
  this.valueNew = 0;
  }

  ngOnChanges(event) {
    if (
      this.globalData &&
      event.globalData.previousValue != event.globalData.currentValue
    ) {
      if (!(Object.keys(this.globalData).length === 0)) {
        this.docStatus = event.globalData.currentValue.assetStatusId;
        this.docStatus = event.globalData.currentValue.assetStatus;
        if(this.docStatus == ASSET_STATUSES.PUBLISHED) {
          if(event.globalData.currentValue.generalGuidance) {
            var result = JSON.parse(event.globalData.currentValue.generalGuidance);
            this.wiGuidence = result.WorkInstructionGuidance;
            this.cgGuidence = result.CriteriaGuidance;
          } else {
            this.wiGuidence = event.globalData.currentValue.wiGuidence;
            this.cgGuidence = event.globalData.currentValue.cgGuidence;
          }
        } else {
          this.wiGuidence = event.globalData.currentValue.wiGuidence;
          this.cgGuidence = event.globalData.currentValue.cgGuidence;
          this.loading = false;
        }
      }
    }
  }

  ngOnInit(): void {
  }
  onFocusOut(value) {
    // this.valueNew = this.valueNew +1;
    // console.log('this.valueNew',this.valueNew);
    // if(this.valueNew > 2){
    //   this.rservice.UpdateBroadcastMessage('true');
    // }
    // else{
    //   this.rservice.UpdateBroadcastMessage('false');
    // }
    this.criteriaGroupID = (this.globalData && this.globalData.id > 0) ? this.globalData.id : this.criteriaGroupID;
    if (this.docStatus !== ASSET_STATUSES.PUBLISHED && this.docStatus !== ASSET_STATUSES.OBSOLETE && this.docStatus !== ASSET_STATUSES.ARCHIVED && this.docStatus !== ASSET_STATUSES.CURRENT && this.docStatus !== ASSET_STATUSES.APPROVED_WAITING_FOR_JC) {
      const payload = {
        id: this.globalData.id,
        cgGuidence: this.cgGuidence,
        wiGuidance: this.wiGuidence,
      }
      this.activityPageService
        .updateGuidanceComponent(payload)
        .subscribe((data) => {
          var res = JSON.parse(JSON.stringify(data));
          const referenceObj = {
            cgGuidence: this.cgGuidence,
            wiGuidence: this.wiGuidence,
            propertiesLastUpdateDateTime: res.propertiesLastUpdateDateTime
          }
          this.updateGeneralGuidanceField.emit(referenceObj);
          // setTimeout(() => {
          //   this.rservice.UpdateBroadcastMessage('false');
          // });

        });
    }
  }

}
