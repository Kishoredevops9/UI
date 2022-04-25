
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivityPageService } from '../../activity-page.service';
import { ActivatedRoute } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ThrowStmt } from '@angular/compiler';
 
import { ASSET_STATUSES } from '@environments/constants';
import { RecordsService } from './../../../../app/shared/records.service';
 
@Component({
  selector: 'app-activity-purpose',
  templateUrl: './activity-purpose.component.html',
  styleUrls: ['./activity-purpose.component.scss']
})
export class ActivityPurposeComponent implements OnInit {
  ASSET_STATUSES = ASSET_STATUSES;
  apPurposeForm: FormGroup;
  activityPageComponentId: number;
  loading = false;
  activityTabs;
  id;
  done = [];
  dragDropSavedIframeId = [];
  @Input() disableForm: boolean;
  selectedIndex = 0;
  @Output() updatePurposeField = new EventEmitter();

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
    // width: '60rem',
    height: 'auto',
    minHeight: '235px',
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

  docStatus: number = 1;
  @Input() globalData;
  valueNew = 0;
  constructor(private fb: FormBuilder,
    private activityPageService: ActivityPageService,
    private rservice: RecordsService,
    private route: ActivatedRoute) {
    this.apPurposeForm = this.fb.group({
      Id: '',
      Purpose: '',
    });

    this.route.params.subscribe((param) => {
      this.id = parseInt(param.id);
    });
  }

  ngOnInit(): void {
    if (this.id > 0) {
    }
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
    this.id = (this.globalData && this.globalData.id > 0) ? this.globalData.id : '';
    if (
      event.globalData.currentValue &&
      event.globalData.previousValue != event.globalData.currentValue
    ) {
      if (!(Object.keys(this.globalData).length === 0)) {
        this.docStatus = event.globalData.currentValue.assetStatusId;
        // if(event.globalData.currentValue.editMode) {
        //   this.docStatus = 1;
        // } else {
        //   this.docStatus = 2;
        // }
        this.activityTabs = event.globalData.currentValue;
        this.loading = false;
        this.apPurposeForm?.patchValue({
          Purpose: this.activityTabs.purpose
        });
      }
    }
  }

  // Starts Purpose Updation Method
  updatePurpose() {
    // this.valueNew = this.valueNew +1;
    // console.log('this.valueNew',this.valueNew);
    // if(this.valueNew > 1){
    //   this.rservice.UpdateBroadcastMessage('true');
    // }
    // else{
    //   this.rservice.UpdateBroadcastMessage('false');
    // }
    this.setActivityId();
    console.log(this.apPurposeForm.value);
    this.activityPageService
      .UpdatePurposeInActivityPage(JSON.stringify(this.apPurposeForm.value))
      .subscribe(
        (data) => {
          const updatedValue = {
            purpose: this.apPurposeForm.value.Purpose,
            propertiesLastUpdateDateTime: data['propertiesLastUpdateDateTime']
          }
          this.updatePurposeField.emit(updatedValue);
          // setTimeout(() => {
          //   this.rservice.UpdateBroadcastMessage('false');
          // });
        },
        (error) => {
          console.error('There was an error!', error);
          this.loading = false;
        }
      );
  }

  setActivityId() {
    // let purposeId = this.id > 0 ? this.id : id;
    // console.log(purposeId);
    // console.log(this.id);
    this.apPurposeForm.patchValue({
      Id: this.id,
    });
  }
}
