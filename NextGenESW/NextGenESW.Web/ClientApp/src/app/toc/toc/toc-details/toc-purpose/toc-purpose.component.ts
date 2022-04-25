import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TocService } from '../../toc.service';
import { ActivatedRoute } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ASSET_STATUSES } from '@environments/constants';

@Component({
  selector: 'app-toc-purpose',
  templateUrl: './toc-purpose.component.html',
  styleUrls: ['./toc-purpose.component.scss']
})
export class TocPurposeComponent implements OnInit {
  ASSET_STATUSES = ASSET_STATUSES;
  tocPurposeForm: FormGroup;
  activityPageComponentId: number;
  loading = false;
  activityTabs;
  id;
  done = [];
  dragDropSavedIframeId = [];
  @Input() disableForm: boolean;
  selectedIndex = 0;
  docStatus = ASSET_STATUSES.DRAFT;
  @Input() globalData;
  @Output() updatePurposeField = new EventEmitter();
  config: AngularEditorConfig = {
    sanitize: true,
    showToolbar: true,
    editable: true,
    spellcheck: true,
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

  constructor(private fb: FormBuilder,
              private tocService: TocService,
              private route: ActivatedRoute) {
    this.route.params.subscribe((param) => {
      this.id = parseInt(param.id);
    });

    this.tocPurposeForm = this.fb.group({
      Id: '',
      Purpose: ''
    });
  }

  ngOnInit(): void {

    if (this.id > 0) {
      // this.tocService.getTocPageList(this.id).subscribe((res) => {
      //   this.activityTabs = res;
      // });
    }

    this.route.params.subscribe((param) => {
      this.id = param.id;
    });
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
        this.activityTabs = event.globalData.currentValue;
        this.tocPurposeForm?.patchValue({
          Purpose: this.activityTabs.purpose
        });
        this.loading = false;
      }
    }
  }

  updatePurpose() {
    this.setActivityId();
    console.log(this.tocPurposeForm.value);
    this.tocService
      .UpdatePurposeInActivityPage(JSON.stringify(this.tocPurposeForm.value))
      .subscribe(
        (data) => {
          this.updatePurposeField.emit(data['purpose']);
        },
        (error) => {
          console.error('There was an error!', error);
          this.loading = false;
        }
      );
  }

  setActivityId() {
    this.tocPurposeForm.patchValue({
      Id: this.globalData?.id,
    });
  }
}
