import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CriteriaGroupPageService } from '@app/criteria-group/criteria-group.service';
import { ActivatedRoute } from '@angular/router';

import { ASSET_STATUSES } from '@environments/constants';
import { RecordsService } from './../../../../app/shared/records.service';


@Component({
  selector: 'app-intent-basis-validation',
  templateUrl: './intent-basis-validation.component.html',
  styleUrls: ['./intent-basis-validation.component.scss'],
})
export class IntentBasisValidationComponent implements OnInit {
  config: AngularEditorConfig = {
    sanitize: false,
    showToolbar: true,
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
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
        'fontSize','fontName','removeFormat',
      ],
    ]
  };
  config1: AngularEditorConfig = {
    sanitize: false,
    showToolbar: false,
    editable: false,
    spellcheck: true,
    width: '100%',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    toolbarHiddenButtons: [
      [
        'fontSize','fontName','removeFormat',
      ],
    ]
  };
  criteriaGroupID;
  loading = false;
  validationOfCriteria= '';
  basisOfCriteria= '';
  intentOfCriteria= '';
  rowData = {};
  @Output() nextTab = new EventEmitter();
  docStatus = ASSET_STATUSES.DRAFT;
  ASSET_STATUSES = ASSET_STATUSES;
  @Input() globalData;
  @Output() updateIntentBasisValidationField = new EventEmitter();
  constructor(
    private fb: FormBuilder,
    private criteriaGroupService: CriteriaGroupPageService,
    private route: ActivatedRoute,
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
        this.validationOfCriteria =
          event.globalData.currentValue.validationOfCriteria;
        this.basisOfCriteria = event.globalData.currentValue.basisOfCriteria;
        this.intentOfCriteria = event.globalData.currentValue.intentOfCriteria;
        this.loading = false;
      }
    }
  }

  ngOnInit(): void {
  }
  onArrowClick() {
    this.nextTab.emit(5);
  }
  onFocusOut() {
    this.criteriaGroupID = (this.globalData && this.globalData.id > 0) ? this.globalData.id : this.criteriaGroupID;
    if (this.isEditableMode) {
      // this.loading = true;
      this.criteriaGroupService
        .UpdateIntentBasisValidation(
          this.criteriaGroupID,
          this.intentOfCriteria,
          this.validationOfCriteria,
          this.basisOfCriteria
        )
        .subscribe((data) => {
          var res = JSON.parse(JSON.stringify(data));
          const referenceObj = {
            intentOfCriteria: this.intentOfCriteria,
            validationOfCriteria: this.validationOfCriteria,
            basisOfCriteria: this.basisOfCriteria,
            propertiesLastUpdateDateTime: data['propertiesLastUpdateDateTime']
          }
          // this.loading = false;
          this.updateIntentBasisValidationField.emit(referenceObj);
        },(error) => {
          // this.loading = false;
        });
    }
  }

  get isContentOwner() {
    return this.globalData?.contentOwnerId === sessionStorage.getItem('userMail');
  }

  get isEditableMode() {
    return this.globalData?.assetStatus !== ASSET_STATUSES.PUBLISHED && this.globalData?.assetStatus !== ASSET_STATUSES.CURRENT && this.globalData?.assetStatus !== ASSET_STATUSES.OBSOLETE && this.globalData?.assetStatus !== ASSET_STATUSES.APPROVED_WAITING_FOR_JC && this.globalData?.assetStatus !== ASSET_STATUSES.ARCHIVED && (this.globalData?.assetStatus !== ASSET_STATUSES.SUBMITTED_FOR_APPROVAL || this.isContentOwner);
  }
}
