import { Component, OnInit, Input, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AngularEditorConfig } from '@kolkov/angular-editor';

import { Subscription } from 'rxjs';
import { ActivityPageService } from '@app/activity-page/activity-page.service';
import { ContextInfo } from '@app/shared/component/global-panel/context/context.model';
import { ContextService } from '@app/shared/component/global-panel/context/context.service';

@Component({
  selector: 'app-add-guidance',
  templateUrl: './add-guidance.component.html',
  styleUrls: ['./add-guidance.component.scss']
})
export class AddGuidanceComponent implements OnInit {

  isLoading = false;
  @Input() docStatus;
  content: any;
  loading = false;
  activityContent;
  bottomLineStyle = '';
  contentInfo:any;
  guidanceText:any;
  config: AngularEditorConfig = {
    sanitize: false,
    showToolbar: true,
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '270px',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    placeholder: 'Enter Guidance',
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



  constructor(private dialogRef: MatDialogRef<AddGuidanceComponent>,  
    @Inject(MAT_DIALOG_DATA) public data: any,
    private activityPageService: ActivityPageService,
    private contextService: ContextService
    ) {
      this.contentInfo = data.data;
     }

  ngOnInit(): void {  
    console.log('this.contentdata',this.contentInfo)
  }

  loadContextInfo() {
    this.contextService.ContextInfo = this.getContextInfo();
  }
  getContextInfo() {
    const contextInfo: ContextInfo = new ContextInfo();
    contextInfo.activityContent = this.activityContent;
    return contextInfo;
  }
  saveGuidance() {
    this.contentInfo.content.guidance = this.contentInfo.content.guidance; 
    console.log(this.contentInfo.content);
    this.loading = true;
    this.activityPageService
      .updateGuidance(this.contentInfo.content)
      .subscribe((res) => {
        this.activityContent = res;
        this.loadContextInfo();
        this.loading = false;
      });
      this.dialogRef.close(this.activityContent);
  }
}
