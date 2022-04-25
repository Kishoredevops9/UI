import {
  Component, ComponentFactory, ComponentFactoryResolver, EventEmitter, Input, OnInit, Output, SimpleChange, ViewChild, ViewChildren,
  ViewContainerRef,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TodoItemsListService } from '@app/dashboard/todo-items-list/todo-items-list.service';
import { SharedService } from '@app/shared/shared.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalInnerContentComponent } from '../../global-inner-content/global-inner-content.component';
import { documentPath, assetTypeConstantValue } from '@environments/constants';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { GlobalSearchService, PhaseTagSelection } from '@app/shared/services/global-search.service';

@Component({
  selector: 'app-eks-internal-tab',
  templateUrl: './eks-internal-tab.component.html',
  styleUrls: ['./eks-internal-tab.component.scss']
})
export class EksInternalTabComponent implements OnInit {
  sltPhaseTags: PhaseTagSelection = {};
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
    private todoItemsListService: TodoItemsListService,
    private route: ActivatedRoute,
    private resolver: ComponentFactoryResolver,
    private router: Router,
    private sharedData: SharedService,
    private globalSearchService: GlobalSearchService
  ) {

    this.sharedData.resiveMessage.subscribe(() => {
      if (window.location.pathname == '/_search') {
        this.ngOnInit()
        console.log("TTTTTTTTTTTTTTTTTTTTTTTT")
      }

    })

  }
  @ViewChild('f') advform: NgForm;

  loadSearchData($query, from, size) {
    this.isLoading = true;
    $query['from'] = from;
    $query['size'] = size;
    $query['searchText'] = $query['searchText'].replaceAll("+", " ")

    if ($query.assetTypeCode == 'null') {
      $query['assetTypeCode'] = "";
    }
    if ($query.version == '') {
      $query['version'] = 0;
    }

    $query.assetStatusId = parseInt($query.assetStatusId);
    return this.todoItemsListService.allSearch($query).pipe(tap((res: any) => {
      this.isLoading = false;
      let contentType = this.collection;
      let contentTypeContentData: any;
      if ( this.collection && this.collection.length > 0 ) {
        contentTypeContentData = this.searchList.filter(function (element) {
          return contentType.indexOf(element._source.assettypecode) > -1;
        });
      }
      this.searchList = res['hits']['hits'];
      this.isLoading = false;
      this.copyInternalSearchData = (contentTypeContentData != undefined && contentTypeContentData.length > 0 && contentType.length > 0) ? contentTypeContentData : (this.searchList.length > 0) ? this.searchList : '';
      this.internalLength = (res['hits']['total']['value'] > 0) ? res['hits']['total']['value'] : 0;
      this.count = this.internalLength;
      if ( this.count > 0 ) {
        this.searchList.forEach(el => {
          el.expanded = false;
          el._source['contentType'] = assetTypeConstantValue(el._source.assettypecode);
        });

      }

      this.eksInternalCount.emit(this.internalLength);
      this.eksInternalSearchData.emit(res);
      this.title = {
        count: this.count ? `${ this.count }\u00A0\u00A0\RESULTS` : '',
        searchTerm: `${ this.searchTerm }`
      };
      this.copySearchList = [ ...this.searchList ];
      this.copySearchData = [ ...this.searchList ];
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
        this.paramQuery = JSON.parse('{"' + decodeURI(data.q).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
        
        const phaseTagSelection = this.globalSearchService.sltPhaseTagsBSub.getValue();
        const { phaseId = [], tags = [] } = phaseTagSelection;
        this.paramQuery.phaseNames = phaseId.length ? phaseId.join('|') : '';
        this.paramQuery.tags = tags.length ? tags.join('|') : '';
        return this.loadSearchData(this.paramQuery, 0, 50);
      })
    ).subscribe();
  }

  expandChildItemDetails(item, action, index) {
    if (this.index != null) {
      this.searchList.forEach((el) => {
        el.expanded = false;
      });
      this.rowContainers.toArray()[this.index].clear();
    }
    if (this.index === index) {
      this.index = null;
    } else {
      item.expanded = true;
      const container = this.rowContainers.toArray()[index];
      const factory: ComponentFactory<any> = this.resolver.resolveComponentFactory(
        GlobalInnerContentComponent
      );
      const inlineComponent = container.createComponent(factory);
      inlineComponent.instance.contentTypeInfo = item._source;
      this.index = index;
    }
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

  handleOnContentIDClick(contentData) {
    let element = contentData._source;
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

}
