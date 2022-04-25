import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output, ViewContainerRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { generateUUID } from '@app/shared/utils/generateGuid';
import { UploadImageTool } from '@app/shared/texteditor/widgets/upload-image.tool';
import { ExpandEditorTool } from '@app/shared/texteditor/widgets/expand-editor.tool';
import { AddEksLinksTool } from '@app/shared/texteditor/widgets/add-eks-links.tool';
import { MatDialog } from '@angular/material/dialog';
import { RICH_TEXT_EDITOR_TOOLS_CONFIG } from '@app/shared/texteditor/constant/rich-text.constant';
import { BaseComponent } from '@app/shared/component/base/base.component';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { InsertVideoTool } from '@app/shared/texteditor/widgets/insert-video.tool';

declare var $;

@Component({
  selector: 'app-texteditor',
  templateUrl: './texteditor.component.html',
  styleUrls: [ './texteditor.component.scss' ],
  providers: [ {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TexteditorComponent),
    multi: true
  } ]
})
export class TexteditorComponent extends BaseComponent implements OnInit, AfterViewInit, ControlValueAccessor {
  private previousValue = {
    changed: false, value: null
  };
  private formValue$ = new Subject();

  id = generateUUID();
  onTouched!: Function;
  onChanged!: Function;
  formValue: any;

  constructor(private viewContainerRef: ViewContainerRef,
              private componentFactoryResolver: ComponentFactoryResolver,
              private dialog: MatDialog) {
    super();
  }

  @Input() set placeholder(value) {
    console.log('set placeholder', value);
    this.formValue = value;
    this.checkForChange(value, true);
  }

  @Input() expandable = false;
  @Input() canAttachEKSLink = false;
  @Input() height = 400;
  @Input() tools = RICH_TEXT_EDITOR_TOOLS_CONFIG.RICH_TEXT_TOOLS;
  @Output() focusout = new EventEmitter<void>();
  @Output() focusin = new EventEmitter<void>();
  @Input() allowMedia = true;

  @Output() editorData = new EventEmitter<any>();
  @Output() focus = new EventEmitter<void>();

  submitForm(value) {
    const editor = this.getEditor();
    if ( editor ) {
      editor.value(value);
    }
    if ( this.onChanged ) {
      this.onChanged(value);
    }
    this.editorData.emit(value);
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.initEditor();
    this.listenFormChange();
  }

  writeValue(value: string): void {
    this.formValue = value;
  }

  registerOnChange(fn: any): void {
    this.onChanged = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
  }

  setEditorValue(value) {
    this.submitForm(value);
  }

  private initEditor() {
    setTimeout(() => {
      let ALL_TOOLS = [
        'bold',
        'italic',
        'underline',
        'strikethrough',
        'justifyLeft',
        'justifyCenter',
        'justifyRight',
        'justifyFull',
        'insertUnorderedList',
        'insertOrderedList',
        'insertUpperRomanList',
        'insertLowerRomanList',
        'indent',
        'outdent',
        'createLink',
        'unlink',
        ...(this.allowMedia ? [
          'insertImage',
          UploadImageTool(),
          InsertVideoTool()
        ] : []),
        'insertFile',
        'subscript',
        'superscript',
        'tableWizard',
        'createTable',
        'addRowAbove',
        'addRowBelow',
        'addColumnLeft',
        'addColumnRight',
        'deleteRow',
        'deleteColumn',
        'mergeCellsHorizontally',
        'mergeCellsVertically',
        'splitCellHorizontally',
        'splitCellVertically',
        'tableAlignLeft',
        'tableAlignCenter',
        'tableAlignRight',
        'viewHtml',
        'formatting',
        'cleanFormatting',
        'copyFormat',
        'applyFormat',
        'fontName',
        'fontSize',
        'foreColor',
        'backColor',
        ...(this.canAttachEKSLink ? [ AddEksLinksTool(this.dialog) ] : [])
      ];
      const BASIC_TOOLS = [
        'bold',
        'italic',
        'underline',
        'insertUnorderedList',
        'insertOrderedList',
        'formatting',
        'createLink',
        'unlink',
        ...(this.allowMedia ? [
          'insertImage',
          UploadImageTool()
        ] : []),
        ...(this.canAttachEKSLink ? [ AddEksLinksTool(this.dialog) ] : []),
        ExpandEditorTool(this, {
          allowMedia: this.allowMedia
        })
      ];
      if ( this.expandable ) {
        ALL_TOOLS = BASIC_TOOLS;
      }
      const parentElement = $('#' + this.id + 't');
      const kendoElement = $('#' + this.id).kendoEditor({
        value: this.formValue,
        encoded: false,
        tools: ALL_TOOLS,
        change: ($event) => {
          setTimeout(() => {
            this.checkForChange(this.getEditorValue());
          }, 200);
        },
        keyup: ($event) => {
          setTimeout(() => {
            this.checkForChange(this.getEditorValue());
          }, 200);
        },
        execute: ($event) => {
          setTimeout(() => {
            this.checkForChange($event.sender.value());
          }, 200);
        }
      }).data('kendoEditor')?.wrapper.width(parentElement.width()).height(this.height || parentElement.height());
      const editor = this.getEditor();
      $(editor.body).focus(() => {
        this.focusin.next();
      }).blur(() => {
        this.focusout.next();
      });
    }, 0);
  }

  getEditor() {
    return $('#' + this.id)
      .data('kendoEditor');
  }

  getEditorValue() {
    const editor = this.getEditor();
    return editor?.value();
  }

  private checkForChange(value, updateEditor = false) {
    // setTimeout(() => {
    if ( !this.previousValue.changed || this.previousValue.value !== value ) {
      if ( updateEditor ) {
        const kendoEditor = this.getEditor();
        if ( kendoEditor ) {
          kendoEditor.value(value);
        }
      }
      this.formValue$.next(value);
      this.previousValue = {
        changed: true,
        value
      };
    }
    // });
  }

  private listenFormChange() {
    this.formValue$.pipe(
      // debounceTime(0),
      distinctUntilChanged(),
      this.unsubsribeOnDestroy
    ).subscribe((value) => this.submitForm(value));
  }
}
