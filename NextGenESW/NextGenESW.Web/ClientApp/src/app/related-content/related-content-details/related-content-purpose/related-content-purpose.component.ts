import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
//import { ActivityPageService } from '../../activity-page.service';
import { ActivityPageService } from '@app/activity-page/activity-page.service';

import { ActivatedRoute } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ThrowStmt } from '@angular/compiler';

import { ASSET_STATUSES } from '@environments/constants';
import { RecordsService } from './../../../../app/shared/records.service';

@Component({
  selector: 'app-related-content-purpose',
  templateUrl: './related-content-purpose.component.html',
  styleUrls: ['./related-content-purpose.component.scss']
})
export class RelatedContentPurposeComponent implements OnInit {
  ASSET_STATUSES = ASSET_STATUSES;
  rcPurposeForm: FormGroup;
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

  docStatus = ASSET_STATUSES.DRAFT;
  @Input() globalData;

  constructor(private fb: FormBuilder,
    private activityPageService: ActivityPageService,
    private rservice: RecordsService,
    private route: ActivatedRoute) {
    this.rcPurposeForm = this.fb.group({
      Id: '',
      Purpose: '',
    });

    this.route.params.subscribe((param) => {
      this.id = parseInt(param.id);
    });
  }

  checkFocusOut(){
    this.rservice.UpdateBroadcastMessage('false');
  }


  checkValueChange(){
    this.rservice.UpdateBroadcastMessage('true');
  }

  ngOnInit(): void {
    if (this.id > 0) {
    }
  }

  ngOnChanges(event) {
    this.id = (this.globalData && this.globalData.id > 0) ? this.globalData.id : '';
    if (
      event.globalData.currentValue &&
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
        if(this.activityTabs.purpose == null ){
        this.activityTabs.purpose = '';
        }
        this.rcPurposeForm?.patchValue({
          Purpose: this.activityTabs.purpose
        });
      }
    }
  }

  // Starts Purpose Updation Method
  updatePurpose() {
    this.setRCId();
    console.log(this.rcPurposeForm.value);
    this.activityPageService
      .UpdatePurposeInRelatedContentPage(JSON.stringify(this.rcPurposeForm.value))
      .subscribe(
        (data) => {
          const updatedValue = {
            purpose: this.rcPurposeForm.value.Purpose,
            propertiesLastUpdateDateTime: data['propertiesLastUpdateDateTime']
          }
          this.updatePurposeField.emit(updatedValue);
        },
        (error) => {
          console.error('There was an error!', error);
          this.loading = false;
        }
      );
  }

  setRCId() {
    // let purposeId = this.id > 0 ? this.id : id;
    // console.log(purposeId);
    // console.log(this.id);
    this.rcPurposeForm.patchValue({
      Id: this.id,
    });
  }

  get isContentOwner() {
    return this.globalData?.contentOwnerId === sessionStorage.getItem('userMail');
  }

  get isEditableMode() {
    return this.globalData?.assetStatus !== ASSET_STATUSES.PUBLISHED && this.globalData?.assetStatus !== ASSET_STATUSES.CURRENT && this.globalData?.assetStatus !== ASSET_STATUSES.OBSOLETE && this.globalData?.assetStatus !== ASSET_STATUSES.APPROVED_WAITING_FOR_JC && this.globalData?.assetStatus !== ASSET_STATUSES.ARCHIVED && (this.globalData?.assetStatus !== ASSET_STATUSES.SUBMITTED_FOR_APPROVAL || this.isContentOwner);
  }
}
