import { Component, Input, OnInit } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-external-work',
  templateUrl: './external-work.component.html',
  styleUrls: ['./external-work.component.scss']
})
export class ExternalWorkComponent implements OnInit {
  @Input() globalData;
  docStatus = 1;
  externalWILinks = '';
  config1: AngularEditorConfig = {
    sanitize: false,
    showToolbar: false,
    editable: false,
    spellcheck: true,
    //width: '100%',
    height: 'auto',
    minHeight: '270px',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    toolbarHiddenButtons: [[
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
    ],]
  };
  constructor() { }
  ngOnChanges(event) {
    if (
      this.globalData &&
      event.globalData.previousValue != event.globalData.currentValue
    ) {
      if (!(Object.keys(this.globalData).length === 0)) {
        this.docStatus = event.globalData.currentValue.assetStatusId;
        this.externalWILinks =  event.globalData.currentValue.externalWILinks;
      }
    }
  }
  ngOnInit(): void {
  }

}
