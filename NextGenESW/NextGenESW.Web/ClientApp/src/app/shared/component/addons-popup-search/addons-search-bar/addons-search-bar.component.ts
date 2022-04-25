import { Component, EventEmitter, OnInit, Output, ViewChild, ViewEncapsulation, Input, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, NgForm } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { WiDropDownList, WiDisciplineDropDownList, GetClassifiersDropDownList, TagList } from '@app/create-document/create-document.model';
import { CreateDocumentService } from '@app/create-document/create-document.service';
import { ActivityPageService } from '@app/activity-page/activity-page.service';
import { allEKSCollection } from '@environments/constants';
import { Store } from '@ngrx/store';
import { selectClassifiersList, selectMetaDataDisciplineCode, selectSetOfPhasesList } from '@app/reducers/common-list.selector';
import { AddonsPopupSearchStore } from '../addons-popup-search.store';
import { initEksQueryObject } from '../addons-popup-search.state';
import { TodoItemsListService } from '@app/dashboard/todo-items-list/todo-items-list.service';
import { SharedService } from '@app/shared/shared.service';
import { PersistanceService } from '@app/shared/persistance.service';

@Component({
  selector: 'app-addons-search-bar',
  templateUrl: './addons-search-bar.component.html',
  styleUrls: ['./addons-search-bar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AddonsSearchBarComponent implements OnInit {
  searchText$ = this.addonsPopupSearchStore.searchText$;
  advancedSearchEnabled$ = this.addonsPopupSearchStore.advancedSearchEnabled$;

  onSearchTermChanged() {
    this.addonsPopupSearchStore.patchState(state => ({
      eksQueryObject: {
        ...initEksQueryObject,
        searchText: state.searchText,
        onAdvancedSearch: false
      },
      globalQueryObject: {
        ...state.globalQueryObject,
        query: state.searchText
      },
      pwPlayQueryObject: {
        ...state.pwPlayQueryObject,
        query: state.searchText
      }
    }))
  }

  onChangeSearchText(searchText: string) {
    this.addonsPopupSearchStore.patchState({ searchText: searchText })
  }

  showDropDown = false;
  totalBadgeItems;
  todoItemsListData;
  userMail;
  placeholder = 'Search';
  @Output() public found = new EventEmitter<any>();
  @Output() eksSearchOutput = new EventEmitter<any>();
  @Output() eksSearchCount = new EventEmitter<any>();
  @Output() eksSearchTitle = new EventEmitter<any>();
  @Output() eksLeftSearchData = new EventEmitter<any>();
  @Output() eksGlobalSearchOutput = new EventEmitter<any>();
  @Output() eksGlobalSearchTermOutput = new EventEmitter<any>();
  @Output() eksPWPlaySearchOutput = new EventEmitter<any>();
  @Input() stepPopUp: string;
  dialog: any;
  advterm = '';
  userHelpItems: any;
  wiDisciplineCodeList: WiDisciplineDropDownList[];
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

  eksCollection = new FormControl();

  private subscription: Subscription;
  controlsData = {};
  advsearchDoc: any;
  advTable$: any;
  eksAdvanceSearchData: any;
  eksSearchData: any;
  contentname: any;
  contentid: any;
  loading = true
  public href: string = "";
  newClassData: any;
  eksAddOnGlobalSearchData: any;
  allEKSCollection;
  showSearch: boolean = false;
  eksAddOnPWPlaySearchData: any;
  startAt: number = 0;
  startEnd: number = 10;
  pageSize: number = 10;
  complist: string;
  advsearch: any;
  querySearch2: any;
  searchList: string;
  discipline: any;
  searchTerm: string;
  selectedDisciplineCode: any;
  selectedDisciplineValue: any = '';

  constructor(
    private addonsPopupSearchStore: AddonsPopupSearchStore,
    private router: Router,
    private todoItemsListService: TodoItemsListService,
    private sharedData: SharedService,
    private profileData: PersistanceService,
    private http: HttpClient,
    private createDocumentService: CreateDocumentService,
    private formBuilder: FormBuilder,
    private activityPageService: ActivityPageService,
    private eRef: ElementRef,
    private store: Store<any>,
    public dialog3: MatDialog) {
    this.loadDropDowndata();

    this.sharedData.eksLoadAll.subscribe(() => {

      // assettypecode:("I","G","S","K","C","R")
      console.log("call Eks Load")

      this.subscription = this.todoItemsListService
        .getAdvanceSearchData('assettypecode:("I","G","S","K","C","R")')
        .subscribe((res) => {
          this.advsearchDoc = [];
          this.eksAdvanceSearchData = res['hits']['hits'];
          if (this.eksAdvanceSearchData.length) {
            this.eksAdvanceSearchData.forEach(element => {
              this.advsearchDoc.push(element._source)
            });
            let advsearchDoc_Data = res;
            this.eksSearchOutput.emit(advsearchDoc_Data);
            this.eksSearchCount.emit(this.advsearchDoc.length);
            this.eksLeftSearchData.emit(this.eksAdvanceSearchData);
          } else {
            this.eksSearchOutput.emit('');
            this.eksSearchCount.emit(0);
            this.eksLeftSearchData.emit('');
          }
          this.advTable$ = this.advsearchDoc;
          //("#myModal").modal("hide");
          // this.router.navigate(['_search'], {
          //   queryParams: { q: (queryString) },
          // });
        });

    })
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
    } else if (this.stepPopUp == 'AP_SF_SP_Not') {
      let content;
      content = allEKSCollection.filter((child) => {
        let childCode = child.code ? child.code.toLowerCase() : '';
        if (child.code && 'sf' != childCode && 'sp' != childCode && 'ap' != childCode) {
          return child;
        }
      });
      this.allEKSCollection = content;
    } else {
      this.allEKSCollection = allEKSCollection;
    }

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
      'eksExternal': ''
    });

    this.eksCollectionForm = this.formBuilder.group({
      'eksCollection': ''
    })

    this.href = this.router.url;
    this.profileData.currentProfile.subscribe((data) => {
      this.userMail = data.mail;
    });
    let email = sessionStorage.getItem('userMail');
    this.trackTodoData();
    const gSearchUrl = window.location.href;
    if (gSearchUrl.includes('/_search')) {
      var querySearch = window.location.href.split('=');
      this.searchTerm = querySearch[1];
    }

    if (this.searchList === '') { }

    const advSearchUrl = window.location.href;
    if (advSearchUrl.includes('/_search')) {
      var querySearch2 = window.location.href.split('=');
      this.advterm = querySearch2[1];
    }
    //console.clear();
  }


  // @HostListener('document:click', ['$event'])
  // clickout(event) {
  //   if (!this.eRef.nativeElement.contains(event.target)) {
  //     this.showSearch = false;
  //   }
  // }

  loadDropDowndata() {
    this.subscription = this.store
      .select(selectMetaDataDisciplineCode)
      .subscribe((res) => {
        this.wiDisciplineCodeList = res;
      });
    this.createDocumentService.getAllMetaDiscipline().subscribe((response) => {
      this.discipline = response;
    });
    this.subscription = this.store.select(selectClassifiersList)
      .subscribe((res) => {
        this.classifiersDropDownList = res;
      });
    this.subscription = this.store.select(selectSetOfPhasesList).subscribe((res) => {
      this.setOfPhasesList = res;
    });
    this.subscription = this.activityPageService
      .getTagList()
      .subscribe((res) => {
        this.tagList = res;
      });
  }

  ngOnDestroy() {
    this.searchTerm = '';
  }

  trackTodoData() {
    this.totalBadgeItems = 0;
    this.todoItemsListService.getTaskItemsList().subscribe((data) => {
      this.todoItemsListData = data;
      this.todoItemsListData.forEach((element) => {
        if (element.isDone == false) {
          this.totalBadgeItems += 1;
        }
      });
    });
  }

  navigateToDashboard() {
    this.sharedData.sendValue(false);
    this.router.navigate(['/dashboard']);
  }

  keyDownFunction(event) {
    if (event.keyCode === 13) {
      this.searchTerm ? this.router.navigate(['_search'], { queryParams: { q: this.searchTerm }, })
        : this.router.navigate(['/dashboard']);
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
      phaseid: (this.advanceSearchForm.controls.phases.value.length > 0) ? this.advanceSearchForm.controls.phases.value : '',
      tagsid: (typeof tagSelectedId !== 'undefined' && tagSelectedId.length > 0) ? tagSelectedId : '',
      version: this.advanceSearchForm.controls.version.value,
      keywords: this.advanceSearchForm.controls.keyword.value,
      tpmdate: this.advanceSearchForm.controls.tpmDate.value,
      eksinternal: this.advanceSearchForm.controls.eksInternal.value,
      eksexternal: this.advanceSearchForm.controls.eksExternal.value
    };
    this.showSearch = false;
    this.getAdvanceSearchSectionData();
  }

  openModal(mytemplate) {
    let dialogRef = this.dialog3.open(mytemplate, {
      width: '', height: '',
      // data: { name: this.name, animal: this.animal }
    });
    dialogRef.afterClosed().subscribe(result => {
      // this.animal = result;
    });
  }

  navigateToUserGuides() {
    window.open('/user-guides');
  }

  navigateToRequestAdminHelp() {
    window.open("https://unitedtechnologiescorporation.service-now.com/sp");
  }

  getAdvanceSearchSectionData() {
    var params = [];
    for (var key in this.controlsData) {
      if (this.controlsData.hasOwnProperty(key) && this.controlsData[key]) {
        if (key == 'assettypecode') {
          params.push(key + ':(' + '"' + this.controlsData['assettypecode'].join('","') + '"' + ')');
        } else {
          params.push(key + ":(" + this.controlsData[key] + ")")
        }
      }
    }
    var queryString = params.join("AND ");
    console.log(queryString)

    // assettypecode:("I","G","S","K","C","R")


    this.subscription = this.todoItemsListService
      .getAdvanceSearchData(queryString)
      .subscribe((res) => {
        this.advsearchDoc = [];
        this.eksAdvanceSearchData = res['hits']['hits'];
        if (this.eksAdvanceSearchData.length) {
          this.eksAdvanceSearchData.forEach(element => {
            this.advsearchDoc.push(element._source)
          });
          let advsearchDoc_Data = res;
          this.eksSearchOutput.emit(advsearchDoc_Data);
          this.eksSearchCount.emit(this.advsearchDoc.length);
          this.eksLeftSearchData.emit(this.eksAdvanceSearchData);
        } else {
          this.eksSearchOutput.emit('');
          this.eksSearchCount.emit(0);
          this.eksLeftSearchData.emit('');
        }
        this.advTable$ = this.advsearchDoc;
        //("#myModal").modal("hide");
        // this.router.navigate(['_search'], {
        //   queryParams: { q: (queryString) },
        // });
      });
  }

  getSearchSectionData(queryString) {

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
    for (var key in this.controlsData) {
      if (this.controlsData.hasOwnProperty(key) && this.controlsData[key]) {

        var re: any = /^[a-zA-Z]{2,3}-[A-Za-z]-\d{6}$/;
        if (re.test(this.searchTerm)) {
          //console.log("Valid");
          params.push(key + ':(' + '"' + this.controlsData[key] + '"' + ')')
        } else {
          //console.log("Invalid");
          params.push(key + ':(' + '' + this.controlsData[key] + '' + ')')
        }

      }
    }
    var QueryString = params.join(" OR ");

    this.sharedData.nextSearchTerm(this.searchTerm);
    //console.log("queryString response", queryString);
    this.subscription = this.todoItemsListService
      .getAdvanceSearchData(QueryString, this.searchTerm)
      .subscribe((res) => {
        this.advsearchDoc = [];
        this.eksSearchData = res['hits']['hits'];
        //console.log("this.eksSearchData length", this.eksSearchData.length);
        if (this.eksSearchData.length) {
          this.eksSearchData.forEach(element => {
            this.advsearchDoc.push(element._source)
          });
          let advsearchDoc_Data = res;
          this.eksSearchOutput.emit(this.advsearchDoc);
          this.eksSearchCount.emit(this.advsearchDoc.length)
          this.eksSearchTitle.emit(queryString);
          this.eksLeftSearchData.emit(this.eksSearchData);
        } else {
          this.eksSearchOutput.emit('');
          this.eksSearchCount.emit(0)
          this.eksSearchTitle.emit('');
          this.eksLeftSearchData.emit('');
        }
        this.advTable$ = this.advsearchDoc;
      });
  }

  onCollectionChangeEvent(event) {
    this.controlsData = (this.searchTerm) ? {
      assettypecode: (typeof event !== 'undefined' && event.length > 0) ? event : '',
      title: this.searchTerm
    } : {
      assettypecode: (typeof event !== 'undefined' && event.length > 0) ? event : ''
    }
    this.getAdvanceSearchSectionData();
  }

  advanceSearch() {
    this.addonsPopupSearchStore.patchState(state => ({
      advancedSearchEnabled: !state.advancedSearchEnabled
    }))
  }

  getEKSGloablSearchData() {
    if (this.searchTerm && this.searchTerm.length > 0) {
      this.eksGlobalSearchTermOutput.emit(this.searchTerm);
    }
  }

  getEKSPWPlaySearchData() {
    if (this.searchTerm) {
      this.todoItemsListService.getPWPlayData(this.searchTerm).subscribe(data => {
        this.eksAddOnPWPlaySearchData = data['videos'];
        this.eksPWPlaySearchOutput.emit(this.eksAddOnPWPlaySearchData);
      });
    }
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

  resetFilters() {
    this.chipData = [];
    this.selectedDisciplineValue = '';
    this.advanceSearchForm.reset();
  }


}
