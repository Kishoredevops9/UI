import {
  Component, ComponentFactoryResolver, EventEmitter, OnInit, Output, ViewChild, ViewChildren,
  ViewContainerRef,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivityPageService } from '@app/activity-page/activity-page.service';
import { TodoItemsListService } from '@app/dashboard/todo-items-list/todo-items-list.service';
import { Subject, Subscription } from 'rxjs';
import { SharedService } from '@app/shared/shared.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { documentPath, assetTypeConstantValue } from '@environments/constants';
import { allEKSCollection } from '@environments/constants';
import { GlobalSearchService } from '@app/shared/services/global-search.service';
@Component({
  selector: 'app-eks-internal-search',
  templateUrl: './eks-internal-search.component.html',
  styleUrls: ['./eks-internal-search.component.scss'],
})
export class EksInternalSearchComponent implements OnInit {
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginator2') paginator2: MatPaginator;
  @ViewChild('paginator3') paginator3: MatPaginator;
  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChildren('searchDetails', { read: ViewContainerRef }) rowContainers;
  EventIndex:any;
  searchTerm;
  advterm;
  adv_search;
  isLoading = false;
  length: number = 0;
  globalLength: number = 0;
  startAt: number = 0;
  startEnd: number = 10;
  pageSize: number = 10;
  expanded: boolean = false;
  index: number;
  isActive = false;
  selectedIndex = 0;
  searchList = [];
  copySearchList;
  copyContactTypeSearchList;
  EKSInternalSearchData;
  page = 1;
  @Output() searchListCountEventHander = new EventEmitter<string>();
  @Output() searchTermEventHandler = new EventEmitter<string>();
  count;
  cdid: any;
  cdname: any;
  shurl: any;
  advurl: any;
  copySearchData: any;
  copyAdvanceSearchData: any;
  copyInternalSearchData: any;
  globalSearchData: any;
  pwPlaySearchData: any;
  EKSGlobalSearchData;
  EKSGlobalSearchCount;
  EKSPWPlaySearchCount;
  EKSPWPlayData;
  eksInternalSearchContentType: any;
  eksInternalSearchFilterType: any;
  eksSearchCount1:any;
  title;
  advsearchDoc: any;
  componenttypename: any;
  contentidname: any;
  advRecords: any[];
  advTable$: any;
  eksSearchDataCreated: any = '';
  eksSearchCountCreated: any;
  eksSearchTitleCreated: any = '';
  eksLeftSearchDataCreated: any = '';
  controlsData = {};
  collection: any;
  eksInternalSearchCount: number;
  eksGlobalSearchCount: number;
  eksVideoSearchCount: number;
  searchData: String;
  edpendData: number;
  masterFilterData: any;
  filterData: any ;
  allEKSCollection : any;
  init : boolean = false;
  tagDataSearch : boolean = false;
  eventsSubject: Subject<void> = new Subject<void>();
  tagObj: any = {
    enginesection: 'Engine Section',
    initialenginemodel: 'Initial Engine Model',
    enginemodelgroup: 'Engine Model Group',
    tags: 'Tags',
    phasenames  : 'Phase',
  };

  queryString : any;
  filterSearch($event) {
    if (this.searchData && this.searchData.length) {
      this.edpendData = 1;
      let tempData = JSON.parse(JSON.stringify(this.masterFilterData));
      tempData.map((node) => {
        node['expend'] = true;
        node.children = node.children.filter((val) => {
          return val.name.toLowerCase().includes(this.searchData.toLowerCase());
        });
      });

      this.filterData = tempData.filter((e) => {
        return e['children'].length;
      });
    } else {
      this.edpendData = 2;
      this.filterData = [...this.masterFilterData];
    }
  }
  addNameKey($arg, d) {
    return (
      $arg &&
      $arg.map((node) => {
        return {
          name: node.key,
          id: this.randomString(8),
          parentId: d,
        };
      })
    );
  }
  randomString(length) {
    var chars =
      '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');

    if (!length) {
      length = Math.floor(Math.random() * chars.length);
    }

    var str = '';
    for (var i = 0; i < length; i++) {
      str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
  }


eksInternalSearchData($event){

  this.filterData = $event.aggregations ;



  let tempObj = [];
  for (let d in this.filterData) {
    if (this.tagObj.hasOwnProperty(d)) {
      tempObj.push({
        name: this.tagObj[d],
        children: this.addNameKey(this.filterData[d].buckets, d),
        id: this.randomString(8),
      });
    }
  }

  console.log(this.init);
  if (!this.init){
    this.allEKSCollection.map((node)=>{
      node['active']= false;
   })

  if (this.filterData.hasOwnProperty('assettypecode') ){
    this.filterData['assettypecode'].buckets.forEach(element => {
       this.allEKSCollection.map((node)=>{

        if (node.keyword==element.key ){
       node['active']= true;
        }

       })

    });

  }



  this.init = true;
  this.filterData = tempObj.filter((e) => {
    return e['children'].length;
  });
  this.masterFilterData = [...this.filterData];


  }





}

onChangeEKSCollection(contentType) {
  const sltCollections = this.allEKSCollection
    .filter(item => item.active && item.checked);
  this.globalSearchService.sltCollectionsBSub.next(sltCollections);

  this.tagDataSearch = false;
let coll =  this.allEKSCollection.filter((item) => {

 return  item.checked




  }).map(x => x.keyword) ;

  this.queryString['assetTypeCode'] =  coll.toLocaleString().replaceAll(",","|")  ;
  console.log(this.queryString);

  this.eventsSubject.next(this.queryString);

}
  tagData($data) {
    console.log($data)
    this.tagDataSearch = true;

      let tempObj = {
        tags : [],
        phaseId  : []
      }
      console.log(tempObj)

    $data.forEach((node)=>{
       if(node.parentId=='phasenames'){
            tempObj.phaseId.push(  node.name )
       }
       else{
        tempObj.tags.push(  node.name )
       }
    });


      this.queryString['tags']    =  this.rAall( tempObj.tags );
      this.queryString['phaseNames'] =  this.rAall( tempObj.phaseId ) ;





      this.eventsSubject.next(this.queryString);
      this.globalSearchService.sltPhaseTagsBSub.next(tempObj);



  }

  rAall($data){
    let rData = "";
    $data.forEach(element => {
       if (rData==""){
        rData = element
       }
       else {
        rData = rData + "|" + element
       }
    });
    return rData;
  }


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sharedData: SharedService,
    private globalSearchService: GlobalSearchService
  ) { }

  @ViewChild('f') advform: NgForm;
  ngOnInit(): void {


    this.sharedData.resiveMessage.subscribe( ()=>{
      console.log("search called")

      this.init = false;
      this.tagDataSearch = false;
      this.allEKSCollection.map((node)=>{
        node['checked']= false;
     })

     this.queryString["tags"] = "";
     this.queryString["phaseNames"] = "";
     this.queryString["assetTypeCode"] = "";


    } )

    this.allEKSCollection = allEKSCollection;

    this.sharedData.collection.subscribe(c => {
      this.collection = c;
    });
    this.route.queryParams.subscribe((data) => {
      this.searchTerm = data.q;
      this.advterm = data.a;
      this.adv_search = data.p;
   //   this.isLoading = (data) ? true : false;
    });

    this.route.queryParams.subscribe((data: any) => {
     this.queryString = JSON.parse('{"' + decodeURI(data.q).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');



    });


  }

  ngAfterViewInit() { }

  onTabChanged(event) {
    console.log('--- event', event);
    this.EventIndex = event.index;
    this.selectedIndex = event.index;
  }
  getSearchContentType(contentType) {
    this.eksInternalSearchContentType = contentType;
    console.log('eksInternalSearchContentType',this.eksInternalSearchContentType);

  }

  getSearchFilterType(contentType) {
    let contentTypeFilterData = [];
    this.copySearchData = [...this.searchList];
    let contentTagId = contentType.tagsid;
    if (contentTagId) {
      contentTypeFilterData = this.copySearchData.filter(function (element) {
        return contentTagId.indexOf(element._source.tagsid) > -1;
      });
    }
    this.eksInternalSearchFilterType = contentTypeFilterData;
    console.log('contentTypeFilterData',contentTypeFilterData);
    console.log('eksInternalSearchFilterType',this.eksInternalSearchFilterType);

    this.copyContactTypeSearchList = (contentTypeFilterData.length > 0) ? contentTypeFilterData : (this.copySearchData.length > 0) ? this.copySearchData : '';
    this.count = this.copyContactTypeSearchList.length;
    this.copyContactTypeSearchList.forEach(el => {
      el.expanded = false;
    });
    this.EKSInternalSearchData = new MatTableDataSource(this.copyContactTypeSearchList);
    this.EKSInternalSearchData.paginator = this.paginator;
    this.copyContactTypeSearchList.forEach((el) => {
      el._source['contentType'] = assetTypeConstantValue(el._source.assettypecode);
    });
  }


  handleOnContentIDClick(contentData) {
    let element = contentData._source;
    let contentType = (element.assettypecode == "I") ? "WI" : (element.assettypecode == "G") ? "GB" : (element.assettypecode == "S") ? "DS" : (element.assettypecode == "A") ? "AP" : (element.assettypecode == "C") ? "CG" : (element.assettypecode == "K") ? "KP" : (element.assettypecode == "R") ? "RC" : (element.assettypecode == "T") ? "TOC" : '';
    sessionStorage.setItem('componentType', contentType);
    sessionStorage.setItem('contentNumber', element.contentid);
    sessionStorage.setItem('contentType', 'published');
    sessionStorage.setItem('redirectUrlPath', 'search');
    sessionStorage.setItem('statusCheck', 'true');

    if (element.assettypecode == 'I' || element.assettypecode == 'G' || element.assettypecode == 'S' || element.assettypecode == 'D') {
      this.router.navigate([documentPath.publishViewPath, element.contentid]);
    } else if (element.assettypecode === 'M' || element.assettypecode === 'Map') {
      this.router.navigate(['/process-maps/edit', element.contentnumber]);
    } else {
      var assetTypecode = (element.assettypecode === 'A') ? "AP" : (element.assettypecode === 'K') ? "KP" : (element.assettypecode === 'T') ? "TOC" : (element.assettypecode === 'R') ? "RC" : (element.assettypecode === 'C') ? "CG" : (element.assettypecode === 'F') ? "SF" : '';
      this.router.navigate([documentPath.publishViewPath, assetTypecode, element.contentid]);
    }
  }

  eksSearchOutput(eksSearchOutput) {
    this.eksSearchDataCreated = eksSearchOutput;
  }

  eksSearchCount(eksSearchCount) {
    this.eksSearchCount1 = eksSearchCount;
    this.eksSearchCountCreated = eksSearchCount + ' Result';
    console.log(' xxx this.eksSearchCountCreated', eksSearchCount);
    console.log(' xxxyyyy this.eksSearchCountCreated', this.eksSearchCount1);
  }

  eksInternalCount(eksInternalCount) {
    this.eksInternalSearchCount = (eksInternalCount && eksInternalCount > 0) ? eksInternalCount : 0;
    this.isLoading = (this.eksInternalSearchCount >= 0) ? false : true;
  }

  eksGlobalCount(eksGlobalCount) {
    this.eksGlobalSearchCount = (eksGlobalCount && eksGlobalCount > 0) ? eksGlobalCount : 0;
  }

  eksVideoCount(eksVideoCount) {
    this.eksVideoSearchCount = (eksVideoCount && eksVideoCount > 0) ? eksVideoCount : 0;
  }

  eksSearchTitle(eksSearchTitle) {
    this.eksSearchTitleCreated = eksSearchTitle;
  }

  eksLeftSearchData(eksLeftSearchData) {
    this.eksLeftSearchDataCreated = eksLeftSearchData;
    if (eksLeftSearchData) {
      this.searchList = eksLeftSearchData;
      this.count = this.searchList.length > 0 && this.searchList.length ? this.searchList.length : 0;
      this.title = {
        count: this.count ? `${this.count}\u00A0\u00A0\RESULTS` : '',
        searchTerm: `EKS Search`,
      };
      this.searchListCountEventHander.emit(this.title);
      this.copySearchList = [...this.searchList];
      this.EKSInternalSearchData = new MatTableDataSource(this.copySearchList);
      this.EKSInternalSearchData.paginator = this.paginator;
      this.copySearchList.forEach((el) => {
        el._source['contentType'] = assetTypeConstantValue(el._source.assettypecode);
      });
    } else {
      this.searchList = (this.copySearchData) ? this.copySearchData : (this.copyAdvanceSearchData) ? this.copyAdvanceSearchData : [];
      this.count = this.searchList.length > 0 && this.searchList.length ? this.searchList.length : 0;
      this.EKSInternalSearchData = new MatTableDataSource(this.searchList);
      this.EKSInternalSearchData.paginator = this.paginator;
      this.searchList.forEach((el) => {
        el._source['contentType'] = assetTypeConstantValue(el._source.assettypecode);
      });
    }
  }

  nextTab(redirect) {
    if (redirect) {
      this.selectedIndex = this.selectedIndex + 1;
    }
  }

  ngOnDestroy() {
    this.searchTerm = '';
    this.advterm = '';
    this.adv_search = '';
  }

}
