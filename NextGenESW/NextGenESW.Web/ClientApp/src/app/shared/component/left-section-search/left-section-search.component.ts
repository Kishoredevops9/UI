
import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { TagSearchViewData } from '@app/task-creation/task-creation-details/task-tab-one-content/task-tab-one-content.model';
import { ActivityPageService } from '@app/activity-page/activity-page.service';
import { CreateDocumentService } from '@app/create-document/create-document.service';
import { TabOneContentService } from '@app/task-creation/task-creation-details/task-tab-one-content/task-tab-one-content.service';
import { Observable, Subject, Subscription } from 'rxjs';
import { TaskCreationState } from '@app/task-creation/task-creation.reducer';
import { Store, select } from '@ngrx/store';
import { Router } from '@angular/router';
import { SharedService } from '@app/shared/shared.service';
import { AddItemAction, DeleteItemAction } from '@app/task-creation/store/task.actions';
import { allEKSCollection } from '@environments/constants';
import { Constants, documentPath, oldContentTypeCode, contentTypeCode } from '@environments/constants';
import { AssetContentTypeColor, AssetContentTypes } from '@app/shared/utils/app-settings';
import { orderBy } from 'lodash';

@Component({
  selector: 'app-left-search-section',
  templateUrl: './left-section-search.component.html',
  styleUrls: ['./left-section-search.component.scss']
})

export class LeftSectionSearchComponent {
  AssetContentTypeColor = AssetContentTypeColor;
  foundContentTypeItems = [];
  private subscription: Subscription;
  @Output() nextTab = new EventEmitter();
  //@Output() buildCreatedOutput = new EventEmitter<any>();
  tagId = [];
  phaseId = [];
  titleId = "";
  contentType = [];
  tagSearchViewData: TagSearchViewData[];
  treedata: any;
  tagSearchForm: FormGroup;
  searchText: string;
  chipValues: any = [];
  chipData: any = [];
  tagdata: any;
  phasesData: any;
  eventsSubject: Subject<void> = new Subject<void>();
  TaskItems$: Observable<any>;
  eksCollectionForm: FormGroup;
  allEKSCollection;
  checked = [];
  eksCollectionIds = [];
  componentTypeCode;
  taskFilterData = {};
  loading:boolean;
  constructor(private formBuilder: FormBuilder,
    private activityPageService: ActivityPageService,
    private SharedService: SharedService,
    private tabOneContentService: TabOneContentService,
    private createDocumentService: CreateDocumentService,
    private router: Router,
    private fb: FormBuilder,
    private taskstore: Store<any>,
    private store: Store<TaskCreationState>) {
    this.loadDropDowndata()
    this.SharedService.chipmessage.subscribe((node) => {
      if (node.hasOwnProperty("tabindex")) {
        if (node['tabindex'].index == 1) {
          this.onSearchSubmit()
        }
      }
    })
  }

  

  loadDropDowndata() {
    this.tabOneContentService.getAllAssetPhases().subscribe(data => {
      this.phasesData = data;
      this.phasesData.map((node) => {
        node.name = node.description
      })
      this.activityPageService
        .getTagList()
        .subscribe((res) => {
          this.phasesData = [{
            id: 4,
            name: "Phases",
            parentId: "undefined",
            children: this.phasesData
          }]
          this.treedata = this.phasesData.concat(res)
        });
    });
  }

  tagData($event) {
    this.chipData = $event;
    this.taskstore.dispatch(new AddItemAction(
      {
        data: this.chipData,
        type: 'knowledgereview'
      }
    ));
  }

  removeData(delChip) {
    this.taskstore.dispatch(new DeleteItemAction({
      data: delChip,
      type: "knowledgereview"
    }));
    this.eventsSubject.next(delChip);
  }

  ngOnInit(): void {
    this.allEKSCollection = orderBy(allEKSCollection, 'name');
    this.tagSearchForm = this.createPhaseForm();
    this.TaskItems$ = this.taskstore.select(store => store.Task.knowledgereview);
    // this.tagSearchForm = this.formBuilder.group({
    //   'eksCollection': ''
    // })
  }

 

  private createPhaseForm(): FormGroup {
    return this.fb.group({
      'searchText': [null, Validators.required],
      'eksCollection': [null]
    })
  }

  loadSearchSection(tagId, phaseId) {
    /*************************QueryString Code***********/
    this.loading = true;
    let phasesQueryStr = '';
    let tagsQueryStr = '';
    if (tagId != undefined && tagId != 0 && tagId.length > 0) {
      let tagItems = tagId.filter(function (el) {
        return el.parentId != undefined &&
          el.id >= 8;
      });
      let phaseQueryId = tagId.filter(function (el) {
        return el.parentId == undefined &&
          el.id <= 8;
      });
      if (Object.keys(phaseQueryId).length > 0) {
        const pharseIds = phaseQueryId.map(item => item.id);
        const conditionStr = pharseIds
          .map(id => `phaseid:(${id})`)
          .join(' OR ');

        phasesQueryStr = conditionStr ? `(${conditionStr})` : '';
      }
      const rootParentIds = [...new Set(tagItems.map(item => item.rootParentId))];
      const combinedConditionStr = rootParentIds
        .map(rootParentId => {
          const hasSameRootParentTags = tagItems.filter(item => item.rootParentId === rootParentId);
          const conditionStr = hasSameRootParentTags
            .map(tagItem => `tagsid:(${tagItem.id})`)
            .join(' OR ');
          return `(${conditionStr})`;        
        })
        .join(' AND ');
      tagsQueryStr = combinedConditionStr ? `(${combinedConditionStr})` : '';
    }
    this.taskFilterData = {
      tagId: (typeof tagsQueryStr !== undefined && tagsQueryStr && tagsQueryStr.length > 0) ? tagsQueryStr : '',
      phaseId: (typeof phasesQueryStr !== undefined && phasesQueryStr && phasesQueryStr.length > 0) ? phasesQueryStr : '',
      titleId: (this.tagSearchForm.controls.searchText.value != "" && this.tagSearchForm.controls.searchText.value != null) ? "(title:" + this.tagSearchForm.controls.searchText.value + " OR purpose:" + this.tagSearchForm.controls.searchText.value + ")" : '',
      contentType: (this.eksCollectionIds != undefined && this.eksCollectionIds.length > 0) ? '(assettypecode:(' + '"' + this.eksCollectionIds.join('","') + '"' + ')' + ')' : ''
    }
    var params = [];
    for (var key in this.taskFilterData) {
      if (this.taskFilterData.hasOwnProperty(key) && this.taskFilterData[key]) {
        params.push(this.taskFilterData[key]);
      }
    }
    var queryString = "assetstatusid:(1)" + (params.length ? ' AND ' + params.join(" AND ") : '');
    /*************************QueryString Code***********/
    this.subscription = this.tabOneContentService
      .getKnowledgeTaskSearchViewListData(queryString)
      .subscribe((res) => {
        this.tagSearchViewData = res;
        const hits = res['hits']['hits'] || [];
        this.foundContentTypeItems = AssetContentTypes.map(contentType => {
          return {
            ...contentType,
            results: hits.filter(x => x._source.assettypelongcode == contentType.longCode) 
          }
        })
        this.loading = false;
      });
  }

  combinedTagIds(tagArray: any) {    
    const res = tagArray.reduce((acc, obj) => {
      obj = Object.assign([], obj)
      let found = false;
      for (let i = 0; i < acc.length; i++) {
        if (acc[i].rootParentId === obj.rootParentId) {
          found = true;
          acc[i].mergedId += ',' + obj.id;
        }
      }
      if (!found) {
        obj.mergedId = obj.id;
        acc.push(obj);
      }
      return acc;
    }, []);
    return res;
  }

  openSite(siteUrl, contentId) {
    window.open(siteUrl + contentId, '_blank');
  }

  navigationLink(contentTypeId, contentNo, contentId) {

    if (contentTypeId == 'I' || contentTypeId == 'G' || contentTypeId == 'S' || contentTypeId == 'D') {
      this.router.navigate([documentPath.publishViewPath, contentId]);
    } else if (contentTypeId === 'M' || contentTypeId === 'Map') {
      this.router.navigate(['/process-maps/edit', contentNo]);
    } else {
      var assetTypecode = (contentTypeId === 'A') ? "AP" : (contentTypeId === 'K') ? "KP" : (contentTypeId === 'T') ? "TOC" : (contentTypeId === 'R') ? "RC" : (contentTypeId === 'C') ? "CG" : '';
      this.router.navigate([documentPath.publishViewPath, assetTypecode, contentId]);
    }    

  }

  onSearchSubmit() {
    this.TaskItems$.subscribe(x => this.tagId = x);
    this.loadSearchSection(this.tagId, this.phaseId);
    //this.buildCreatedOutput.emit(value);
  }

  onChangeEKSCollection(event, contentType) {
    let eksCollectionId = [];
    if (event.checked) {
      this.checked.push(contentType);
    } else {
      this.checked = this.checked.filter(function (el) {
        return el.keyword != contentType.keyword;
      });
    }
    if (this.checked && this.checked.length) {
      this.checked.forEach(elem => {
        eksCollectionId.push(elem.keyword);
      });
    }
    this.eksCollectionIds = [...eksCollectionId]
  }

}
