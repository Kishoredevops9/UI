import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { AddonsPopupSearchStore } from '../addons-popup-search.store';
import { InternalSearchQueryObject } from '../addons-popup-search.state';
import { CreateDocumentService } from '@app/create-document/create-document.service';
import { ActivityPageService } from '@app/activity-page/activity-page.service';
import { Store } from '@ngrx/store';
import { selectClassifiersList, selectMetaDataDisciplineCode, selectSetOfPhasesList } from '@app/reducers/common-list.selector';

@Component({
  selector: 'app-addons-advanced-search-panel',
  templateUrl: './addons-advanced-search-panel.component.html',
  styleUrls: ['./addons-advanced-search-panel.component.scss']
})
export class AddonsAdvancedSearchPanelComponent implements OnInit {
  tagList$: Observable<any[]>;
  phaseList$: Observable<any[]>;
  classifierList$: Observable<any[]>;
  disciplineList$: Observable<any[]>;
  wiDisciplineCodeList$: Observable<any[]>;

  showAdvanceSearchDiscipline = false;
  showDropDown = false;     
  advanceSearchForm: FormGroup;
  sltTags: any[] = [];
  selectedDisciplineValue: any = '';

  constructor(
    private addonsPopupSearchStore: AddonsPopupSearchStore,
    private createDocumentService: CreateDocumentService,
    private formBuilder: FormBuilder,
    private activityPageService: ActivityPageService,
    private store: Store<any>) {
    this.phaseList$ = this.store.select(selectSetOfPhasesList);
    this.classifierList$ = this.store.select(selectClassifiersList);
    this.wiDisciplineCodeList$ = this.store.select(selectMetaDataDisciplineCode);
    this.tagList$ = this.activityPageService.getTagList();
    this.disciplineList$ = this.createDocumentService.getAllMetaDiscipline();
  }

  ngOnInit(): void {
    this.advanceSearchForm = this.formBuilder.group({
      disciplineCode: new FormControl(),
      contentOwner: new FormControl(),
      phases: new FormControl(),
      tags: new FormControl(),
      version: new FormControl(),
      keywords: new FormControl(),
    });
  }
    
  getSltTagsRenderer() {
    const nbSltTags = this.sltTags.length;
    if (nbSltTags === 0) return 'No tags selected';
    if (nbSltTags === 1) return '1 tag selected';
    return `${nbSltTags} tags selected`;
  }

  onSubmitAdvSearchForm() {
    const formValue = this.advanceSearchForm.value;
    const keywords = (formValue.keywords || '')
      .split(',')
      .map(item => item.trim())
      .join('|')
    const queryObject: InternalSearchQueryObject = {
      disciplineCode: formValue.disciplineCode,
      contentOwnerId: formValue.contentOwner,
      phaseId: (formValue.phases || []).join('|'),
      tagsId: this.sltTags.map(item => item.id).join('|'),
      version: formValue.version,
      keywords
    }
    this.addonsPopupSearchStore.patchState(state => ({
      eksQueryObject: {
        ...state.eksQueryObject,
        ...queryObject,
        searchText: state.searchText,
        onAdvancedSearch: true
      },
      advancedSearchEnabled: false
    }))
  }

  setDisciplineData(sltDisciplines: any[]) {
    const sltDiscipline = sltDisciplines[0];
    if (sltDiscipline) {
      this.createDocumentService
      .getDisciplineCode(sltDiscipline.rowNo)
      .subscribe((codeItem: any) => {        
        this.selectedDisciplineValue = sltDiscipline?.name || '';
        this.advanceSearchForm.patchValue({
          disciplineCode: codeItem.code
        });
      });
    }
  }

  resetFilters() {
    this.sltTags = [];
    this.selectedDisciplineValue = '';
    this.advanceSearchForm.reset();
  }
}
