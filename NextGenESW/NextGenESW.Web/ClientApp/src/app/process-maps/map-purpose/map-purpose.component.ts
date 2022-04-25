import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { CriteriaGroupPageService } from '@app/criteria-group/criteria-group.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { SharedService } from '@app/shared/shared.service';
import { ProcessMapsService } from "../process-maps.service";
import { Store ,select} from '@ngrx/store';
import {  selectSelectedProcessMap } from '@app/reducers';
import { ASSET_STATUSES } from '@environments/constants';
import { RecordsService } from '@app/shared/records.service';

@Component({
  selector: 'app-map-purpose',
  templateUrl: './map-purpose.component.html',
  styleUrls: ['./map-purpose.component.scss']
})
export class MapPurposeComponent implements OnInit {
  ASSET_STATUSES = ASSET_STATUSES;

  cgPurposeForm: FormGroup;
  loading = false;
  activityTabs;
  id;
  @Input() disableForm: boolean;
  docStatus: number = 1;
  @Output() nextTab = new EventEmitter();
  @Output() updatePurposeField = new EventEmitter();

  purposeHolder;

  @Input() globalData;


    constructor(
      private fb: FormBuilder,
      private route: ActivatedRoute,
      private criteriaGroupService: CriteriaGroupPageService,
      private dbService: NgxIndexedDBService,
      private sharedService: SharedService,
      private processMapsService : ProcessMapsService,
      private mapStore: Store<any>,
      private rservice: RecordsService,
    ) {
      this.cgPurposeForm = this.fb.group({
        Id: '',
        Purpose: '',
      });

    }

    ngOnChanges(event) {
      if (
        this.globalData &&
        event.globalData.previousValue != event.globalData.currentValue
      ) {
        if (!(Object.keys(this.globalData).length === 0)) {
          this.docStatus = event.globalData.currentValue.assetStatus;
          // if(event.globalData.currentValue.editMode) {
          //   this.docStatus = 1;
          // } else {
          //   this.docStatus = 2;
          // }
          this.activityTabs = event.globalData.currentValue;
          this.cgPurposeForm?.patchValue({
            Purpose: this.activityTabs.purpose
          });
          this.loading = false;
        }
      }
    }

    ngOnInit(): void {
      this.route.params.subscribe((param) => {
        this.id = parseInt(param.id);
        console.log(this.id);
        this.mapStore
      .pipe(select(selectSelectedProcessMap))
      .subscribe((processMap) => {
        // this.globalData = processMap
        //console.log("map-purpose", processMap);
      });
      //   this.processMapsService.getProcessMap(this.id)
      //   .subscribe((data) => {
      //   this.globalData = data;
      //   console.log('contentid', this.globalData);
      // });

        // this.dbService.getByKey('stepflowPurpose', this.id).subscribe( (value) => {
        //   console.log('purpose Value',value);
        //   this.purposeHolder = value;
        //   this.cgPurposeForm.patchValue({
        //     Purpose: value['Purpose'],
        //   });
        // });
      });



    }


    // Starts Purpose Updation Method
    updatePurpose() {
      this.setActivityId();
      console.log(this.cgPurposeForm.value);

      // if(this.purposeHolder == undefined) {
      //   console.log("Add");
      //   this.dbService
      //   .add('stepflowPurpose',Object.assign({ id : this.id } , this.cgPurposeForm.value  )     )
      //   .subscribe((key) => {
      //     console.log('key: ', key);

      //   });
      // } else{
      //   console.log("Update");
      //   this.dbService
      //   .update('stepflowPurpose', Object.assign({ id : this.id } ,this.cgPurposeForm.value  ))
      //   .subscribe((storeData) => {
      //     console.log(storeData);
      //   });

      // }
      this.callupdate();
      // this.criteriaGroupService
      //   .UpdatePurposeInCriteriaGroup(JSON.stringify(this.cgPurposeForm.value))
      //   .subscribe(
      //     (data) => {
      //       this.updatePurposeField.emit(this.cgPurposeForm.value.Purpose);
      //     },
      //     (error) => {
      //       console.error('There was an error!', error);
      //       this.loading = false;
      //     }
      //   );

    }

    callupdate(){
      let purpose = this.cgPurposeForm.controls.Purpose.value;
      let purposeText = {purpose: purpose};
      let contId = this.globalData.contentId;
      let contentid = {contentid:contId};
      let id = {stepFlowId:this.globalData.id};
      let purposeData = {...contentid, ...purposeText, ...id};
      this.processMapsService.editProcessMapUpAndDown(purposeData).subscribe((data)=>{
        console.log("Update...");
        this.updatePurposeField.emit(this.cgPurposeForm.value.Purpose);
       })
    }
    setActivityId() {
      this.cgPurposeForm.patchValue({
        Id: this.id,
      });
    }
    onArrowClick() {
      this.nextTab.emit(2);
    }

    checkFocusOut(){
      this.rservice.UpdateBroadcastMessage('false');
    }

    checkValueChange(){
      this.rservice.UpdateBroadcastMessage('true');
    }

    get isContentOwner() {
      return this.globalData?.contentOwnerId === sessionStorage.getItem('userMail');
    }

    get isEditableMode() {
      return this.globalData?.assetStatus !== ASSET_STATUSES.PUBLISHED && this.globalData?.assetStatus !== ASSET_STATUSES.CURRENT && this.globalData?.assetStatus !== ASSET_STATUSES.OBSOLETE && this.globalData?.assetStatus !== ASSET_STATUSES.APPROVED_WAITING_FOR_JC && this.globalData?.assetStatus !== ASSET_STATUSES.ARCHIVED && (this.globalData?.assetStatus !== ASSET_STATUSES.SUBMITTED_FOR_APPROVAL || this.isContentOwner);
    }
}
