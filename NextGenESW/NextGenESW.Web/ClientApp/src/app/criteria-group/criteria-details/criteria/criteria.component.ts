import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CriteriaGroupPageService } from '@app/criteria-group/criteria-group.service';
import { ActivatedRoute } from '@angular/router';
import { MatTable } from '@angular/material/table';
import { Tag, TagList } from '@app/create-document/create-document.model';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatDialog } from '@angular/material/dialog';
import { TagData } from '@app/shared/component/properties/properties.model';
import { Subject } from 'rxjs';
import { CreateDocumentService } from '@app/create-document/create-document.service';
import { ActivityPageService } from '@app/activity-page/activity-page.service';
import { BaseComponent } from '@app/shared/component/base/base.component';
import { Store } from '@ngrx/store';
import { selectSetOfPhasesList } from '@app/reducers/common-list.selector';
import { ASSET_STATUSES } from '@environments/constants';
import { RecordsService } from './../../../../app/shared/records.service';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-criteria',
  templateUrl: './criteria.component.html',
  styleUrls: [ './criteria.component.scss' ]
})
export class CriteriaComponent extends BaseComponent implements OnInit {
  @ViewChild('phaseControl') phaseControl: MatSelect;
  ASSET_STATUSES = ASSET_STATUSES;
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
        'fontSize', 'fontName', 'removeFormat'
      ]
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
    toolbarHiddenButtons: [ [
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
      'fontSize', 'fontName', 'removeFormat'
    ] ]
  };
  @ViewChild(MatTable) table: MatTable<any>;
  @Output() nextTab = new EventEmitter();
  @Output() handleDirtyPage = new EventEmitter();
  docStatus = ASSET_STATUSES.DRAFT;
  @Input() criteria;
  @Input() globalData;
  criteriaGroupID;
  loading = false;
  criteriaData = [];
  readonly separatorKeysCodes: number[] = [ ENTER, COMMA ];
  selectable = true;
  removable = true;
  addOnBlur = true;
  criteriaObj = {
    criteriaGroupId: '',
    no: '',
    designCriteria: '',
    rationale: '',
    links: '',
    bpOrC: false,
    contentTag: [],
    contentTagList: [],
    showBackgroundColor: ''
  };
  displayedColumns: string[] = [
    'no',
    'designCriteria',
    'rationale',
    'links',
    'tags',
    'phases',
    'bpOrC',
    'delete'
  ];
  @Output() updateCriteriaField = new EventEmitter();
  showAlert = false;
  alertMsg: string = 'Save / Delete the criteria to proceed.';
  showDropDown = false;
  tagDataObj: TagData;
  tagDataList: TagData[] = [];
  chipData: any[] = [];
  chipContainer: any = [];
  tagListHirerachy = [];
  tagList: TagList[] = [];
  eventsSubject: Subject<void> = new Subject<void>();
  eventSubject: Subject<void> = new Subject<void>();
  showTagField = false;
  phaseList: any;
  selected: any[] = [];
  contentPhase: any[] = [];
  chipDataUpdate: any[] = [];
  nodePathTag: string = '';
  flag: boolean = false;

  constructor(
    private criteriaGroupService: CriteriaGroupPageService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private createDocumentService: CreateDocumentService,
    private activityPageService: ActivityPageService,
    private store: Store<any>,
    private rservice: RecordsService
  ) {
    super();
    this.route.params.subscribe((param) => {
      this.criteriaGroupID = (this.globalData && this.globalData.id > 0) ? this.globalData.id : (param['contentId']);
    });
  }

  checkFocusOut() {
    this.rservice.UpdateBroadcastMessage('false');
  }

  checkValueChange() {
    this.rservice.UpdateBroadcastMessage('true');
  }

  ngOnChanges(event) {
    if (
      this.globalData &&
      event.globalData.previousValue != event.globalData.currentValue
    ) {
      if ( !(Object.keys(this.globalData).length === 0) ) {
        this.criteriaData = event.globalData.currentValue.criteria;
        this.bindingCriteriaProperties();
        this.docStatus = event.globalData.currentValue.assetStatus;
        // if(event.globalData.currentValue.editMode) {
        //   this.docStatus = 1;
        // } else {
        //   this.docStatus = 2;
        // }
      }
      if ( this.docStatus === ASSET_STATUSES.PUBLISHED || this.docStatus === ASSET_STATUSES.CURRENT || this.docStatus === ASSET_STATUSES.OBSOLETE ) {
        this.displayedColumns.pop();
        //this.table.renderRows();
      } else {
        this.displayedColumns = [
          'no',
          'designCriteria',
          'rationale',
          'links',
          'tags',
          'phases',
          'bpOrC',
          'delete'
        ];
      }
      this.loading = false;
    }
  }

  ngOnInit(): void {

    this.route.params.subscribe((param) => {
      if(param['contentId']) {

        if ( this.route.snapshot.queryParams['status']  ) {
          this.docStatus = this.route.snapshot.queryParams['status'];
        } else {
          this.docStatus = ASSET_STATUSES.PUBLISHED;
        }

      }
    });

    this.activityPageService.getTagList().subscribe((res) => {
      this.tagList = res;
      this.tagListHirerachy = res;
      this.bindingCriteriaProperties();
    });
    this.store.select(selectSetOfPhasesList).pipe(
      this.unsubsribeOnDestroy
    ).subscribe((res) => {
      this.phaseList = res;
      this.bindingCriteriaProperties();
    });
  }

  add(event: MatChipInputEvent, element): void {
    const input = event.input;
    const value = event.value;
    // Add
    if ( (value || '').trim() ) {
      element.tags.push(value.trim());
    }
    // Reset the input value
    if ( input ) {
      input.value = '';
    }
  }

  remove(fruit: Tag, el): void {
    const index = el.tags.indexOf(fruit);
    if ( index >= 0 ) {
      el.tags.splice(index, 1);
    }
  }

  onArrowClick(requestApprovalTemplate) {
    let editedCriteriaData =
      this.criteriaData &&
      this.criteriaData.find((criteriaData) => {
        return criteriaData.isEdit == true;
      });
    if ( editedCriteriaData ) {
      // Show pop up in case of form dirty
      const dialogRef = this.dialog.open(requestApprovalTemplate, {
        width: '42%',
        disableClose: true,
        panelClass: 'custom-dialog-container'
      });
    } else {
      this.handleDirtyPage.emit(false);
      this.nextTab.emit(3);
    }
  }

  addCriteria() {
    let editedCriteriaData =
      this.criteriaData &&
      this.criteriaData.find((criteriaData) => {
        return criteriaData.isEdit == true;
      });
    let hasCreatorId =
      this.criteriaData &&
      this.criteriaData.find((criteriaData) => {
        if ( !criteriaData.id ) {
          return true;
        }
      });
    if ( !editedCriteriaData ) {
      var copyCriteriaData = { ...this.criteriaObj };
      copyCriteriaData['isEdit'] = true;
      this.criteriaData.push(copyCriteriaData);
      //this.table.renderRows();
    } else if ( editedCriteriaData ) {
      // Not allowed to add any criteria if the form is dirty
      this.showAlert = true;
      window.scrollTo(0, 0);
      setTimeout(() => {
        this.showAlert = false;
      }, 5000);
    }
    this.handleDirtyPage.emit(true);
  }

  edit(row) {
    //this.rservice.UpdateBroadcastMessage('true');
    let editedCriteriaData =
      this.criteriaData &&
      this.criteriaData.find((criteriaData) => {
        return criteriaData.isEdit == true;
      });
    if ( editedCriteriaData ) {
      this.showAlert = true;
      window.scrollTo(0, 0);
      setTimeout(() => {
        this.showAlert = false;
      }, 5000);
    }
    if ( !editedCriteriaData ) { // Should edit only one row at a time
      row.isEdit = true;
      row['showBackgroundColor'] = '';
    }
    this.handleDirtyPage.emit(true);
  }

  deleteCriteria(element) {
    this.rservice.UpdateBroadcastMessage('false');
    if ( element.isEdit && !element.id ) {
      // Allowed to delete newly added row
      this.criteriaData.pop();
      this.handleDirtyPage.emit(false);
      this.table.renderRows();
    }
    let editedCriteriaData =
      this.criteriaData &&
      this.criteriaData.find((criteriaData) => {
        return criteriaData.isEdit == true;
      });
    if ( (element.isEdit && element.id) || (!editedCriteriaData && element.id) ) {
      this.loading = true;
      this.criteriaGroupService.DeleteCriteria(element.id, element.criteriaGroupId).subscribe((data) => {
        this.loading = false;
        this.criteriaData = this.criteriaData.filter(criteria => {
          return criteria.id != element.id;
        });
        let updatedValue = {
          criteriaData: this.criteriaData,
          propertiesLastUpdateDateTime: data
        };
        this.updateCriteriaField.emit(updatedValue);
        this.handleDirtyPage.emit(false);
      });
    } else if ( !element.isEdit ) {
      // Not allowed to delete any criteria when the form is dirty
      this.showAlert = true;
      window.scrollTo(0, 0);
      setTimeout(() => {
        this.showAlert = false;
      }, 5000);
    }
  }

  getInput(event, text, i) {
    var rowData = this.criteriaData[i];
    if ( text == 'designCriteria' || text == 'rationale' ) {
      rowData[text] = event.target.innerHTML;
    } else if ( text == 'bpOrC' ) {
      rowData[text] = event.checked;
    } else {
      rowData[text] = event.target.value;
    }
  }

  handleSave(item) {
    this.rservice.UpdateBroadcastMessage('false');
    this.phaseControl.ngControl.control.markAsTouched();
    if ( !this.isEmptyString(item.designCriteria) && item.contentPhase?.length ) {
      var rowData = item;
      rowData['criteriaGroupId'] = (this.globalData.id) ? this.globalData.id : this.criteriaGroupID;
      rowData['bpOrC'] = rowData.bpOrC == true ? 'C' : 'BP';
      this.loading = true;
      if ( rowData.id ) {
        this.criteriaGroupService.UpdateCriteria(rowData).subscribe((data) => {
          this.loading = false;
          let updatedValue = {
            criteriaData: this.criteriaData,
            propertiesLastUpdateDateTime: data['propertiesLastUpdateDateTime']
          };
          this.updateCriteriaField.emit(updatedValue);
          this.handleDirtyPage.emit(false);
          this.bindingCriteriaProperties();
          //   this.criteriaGroupService
          //     .getCriteriaGroupPageList(this.criteriaGroupID)
          //     .subscribe((data) => {
          //       var res = JSON.parse(JSON.stringify(data));
          //       if (res.criteria.length > 0) {
          //         this.criteriaData = res.criteria;
          //         res.criteria.forEach((el) => {
          //           el['bpOrC'] = el.bpOrC == 'BP' ? false : true;
          //         });
          //       }
          //       this.loading = false;
          //       this.updateCriteriaField.emit(this.criteriaData);
          //       this.handleDirtyPage.emit(false);
          //     });
        });
      } else {
        this.criteriaGroupService.CreateCriteria(rowData).subscribe((data) => {
          var res = JSON.parse(JSON.stringify(data));
          this.criteriaData.forEach((el) => {
            if ( !el['id'] ) {
              el['id'] = res.id;
            }
          });
          this.loading = false;
          let updatedValue = {
            criteriaData: this.criteriaData,
            propertiesLastUpdateDateTime: data['propertiesLastUpdateDateTime']
          };
          this.updateCriteriaField.emit(updatedValue);
          this.handleDirtyPage.emit(false);
          this.bindingCriteriaProperties();
          // this.criteriaGroupService
          //   .getCriteriaGroupPageList(this.criteriaGroupID)
          //   .subscribe((data) => {
          //     var res = JSON.parse(JSON.stringify(data));
          //     if (res.criteria.length > 0) {
          //       this.criteriaData = res.criteria;
          //       res.criteria.forEach((el) => {
          //         return (el['bpOrC'] = el.bpOrC == 'BP' ? false : true);
          //       });
          //     }
          //   this.loading = false;
          //   this.updateCriteriaField.emit(this.criteriaData);
          //   this.handleDirtyPage.emit(false);
          // });
        });
      }
    } else {
      this.showAlert = true;
      this.alertMsg = 'Please enter the fields to proceed.';
      window.scrollTo(0, 0);
      setTimeout(() => {
        this.showAlert = false;
        this.alertMsg = 'Save / Delete the criteria to proceed.';
      }, 5000);
    }
  }

  handleOnOkButton() {
    this.dialog.closeAll();
  }

  bindingCriteriaProperties() {
    if ( this.criteriaData && this.criteriaData.length > 0 ) {
      this.criteriaData.forEach((el) => {
        el['showBackgroundColor'] = 'container-background-style';
        if ( el.bpOrC == 'BP' || el.bpOrC == 'C' ) {
          el['bpOrC'] = el.bpOrC == 'BP' ? false : true;
        }
        if ( el['isEdit'] ) {
          el['isEdit'] = false;
        }
        if ( el['contentTag'] && this.tagList.length > 0 ) {
          this.tagList.forEach((node) => {
            this.selectAllNodesForBindTag(node, el);
          });
          el['contentTagList'] = [];
          if ( this.chipDataUpdate.length > 0 ) {
            this.chipDataUpdate.forEach((node) => {
              this.setTagHirerachy(node, el);
            });
          }
          this.chipDataUpdate = [];
        }
        if ( el['contentPhase'] && this.phaseList.length > 0 ) {
          this.onChangePhase(el['contentPhase'], el);
        }
      });
    }
  }

  onClose() {
    this.showAlert = false;
    this.alertMsg = 'Save / Delete the criteria to proceed.';
  }

  tagData($event, rowData) {
    if ( rowData.isEdit ) {
      this.chipData = $event;
      this.chipContainer = [];
      let contentTagData = [];
      rowData['contentTagList'] = [];
      rowData['contentTag'] = [];
      if ( this.chipData.length > 0 ) {
        this.chipData.forEach((node) => {
          rowData['contentTag'].push(node.id);
          this.setTagHirerachy(node, rowData);
        });
      }
    }
  }

  setTagHirerachy(node, rowData) {
    if ( this.tagListHirerachy.length > 0 ) {
      this.tagListHirerachy.forEach((nodeAll) => {
        if ( nodeAll.id == node.id ) {
          rowData['contentTagList'].push({ name: nodeAll.name, id: node.id });
        } else if ( nodeAll.children.length ) {
          nodeAll.children.forEach((c1) => {
            if ( c1.id == node.id ) {
              rowData['contentTagList'].push({
                name: nodeAll.name + ' > ' + c1.name,
                id: c1.id
              });
            } else if ( c1.children.length ) {
              c1.children.forEach((c2) => {
                if ( c2.id == node.id ) {
                  rowData['contentTagList'].push({
                    name: nodeAll.name + ' > ' + c1.name + ' > ' + c2.name,
                    id: c2.id
                  });
                }
              });
            }
          });
        }
      });
    }
  }

  removeChip(chip, rowData) {
    this.checkValueChange();
    if ( rowData.isEdit ) {
      this.eventSubject.next(rowData['contentTagList']);
      let removeElement = chip.id;
      chip.isUnchecked = true;
      rowData['contentTagList'] = rowData['contentTagList'].filter(
        (obj) => obj.id != chip.id
      );
      rowData['contentTag'] = rowData['contentTag'].filter(
        (id) => id != chip.id
      );
      this.eventsSubject.next(chip);
    }
  }

  onChangePhase(input: any, rowData) {
    this.checkValueChange();
    let phaseLists = [];
    input.forEach((id) => {
      var item = this.phaseList[id - 1];
      phaseLists.push(item);
    });
    rowData['selected'] = input;
    rowData['contentPhaseList'] = phaseLists;
    rowData['contentPhase'] = input;
  }

  removePhases(input, rowData) {
    this.checkValueChange();
    rowData.contentPhaseList.splice(
      rowData.contentPhaseList.findIndex(function (i) {
        return i.id == input.id;
      }),
      1
    );
    let copySelectedValue = [ ...rowData['selected'] ];
    copySelectedValue.splice(
      copySelectedValue.findIndex(function (i) {
        return i == input.id;
      }),
      1
    );
    rowData['selected'] = copySelectedValue;
    rowData['contentPhase'] = copySelectedValue;
  }

  selectAllNodesForBindTag(node, el) {
    if ( el['contentTag'].length > 0 && Array.isArray(el['contentTag']) ) {
      el['contentTag'].forEach((nodeId) => {
        if ( node.id == nodeId ) {
          this.chipDataUpdate.push(node);
        } else if ( node.children.length ) {
          node.children.forEach((c1) => {
            if ( c1.id == nodeId ) {
              // this.eventsSubject.next(c1);
              this.nodePathTag = this.nodePathTag + ',' + c1.name;
              this.chipDataUpdate.push(c1);
            } else if ( c1.children.length ) {
              c1.children.forEach((c2) => {
                if ( c2.id == nodeId ) {
                  //  this.eventsSubject.next(c2);
                  this.chipDataUpdate.push(c2);
                  this.nodePathTag = this.nodePathTag + ',' + c2.name;
                }
              });
            }
          });
        }
      });
    }
  }

  onShowDropdownClick(row) {
    this.checkValueChange();
    this.showDropDown = !this.showDropDown;
    if ( this.showDropDown && row['contentTagList'] ) {
      this.eventSubject.next(row['contentTagList']);
    }
  }

  isEmptyString(str) {
    if ( !str ) {
      return true;
    }

    return !str.replace(/&nbsp;/g,' ').trim().length;
  }

  get isContentOwner() {
    return this.globalData?.contentOwnerId === sessionStorage.getItem('userMail');
  }

  get isEditableMode() {
    return this.globalData?.assetStatus !== ASSET_STATUSES.PUBLISHED && this.globalData?.assetStatus !== ASSET_STATUSES.CURRENT && this.globalData?.assetStatus !== ASSET_STATUSES.OBSOLETE && this.globalData?.assetStatus !== ASSET_STATUSES.APPROVED_WAITING_FOR_JC && this.globalData?.assetStatus !== ASSET_STATUSES.ARCHIVED && (this.globalData?.assetStatus !== ASSET_STATUSES.SUBMITTED_FOR_APPROVAL || this.isContentOwner);
  }
}
