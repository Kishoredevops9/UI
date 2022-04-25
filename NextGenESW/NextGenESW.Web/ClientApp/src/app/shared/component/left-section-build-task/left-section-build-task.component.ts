import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TagSearchViewData } from '@app/task-creation/task-creation-details/task-tab-one-content/task-tab-one-content.model';
import { ActivityPageService } from '@app/activity-page/activity-page.service';
import { Router } from '@angular/router';
import { SharedService } from '@app/shared/shared.service';
import { TabOneContentService } from '@app/task-creation/task-creation-details/task-tab-one-content/task-tab-one-content.service';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { AddItemAction, DeleteItemAction, AddBuildTask } from '@app/task-creation/store/task.actions';
import { Store } from '@ngrx/store';
import { BrowseMapService } from '@app/browse/browse-map/browse-map-service';
import { TaskCrationPageService } from '@app/task-creation/task-creation.service';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { searchTree } from '@app/shared/utils/tree-search';

@Component({
  selector: 'app-left-section-build-task-section',
  templateUrl: './left-section-build-task.component.html',
  styleUrls: ['./left-section-build-task.component.scss']
})
export class LeftSectionBuildTaskComponent {

  private subscription: Subscription;
  @Output() nextTab = new EventEmitter();
  hasBuildCreated: any = false;
  @Output() LeftbuildCreatedOutput = new EventEmitter<any>();
  tagId = [];
  phaseId = [];
  titleId = "";
  tagSearchViewData: TagSearchViewData[];
  processMapContent: any[];
  treedata: any;
  tagBuildSearchForm: FormGroup;
  searchText: string;
  chipValues: any = [];
  chipData: any = [];
  phasesData: any;
  eventsSubject: Subject<void> = new Subject<void>();
  taskItems$: Observable<any>;
  taskFilterData = {};
  stepFlowData: any;
  loading: boolean;
  filtertype: number = 1;
  mapData: any = [];
  mapDataMaster: any = [];
  showRightBox: boolean = true;
  param: object = {};
  checkedmap: any = [];
  treedataMaster: any = [];
  filterBtn: boolean = false;
  edpendData: number;

  filterExpandOpt = 1;
  stepFExpandOpt = 1;

  filterSearchTextBSub = new BehaviorSubject<string>('');
  stepFSearchTextBSub = new BehaviorSubject<string>('');
  filterSearchText$ = this.filterSearchTextBSub
    .pipe(
      debounceTime(300),
      map(text => text.trim()),
      distinctUntilChanged(),
    )
  stepFSearchText$ = this.stepFSearchTextBSub
    .pipe(
      debounceTime(300),
      map(text => text.trim()),
      distinctUntilChanged()
    )

  constructor(private sharedService: SharedService,
    private activityPageService: ActivityPageService,
    private tabOneContentService: TabOneContentService,
    private router: Router,
    private fb: FormBuilder,
    private taskstore: Store<any>,
    public BrowseMapService: BrowseMapService,
    public taskService: TaskCrationPageService
  ) {
    this.loadDropDowndata();
    this.sharedService.chipmessage.subscribe((node) => {
      if (node.hasOwnProperty("tabindex")) {
        if (node['tabindex'].index == 2) {
          this.onSearchSubmit()
        }
      }
    })
  }

  ngOnInit(): void {
    this.tagBuildSearchForm = this.createPhaseForm();
    this.taskItems$ = this.taskstore.select(store => store.Task.buildtask);
    this.getMapData();
    this.filterSearchText$.subscribe(searchText => this.filterSearchPhaseData(searchText));
    this.stepFSearchText$.subscribe(searchText => this.filterSearchData(searchText));
  }

  ngAfterContentInit(): void {
    //Called after ngOnInit when the component's or directive's content has been initialized.
    //Add 'implements AfterContentInit' to the class.
    let dataCount: number = 0;
    this.taskItems$.subscribe(data => {
      console.log(data)
      dataCount = dataCount + 1;
      console.log(dataCount)
      if (dataCount > 3) {
        this.filterBtn = true;
      }
      // do stuff with data
      // e.g. this.property = data
    });
  }

  private createPhaseForm(): FormGroup {
    return this.fb.group({
      'searchText': [null, Validators.required],
      'mapsearchText': [null, Validators.required]
    })
  }

  setName($data) {
    $data.map((node) => {
      node['name'] = node.title
      if (node.hasOwnProperty('children') && node.children && node.children.length) {
        node['children'] = this.setName(node['children'])
      }
    })
    return $data;
  }

  getMapData() {
    this.BrowseMapService.getNav().subscribe(data => {
      this.mapData = this.setName(data);
      this.mapDataMaster = [...this.mapData];
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
          this.treedata = this.phasesData.concat(res);
          this.treedataMaster = [...this.treedata];
        });
    });
  }

  public cCode: any = {
    "WI": "#9D5A83",
    "GB": "#008A90",
    "DS": "#8800BA",
    "M": "#DF4B09",
    "AP": "#30A62A",
    "KP": "#404040",
    "CG": "#17b4ef",
    "TOC": "#034796",
    "RC": "#FFC400"
  }

  tagdata: any;
  tagDataEvent($event) {
    let phaseSelection = $event.filter(function (el) {
      return el.parentId == undefined &&
        el.id <= 8;
    });
    let tagSelection = $event.filter(function (el) {
      return el.parentId != undefined &&
        el.id >= 8;
    });
    if (Object.keys(phaseSelection).length > 0) {
      this.chipValues = phaseSelection;
    }
    if (Object.keys(tagSelection).length > 0) {
      this.chipData = tagSelection;
    }
    this.tagdata = $event;
    this.tagId = $event;
  }

  saveMap() {
    this.sharedService.initSelectedBuildTask.emit(this.param)
    this.checkedmap = [];
  }

  mapDataEvent($event) {
    this.checkedmap = [];
    let reqData = $event.pop();
    this.checkedmap.push(reqData);
    let taskid = window.location.pathname.split("/").pop()
    this.param = Object.assign(reqData, {
      taskId: parseInt(taskid)
    })
  }

  nodeSearch(searchText, masterdata) {
    let data = [];
    let treeNodes = [...masterdata];
    function innerSearch(n, topNode) {
      n.forEach(element => {
        if (new RegExp(searchText.toLocaleLowerCase()).test(element.title.toLocaleLowerCase())) {
          data.push(topNode)
        }
        if (element.children) {
          innerSearch(element.children, topNode)
        }
      });
    }
    treeNodes.forEach((node) => {
      if (new RegExp(searchText.toLocaleLowerCase()).test(node.title.toLocaleLowerCase())) {
        data.push(node)
      }
      if (node.children) {
        innerSearch(node.children, node)
      }
    })
    let uniq = {}
    return data.filter(obj => !uniq[obj.id] && (uniq[obj.id] = true));
  };

  setFilterType($value) {
    this.filtertype = $value;
    this.tagBuildSearchForm.reset();
    this.filterSearchTextBSub.next('');
    this.stepFSearchTextBSub.next('');
  }

  filterSearchPhaseData(searchText) {
    this.treedata = searchText
      ? searchTree(searchText, this.treedataMaster, { labelField: 'name' })
      : this.treedataMaster;
    this.filterExpandOpt = searchText ? 1 : 2;
  }  

  filterSearchData(searchText) {
    this.mapData = searchText
      ? searchTree(searchText, this.mapDataMaster, { labelField: 'title' })
      : this.mapDataMaster;
    this.stepFExpandOpt = searchText ? 1 : 2;
  }

  tagData($event) {
    this.chipData = $event;
    this.taskstore.dispatch(new AddItemAction(
      {
        data: this.chipData,
        type: 'buildtask'
      }
    ));
  }

  removeChipData(delChip) {
    this.taskstore.dispatch(new DeleteItemAction({
      data: delChip,
      type: "buildtask"
    }));
    this.eventsSubject.next(delChip);
  }

  loadSearchSection(tagId, phaseId) {
    this.loading = true;
    let phasesQueryStr = '';
    let tagsQueryStr = '';
    /*************************QueryString Code***********/
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
      titleId: (this.tagBuildSearchForm.controls.searchText.value != "" && this.tagBuildSearchForm.controls.searchText.value != null) ? "(title:" + this.tagBuildSearchForm.controls.searchText.value + " OR purpose:" + this.tagBuildSearchForm.controls.searchText.value + ")" : '',
      assettypecode: "assettypecode:(F)"
    }
    var params = [];
    console.log(this.taskFilterData)
    for (var key in this.taskFilterData) {
      if (this.taskFilterData.hasOwnProperty(key) && this.taskFilterData[key]) {
        params.push(this.taskFilterData[key]);
      }
    }
    var queryString = "assetstatusid:(1)" + (params.length ? ' AND ' + params.join(" AND ") : '');
    /*************************QueryString Code***********/
    console.log(queryString);

    this.stepFlowData = [];
    this.subscription = this.tabOneContentService
      .getKnowledgeTaskSearchViewListData(queryString)
      .subscribe((res) => {
        let stepFlowData = res['hits']['hits'];
        stepFlowData.map((node) => {
          this.stepFlowData.push(node._source);
        })
        this.loading = false;
      });
  }

  combinedTagIds(tagArray: any) {
    const res = tagArray.reduce((acc, obj) => {
      obj = Object.assign([], obj)
      let found = false;
      for (let i = 0; i < acc.length; i++) {
        if (acc[i].parentId === obj.parentId) {
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

  navigationLink(contentTypeId, contentId) {
    if (contentTypeId === 4) {
      this.router.navigate(['/process-maps/edit', contentId]);
    }
  }

  openSite(siteUrl, contentId) {
    window.open(siteUrl + contentId, '_blank');
  }

  onSearchSubmit() {
    this.taskItems$.subscribe(x => this.tagId = x);
    this.loadSearchSection(this.tagId, this.phaseId);
    this.filterBtn = false;
    //this.buildCreatedOutput.emit(true);
  }

  buildCreatedOutput(hasBuildCreated) {
    this.hasBuildCreated = hasBuildCreated;
    this.LeftbuildCreatedOutput.emit(hasBuildCreated);
  }

}
