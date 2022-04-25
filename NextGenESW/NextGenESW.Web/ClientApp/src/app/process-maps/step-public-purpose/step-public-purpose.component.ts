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
  selector: 'app-step-public-purpose',
  templateUrl: './step-public-purpose.component.html',
  styleUrls: ['./step-public-purpose.component.scss']
})
export class StepPublicPurposeComponent implements OnInit {
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
  @Input() publishMode = false;


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
          this.docStatus = event.globalData.currentValue.assetStatusId;
          this.docStatus = event.globalData.currentValue.assetStatus;
          // if(event.globalData.currentValue.editMode) {
          //   this.docStatus = 1;
          // } else {
          //   this.docStatus = 2;
          // }
          this.activityTabs = event.globalData.currentValue;
          this.loading = false;
          this.cgPurposeForm?.patchValue({
            Purpose: this.activityTabs.purpose
          });
        }
      }
    }

    ngOnInit(): void {
      this.route.params.subscribe((param) => {
        this.id =  param['id'];
        // if(this.id){
        //   this.mapStore.pipe(select(this.id))
        //   .subscribe((processMap) => {
        //     this.globalData = processMap;
        //     console.log(this.globalData)
        //   });
        // }
      });
    }


    // Starts Purpose Updation Method
    updatePurpose() {
      this.setActivityId();
      console.log(this.cgPurposeForm.value);

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


    updatePRS(){


      let purpose = this.cgPurposeForm.controls.Purpose.value;
      let purposeText = {purpose: purpose};
      let contId = this.globalData.contentId;
      let contentid = {contentid:contId};
      let Id = {id:this.globalData.id};
      let purposeData = {...contentid, ...purposeText, ...Id};
      this.processMapsService.updatePurposepublicStep(purposeData).subscribe((data)=>{
        console.log("Update...");
        this.updatePurposeField.emit(this.cgPurposeForm.value.Purpose);
       })


    }
    callupdate(){

      if (!this.globalData){
        this.ngOnInit();
        setTimeout(()=>{
                    this.updatePRS()
        },5000);
      }
      else{
        this.updatePRS();
      }
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
}
