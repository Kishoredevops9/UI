import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { CriteriaGroupPageService } from '@app/criteria-group/criteria-group.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { ProcessMapsService } from "../../../process-maps.service";
import { SharedService } from '@app/shared/shared.service';
import { ASSET_STATUSES } from '@environments/constants';
@Component({
  selector: 'app-step-purpose',
  templateUrl: './step-purpose.component.html',
  styleUrls: ['./step-purpose.component.scss']
})
export class StepPurposeComponent implements OnInit {
  ASSET_STATUSES = ASSET_STATUSES;
  cgPurposeForm: FormGroup;
  loading = false;
  activityTabs;
  docstatusdata:any;
  previewStatus:any;
  id;
  @Input() disableForm: boolean;
  @Input() globalData: any;
  docStatus: number = 1;
  @Output() nextTab = new EventEmitter();
  @Input() docStatusValue:any;
  @Output() updatePurposeField = new EventEmitter();

  purposeStepHolder;
  stepKeys;

  config: AngularEditorConfig = {
    sanitize: false,
    showToolbar: true,
    editable: true,
    spellcheck: true,
    // height: '15rem',
    // minHeight: '5rem',
    height: 'auto',
    minHeight: '270px',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      [
        'strikeThrough',
        'subscript',
        'superscript',
        'justifyLeft',
        'indent',
        'insertHorizontalRule',
        'clearFormatting',
        'outdent',
        'justifyCenter',
        'justifyRight',
        'justifyFull',
        'backgroundColorPicker',
        'insertVideo',
        'fontSize','fontName','removeFormat',
      ],
    ]
  };
  config1: AngularEditorConfig = {
    sanitize: false,
    showToolbar: false,
    editable: false,
    spellcheck: true,
    //width: '60rem',
    height: 'auto',
    minHeight: '270px',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    toolbarHiddenButtons: [
      [
        'strikeThrough',
        'subscript',
        'superscript',
        'justifyLeft',
        'indent',
        'insertHorizontalRule',
        'clearFormatting',
        'outdent',
        'justifyCenter',
        'justifyRight',
        'justifyFull',
        'backgroundColorPicker',
        'insertVideo',
        'fontSize','fontName','removeFormat',
      ],
    ]
  };



    constructor(
      private fb: FormBuilder,
      private route: ActivatedRoute,
      private criteriaGroupService: CriteriaGroupPageService,
      private dbService: NgxIndexedDBService,
      private processMapsService : ProcessMapsService,
      private sharedService: SharedService,
    ) {
      this.cgPurposeForm = this.fb.group({
        Id: '',
        Purpose: '',
      });

    }

    ngOnChanges(event) {
      console.log(this.globalData);
      if (
        this.globalData &&
        event.globalData.previousValue != event.globalData.currentValue
      ) {
        if (!(Object.keys(this.globalData).length === 0)) {
          this.docStatus = event.globalData.currentValue.assetStatusId;
          this.activityTabs = event.globalData.currentValue;
          this.loading = false;
          this.cgPurposeForm?.patchValue({
            Purpose: this.activityTabs.purpose
          });
        }
      }
      if (
        event.docStatusValue &&
        event.docStatusValue.previousValue != event.docStatusValue.currentValue
      ){
        this.docStatus = event.docStatusValue.currentValue;
      }
    }

    ngOnInit(): void {
      this.route.params.subscribe((param) => {
        this.id = parseInt(param['id']);
        console.log(this.id);
        this.processMapsService.getProcessMap(this.id)
        .subscribe((data) => {
        this.globalData = data;
      });
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
      let id = {stepFlowId:this.id};
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
}
