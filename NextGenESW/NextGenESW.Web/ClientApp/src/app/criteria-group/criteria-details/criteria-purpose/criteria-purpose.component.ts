import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CriteriaGroupPageService } from '@app/criteria-group/criteria-group.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';

import { ASSET_STATUSES } from '@environments/constants';
import { RecordsService } from './../../../../app/shared/records.service';


@Component({
  selector: 'app-criteria-purpose',
  templateUrl: './criteria-purpose.component.html',
  styleUrls: ['./criteria-purpose.component.scss'],
})
export class CriteriaPurposeComponent implements OnInit {
  ASSET_STATUSES = ASSET_STATUSES;
  cgPurposeForm: FormGroup;
  loading = false;
  activityTabs;
  id;
  @Input() disableForm: boolean;
  docStatus = ASSET_STATUSES.DRAFT;
  @Output() nextTab = new EventEmitter();
  @Output() updatePurposeField = new EventEmitter();
  config: AngularEditorConfig = {
    sanitize: false,
    showToolbar: true,
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '300px',
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
    minHeight: '235px',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    toolbarHiddenButtons: [
      [
        'undo',
        'redo',
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
  @Input() globalData;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private criteriaGroupService: CriteriaGroupPageService,
    private rservice: RecordsService,
  ) {
    this.cgPurposeForm = this.fb.group({
      Id: '',
      Purpose: '',
    });

    this.route.params.subscribe((param) => {
      this.id = (this.globalData && this.globalData.id > 0) ? this.globalData.id : param['contentId'];
    });
  }

checkFocusOut(){
  this.rservice.UpdateBroadcastMessage('false');
}
checkValueChange(){
  this.rservice.UpdateBroadcastMessage('true');
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
        this.loading = false;
        this.cgPurposeForm?.patchValue({
          Purpose: this.activityTabs.purpose
        });
      }
    }
  }

  ngOnInit(): void {
  }

  // Starts Purpose Updation Method
  updatePurpose() {
    this.setActivityId();
    console.log(this.cgPurposeForm.value);
    this.criteriaGroupService
      .UpdatePurposeInCriteriaGroup(JSON.stringify(this.cgPurposeForm.value))
      .subscribe(
        (data) => {
          const updatedValue = {
            purpose: this.cgPurposeForm.value.Purpose,
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

  setActivityId() {
    this.cgPurposeForm.patchValue({
      Id: this.id = (this.globalData && this.globalData.id > 0) ? this.globalData.id : this.id
    });
  }
  onArrowClick() {
    this.nextTab.emit(2);
  }

  get isContentOwner() {
    return this.globalData?.contentOwnerId === sessionStorage.getItem('userMail');
  }
}
