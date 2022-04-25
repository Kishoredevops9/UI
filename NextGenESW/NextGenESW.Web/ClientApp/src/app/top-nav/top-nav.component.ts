import { Component, EventEmitter, OnInit, Output, ViewChild, ViewEncapsulation, Input, ElementRef, HostListener } from '@angular/core';
import { TodoItemsListService } from '../dashboard/todo-items-list/todo-items-list.service';
import { SharedService } from '../shared/shared.service';
import { PersistanceService } from '../shared/persistance.service';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, NgForm, FormControl } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router, Event, NavigationStart, ActivationStart } from '@angular/router';
import { FeedbackComponent } from '../feedback/feedback.component';
import { LobbyHomeService } from '../lobby-home/lobby-home.service';
import {
  WiDropDownList, WiDisciplineDropDownList, GetClassifiersDropDownList,
  TagList
} from '@app/create-document/create-document.model';
import { CreateDocumentService } from '@app/create-document/create-document.service';
import { ActivityPageService } from '@app/activity-page/activity-page.service';
import { AdminService } from '@app/admin/admin.service';
import { allEKSCollection } from '@environments/constants';
import { DatePipe } from '@angular/common';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectMetaDataDisciplineCode, selectSetOfPhasesList, selectUserList } from '@app/reducers/common-list.selector';
let datePipe = new DatePipe("en-US");
@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TopNavComponent implements OnInit {
  count: number;
  collection: any;
  totalBadgeItems;
  todoItemsListData;
  userMail;
  searchTerm = '';
  placeholder = 'Search';
  @Output() public found = new EventEmitter<any>();
  dialog: any;
  advterm = '';
  userHelpItems: any;
  userGuides: any = ["User Guide - 5", "User Guide - 4", "User Guide - 3"];
  userGuidesLevel1: any = [];
  userGuidesLevel2: any = [];
  userGuidesv1: any = ["User Guide - 5", "User Guide - 4", "User Guide - 3"];
  allHelpRequest = "H";
  userGuideRequest = "U";
  userGuideChilds: any;
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
  advsearchDoc: any;
  advTable$: any;
  componenttypename: any = '';
  contentidname: any = '';
  contentname: any;
  contentid: any;
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
  showFeedbackMenu: boolean = false;
  feedbackMenuLeft;
  feedbackMenuTop;
  buttonTop;
  buttonLeft;
  openFeedbackData = [];
  pageId: any = 0;
  matchData;
  tooltip;

  helpCallCounter = 0;
  helpIdData: any;
  getAllHelpPagesData: any;
  helpDataOnly: any;
  currentToken: any;
  helpFirstData: any;
  helpDataItem = '';
  discipline: any;
  selectedDisciplineCode: any;
  selectedDisciplineValue: any = '';

  filteredCoauthor: any;
  filteredCoauthorName: any;

  @Input() topNavisAdmin: boolean = false;
  constructor(
    private router: Router,
    private todoItemsListService: TodoItemsListService,
    private sharedData: SharedService,
    private profileData: PersistanceService,
    private http: HttpClient,
    public dialogFeedback: MatDialog,
    private lobbyHomeService: LobbyHomeService,
    private createDocumentService: CreateDocumentService,
    private formBuilder: FormBuilder,
    private activityPageService: ActivityPageService,
    public dialog3: MatDialog,
    public adminService: AdminService,
    private eRef: ElementRef,
    private store: Store<any>
  ) {
    this.loadDropDowndata();
    this.adminService.getAllToolTip().subscribe((data) => {
      this.tooltip = data
      setTimeout(() => {
        this.setToolTip()
        //console.log("Tooltip Added")
      }, 1000)
    })
  }
  // @HostListener('document:click', ['$event'])
  // clickout(event) {
  //   if(!this.eRef.nativeElement.contains(event.target)) {
  //     this.showSearch = false;
  //   }
  // }
  ngOnInit(): void {
    this.allEKSCollection = allEKSCollection;
    this.router.events.subscribe((data) => {
      if (data instanceof ActivationStart) {
        this.pageId = (data.snapshot.data && data.snapshot.data.id) ? data.snapshot.data.id : 0;
        // console.log(this.pageId);
        this.helpOnThisPageFunc(this.pageId);

      }

    });
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
      'eksExternal': ''
    });
    this.eksCollectionForm = this.formBuilder.group({
      'eksCollection': ''
    })
    this.loadUserGuide();
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {

      }
    });
    this.href = this.router.url;
    this.profileData.currentProfile.subscribe((data) => {
      this.userMail = data.mail;
    });
    let email = sessionStorage.getItem('userMail');
    this.trackTodoData();
    const gSearchUrl = window.location.href;
    if (gSearchUrl.includes('/_search')) {
      var querySearch = window.location.href.split('=');
      let searchQueryString = querySearch[0]?.split("_search?", 2);
      this.searchTerm = (searchQueryString[1] == 'q') ? querySearch[1] : '';
    }
  }

  helpOnThisPageFunc(pageIdCurrent) {
    this.helpCallCounter = this.helpCallCounter + 1;


    if (this.helpCallCounter > 2) {

      if (this.getAllHelpPagesData && this.getAllHelpPagesData.length > 0 && this.helpDataOnly && this.helpDataOnly.length > 0) {
        if (pageIdCurrent == 0) {
          this.helpDataItem = '';
        } else {
          this.currentToken = this.getAllHelpPagesData.filter((helpPage) => {
            return (helpPage.tokenId == pageIdCurrent)
          });

          if (this.currentToken.length > 0) {
            this.helpFirstData = this.helpDataOnly.filter((helpOnly) => {
              return (helpOnly.title == this.currentToken[0].title);
            });
            // console.log(this.helpFirstData);
            if (this.helpFirstData.length > 0) {
              this.helpDataItem = this.helpFirstData[0];
            } else {
              this.helpDataItem = '';
            }

          }
        }

      }

    } else if (this.helpCallCounter <= 2) {
      this.helpCallCounter = this.helpCallCounter + 1;


      this.adminService.getAllEKSHelpPage().subscribe((data) => {

        this.getAllHelpPagesData = data;

        this.adminService.getAllEKSHelp().subscribe((items) => {

          this.helpDataOnly = items;
          this.userHelpItems = items;

          this.currentToken = this.getAllHelpPagesData.filter((helpPage) => {
            return (helpPage.tokenId == pageIdCurrent)
          });

          if (this.currentToken.length > 0) {
            this.helpFirstData = this.helpDataOnly.filter((helpOnly) => {
              return (helpOnly.title == this.currentToken[0].title);
            });

            if (this.helpFirstData.length > 0) {
              this.helpDataItem = this.helpFirstData[0];
            } else {
              this.helpDataItem = '';
            }

          }

        });

      });
    }



  }

  loadDropDowndata() {
    this.subscription = this.store.select(selectMetaDataDisciplineCode).subscribe(res => this.WIDisciplineCodeList = res);
    // this.subscription = this.createDocumentService.getClassifiersList()
    //   .subscribe((res) => {
    //     this.classifiersDropDownList = res;
    //   });
    this.createDocumentService.getAllMetaDiscipline().subscribe((response) => {
      this.discipline = response;
    });
    this.store.select(selectUserList).subscribe((response) => {
      this.filteredCoauthorName = response;
    });
    this.subscription = this.store.select(selectSetOfPhasesList).subscribe((res) => {
      this.setOfPhasesList = res;
    });
    this.subscription = this.activityPageService.getTagList()
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
      //console.log("topNavisAdmin", this.topNavisAdmin);
      if (this.topNavisAdmin) {
        this.feedbackBadges();
      }
    });
  }
  // Feedback count adding in TotalBadgeItem
  feedbackBadges() {
    this.adminService.getAllEKSFeedbacks().subscribe((data) => {
      this.openFeedbackData = [];
      let countOpenFeedbacks = 0;
      let getAllFeedback = data;
      Object.keys(getAllFeedback).forEach(key => {
        if (getAllFeedback[key].isActive == true && getAllFeedback[key].status != 'Closed') {
          countOpenFeedbacks = countOpenFeedbacks + 1;
          this.openFeedbackData.push(getAllFeedback[key]);
        }
      });
      this.totalBadgeItems = this.totalBadgeItems + countOpenFeedbacks;
      this.openFeedbackData.reverse();
    });
  }
  navigateToDashboard() {
    this.sharedData.sendValue(false);
    this.router.navigate(['/dashboard']);
  }
  keyDownFunction(event) {
    if (event.keyCode === 13) {
      this.searchTerm ? this.router.navigate(['_search'], { queryParams: { q: this.searchTerm } }) : this.router.navigate(['/dashboard']);
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
  // openModal(mytemplate) {
  //   let dialogRef = this.dialog3.open(mytemplate, {
  //     width: '', height: '',
  //     // data: { name: this.name, animal: this.animal }
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     // this.animal = result;
  //   });
  //   this.setToolTip()
  // }
  navigateToUserGuides() {
    window.open('/user-guides');
  }
  navigateToRequestAdminHelp() {
    window.open("https://unitedtechnologiescorporation.service-now.com/sp");
  }
  feedbackPopup(values, helpRequestType) {
    const dialogRefFeedback = this.dialogFeedback.open(FeedbackComponent, {
      width: '40%',
      height: 'auto',
      data: {
        element: values,
        helpType: helpRequestType
      }
    });
    dialogRefFeedback.afterClosed().subscribe((result) => {
    });
  }
  loadUserGuide() {
    this.lobbyHomeService.getAllUserGuides().subscribe((data) => {
      this.userGuides = data;
      this.userGuidesv1 = data;
      this.userGuides.forEach(element => {
        this.userGuidesLevel1.push(element.children);
      });
      this.userGuidesLevel2 = this.userGuidesLevel1[0];
    }
    );
  }
  navigateTo(values) {
  }
  openHelpMenu() {
  }
  openHereMenu(event) {
    this.showMenus = true;
    this.splMenu = false;
    this.menuOffsetLeft = event.clientX - 140;
    this.menuOffsettop = 64;
    this.expansionLeft = event.clientX;
    this.expansionTop = 170;
  }
  hideMenus() {
    this.showMenus = false;
    this.splMenu = true;
  }
  openHelps() {
    this.splMenu = true;
  }

  openFeedbackMenu(event) {
    if (this.topNavisAdmin && this.openFeedbackData && this.openFeedbackData.length > 0) {
      this.showFeedbackMenu = true;
      this.buttonLeft = document.getElementById('bellIcons').offsetLeft;
      this.buttonTop = document.getElementById('bellIcons').offsetTop;
      this.feedbackMenuLeft = this.buttonLeft - 274;
      this.feedbackMenuTop = this.buttonTop + 72;
    }
  }

  closeFeedbackMenu() {
    this.showFeedbackMenu = false;
  }
  moveToFeedback() {
    this.showFeedbackMenu = false;
    this.router.navigate(['/admin/open-feedback']);
  }
  moveToDashboard() {
    this.showFeedbackMenu = false;
    this.sharedData.sendValue(false);
    this.router.navigate(['/dashboard']);
  }
  advanceSearch() {
    this.showSearch = !this.showSearch;
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
