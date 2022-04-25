import { Component, EventEmitter, OnInit, Output, ViewChild, ViewEncapsulation, Input, ElementRef } from '@angular/core';
import { SharedService } from '@app/shared/shared.service';
import { PersistanceService } from '@app/shared/persistance.service';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, NgForm, FormControl } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { Router,ActivatedRoute, Event, NavigationStart } from '@angular/router';
import {
  WiDropDownList, WiDisciplineDropDownList, GetClassifiersDropDownList,
  TagList
} from '@app/create-document/create-document.model';
import { CreateDocumentService } from '@app/create-document/create-document.service';
import { ActivityPageService } from '@app/activity-page/activity-page.service';
import { AdminService } from '@app/admin/admin.service';
import { allEKSCollection } from '@environments/constants';
import { DatePipe } from '@angular/common';
import { TaskItemsListService } from '@app/dashboard/task-items-list/task-items-list.service';
import { Store } from '@ngrx/store';
import { selectMetaDataDisciplineCode, selectSetOfPhasesList, selectUserList } from '@app/reducers/common-list.selector';
import { environment } from '@environments/environment';
import { GlobalSearchService } from '@app/shared/services/global-search.service';
let datePipe = new DatePipe("en-US");


@Component({
  selector: 'app-eks-top-searchbar',
  templateUrl: './eks-top-searchbar.component.html',
  styleUrls: ['./eks-top-searchbar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EksTopSearchbarComponent implements OnInit {
  sltCollections: any[] = [];
  count: number;
  searchType : Boolean  = false;
  collection: any;
  totalBadgeItems;
  todoItemsListData;
  userMail;
  searchTerm = '';
  placeholder = 'Search';
  disableTaskSearchAndTaskCreation = environment.disableTaskSearchAndTaskCreation;
  @Output() public found = new EventEmitter<any>();
  dialog: any;
  advterm = '';
  showMenus: boolean = false;
  menuOffsetLeft;
  menuOffsettop;
  splMenu: boolean = false;
  expansionLeft;
  expansionTop;
  WIDisciplineCodeList: WiDisciplineDropDownList[];
  classifiersDropDownList: GetClassifiersDropDownList[];
  setOfPhasesList: WiDropDownList[];
  tagList: TagList[] = [];
  advanceSearchForm: FormGroup;
  eksCollectionForm: FormGroup;
  chipData: any = [];
  eventsSubject: Subject<void> = new Subject<void>();
  eventSubject: Subject<void> = new Subject<void>();
  eventsSearchDiscipline: Subject<void> = new Subject<void>();
  @ViewChild('f') advform: NgForm;
  advRecords = [];
  private subscription: Subscription;
  allEKSCollection
  eksCollection = new FormControl();
  public href: string = "";
  newClassData: any;
  suggestval: any;
  controlsData = {};
  eksAdvanceSearchData: any;
  eksSearchData: any;
  complist: string;
  advsearch: any;
  querySearch2: any;
  searchList: string;
  showSearch: boolean = false;
  pageId: any = 0;
  tooltip;
  discipline: any;
  selectedDisciplineCode: any;
  selectedDisciplineValue: any = '';
  filteredCoauthor: any;
  filteredCoauthorName: any;
  public tData: any = {};

  toppingList: string[] = [];
  selected = -1;
  rprog : any = [];
  taskSearchCount : number = 0;

  /*checkbox change event*/



  @Input() topNavisAdmin: boolean = false;
  constructor(
    private store: Store<any>,

    private router: Router,

    private sharedData: SharedService,
    private profileData: PersistanceService,
    public dialogFeedback: MatDialog,
    private createDocumentService: CreateDocumentService,
    private formBuilder: FormBuilder,
    private activityPageService: ActivityPageService,
    public dialog3: MatDialog,
    public adminService: AdminService,
    private eRef: ElementRef,
    public  TaskItemsListService : TaskItemsListService,
    public activatedRoute:ActivatedRoute,
    private globalSearchService: GlobalSearchService,
  ) {
    this.globalSearchService.sltCollectionsBSub
    .asObservable()
    .subscribe(sltCollections => this.sltCollections = sltCollections || [])
    this.loadDropDowndata();
    this.getRp();
    this.sharedData.taskSearch.subscribe((data)=>{
this.taskSearchCount = data;

    })



  }

  ngAfterViewInit(): void {

   this.router.events.subscribe((val) => {
    if ( window.location.pathname == '/_tasksearch'){


      this.searchType = true;

     }
     else{
       this.searchType = false;
     }
  });




  }

  onChange(event) {
    console.log( this.rprog )



  }

  getRp(){

    this.TaskItemsListService.getAllRp().subscribe( (DATA)=>{

        this.toppingList = DATA.map((node)=>{
          return node['programName']
        })

  console.log( this.toppingList )

},
(err)=>{
  console.log(err)
}



    )



  }


  ngOnInit(): void {

    // this.activatedRoute.queryParams.subscribe((data: any) => {
    //  if (data && data.q){
    //    console.log(data)
    //   let Obj = JSON.parse('{"' + decodeURI(data.q).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');


    //   this.searchTerm = Obj.searchText;
    //  }



    // });




    this.adminService.getAllToolTip().subscribe((data) => {

      this.tooltip = data;
      this.setToolTip()

      this.tooltip.forEach(element => {
        this.tData[element.tokenId] = element.description

      });



    })


    this.allEKSCollection = allEKSCollection;
    this.sharedData.count.subscribe(c => {
      this.count = c;
    });
    this.sharedData.collection.subscribe(c => {
      this.collection = c;
    });
    this.getPlaceData();
    this.advanceSearchForm = this.formBuilder.group({
      'disciplineCode': '',
      'contentOwner': '',
      'phases': '',
      'tags': '',
      'version': '',
      'keyword': '',
      'tpmDate': '',
      'eksInternal': '',
      'eksExternal': '',
      obsolete: false
    });
    this.eksCollectionForm = this.formBuilder.group({
      'eksCollection': ''
    })
    this.router.events.subscribe((event: Event) => {
      //console.log(' top-search event',event);
      if (event instanceof NavigationStart) {
        //console.log(' top-search event',event.url);
        if(event.url== '/dashboard'){
          this.searchTerm = '';
          this.resetFilters();
        }
       }
    });
    this.href = this.router.url;
    this.profileData.currentProfile.subscribe((data) => {
      this.userMail = data.mail;
    });
    let email = sessionStorage.getItem('userMail');
    const gSearchUrl = window.location.href;
    if (gSearchUrl.includes('/_search')) {
      var querySearch = window.location.href.split('=');
      let searchQueryString = querySearch[0]?.split("_search?", 2);
      const queryParam = (searchQueryString[1] == 'q') ? decodeURIComponent(querySearch[1]) : '';
      const params = new URLSearchParams(queryParam);
      this.searchTerm = params.get('searchText')
    }
  }

  loadDropDowndata() {
    this.subscription = this.store.select(selectMetaDataDisciplineCode)
      .subscribe((res) => {
        this.WIDisciplineCodeList = [ ...res ];
      });
    this.createDocumentService.getAllMetaDiscipline().subscribe((response) => {
      this.discipline = response;
    });
    this.createDocumentService.retrieveCoauthorName().subscribe((response) => {
      this.filteredCoauthorName = response;
    });
    this.subscription = this.store.select(selectSetOfPhasesList)
      .subscribe((res) => {
        this.setOfPhasesList = res;
      });
    this.subscription = this.activityPageService.getTagList()
      .subscribe((res) => {
        this.tagList = res;
      });
  }

  ngOnDestroy() {
    // console.log(' in top-search before',this.searchTerm);
    // console.log(' in top-search after',this.searchTerm);
    // console.log(' top-search this.href',this.href);
    //this.searchTerm = '';
  }

  keyDownFunction(event) {
    if (event.keyCode === 13) {
      this.onArrowClick();
      //this.searchTerm ? this.router.navigate(['_search'], { queryParams: { q: this.searchTerm } }) : this.router.navigate(['/dashboard']);
    }
  }

  removePlaceHolder() {
    this.placeholder = '';
  }

  setPlaceHolder() {
    this.placeholder = 'Search';
  }

  getPlaceData() {
    if (this.chipData && this.chipData.length) {
      return this.chipData.length + " Tag Selected";
    } else {
      return "No Tag Selected";
    }
  }

  tagData($event) {
    this.chipData = $event;
  }




  setToolTip() {


    this.tooltip.forEach(element => {
      var tid = element.tokenId.toString()
      let selector = document.querySelector("*[data-tooltip='" + tid + "']");


      if (selector) {

        selector.setAttribute("tooltip", element.description);
        selector.setAttribute("ng-reflect-tooltip-value", element.description);
      }
    });
  }

  searchTypeChange(){
    if (window.location.pathname.includes("/_tasksearch") || window.location.pathname.includes("/_search"))
      this.onArrowClick()
  }
  onArrowClick() {
    console.log("search start ")
    const assetTypeCode = this.sltCollections.length
      ? this.sltCollections.map(item => item.keyword).join('|')
      : "";
    if (!this.searchType) {
      console.log("Search Called");
      let params = new URLSearchParams();
      let options = {
        "searchText": this.searchTerm,
        "tags": "",
        "assetTypeCode": assetTypeCode,
        "disciplineCode": this.advanceSearchForm.value.disciplineCode,
        "contentOwnerId": this.advanceSearchForm.value.contentOwner,
        "phaseId": this.advanceSearchForm.value.phases,
        "tagsId": this.chipData.map((n) => { return n.id }),
        "version": this.advanceSearchForm.value.version,
        "keywords": this.advanceSearchForm.value.keyword,
        "assetStatusId": this.advanceSearchForm.value.obsolete ? 3 : 1,
        "obsolete" : this.advanceSearchForm.value.obsolete,
        "from": 0,
        "size": 50
      }
      for (let key in options) {
        params.set(key, options[key])
      }

      this.sharedData.nextSearchTerm(this.searchTerm);
      this.router.navigate(['_search'], { queryParams: { q: params.toString() } });
    }
    else{
      console.log(this.rprog)
      this.sharedData.nextSearchTerm(this.searchTerm);
      this.router.navigate(['_tasksearch'], { queryParams: { q: this.searchTerm , rp : this.rprog.toLocaleString() } })
    }
  }

  onCollectionChangeEvent(event) {
    //console.log("top side onCollectionChangeEvent event",event);
    this.controlsData = { assettypecode: (typeof event !== 'undefined' && event.length > 0) ? event : '' }
    this.getAdvanceSearchSectionData();
  }

  onSubmitAdvSearchForm() {
    let tagSelectedId = [];
    if (this.chipData && this.chipData.length) {
      this.chipData.forEach(elem => {
        tagSelectedId.push(elem.id);
      });
    }
    this.controlsData = {
      disciplinecode: this.advanceSearchForm.controls.disciplineCode.value,
      contentownerid: this.advanceSearchForm.controls.contentOwner.value,
      phaseid: (this.advanceSearchForm.controls.phases.value != null && this.advanceSearchForm.controls.phases.value.length > 0) ? this.advanceSearchForm.controls.phases.value : '',
      tagsid: (tagSelectedId !== null && typeof tagSelectedId !== undefined && tagSelectedId.length > 0) ? tagSelectedId : '',
      version: this.advanceSearchForm.controls.version.value,
      keywords: this.advanceSearchForm.controls.keyword.value,
      tpmdate: (this.advanceSearchForm.controls.tpmDate.value != null && this.advanceSearchForm.controls.tpmDate.value != '') ? datePipe.transform(this.advanceSearchForm.controls['tpmDate'].value, 'yyyy-MM-dd') : '',
      eksinternal: this.advanceSearchForm.controls.eksInternal.value,
      eksexternal: this.advanceSearchForm.controls.eksExternal.value,
      assetStatusId: this.advanceSearchForm.controls.obsolete.value ? 3 : null
    };
    this.showSearch = false;
    this.getAdvanceSearch(); //for selecting from advance search form
  }

  getAdvanceSearchSectionData() {
    var params = [];
    for (var key in this.controlsData) {
      //console.log(' this.controlsData length',this.controlsData['assettypecode'].length);
      //console.log(' this.controlsData.value',this.controlsData['assettypecode']);
      if (this.controlsData.hasOwnProperty(key) && this.controlsData[key]) {
        if (key == 'assettypecode') {
          params.push(key + ':(' + '"' + this.controlsData['assettypecode'].join('","') + '"' + ')');
        } else if (key == 'contentownerid') {
          params.push(key + ':(' + '"' + this.controlsData[key] + '"' + ')')
        } else {
          params.push(key + ":(" + this.controlsData[key] + ")")
        }
      }
    }
    var queryString = params.join(" AND ");
    (queryString) ? this.router.navigate(['_search'], { queryParams: { a: (queryString) } }) : (this.searchTerm && this.searchTerm.length > 0) ? this.router.navigate(['_search'], { queryParams: { q: this.searchTerm } }) : this.router.navigate(['lobbyhome']);
  }

  getAdvanceSearch() {
    var params = [];
    for (var key in this.controlsData) {
      //console.log(' this.controlsData length',this.controlsData['assettypecode'].length);
      //console.log(' this.controlsData.value',this.controlsData['assettypecode']);
      if (this.controlsData.hasOwnProperty(key) && this.controlsData[key]) {
        if (key == 'assettypecode') {
          params.push(key + ':(' + '"' + this.controlsData['assettypecode'].join('","') + '"' + ')');
        } else if (key == 'contentownerid') {
          params.push(key + ':(' + '"' + this.controlsData[key] + '"' + ')')
        } else {
          params.push(key + ":(" + this.controlsData[key] + ")")
        }
      }
    }
    var queryString = params.join(" AND ");
    (queryString) ? this.router.navigate(['_search'], { queryParams: { p: (queryString) } }) : (this.searchTerm && this.searchTerm.length > 0) ? this.router.navigate(['_search'], { queryParams: { q: this.searchTerm } }) : this.router.navigate(['lobbyhome']);
  }

  // getAdvanceSearch() {
  //   var params = [];
  //   for (var key in this.controlsData) {
  //     //console.log(' this.controlsData length',this.controlsData['assettypecode'].length);
  //     //console.log(' this.controlsData.value',this.controlsData['assettypecode']);
  //     if (this.controlsData.hasOwnProperty(key) && this.controlsData[key]) {
  //       if (key == 'assettypecode') {
  //         params.push(key + ':' + '"' + this.controlsData['assettypecode'].join('","') + '"' + '');
  //       } else if (key == 'contentownerid') {
  //         params.push(key + ':' + '"' + this.controlsData[key] + '"' + '')
  //       } else {
  //         params.push(key + ':' + this.controlsData[key] + '')
  //       }
  //     }
  //   }
  //   var queryString = params.join(" AND ");
  //   (queryString) ? this.router.navigate(['_search'], { queryParams: { p: (queryString) } }) : (this.searchTerm && this.searchTerm.length > 0) ? this.router.navigate(['_search'], { queryParams: { q: this.searchTerm } }) : this.router.navigate(['lobbyhome']);
  // }

  advanceSearch() {
    this.showSearch = !this.showSearch;
    setTimeout(() => {
      this.setToolTip()
    }, 100)
  }

  resetFilters() {
    this.chipData = [];
    this.selectedDisciplineValue = '';
    this.advanceSearchForm.reset();
  }

  filterCoauthor(name) {
    if (name && name.length >= 3) {
      this.filteredCoauthor = this.filteredCoauthorName.filter((node) => {
        return new RegExp(name.toLocaleLowerCase()).test(
          node.displayName.toLocaleLowerCase()
        );
      });
    } else {
      this.filteredCoauthor = null;
    }
    //console.log("this.filteredCoauthor", this.filteredCoauthor);
  }

  setDisciplineData($event: any) {
    if ($event[0]) {
      this.createDocumentService.getDisciplineCode($event[0].rowNo).subscribe((res) => {
        this.selectedDisciplineCode = (res) ? res : '';
        this.selectedDisciplineValue = ($event[0]) ? $event[0].name : '';
        this.advanceSearchForm.patchValue({
          disciplineCode: (this.selectedDisciplineCode) ? this.selectedDisciplineCode.code : '',
        });
      });
    }
  }

}
