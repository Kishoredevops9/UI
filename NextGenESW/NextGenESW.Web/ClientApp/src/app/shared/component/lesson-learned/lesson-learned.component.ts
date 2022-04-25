
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { LessonLearnedService } from './lesson-learned.service';
import { Store, select } from '@ngrx/store';
import { ProcessMapsState } from '@app/process-maps/process-maps.reducer';
import { selectContentList } from '@app/reducers';
import { ContextService } from '../global-panel/context/context.service';
import { ContextInfo } from '../global-panel/context/context.model';
import { MatDialog } from '@angular/material/dialog';

import { ASSET_STATUSES } from '@environments/constants';

import { RICH_TEXT_EDITOR_TOOLS_CONFIG } from '@app/shared/texteditor/constant/rich-text.constant';
import { RecordsService } from '../../records.service';
@Component({
  selector: 'app-lesson-learned',
  templateUrl: './lesson-learned.component.html',
  styleUrls: ['./lesson-learned.component.scss'],
})
export class LessonLearnedComponent implements OnInit {
  constructor(
    private createGroupService: LessonLearnedService,
    private route: ActivatedRoute,
    private contextService: ContextService,
    private dialog: MatDialog,
    private rservice: RecordsService,
  ) {
    this.route.params.subscribe((param) => {
      this.id = param['contentId'];
    });
  }

  @ViewChild(MatTable) table: MatTable<any>;
  @Output() nextTab = new EventEmitter();
  @Input() contentType: string;
  @Output() handleDirtyPage = new EventEmitter();
  docStatus = ASSET_STATUSES.DRAFT;
  ASSET_STATUSES = ASSET_STATUSES;
  @Input() globalData;
  @Input() docStatusM: any;
  @Output() updateLastModifiedDate = new EventEmitter<string>();
  @Output() updateLessonLearned = new EventEmitter<string>();
  id: number;
  displayedColumns: string[] = ['link', 'description', 'delete'];
  lessonLearnedProperties = [];
  lessonLearnedDataCopy = {
    linkNumber: '',
    description: '',
  };
  loading = false;
  isCGDoc: boolean = false;
  showAlert = false;
  alertMsg: string = 'Save / Delete the lessons learned to proceed.';
  valueNew = 0;
  checkValueChange(){
    // this.valueNew = this.valueNew +1;
    // console.log('this.valueNew',this.valueNew);
    // if(this.valueNew > 1)
      this.rservice.UpdateBroadcastMessage('true');
  }

  ngOnDestroy() {
    this.valueNew = 0;
  }



  checkFocusOut(){
      this.rservice.UpdateBroadcastMessage('false');
  }

  ngOnChanges(event) {
    this.id = (this.globalData && this.globalData.id) ? this.globalData.id : this.id;
    if (
      this.globalData &&
      event.globalData.previousValue != event.globalData.currentValue
    ) {
      if (!(Object.keys(this.globalData).length === 0)) {
        this.loading = false;
        if (event.globalData.currentValue.assetStatus) {
          this.docStatus = event.globalData.currentValue.assetStatus;
          if (!this.isEditableMode) {
            this.displayedColumns.pop();
            this.isCGDoc =
              event.globalData.currentValue.contentType == 'CG' ? true : false;
          } else {
            this.displayedColumns = ['link', 'description', 'delete'];
            this.isCGDoc =
              event.globalData.currentValue.contentType == 'CG' ? true : false;
          }
        } else if (
          (this.contentType == 'WI' ||
            this.contentType == 'DS' ||
            this.contentType == 'GB') &&
          (this.id > 0)
        ) {
          const documentStatusDetails = sessionStorage.getItem(
            'documentStatusDetails'
          );
          this.docStatus = documentStatusDetails == 'published' ? ASSET_STATUSES.PUBLISHED : ASSET_STATUSES.DRAFT;
          //this.showArrowIcon = false;
          if (!this.isEditableMode) {
            this.displayedColumns.pop();
          } else {
            this.displayedColumns = ['link', 'description', 'delete'];
          }
        }
        if (!this.isEditableMode) {
          this.lessonLearnedProperties = (event.globalData.currentValue.lessonLearned && event.globalData.currentValue.lessonLearned != undefined) ? event.globalData.currentValue.lessonLearned : this.loadLessonLearned();
          this.loadContextInfo();
        } else {
          this.loadLessonLearned();
        }
      }
    }

  }
  ngOnInit(): void {
    // if (this.id) {
    // this.loadLessonLearned();
    // }
  }

  loadLessonLearned() {
    this.loading = true;
    this.id = (this.globalData && this.globalData.id) ? this.globalData.id : this.id;
    this.createGroupService
      .getLessonLearnedAP(this.id.toString(), this.contentType)
      .subscribe((res) => {
        var data = JSON.parse(JSON.stringify(res));
        this.lessonLearnedProperties = data.filter(
          (x) => x.contentType == this.contentType
        );
        this.updateLessonLearned.emit(JSON.stringify(data));
        this.loadContextInfo();
        this.loading = false;
      }),
      (error) => {
        console.error('There was an error!', error);
        this.loading = false;
      };
  }

  saveLessonLearned(rowData) {
    this.valueNew = 0;
    this.rservice.UpdateBroadcastMessage('false');
    if (rowData.linkNumber != "" || rowData.description != "") {
      this.loading = true;
      rowData['contentId'] = this.id;
      rowData['contentType'] = this.contentType;
      if (rowData.id) {
        this.createGroupService.updateLessonLearned(rowData).subscribe(
          (data) => {
            var res = JSON.parse(JSON.stringify(data));
            if (this.isCGDoc) {
              this.handleDirtyPage.emit(false);
            }
            if (res && res.propertiesLastUpdateDateTime) {
              this.updateLastModifiedDate.emit(res.propertiesLastUpdateDateTime);
            }
            this.loadLessonLearned();
          },
          (error) => {
            console.error('There was an error!', error);
            this.loading = false;
          }
        );

      } else {
        this.createGroupService.saveLessonLearned(rowData).subscribe(
          (data) => {
            var res = JSON.parse(JSON.stringify(data));
            //rowData['id'] = data;
            if (this.isCGDoc) {
              this.handleDirtyPage.emit(false);
            }
            if (res && res.propertiesLastUpdateDateTime) {
              this.updateLastModifiedDate.emit(res.propertiesLastUpdateDateTime);
            }
            this.loadLessonLearned();
          },
          (error) => {
            console.error('There was an error!', error);
            this.loading = false;
          }
        );
      }
    } else {
      this.showAlert = true;
      this.alertMsg = 'Please enter the fields to proceed.';
      window.scrollTo(0, 0);
      setTimeout(() => {
        this.showAlert = false;
        this.alertMsg = 'Save / Delete the lessons learned to proceed.';
      }, 5000);
    }
  }

  getInput(event, text, i) {
    var rowData = this.lessonLearnedProperties[i];
    rowData[text] = event.target.innerHTML;
    rowData['contentId'] = this.id;
    rowData['contentType'] = this.contentType;
  }

  add() {
    if (this.isCGDoc) {
      let lessonLearnedProperties = this.lessonLearnedProperties && this.lessonLearnedProperties.find((lessonLearnedProperties) => {
        return (lessonLearnedProperties.isEdit == true)
      });
      let hasCreatorId = this.lessonLearnedProperties && this.lessonLearnedProperties.find((lessonLearnedProperties) => {
        if (!lessonLearnedProperties.id) {
          return true;
        }
      });
      if (!lessonLearnedProperties) { // Not allowed to add any criteria if the form is dirty
        var copyLessonLearnedDataCopy = { ...this.lessonLearnedDataCopy };
        copyLessonLearnedDataCopy['isEdit'] = true;
        this.lessonLearnedProperties.push(copyLessonLearnedDataCopy);
        this.table.renderRows();
      }
      else if (lessonLearnedProperties) {
        this.showAlert = true;
        window.scrollTo(0, 0);
        setTimeout(() => {
          this.showAlert = false;
        }, 5000);
      }
      this.handleDirtyPage.emit(true);
    } else {
      var copyInputObj = { ...this.lessonLearnedDataCopy };
      copyInputObj['isEdit'] = true;
      this.lessonLearnedProperties.push(copyInputObj);
      this.table.renderRows();
    }
  }

  edit(row) {
    if (this.isCGDoc) {
      let editedlessonLearnedData = this.lessonLearnedProperties && this.lessonLearnedProperties.find((lessonLearnedProperties) => {
        return (lessonLearnedProperties.isEdit == true)
      });
      if (editedlessonLearnedData) {
        this.showAlert = true;
        window.scrollTo(0, 0);
        setTimeout(() => {
          this.showAlert = false;
        }, 5000);
      }
      !editedlessonLearnedData && (row.isEdit = true); // Should edit only one row at a time
      this.handleDirtyPage.emit(true);
    } else {
      row.isEdit = true;
    }
  }

  delete(element) {
    this.valueNew = 0;
    this.rservice.UpdateBroadcastMessage('false');
    if (this.isCGDoc) {
      if (element.isEdit && !element.id) { // Allowed to delete newly added row
        this.lessonLearnedProperties.pop();
        this.handleDirtyPage.emit(false);
        this.table.renderRows();
      }
      let editedLessonLearnedData = this.lessonLearnedProperties && this.lessonLearnedProperties.find((lessonLearnedProperties) => {
        return (lessonLearnedProperties.isEdit == true)
      })
      if ((element.isEdit && element.id) || (!editedLessonLearnedData && element.id)) {
        this.loading = true;
        this.createGroupService.deleteLessonLearned(element.id, element.contentType).subscribe((data) => {
          this.handleDirtyPage.emit(false);
          if (data) {
            const a = JSON.stringify(data);
            let updatedValue = {
              data: ''
            }
            updatedValue.data = JSON.parse(a);
            this.updateLastModifiedDate.emit(updatedValue.data);
          }
          this.loadLessonLearned();
        });
      } else if (!element.isEdit) {
        this.showAlert = true;
        window.scrollTo(0, 0);
        setTimeout(() => {
          this.showAlert = false;
        }, 5000);
      }

    } else {
      this.loading = true;
      if (element.isEdit && !element.id) { // Allowed to delete newly added row
        this.lessonLearnedProperties.pop();
        this.loading = false;
        this.table.renderRows();
      } else {
        this.createGroupService.deleteLessonLearned(element.id, element.contentType).subscribe((data) => {
          if (data) {
            const a = JSON.stringify(data);
            let updatedValue = {
              data: ''
            }
            updatedValue.data = JSON.parse(a);
            this.updateLastModifiedDate.emit(updatedValue.data);
          }
          this.loadLessonLearned();
        });
      }
    }
  }
  onArrowClick(requestApprovalTemplate) {
    let editedLessonLearnedData = this.lessonLearnedProperties && this.lessonLearnedProperties.find((lessonLearnedProperties) => {
      return (lessonLearnedProperties.isEdit == true)
    });
    if (editedLessonLearnedData) { // Show pop up in case of form dirty
      const dialogRef = this.dialog.open(requestApprovalTemplate, {
        width: '42%',
        disableClose: true,
        panelClass: 'custom-dialog-container'
      });
    } else {
      this.handleDirtyPage.emit(false);
      this.nextTab.emit(1);
    }
  }
  loadContextInfo() {
    this.contextService.ContextInfo = this.getContextInfo();
  }

  getContextInfo() {
    const contextInfo: ContextInfo = new ContextInfo();
    contextInfo.entityInfo = this.globalData;
    contextInfo['lessonLearned'] = this.lessonLearnedProperties;
    contextInfo.entityId = this.id;
    return contextInfo;
  }
  handleOnOkButton() {
    this.dialog.closeAll();
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
