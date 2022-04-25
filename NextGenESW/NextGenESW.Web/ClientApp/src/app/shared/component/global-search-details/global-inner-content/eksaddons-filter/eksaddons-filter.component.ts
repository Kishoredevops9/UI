import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivityPageService } from '@app/activity-page/activity-page.service';
import { CreateDocumentService } from '@app/create-document/create-document.service';
import { Observable, Subject, Subscription } from 'rxjs';
import { TabOneContentService } from '@app/task-creation/task-creation-details/task-tab-one-content/task-tab-one-content.service';
import { FormBuilder, FormControl, FormGroup, NgForm } from '@angular/forms';
import { TodoItemsListService } from '../../../../../dashboard/todo-items-list/todo-items-list.service';
import { SharedService } from '@app/shared/shared.service';
import { allEKSCollection } from '@environments/constants';
import { Router, Event, NavigationStart, ActivationStart } from '@angular/router';

@Component({
  selector: 'app-eksaddons-filter',
  templateUrl: './eksaddons-filter.component.html',
  styleUrls: ['./eksaddons-filter.component.scss']
})
export class EksaddonsFilterComponent implements OnInit {

  count: number;
  collection: any;
  EKSCollection: any;
  FilterCollection: any;
  searchTerm: string;
  @Input() searchTextData: string;
  @Output() getSearchContentType = new EventEmitter<any>();
  @Output() getSearchFilterType = new EventEmitter<any>();
  @Output() eksSearchOutput = new EventEmitter<any>();
  @Output() eksSearchCount = new EventEmitter<any>();
  @Output() eksLeftSearchData = new EventEmitter<any>();
  searchContentType;
  showTitleBorder;
  panelOpenState: boolean = false;
  tagdata: any;
  phasesData: any;
  treedata: any;
  eventsSubject: Subject<void> = new Subject<void>();
  checked = [];
  eksCollectionForm: FormGroup;
  checkedValue: any;
  controlsData = {};
  advsearchDoc: any;
  advTable$: any;
  eksAdvanceSearchData: any;
  eksSearchData: any;
  eksSearchDataEmit = {};
  allEKSCollection;
  eventEKSCollection: any;
  checkedVal: boolean = false;
  contentTypeContentData: any;
  allEksCollectionData: any;
  allFilterCollectionData: any;
  @Input() popUp: string;
  @Input() stepPopUp: string;
  private subscription: Subscription;
  constructor(
    private router: Router,
    private createDocumentService: CreateDocumentService,
    private tabOneContentService: TabOneContentService,
    private formBuilder: FormBuilder,
    private todoItemsListService: TodoItemsListService,
    private activityPageService: ActivityPageService,
    private sharedData: SharedService
  ) {
    this.loadDropDowndata();
  }

  ngOnInit(): void {
    if (this.stepPopUp == 'stepFlow') {
      let content;
      content = allEKSCollection.filter((child) => {
        let childCode = child.code ? child.code.toLowerCase() : '';
        if (child.code && 'sf' != childCode && 'sp' != childCode && 'ap' != childCode && 'toc' != childCode) {
          return child;
        }
      });
      this.allEKSCollection = content;
    } else {
      this.allEKSCollection = allEKSCollection;
    }

    this.sharedData.searchTerm.subscribe((searchValue) => {
      this.searchTerm = searchValue;
    });

    this.sharedData.count.subscribe((c) => {
      this.count = c;
    });

    this.sharedData.collection.subscribe((c) => {
      this.collection = c;
    });

    this.eksCollectionForm = this.formBuilder.group({
      eksCollection: '',
    });

    if (this.collection.length > 0) {
      let contentType = this.collection;
      this.contentTypeContentData = this.allEKSCollection.filter(function (
        element
      ) {
        return contentType.indexOf(element.keyword) > -1;
      });
      this.onChangeEKSCollection(this.contentTypeContentData);
    }
  }

  onChangeEKSCollection(contentType) {
    let eksCollectionId = [];
    this.checked = this.allEKSCollection.filter((item) => item.checked);
    if (this.checked && this.checked.length) {
      this.checked.forEach((elem) => {
        eksCollectionId.push(elem.keyword);
      });
    }
    this.sharedData.nextEKSCollection(this.EKSCollection, eksCollectionId);
    this.sharedData.FilterCollection.subscribe(c => {
      this.allFilterCollectionData = c;
    });
    this.controlsData = {
      assettypecode: (typeof eksCollectionId !== 'undefined' && eksCollectionId.length > 0) ? eksCollectionId : '',
      tagsid: (typeof this.allFilterCollectionData !== 'undefined' && this.allFilterCollectionData.length > 0) ? this.allFilterCollectionData : '',
    }
    this.popUp ? this.getSearchContentType.emit(eksCollectionId) : this.getAdvanceSearchSectionData();
  }

  loadDropDowndata() {
    // this.tabOneContentService.getAllAssetPhases().subscribe(data => {
    //   this.phasesData = data;
    //   this.phasesData.map((node) => {
    //     node.name = node.description
    //   })
    //   this.activityPageService
    //     .getTagList()
    //     .subscribe((res) => {
    //       this.phasesData = [{
    //         id: 4,
    //         name: "Phases",
    //         parentId: "undefined",
    //         children: this.phasesData
    //       }]
    //       this.treedata = this.phasesData.concat(res)
    //     });
    // });
    this.activityPageService.getTagList().subscribe((res) => {
      this.treedata = res;
    });
  }

  tagData($event) {
    let tagData = $event;
    if (tagData != 'undefined' && tagData != 0 && tagData.length > 0) {
      let tagQueryId = tagData.filter(function (el) {
        return el.parentId != undefined && el.id >= 8;
      });
      let phaseQueryId = tagData.filter(function (el) {
        return el.parentId == undefined && el.id <= 8;
      });
      if (Object.keys(phaseQueryId).length > 0) {
        let phasesQurId = Array.prototype.map
          .call(phaseQueryId, function (item) {
            return item.id;
          })
          .join(',');
        //phasesQurId = '(' + phasesQurId + ')';
        var phaseId = phasesQurId;
      }
      if (Object.keys(tagQueryId).length > 0) {
        let tagsQurId = Array.prototype.map
          .call(tagQueryId, function (item) {
            return item.id;
          })
          .join(',');
        //tagsQurId = '(' + tagsQurId + ')';
        var tagId = tagsQurId;
      }
    }
    this.sharedData.EKSCollection.subscribe(c => {
      this.allEksCollectionData = c;
    });
    this.sharedData.nextFilterCollection(this.FilterCollection, tagId);
    this.controlsData = {
      assettypecode: (typeof this.allEksCollectionData !== 'undefined' && this.allEksCollectionData.length > 0) ? this.allEksCollectionData : '',
      phaseid: typeof phaseId !== 'undefined' && phaseId.length > 0 ? phaseId : '',
      tagsid: typeof tagId !== 'undefined' && tagId.length > 0 ? tagId : '',
    };
    this.popUp ? this.getSearchFilterType.emit(this.controlsData) : this.getAdvanceSearchSectionData();
  }

  getAdvanceSearchSectionData() {
    var params = [];
    for (var key in this.controlsData) {
      if (this.controlsData.hasOwnProperty(key) && this.controlsData[key]) {
        if (key == 'assettypecode') {
          params.push(key + ':(' + '"' + this.controlsData['assettypecode'].join('","') + '"' + ')');
        } else if (key == 'contentownerid') {
          params.push(key + ':(' + '"' + this.controlsData[key] + '"' + ')')
        } else if (key == 'tagsid') {
          params.push(key + ":" + this.controlsData[key])
        } else {
          params.push(key + ":(" + this.controlsData[key] + ")")
        }
      }
    }
    var queryString = params.join("AND ");
    (queryString) ? this.router.navigate(['_search'], { queryParams: { a: (queryString) } }) : (this.searchTerm && this.searchTerm.length > 0) ? this.router.navigate(['_search'], { queryParams: { q: this.searchTerm } }) : this.router.navigate(['lobbyhome']);
  }

  combinedTagIds(tagArray: any) {
    const res = tagArray.reduce((acc, obj) => {
      obj = Object.assign([], obj);
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
}