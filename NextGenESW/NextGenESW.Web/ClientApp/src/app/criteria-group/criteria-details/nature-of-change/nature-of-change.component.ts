import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CriteriaGroupPageService } from '@app/criteria-group/criteria-group.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { MatTable } from '@angular/material/table';
import { Tag } from '@app/create-document/create-document.model';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { ASSET_STATUSES } from '@environments/constants';

@Component({
  selector: 'app-nature-of-change',
  templateUrl: './nature-of-change.component.html',
  styleUrls: ['./nature-of-change.component.scss'],
})
export class NatureOfChangeComponent implements OnInit {
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
        'fontSize','fontName','removeFormat',
      ],
    ]
  };
  config1: AngularEditorConfig = {
    sanitize: false,
    showToolbar: false,
    editable: false,
    spellcheck: true,
    //width: '47rem',
    height: 'auto',
    minHeight: '235px',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    toolbarHiddenButtons: [['fontSize','fontName','removeFormat',]]
  };
  @ViewChild(MatTable) table: MatTable<any>;
  @Output() nextTab = new EventEmitter();
  docStatus = ASSET_STATUSES.DRAFT;
  ASSET_STATUSES = ASSET_STATUSES;
  @Input() globalData;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  criteriaGroupID;
  version:string;
  natureOfChangeData = [];
  currentDate: any;
  formatedDate: any;
  natureOfChangeObject = { version: null, definition: '' };
  displayedColumns: string[] = ['version', 'date', 'definition', 'delete'];
  loading = false;
  constructor(
    private criteriaGroupService: CriteriaGroupPageService,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe((param) => {
      this.criteriaGroupID = parseInt(param['id']);
      this.version = param['version'] ? param['version'] : '0';
    });
  }
  ngOnChanges(event) {
    if (
      this.globalData &&
      event.globalData.previousValue != event.globalData.currentValue
    ) {
      if (!(Object.keys(this.globalData).length === 0)) {
        this.docStatus = event.globalData.currentValue.assetStatus;
        this.displayedColumns= ['version', 'date', 'definition', 'delete'];

        if (this.docStatus !== ASSET_STATUSES.PUBLISHED && this.docStatus !== ASSET_STATUSES.CURRENT && this.docStatus !== ASSET_STATUSES.OBSOLETE) {
          this.loadNatureOfChange();
        } else if((this.docStatus === ASSET_STATUSES.PUBLISHED || this.docStatus === ASSET_STATUSES.CURRENT || this.docStatus === ASSET_STATUSES.OBSOLETE) && event.globalData.currentValue.assetTypeId == 6) {
         this.bindNocData(event.globalData.currentValue.natureOfChange);
        }
        this.loading = false;
      }
    }
  }
  ngOnInit(): void {
  }
  loadNatureOfChange() {
      this.criteriaGroupService
        .getNOCList(this.globalData.contentId, this.globalData.assetTypeId)
        .subscribe(
          (data) => {
            var res = JSON.parse(JSON.stringify(data));
            if (res.length > 0) {
              this.natureOfChangeData = res;
              this.natureOfChangeData.forEach(el => {
              var splitTime = el['nocdateTime'].split("T",1);
              var date = splitTime[0].split("-");
              return el['nocdate'] = `${date[1]}/${date[2]}/${date[0]}`;
            });
              this.natureOfChangeData.sort(function (a, b) {
                return b['version'] - a['version'];
              })
               this.displayedColumns.pop();
                this.natureOfChangeData.forEach(el => {
                  if(this.globalData.assetStatus !== ASSET_STATUSES.PUBLISHED && this.globalData.assetStatus !== ASSET_STATUSES.CURRENT && this.globalData.assetStatus !== ASSET_STATUSES.OBSOLETE) {
                    if(this.natureOfChangeData.length == 2 && el.version == 1 ) {
                      return;
                    }
                    this.displayedColumns= ['version', 'date', 'definition', 'delete'];
                    el['showAction'] = false;
                    el['createMode'] = false;
                  } else {
                    el['showAction'] = false;
                    el['createMode'] = false;
                  }
                  return el;
                })
              //}
            } else {
              this.natureOfChangeData = [];
            }
            this.loading = false;
          },
          (error) => {
            console.error('There was an error!', error);
            this.loading = false;
          }
        );
  }
  onArrowClick() {
    this.nextTab.emit(4);
  }
  add() {
    var rowData = { ...this.natureOfChangeObject };
    const date = new Date();
    rowData['createdDate'] = `${
      date.getMonth() + 1
    }/${date.getDate()}/${date.getFullYear()}`;
    rowData['createMode'] = true;
    rowData['createdDateTime'] = new Date().toISOString().substr(0, 19);
    this.natureOfChangeData.push(rowData);
    this.table.renderRows();
  }
  edit(row) {
    // const date = new Date();
    // row['createdDate'] = `${
    //   date.getMonth() + 1
    // }/${date.getDate()}/${date.getFullYear()}`;
    // row['createdDateTime'] = new Date().toISOString().substr(0, 19);
    row.createMode = true;
  }

  delete(i) {
    const data = i;
    this.loading = true;
    this.criteriaGroupService
      .DeleteNatureOfChange(data.criteriaGroupNatureOfChangeId)
      .subscribe(
        (data) => {
          this.loadNatureOfChange();
        },
        (error) => {
          console.error('There was an error!', error);
          this.loading = false;
        }
      );
  }
  getInputText(event, text, i) {
    var rowData = this.natureOfChangeData[i];
    if (text == 'definition') {
      rowData[text] = event.target.innerHTML;
    } else if (text == 'version') {
      rowData[text] = event.target.value;
    }
  }
  handleSave(item) {
    var rowData = item;
    //if (rowData.definition != '') {
      // rowData['criteriaGroupId'] = this.criteriaGroupID;
      // if (rowData.criteriaGroupNatureOfChangeId) {
        this.criteriaGroupService.updateNatureOfChange(rowData).subscribe(
          (data) => {
            this.loading = true;
            this.loadNatureOfChange();
          },
          (error) => {
            console.error('There was an error!', error);
            this.loading = false;
          }
        );
      //}
   // }
  }
  bindNocData (res) {
    if (res.length > 0) {
      this.natureOfChangeData = res;
      this.natureOfChangeData.forEach(el => {
      var splitTime = el['nocdateTime'].split("T",1);
      var date = splitTime[0].split("-");
      return el['nocdate'] = `${date[1]}/${date[2]}/${date[0]}`;
    });
      this.natureOfChangeData.sort(function (a, b) {
        return b['version'] - a['version'];
      })
       this.displayedColumns.pop();
        this.natureOfChangeData.forEach(el => {
          if(this.globalData.assetStatus !== ASSET_STATUSES.PUBLISHED && this.globalData.assetStatus !== ASSET_STATUSES.CURRENT && this.globalData.assetStatus !== ASSET_STATUSES.OBSOLETE) {
            if(this.natureOfChangeData.length == 2 && el.version == 1 ) {
              return;
            }
            this.displayedColumns= ['version', 'date', 'definition', 'delete'];
            el['showAction'] = false;
            el['createMode'] = false;
          } else {
            el['showAction'] = false;
            el['createMode'] = false;
          }
          return el;
        })
      //}
    } else {
      this.natureOfChangeData = [];
    }
  }
}
