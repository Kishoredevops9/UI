import {
  AfterViewInit,
  Component, ComponentFactoryResolver, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild, ViewChildren,
  ViewContainerRef,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { TodoItemsListService } from '@app/dashboard/todo-items-list/todo-items-list.service';
import { SharedService } from '@app/shared/shared.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { documentPath, assetTypeConstantValue, allEKSCollection } from '@environments/constants';
import { environment } from '@environments/environment';
import { Observable, of } from 'rxjs';
import { delay, map, switchMap, tap } from 'rxjs/operators';
import { GridOptions } from '@app/shared/models/mat-table';
import { AddonsPopupSearchStore } from '../addons-popup-search.store';
import { EksDetailField, EksDetailItem } from '../addons-popup-search.state';
import { removeHTMLTags } from '@app/shared/utils/common';
import { SelectItem } from '@app/shared/models/common';
import { AggregationPrefix, getPhaseTagValues } from '../addons-popup-search.utils';
import { MatTableComponent } from './../../mat-table/mat-table.component'

@Component({
  selector: 'app-addons-eks-result',
  templateUrl: './addons-eks-result.component.html',
  styleUrls: ['./addons-eks-result.component.scss']
})
export class AddonsEksResultComponent implements OnInit, AfterViewInit {
  removeHTMLTags = removeHTMLTags;
  eksSearchResult$ = this.addonsPopupSearchStore.eksSearchResult$;
  eksResultGridOptions!: GridOptions;
  eksResultGridData$ = this.eksSearchResult$.pipe(map(item => item.subEksItems));
  eksCollectionSltItems$: Observable<SelectItem[]>;
  sltCollections = [];
  phaseTageSltItems$: Observable<SelectItem> = this.addonsPopupSearchStore.phaseTageSltItems$;
  sltPhaseTags = [];

  get eksTablePaginator() { return this.eksMatTable && this.eksMatTable.paginator };
  @ViewChild('contentIdRenderer') contentIdRenderer!: TemplateRef<HTMLElement>;
  @ViewChild('assetTypeCodeRenderer') assetTypeCodeRenderer!: TemplateRef<HTMLElement>;
  @ViewChild('purposeRenderer') purposeRenderer!: TemplateRef<HTMLElement>;
  @ViewChild('eksMatTable') eksMatTable!: MatTableComponent;

  @Input() excludedTypes: string[] = [];
  @Input() existingContentIds: string[] = [];

  formatPurposeData(purposeStr: string): string {
    if (!purposeStr) return "NA";
    const purposeData = JSON.parse(purposeStr);
    return purposeData.PurposeDescription;
  }

  onCollectionsChanged(sltCollections: any[]) {
    // Paginator should be reset to first page
    this.eksTablePaginator && this.eksTablePaginator.firstPage();
    this.addonsPopupSearchStore.patchState(state => ({
      eksQueryObject: {
        ...state.eksQueryObject,
        assetTypeCode: sltCollections.join('|'),
        from: 0,
        size: 10
      }
    }))
  }

  onPhaseTagsChanged($event: any[]) {
    // Paginator should be reset to first page
    this.eksTablePaginator && this.eksTablePaginator.firstPage();
    // $event has format: type_value where type is "Phase" or "Tags"
    const sltPhases = getPhaseTagValues($event, AggregationPrefix.Phase);
    const sltTags = getPhaseTagValues($event, AggregationPrefix.Tags);
    this.addonsPopupSearchStore.patchState(state => ({
      eksQueryObject: {
        ...state.eksQueryObject,
        phaseNames: sltPhases.join('|'),
        tags: sltTags.join('|'),
        from: 0,
        size: 10
      }
    }))
  }

  ngAfterViewInit(): void {
    this.eksResultGridOptions = {
      columnDefs: [
        {
          headerName: 'Title', field: EksDetailField.Title,
          checkboxSelection: true,
          checkboxSelectable: (nodeData) => !this.existingContentIds.includes(nodeData[EksDetailField.Contentid]),
          checked: (nodeData) => this.existingContentIds.includes(nodeData[EksDetailField.Contentid]),
          width: 15
      },
        {
          headerName: 'Content Id',
          field: EksDetailField.Contentid, width: 10, cellStyle: { justifyContent: 'center' },
          cellRenderer: this.contentIdRenderer
        },
        {
          headerName: 'Type',
          field: EksDetailField.Assettypecode, width: 5, cellStyle: { justifyContent: 'center' },
          cellRenderer: this.assetTypeCodeRenderer
        },
        {
          headerName: 'Purpose',
          field: EksDetailField.Purpose, width: 40,
          cellRenderer: this.purposeRenderer
        }
      ],
      footerEnabled: false,
      rowSelection: 'multiple',
      onSelectionChanged: (selectedNodes) => {
        this.addonsPopupSearchStore.patchState({
          sltEksResultItems: selectedNodes
        })
      }
    };
  }

  onPageChanged($event: { pageEvent: PageEvent, paginator: MatPaginator }) {
    this.addonsPopupSearchStore.patchState(state => ({
      eksQueryObject: {
        ...state.eksQueryObject,
        from: $event.pageEvent.pageIndex * $event.pageEvent.pageSize
      }
    }))
  }

  assetStatusMapping = {
    1: 'Published',
    2: 'Archived',
    3: 'Obsolete',
    4: 'Hidden',
    5: 'WIP',
    6: 'Legacy',
    7: 'Legacy/Obsolete'
  };
  @ViewChild('paginator1') paginator1: MatPaginator;
  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChildren('searchDetails', { read: ViewContainerRef }) rowContainers;
  @Output() eksInternalCount = new EventEmitter<any>();
  @Output() eksInternalSearchData = new EventEmitter<any>();

  searchTerm: any;
  advterm: any;
  adv_search: any;
  length: number = 0;
  internalLength: number = 0;
  startAt: number = 0;
  startEnd: number = 50;
  pageSize: number = 50;
  expanded: boolean = false;
  displayedColumns: string[] = ['arrow', 'eks', 'title', 'version', 'lastUpdate', 'jc', 'status', 'outsourcable',
  ];
  index: number;
  searchList = [];
  searchList1 = [];
  searchList2 = [];
  copySearchList: any;
  copyContactTypeSearchList: any;
  EKSInternalSearchData: any;
  pageRowCounters = environment.pageRowCounters;
  page = 1;
  @Output() searchListCountEventHander = new EventEmitter<string>();
  @Output() searchTermEventHandler = new EventEmitter<string>();
  @Input() eksInternalSearchContentType: any;
  @Input() eksInternalSearchFilterType: any;
  @Input() eksSearchCount1: any;
  @Input() inputQuery: Observable<any>;
  cntValue: boolean = false;
  count;
  copySearchData: any;
  copyAdvanceSearchData: any;
  copyInternalSearchData: any;
  title: any;
  advsearchDoc: any;
  componenttypename: any;
  contentidname: any;
  advRecords: any[];
  advTable$: any;
  eksSearchDataCreated: any = '';
  eksSearchTitleCreated: any = '';
  eksLeftSearchDataCreated: any = '';
  controlsData = {};
  collection: any;
  showEKSPagination: boolean = true;
  isLoading = false;
  queryParamSubscription;

  @Input() eksAdvSearchData: any;
  adQData: number = 0;
  adQ;
  adQNew;
  ST;
  paramQuery: any;
  constructor(
    private addonsPopupSearchStore: AddonsPopupSearchStore,
    private todoItemsListService: TodoItemsListService,
    private route: ActivatedRoute,
    private resolver: ComponentFactoryResolver,
    private router: Router,
    private sharedData: SharedService
  ) {
    this.eksCollectionSltItems$ = this.addonsPopupSearchStore.eksSearchResult$
      .pipe(
        map(result => {
          const { assetTypeItems = [] } = result;
          const assetTypeKeys = assetTypeItems.map(item => item.key);
          return allEKSCollection
            .filter(item => assetTypeKeys.includes(item.keyword))
            .map(item => ({
              label: item.name,
              value: item.keyword,
              data: item
            }))
        })
      )
    this.sharedData.resiveMessage.subscribe(() => {
      if (window.location.pathname == '/_search') {
        this.ngOnInit()
        console.log("TTTTTTTTTTTTTTTTTTTTTTTT")
      }

    })

  }
  @ViewChild('f') advform: NgForm;

  loadSearchData($query, from, size, sortBy = null, sortDirection = null) {
    this.isLoading = true;
    $query['from'] = from;
    $query['size'] = size;
    $query['searchText'] = $query['searchText']?.replaceAll("+", " ")

    if ($query.assetTypeCode == 'null') {
      $query['assetTypeCode'] = "";
    }
    if ($query.version == '') {
      $query['version'] = 0;
    }

    $query.assetStatusId = parseInt($query.assetStatusId);

    if (sortBy) {
      $query.sortField = sortBy;
    }

    if (sortDirection) {
      $query.sortType = sortDirection;
    }
    return this.todoItemsListService.allSearch($query).pipe(tap((res: any) => {
      this.isLoading = false;
      let contentType = this.collection;
      let contentTypeContentData: any;
      if (this.collection && this.collection.length > 0) {
        contentTypeContentData = this.searchList.filter(function (element) {
          return contentType.indexOf(element._source.assettypecode) > -1;
        });
      }
      this.searchList = res['hits']['hits'];
      this.isLoading = false;
      this.copyInternalSearchData = (contentTypeContentData != undefined && contentTypeContentData.length > 0 && contentType.length > 0) ? contentTypeContentData : (this.searchList.length > 0) ? this.searchList : '';
      this.internalLength = (res['hits']['total']['value'] > 0) ? res['hits']['total']['value'] : 0;
      this.count = this.internalLength;
      if (this.count > 0) {
        this.searchList.forEach(el => {
          el.expanded = false;
          el._source['contentType'] = assetTypeConstantValue(el._source.assettypecode);
        });

      }

      this.eksInternalCount.emit(this.internalLength);
      this.eksInternalSearchData.emit(res);
      this.title = {
        count: this.count ? `${this.count}\u00A0\u00A0\RESULTS` : '',
        searchTerm: `${this.searchTerm}`
      };
      this.copySearchList = [...this.searchList];
      this.copySearchData = [...this.searchList];
      this.searchTermEventHandler.emit(this.searchTerm);
      this.searchListCountEventHander.emit(this.title);
      this.EKSInternalSearchData = new MatTableDataSource(this.copyInternalSearchData);
      this.EKSInternalSearchData.paginator1 = this.paginator1;

    }));
  }

  ngOnInit(): void {

    this.inputQuery?.subscribe((query) => {
      console.log("event trigger")
      console.log(query)
      this.paramQuery = query;
      this.loadSearchData(query, 0, 50).subscribe();

    })

    this.queryParamSubscription?.unsubscribe();

    this.queryParamSubscription = this.route.queryParams.pipe(
      switchMap((data: any) => {
        this.paramQuery = {};
        if(data.q){
          this.paramQuery = JSON.parse('{"' + decodeURI(data.q).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
        }
        return this.loadSearchData(this.paramQuery, 0, 50);
      })
    ).subscribe();
  }

  getEKSInternalSearchData(startNumber: number, load: string) {
    if (this.searchTerm || this.ST) {
      this.controlsData = {
        assettypecode: this.searchTerm,
        author: this.searchTerm,
        contenttypename: this.searchTerm,
        componenttype: this.searchTerm,
        contentid: this.searchTerm,
        contentownerid: this.searchTerm,
        contentnumber: this.searchTerm,
        disciplinecode: this.searchTerm,
        jc: this.searchTerm,
        keywords: this.searchTerm,
        lastupdatedatetime: this.searchTerm,
        outsourceable: this.searchTerm,
        purpose: this.searchTerm,
        subsubdisciplinename: this.searchTerm,
        title: this.searchTerm,
        version: this.searchTerm,
        lessonlearned: this.searchTerm,
        criteria: this.searchTerm,
        definitions: this.searchTerm,
        intentbasisvalidation: this.searchTerm,
        references: this.searchTerm,
        toc: this.searchTerm,
        content: this.searchTerm,
        natureofchange: this.searchTerm,
        howitworks: this.searchTerm,
        history: this.searchTerm,
        criteriaguidencetext: this.searchTerm,
        workinstructionguidencetext: this.searchTerm,
        externallinksinto: this.searchTerm
      };
      var params = [];
      var fields = [];

      for (var key in this.controlsData) {
        if (this.controlsData.hasOwnProperty(key) && this.controlsData[key]) {
          var re: any = /^[a-zA-Z]{2,3}-[A-Za-z]-\d{6}$/;
          var reNew: any = /^[A-Za-z]-\d{6}$/;
          if (this.searchTerm.length > 8) {
            if (re.test(this.searchTerm)) {
              params.push(key + ':(' + '"' + this.controlsData[key] + '"' + ')')
              fields.push(key)
            } else {
              params.push(key + ':(' + '' + this.controlsData[key] + '' + ')')
              fields.push(key)
            }
          }
          else {
            if (reNew.test(this.searchTerm)) {
              params.push(key + ':(' + '"' + this.controlsData[key] + '"' + ')')
              fields.push(key)
            } else {
              params.push(key + ':(' + '' + this.controlsData[key] + '' + ')')
              fields.push(key)
            }
          }
        }
      }
      var queryString = params.join(" OR ");
      var fieldString = fields.join(",");
      this.isLoading = true;
      this.todoItemsListService
        .getAdvanceSearchDataOnCall(queryString, startNumber, this.pageSize)
        .subscribe((res) => {

          let contentType = this.collection;
          let contentTypeContentData: any;
          if (this.collection.length > 0) {
            contentTypeContentData = this.searchList.filter(function (element) {
              return contentType.indexOf(element._source.assettypecode) > -1;
            });
          }
          this.searchList = res['hits']['hits'];
          this.isLoading = false;
          this.copyInternalSearchData = (contentTypeContentData != undefined && contentTypeContentData.length > 0 && contentType.length > 0) ? contentTypeContentData : (this.searchList.length > 0) ? this.searchList : '';
          this.internalLength = (res['hits']['total']['value'] > 0) ? res['hits']['total']['value'] : 0;
          this.count = this.internalLength;
          var re1: any = /^[a-zA-Z]{2,3}-[A-Za-z]-\d{6}$/;
          var reNew1: any = /^[A-Za-z]-\d{6}$/;

          if (re1.test(this.searchTerm) || reNew1.test(this.searchTerm)) {

            var re1: any = /^[a-zA-Z]{2,3}-[A-Za-z]-\d{6}$/;

            var temp = 0;
            var largest = 0;

            this.copyInternalSearchData.forEach((el) => {
              if (largest < el._source['version']) {
                largest = el._source['version']
                temp = el;
              }
            });
            console.log(' largest', largest);
            this.copyInternalSearchData = temp;
            console.log(' largest this.copyInternalSearchData', this.copyInternalSearchData);

            this.internalLength = 1;
            this.count = this.internalLength;
            this.eksInternalCount.emit(this.internalLength);
            this.title = {
              count: this.count ? `${this.count}\u00A0\u00A0\RESULTS` : '',
              searchTerm: `${this.searchTerm}`,
            };

            console.log('--- this.searchList', this.searchList);
            this.searchList1.push(this.copyInternalSearchData);
            this.searchList2.push(this.copyInternalSearchData);
            console.log('--- this.searchList1', this.searchList1);
            this.copySearchList = [...this.searchList1];
            this.copySearchData = [...this.searchList1];

            if (this.count > 0) {
              this.searchList1.forEach(el => {
                el.expanded = false;
              });

            }

            if (this.count > 0) {
              this.searchList1.forEach((el) => {
                el._source['contentType'] = assetTypeConstantValue(el._source.assettypecode);
              });

            }

            this.searchTermEventHandler.emit(this.searchTerm);
            this.searchListCountEventHander.emit(this.title);
            console.log(' if this.searchList2', this.searchList2);
            console.log(' if this.copyInternalSearchData', this.copyInternalSearchData);
            this.EKSInternalSearchData = new MatTableDataSource(this.searchList2);
            this.EKSInternalSearchData.paginator1 = this.paginator1;
            console.log(' if this.EKSInternalSearchData', this.EKSInternalSearchData);
            this.searchList1 = [];
            this.searchList2 = [];

          }

          else {
            this.eksInternalCount.emit(this.internalLength);
            this.title = {
              count: this.count ? `${this.count}\u00A0\u00A0\RESULTS` : '',
              searchTerm: `${this.searchTerm}`,
            };
            if (this.count > 0) {
              this.copyInternalSearchData.forEach(el => {
                el.expanded = false;
              });
            }

            this.copySearchList = [...this.searchList];
            this.copySearchData = [...this.searchList];

            if (this.count > 0) {
              this.copyInternalSearchData.forEach((el) => {
                el._source['contentType'] = assetTypeConstantValue(el._source.assettypecode);
              });
            }

            this.searchTermEventHandler.emit(this.searchTerm);
            this.searchListCountEventHander.emit(this.title);
            console.log(' else this.copyInternalSearchData', this.copyInternalSearchData);
            this.EKSInternalSearchData = new MatTableDataSource(this.copyInternalSearchData);
            this.EKSInternalSearchData.paginator1 = this.paginator1;
            console.log(' else this.EKSInternalSearchData', this.EKSInternalSearchData);

          }

        });
    }

  }

  getEKSInternalAdvanceSearchData(startNumber: number, load: string) {
    if (this.advterm || this.adQ || this.adv_search || this.adQNew) {

      let advanceQueryString;
      this.sharedData.searchTerm.subscribe(searchValue => {
        this.searchTerm = searchValue;
      });
      if (this.searchTerm || this.ST) {
        this.controlsData = {
          author: this.searchTerm,
          contenttypename: this.searchTerm,
          componenttype: this.searchTerm,
          contentid: this.searchTerm,
          contentownerid: this.searchTerm,
          contentnumber: this.searchTerm,
          disciplinecode: this.searchTerm,
          jc: this.searchTerm,
          keywords: this.searchTerm,
          lastupdatedatetime: this.searchTerm,
          outsourceable: this.searchTerm,
          purpose: this.searchTerm,
          subsubdisciplinename: this.searchTerm,
          title: this.searchTerm,
          version: this.searchTerm,
          lessonlearned: this.searchTerm,
          criteria: this.searchTerm,
          definitions: this.searchTerm,
          intentbasisvalidation: this.searchTerm,
          references: this.searchTerm,
          toc: this.searchTerm,
          content: this.searchTerm,
          natureofchange: this.searchTerm,
          howitworks: this.searchTerm,
          history: this.searchTerm,
          criteriaguidencetext: this.searchTerm,
          workinstructionguidencetext: this.searchTerm,
          externallinksinto: this.searchTerm
        };
        var params = [];
        for (var key in this.controlsData) {
          if (this.controlsData.hasOwnProperty(key) && this.controlsData[key]) {
            if (key == 'contentid') {
              params.push(key + ':(' + '"' + this.controlsData[key] + '"' + ')')
            } else {
              params.push(key + ":(" + this.controlsData[key] + ")")
            }
          }
        }

        if ((this.advterm ? this.advterm : this.adQ) && (this.adv_search ? this.adv_search : this.adQNew)) {
          advanceQueryString = (this.advterm ? this.advterm : this.adQ) + " AND " + (this.adv_search ? this.adv_search : this.adQNew) + " AND (" + params.join(" OR ") + ")";
        }

        else if (this.advterm ? this.advterm : this.adQ) {
          advanceQueryString = (this.advterm ? this.advterm : this.adQ) + " AND (" + params.join(" OR ") + ")";
        }

        else {
          advanceQueryString = (this.adv_search ? this.adv_search : this.adQNew) + " AND (" + params.join(" OR ") + ")";
        }
      }
      else {
        if ((this.advterm ? this.advterm : this.adQ) && (this.adv_search ? this.adv_search : this.adQNew)) {
          advanceQueryString = (this.advterm ? this.advterm : this.adQ) + " AND " + (this.adv_search ? this.adv_search : '');
        }
        else if (this.advterm ? this.advterm : this.adQ) {
          advanceQueryString = (this.advterm ? this.advterm : this.adQ);
        }

        else {
          advanceQueryString = (this.adv_search ? this.adv_search : this.adQNew);
        }
      }
      this.isLoading = true;
      this.todoItemsListService
        .getAdvanceSearchDataOnCall(advanceQueryString, startNumber, this.pageSize)
        .subscribe((res) => {
          this.searchList = res['hits']['hits'];
          this.copyAdvanceSearchData = (this.searchList.length > 0) ? this.searchList : '';
          this.internalLength = (res['hits']['total']['value'] > 0) ? res['hits']['total']['value'] : 0;
          this.count = this.internalLength;
          this.isLoading = false;
          this.title = {
            count: this.count ? `${this.count}\u00A0\u00A0\RESULTS` : '',
            searchTerm: `EKS Search`,
          };
          this.searchList.forEach(el => {
            el.expanded = false;
          });
          this.eksInternalCount.emit(this.internalLength);
          this.searchListCountEventHander.emit(this.title);
          this.copySearchList = [...this.searchList];
          this.EKSInternalSearchData = new MatTableDataSource(this.copyAdvanceSearchData);
          if (load == 'load') {
            this.paginator1.pageIndex = 0;
          } else {
            this.EKSInternalSearchData.paginator1 = this.paginator1;
          }
          this.searchList.forEach((el) => {
            el._source['contentType'] = assetTypeConstantValue(el._source.assettypecode);
          });
        });
    }

  }

  getSearchContentType(contentType) {

    this.copySearchData = [...this.searchList];
    let contentTypeContentData: any;
    if (contentType.length > 0) {
      contentTypeContentData = this.copySearchData.filter(function (element) {
        return contentType.indexOf(element._source.assettypecode) > -1;
      });
    }
    this.showEKSPagination = (contentType.length > 0) ? false : true;
    this.copyContactTypeSearchList = (contentTypeContentData != undefined && contentTypeContentData.length >= 0 && contentType.length > 0) ? contentTypeContentData : (this.copySearchData.length > 0) ? this.copySearchData : '';
    this.count = this.copyContactTypeSearchList.length;

    this.copyContactTypeSearchList.forEach(el => {
      el.expanded = false;
    });
    this.EKSInternalSearchData = new MatTableDataSource(this.copyContactTypeSearchList);
    this.EKSInternalSearchData.paginator1 = this.paginator1;
    this.copyContactTypeSearchList.forEach((el) => {
      el._source['contentType'] = assetTypeConstantValue(el._source.assettypecode);
    });
  }

  getSearchFilterType(contentType) {

    let contentTypeFilterData = [];
    this.copySearchData = [...this.searchList];
    let contentPhaseId = contentType.phaseid;
    let contentTagId = contentType.tagsid;
    if (contentTagId) {
      contentTypeFilterData = this.copySearchData.filter(function (element) {
        return contentTagId.indexOf(element._source.tagsid) > -1;
      });
    }
    this.showEKSPagination = (contentType.length > 0) ? false : true;
    this.copyContactTypeSearchList = (contentTypeFilterData.length > 0) ? contentTypeFilterData : (this.copySearchData.length > 0) ? this.copySearchData : '';
    this.count = this.copyContactTypeSearchList.length;

    this.copyContactTypeSearchList.forEach(el => {
      el.expanded = false;
    });
    this.EKSInternalSearchData = new MatTableDataSource(this.copyContactTypeSearchList);
    this.EKSInternalSearchData.paginator1 = this.paginator1;
    this.copyContactTypeSearchList.forEach((el) => {
      el._source['contentType'] = assetTypeConstantValue(el._source.assettypecode);
    });
  }

  handleOnContentIDClick(element: EksDetailItem) {
    let version = element.version;
    let contentType = (element.assettypecode == "I") ? "WI" : (element.assettypecode == "G") ? "GB" : (element.assettypecode == "S") ? "DS" : (element.assettypecode == "A") ? "AP" : (element.assettypecode == "C") ? "CG" : (element.assettypecode == "K") ? "KP" : (element.assettypecode == "R") ? "RC" : (element.assettypecode == "T") ? "TOC" : '';
    sessionStorage.setItem('componentType', contentType);
    sessionStorage.setItem('contentNumber', element.contentid);
    sessionStorage.setItem('contentType', 'published');
    sessionStorage.setItem('redirectUrlPath', 'search');
    sessionStorage.setItem('_id', element.contentnumber);
    sessionStorage.setItem('statusCheck', 'true');

    if (element.assettypecode == 'I' || element.assettypecode == 'G' || element.assettypecode == 'S' || element.assettypecode == 'D') {
      if (environment.enableSearchNewWindowFlag) {
        window.open(documentPath.publishViewPath + '/' + element.contentid + '/' + element.version, '_blank');
      } else {
        this.router.navigate([documentPath.publishViewPath, element.contentid, element.version]);
      }
    } else if (element.assettypecode === 'M' || element.assettypecode === 'Map') {
      if (environment.enableSearchNewWindowFlag) {
        window.open('/process-maps/edit/' + element.contentnumber, '_blank');
      } else {
        this.router.navigate(['/process-maps/edit', element.contentnumber]);
      }
    } else {
      var assetTypecode = (element.assettypecode === 'A') ? "AP" : (element.assettypecode === 'K') ? "KP" : (element.assettypecode === 'T') ? "TOC" : (element.assettypecode === 'R') ? "RC" : (element.assettypecode === 'C') ? "CG" : (element.assettypecode === 'F') ? "SF" : (element.assettypecode === 'SF') ? "SF" : (element.assettypecode === 'P') ? "SP" : '';
      if (environment.enableSearchNewWindowFlag) {
        window.open(documentPath.publishViewPath + '/' + assetTypecode + '/' + element.contentid + '/' + element.version, '_blank');
      } else {
        this.router.navigate([documentPath.publishViewPath, assetTypecode, element.contentid, element.version]);
      }
    }
  }

  onPageEvent(event: PageEvent) {
    this.startAt = (event.pageSize * event.pageIndex) + 1;
    this.startEnd = (event.pageIndex + 1) * event.pageSize;
    this.pageSize = event.pageSize;
    this.internalLength = this.internalLength;

    console.log(this.startAt)
    console.log(this.startEnd)
    console.log(this.pageSize)

    this.loadSearchData(this.paramQuery, this.startAt, this.pageSize).subscribe();
  }

  ngOnDestroy() {

    this.ST = '';
    this.adQ = '';
    this.adQNew = '';

  }

  onSortChanged(event) {
    const { active, direction } = event;
    this.paginator1.pageIndex = 0;
    this.startAt = 0;
    this.loadSearchData(this.paramQuery, this.startAt, this.pageSize, active, direction).subscribe();
  }
}
