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
import { MatDialog } from '@angular/material/dialog';
import { ASSET_STATUSES } from '@environments/constants';
import { RecordsService } from './../../../../app/shared/records.service';

@Component({
  selector: 'app-definitions',
  templateUrl: './definitions.component.html',
  styleUrls: ['./definitions.component.scss'],
})
export class DefinitionsComponent implements OnInit {
  ASSET_STATUSES = ASSET_STATUSES;
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
    //width: '100%',
    height: 'auto',
    minHeight: '235px',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    toolbarHiddenButtons: [
      [
        'fontSize','fontName','removeFormat',
      ],
    ]
  };
  @ViewChild(MatTable) table: MatTable<any>;
  @Output() nextTab = new EventEmitter();
  docStatus = ASSET_STATUSES.DRAFT;
  @Input() globalData;
  criteriaGroupID;
  loading = false;
  definitionData = [];
  definitionObject = { term: '', definition: '' };
  displayedColumns: string[] = ['term', 'definition', 'delete'];
  @Output() updateDefinitionField = new EventEmitter();
  @Output() handleDirtyPage = new EventEmitter();
  showAlert = false;
  alertMsg: string = 'Save / Delete the definitions to proceed.';
  constructor(
    private criteriaGroupService: CriteriaGroupPageService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
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
        this.definitionData = event.globalData.currentValue.definitions;
        this.docStatus = event.globalData.currentValue.assetStatus;
        // if(event.globalData.currentValue.editMode) {
        //   this.docStatus = 1;
        // } else {
        //   this.docStatus = 2;
        // }
      }
      if ( !this.isEditableMode ) {
        this.displayedColumns.pop();
      } else {
        this.displayedColumns = [ 'term', 'definition', 'delete' ];
      }
      this.loading = false;
    }
  }

  ngOnInit(): void {
  }
  onArrowClick(requestApprovalTemplate) {
    let editedDefinitionData = this.definitionData && this.definitionData.find((definitionData) => {
      return (definitionData.isEdit == true)
    });
    if(editedDefinitionData) { // Show pop up in case of form dirty
      const dialogRef = this.dialog.open(requestApprovalTemplate, {
        width: '42%',
        disableClose: true,
        panelClass: 'custom-dialog-container'
      });
    } else {
      this.handleDirtyPage.emit(false);
      this.nextTab.emit(4);
    }
  }
  addDefinition() {
    let editedDefinitionData = this.definitionData && this.definitionData.find((definitionData) => {
      return (definitionData.isEdit == true)
    });
    let hasCreatorId = this.definitionData && this.definitionData.find((definitionData) => {
        if(!definitionData.id){
          return true;
        }
    });
    if(!editedDefinitionData) { // Not allowed to add any criteria if the form is dirty
    var copyCriteriaData = { ...this.definitionObject };
    copyCriteriaData['isEdit'] = true;
    this.definitionData.push(copyCriteriaData);
    this.table.renderRows();
    }
    else if (editedDefinitionData) {
      this.showAlert = true;
      window.scrollTo(0, 0);
      setTimeout(()=>{
        this.showAlert = false;
      },5000);
    }
    this.handleDirtyPage.emit(true);
  }
  edit(row) {
    let editedDefinitionData = this.definitionData && this.definitionData.find((definitionData) => {
      return (definitionData.isEdit == true)
    });
    if(editedDefinitionData) {
      this.showAlert = true;
      window.scrollTo(0, 0);
      setTimeout(()=>{
        this.showAlert = false;
      },5000);
    }
    !editedDefinitionData && (row.isEdit = true); // Should edit only one row at a time
    this.handleDirtyPage.emit(true);
  }

  deleteDefinition(item) {
    this.rservice.UpdateBroadcastMessage('false');
    const data = item;
    if(data.isEdit && !data.id) { // Allowed to delete newly added row
      this.definitionData.pop();
      this.handleDirtyPage.emit(false);
      this.table.renderRows();
    }
    let editedDefinitionData = this.definitionData && this.definitionData.find((definitionData) => {
      return (definitionData.isEdit == true)
    })
    if((item.isEdit && item.id) || (!editedDefinitionData && item.id)){
      this.criteriaGroupID = (this.globalData && this.globalData.id > 0) ? this.globalData.id : this.criteriaGroupID;
      this.loading = true;
      this.criteriaGroupService.DeleteDefinition(data.id).subscribe((data) => {
        this.criteriaGroupService
          .getCriteriaGroupPageList(this.criteriaGroupID)
          .subscribe((data) => {
            this.handleDirtyPage.emit(false);
            var res = JSON.parse(JSON.stringify(data));
            this.loading = false;
            if (res.definitions.length > 0) {
              this.definitionData = res.definitions;
              this.loading = false;
            } else {
              this.definitionData = [];
            }
            let updatedValue = {
              definitionData: this.definitionData,
              propertiesLastUpdateDateTime: data['lastUpdateDateTime']
            }
            this.updateDefinitionField.emit(updatedValue);
          });
      });
    } else if(!item.isEdit) {
      this.showAlert = true;
      window.scrollTo(0, 0);
      setTimeout(()=>{
        this.showAlert = false;
      },5000);
    }
  }
  getInput(event, text, i) {
    var rowData = this.definitionData[i];
    rowData[text] = event.target.innerHTML;
  }
  handleSave(item) {
    this.rservice.UpdateBroadcastMessage('false');
    this.criteriaGroupID = (this.globalData && this.globalData.id > 0) ? this.globalData.id : this.criteriaGroupID;
    if(item.term != "" || item.definition != "") {
      var rowData = item;
      rowData['criteriaGroupId'] = this.criteriaGroupID;
      this.loading = true;
      if (rowData.id) {
        this.criteriaGroupService.updateDefinition(rowData).subscribe((data) => {
          let updatedValue = {
            definitionData: this.definitionData,
            propertiesLastUpdateDateTime: data['propertiesLastUpdateDateTime']
          }
          this.updateDefinitionField.emit(updatedValue);
          this.handleDirtyPage.emit(false);
          this.removePreviousEditableRow();
          this.loading = false;
          // this.criteriaGroupService
          //   .getCriteriaGroupPageList(this.criteriaGroupID)
          //   .subscribe((data) => {
          //     var res = JSON.parse(JSON.stringify(data));
          //     this.loading = false;
          //     if (res.definitions.length > 0) {
          //       this.definitionData = res.definitions;
          //     } else {
          //       this.definitionData = [];
          //     }
          //     this.updateDefinitionField.emit(this.definitionData);
          //   });
        });
      } else {
        this.criteriaGroupService.CreateDefinition(rowData).subscribe((data) => {
          var res = JSON.parse(JSON.stringify(data));
          this.definitionData.forEach(el => {
            if(!el['id']){
              el['id'] = res.id;
            }
          });
          let updatedValue = {
            definitionData: this.definitionData,
            propertiesLastUpdateDateTime: data['propertiesLastUpdateDateTime']
          }
          this.updateDefinitionField.emit(updatedValue);
          this.handleDirtyPage.emit(false);
          this.removePreviousEditableRow();
          this.loading = false;
          // this.criteriaGroupService
          //   .getCriteriaGroupPageList(this.criteriaGroupID)
          //   .subscribe((data) => {
          //     var res = JSON.parse(JSON.stringify(data));
          //     this.loading = false;
          //     if (res.definitions.length > 0) {
          //       this.definitionData = res.definitions;
          //     } else {
          //       this.definitionData = [];
          //     }
          //     this.updateDefinitionField.emit(this.definitionData);
          //   });
        });
      }
    } else {
      this.showAlert = true;
      this.alertMsg = 'Please enter the fields to proceed.';
      window.scrollTo(0, 0);
      setTimeout(()=>{
        this.showAlert = false;
        this.alertMsg = 'Save / Delete the definitions to proceed.';
      },5000);
    }
  }
  handleOnOkButton () {
    this.dialog.closeAll();
  }
  removePreviousEditableRow() {
    if (this.definitionData && this.definitionData.length > 0) {
      this.definitionData.forEach((el) => {
          if(el['isEdit'] && !el['isFormDirty']) {
            el['isEdit'] = false;
          }
      });
    }
  }
  onClose() {
    this.showAlert = false;
    this.alertMsg = 'Save / Delete the criteria to proceed.';
  }


  get isContentOwner() {
    return this.globalData?.contentOwnerId === sessionStorage.getItem('userMail');
  }

  get isEditableMode() {
    return this.globalData?.assetStatus !== ASSET_STATUSES.PUBLISHED && this.globalData?.assetStatus !== ASSET_STATUSES.CURRENT && this.globalData?.assetStatus !== ASSET_STATUSES.OBSOLETE && this.globalData?.assetStatus !== ASSET_STATUSES.APPROVED_WAITING_FOR_JC && this.globalData?.assetStatus !== ASSET_STATUSES.ARCHIVED && (this.globalData?.assetStatus !== ASSET_STATUSES.SUBMITTED_FOR_APPROVAL || this.isContentOwner);
  }
}
