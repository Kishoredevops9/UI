import { Component, OnInit, Inject, ViewChild, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Item, WICDdocList } from '../../../activity-page.model';
import { Subscription } from 'rxjs';
import { ActivityPageService } from '@app/activity-page/activity-page.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Constants, documentPath, oldContentTypeCode, contentTypeCode, assetTypeConstantValue } from '@environments/constants';
import { ActivatedRoute, Router } from '@angular/router';
import { TodoItemsListService } from '@app/dashboard/todo-items-list/todo-items-list.service';
import { environment } from '@environments/environment';
import { EventEmitter } from 'stream';
@Component({
  selector: 'app-addons-popup',
  templateUrl: './addons-popup.component.html',
  styleUrls: ['./addons-popup.component.scss']
})
export class AddonsPopupComponent implements OnInit {
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginator2') paginator2: MatPaginator;
  @ViewChild('paginator3') paginator3: MatPaginator;
  hclenv = environment.hclenv;
  citrus: any;
  pageRowCounters = environment.pageRowCounters;
  isLoading = false;
  disableObsoleteDocuments = false;
  addons: any;
  allData = [];
  selectedAddons = [];
  ctTitle: any = '';
  ctDescription: any = '';
  ctContentId: any = '';
  addonsTable$: any;
  eksaddonsTable$: any;
  eksGlobalData$: any = '';
  items = ['EKS Addons'];
  type: any;
  contentSelected: boolean = false;
  showEksPanel: boolean = false;
  displayedColumns: string[] = ['title', 'contentid', 'componenttype', 'purpose'];
  globalDisplayedColumns: string[] = ['arrow', 'title', 'type', 'link', 'publishDate'];
  pwPlayDisplayedColumns: string[] = ['arrow', 'title', 'description', 'count', 'publishDate'];
  ekssearchWICDDoc: any;
  eksRecords = [];
  restrictedContentIds = [];
  apiError: any = false;
  private subscription: Subscription;

  eksSearchDataCreated: any = '';
  eksSearchCountCreated: any;
  eksSearchTitleCreated: any = '';
  eksLeftSearchDataCreated: any = '';
  selectedIndex = 0;
  leftSideContentData;
  eksAddOnSearchData;
  eksAddOnInternalSearchData;
  eksGlobalSearchData;
  eksGlobalSearchCount;
  eksPWPlayData$: any = '';
  eksPWPlaySearchCount;
  eksPWPlaySearchData;
  startAt: number = 0;
  startEnd: number = 10;
  pageSize: number = 10;
  globalLength: number = 0;
  searchTerm: any;
 
  disableAPSFSP:any;
  eksPopupSearchData:any;
  eksPopupPhaseData:any;
  advsearchDoc:any;
  eksAdvanceSearchData:any;

 
  constructor(private dialogRef: MatDialogRef<AddonsPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private todoItemsListService: TodoItemsListService,
    private activityPageService: ActivityPageService) {
    // this.allData = data.doc;
    this.ctContentId = data.ctContentId;
    this.type = data.type;
    this.ctTitle = data.ctTitle;
    this.ctDescription = data.ctDescription;
    this.showEksPanel = data.showEksPanel;
    this.disableAPSFSP = data.disableAPSFSP;
    this.restrictedContentIds = data.restrictedContentIds || [];
    this.disableObsoleteDocuments = !!data.disableObsoleteDocuments;
  }

  ngOnInit(): void {
    console.log('-----hclenv---', this.hclenv);

    this.apiError = false;
    this.contentSelected = false;
    console.log("ngOnInit this.type", this.type);
    if (!this.showEksPanel && this.type != '') {
      this.eksRecords = [];
      this.isLoading = true;
      this.subscription = this.activityPageService
        .getEkssearchWICDDocList(this.ctContentId, this.type, this.ctTitle, this.ctDescription)
        .subscribe((res) => {
          this.ekssearchWICDDoc = res;
          this.isLoading = false;
          const hitItems = this.ekssearchWICDDoc.hits?.hits || [];
          const disabledTypes = this.disableAPSFSP === 'AP_SF_SP_not' ? ['A', 'S', 'P'] : [];
          this.eksRecords = hitItems
            .map(item => item._source)
            .filter(item => !disabledTypes.includes(item.assettypecode));
          console.log("getEkssearchWICDDocList", this.eksRecords);

          this.addonsTable$ = this.eksRecords;
          this.eksAddOnSearchData = [...this.addonsTable$]
          this.eksSearchCountCreated = (this.eksRecords.length > 0) ? this.eksRecords.length : 0;
          this.eksPopupSearchData = this.addonsTable$;
          this.eksAddOnInternalSearchData = new MatTableDataSource(this.addonsTable$);
          this.eksAddOnInternalSearchData.paginator = this.paginator;
        }, (error) => {
          console.error('There was an error!', error);
          this.apiError = true;
        });
    }
  }


  closeModal(button: any) {
    this.dialogRef.close(button);
  }

  onChange(event, element) {
    if (event.checked) {
      this.selectedAddons.push(element)
    } else {
      this.selectedAddons = this.selectedAddons.filter((child) => {
        if (child.title !== element.title) {
          return child;
        }
      });
    }
  }

  selectAddOns(type) {
    this.contentSelected = true;
    this.type = type;
  }

  submit() {
    this.dialogRef.close(this.selectedAddons);
  }

  getSearchContentType(contentType) {
    this.leftSideContentData = [...this.eksAddOnSearchData]
    let contentTypeContentData = this.leftSideContentData.filter(function (element) {
      return contentType.indexOf(element.assettypecode) > -1;
    });
    this.addonsTable$ = (contentTypeContentData.length >= 0 && contentType.length > 0) ? contentTypeContentData : (this.leftSideContentData.length > 0) ? this.leftSideContentData : '';
    if ( this.disableObsoleteDocuments ) {
      this.addonsTable$ = this.addonsTable$.filter(item => item.assetstatus !== 'Obsolete');
    }
    this.eksSearchCountCreated = this.addonsTable$.length;
    console.log("getSearchContentType", this.addonsTable$);
    this.eksAddOnInternalSearchData = new MatTableDataSource(this.addonsTable$);
    this.eksAddOnInternalSearchData.paginator = this.paginator;
  }

  getSearchFilterType(contentType) {
    this.leftSideContentData = [...this.eksAddOnSearchData]
    let contentPhaseId = contentType.phaseid;
    let contentTagId = contentType.tagsid;
    let contentTypeFilterData = this.leftSideContentData.filter(function (element) {
      return contentTagId.indexOf(element.tagsid) > -1;
    });
    //console.log("contentTypeFilterData addon length", contentTypeFilterData.length);
    this.addonsTable$ = (contentTypeFilterData.length > 0) ? contentTypeFilterData : (this.leftSideContentData.length > 0) ? this.leftSideContentData : '';
    if ( this.disableObsoleteDocuments ) {
      this.addonsTable$ = this.addonsTable$.filter(item => item.assetstatus !== 'Obsolete');
    }
    this.eksSearchCountCreated = this.addonsTable$.length;
    console.log("getSearchFilterType", this.addonsTable$);
    this.eksAddOnInternalSearchData = new MatTableDataSource(this.addonsTable$);
    this.eksAddOnInternalSearchData.paginator = this.paginator;
  }

  eksSearchOutput(eksSearchOutput: any[]) {
    // CuongPHAM: The following code need to be refactored, 
    // ===toRefactorStart===
    const nonRestrictedResults = eksSearchOutput.map(item => {
      if (this.restrictedContentIds.indexOf(item.contentid) > -1) {
        item.isSelected = true;
      }
      return item;
    });
    // ===toRefactorEnd===
    // If disableAPSFSP is indicated, need to exclude results in corresponding types
    const toExcludeTypes = this.disableAPSFSP == 'AP_SF_SP_Not' ? ['A', 'P', 'F'] : [];
    this.addonsTable$ = nonRestrictedResults.filter(item => !toExcludeTypes.includes(item.assettypecode));
    this.eksaddonsTable$ = this.addonsTable$;
    this.eksAddOnSearchData = [...this.addonsTable$];
    this.addonsTable$ = nonRestrictedResults;
    this.eksaddonsTable$ = this.addonsTable$;
    this.eksAddOnSearchData = [...this.addonsTable$];

    if (this.disableObsoleteDocuments) {
      this.eksaddonsTable$ = this.eksaddonsTable$.filter(item => item.assetstatus !== "Obsolete")
    }

    console.log("eksSearchOutput", this.eksaddonsTable$);
    this.eksPopupSearchData = this.eksaddonsTable$;
    this.eksPopupPhaseData = eksSearchOutput && eksSearchOutput['aggregations'] ? eksSearchOutput['aggregations'] : '';
    this.eksAddOnInternalSearchData = new MatTableDataSource(this.eksaddonsTable$);
    this.eksAddOnInternalSearchData.paginator = this.paginator;
  }

  eksGlobalSearchOutput(eksGlobalSearchOutput) {
    this.eksGlobalData$ = eksGlobalSearchOutput['hits']['hits'];
    this.eksGlobalSearchCount = this.eksGlobalData$.length;
    this.eksGlobalSearchData = new MatTableDataSource(this.eksGlobalData$);
    this.eksGlobalSearchData.paginator = this.paginator2;
  }

  eksGlobalSearchTermOutput(eksGlobalSearchTermOutput) {
    this.searchTerm = (eksGlobalSearchTermOutput && eksGlobalSearchTermOutput.length > 0) ? eksGlobalSearchTermOutput : '';
    (this.searchTerm && this.searchTerm.length > 0) ? this.getEKSGloablSearchData() : '';
  }

  getEKSGloablSearchData() {
    if (this.searchTerm && this.searchTerm.length > 0) {
      //this.todoItemsListService.getGlobalSearchDataLocal(this.searchTerm, this.startAt, this.startEnd, this.pageSize).subscribe(data => {

      if (this.hclenv == 'hcl') {
        this.todoItemsListService.getGlobalSearchDataOnCallLocal(this.searchTerm, this.startAt, this.startEnd, this.pageSize).subscribe(data => {
          this.eksGlobalData$ = data['results'];
          console.log('data from API in global tab data count', this.eksGlobalData$);

          this.citrus = this.eksGlobalData$.slice(this.startAt, this.startEnd);
          // console.log('this.citrus',this.citrus);
          // console.log(' startNumber',startNumber);
          // console.log(' this.startEnd',this.startEnd);
          //let pushData:any= this.citrus;
          //this.globalSearchData.push(pushData);
          this.eksGlobalData$ = this.citrus;
          console.log('afterslice API in global tab data count', this.eksGlobalData$);

          if (this.globalLength === 0) {
            this.globalLength = (data['total_results'] > 0) ? data['total_results'] : 0;
          }
          //this.eksGlobalSearchCount.emit(this.globalLength);
          this.eksGlobalSearchData = new MatTableDataSource(this.eksGlobalData$);
          this.eksGlobalSearchData.paginator = this.paginator2;

          this.eksGlobalSearchCount = (data['total_results'] > 0) ? data['total_results'] : 0;
        });
      }
      else {

        let textbox = this.searchTerm.split("&tags=&a")[0].split("searchText=")[1];
        this.todoItemsListService.getGlobalSearchDataOnCall( textbox , this.startAt, this.startEnd, this.pageSize).subscribe(data => {
          this.eksGlobalData$ = data['results'];
          this.eksGlobalSearchData = new MatTableDataSource(this.eksGlobalData$);
          this.eksGlobalSearchData.paginator = this.paginator2;
          if (this.globalLength === 0) { this.globalLength = (data['total_results'] > 0) ? data['total_results'] : 0; }
          this.eksGlobalSearchCount = (data['total_results'] > 0) ? data['total_results'] : 0;
        });

      }




      // this.todoItemsListService.getGlobalSearchDataOnCall(this.searchTerm, this.startAt, this.startEnd, this.pageSize).subscribe(data => {
      //   this.eksGlobalData$ = data['results'];
      //   this.eksGlobalSearchData = new MatTableDataSource(this.eksGlobalData$);
      //   this.eksGlobalSearchData.paginator = this.paginator2;
      //   if (this.globalLength === 0) { this.globalLength = (data['total_results'] > 0) ? data['total_results'] : 0; }
      //   this.eksGlobalSearchCount = (data['total_results'] > 0) ? data['total_results'] : 0;
      // });





    }
  }

  eksAddonGlobalSearchPagination(event: PageEvent) {
    this.startAt = (event.pageSize * event.pageIndex) + 1;
    this.startEnd = (event.pageIndex + 1) * event.pageSize;
    this.pageSize = event.pageSize;
    this.globalLength = this.globalLength;
    this.getEKSGloablSearchData();
    console.log("this.pageSize, this.startAt + this.startEnd + this.globalLength", this.pageSize, this.startAt, this.startEnd, this.globalLength);
  }

  eksPWPlaySearchOutput(eksPWPlaySearchOutput) {
    this.eksPWPlayData$ = eksPWPlaySearchOutput;
    this.eksPWPlaySearchCount = this.eksPWPlayData$.length;
    this.eksPWPlaySearchData = new MatTableDataSource(this.eksPWPlayData$);
    this.eksPWPlaySearchData.paginator = this.paginator3;
  }

  eksSearchCount(eksSearchCount) {
    if(this.disableAPSFSP == 'AP_SF_SP_Not' || this.disableObsoleteDocuments) {
      this.eksSearchCountCreated = this.eksaddonsTable$.length + ' Result';
    } else {
      this.eksSearchCountCreated = eksSearchCount + ' Result';
    }

  }

  eksSearchTitle(eksSearchTitle) {
    this.eksSearchTitleCreated = eksSearchTitle;
  }

  eksLeftSearchData(eksLeftSearchData) {
    this.eksLeftSearchDataCreated = eksLeftSearchData;
  }

  nextTab(redirect) {
    if (redirect) {
      this.selectedIndex = this.selectedIndex + 1;
    }
  }

  onTabClick(indexNumber) {
    setTimeout(() => {
      switch (indexNumber) {
        case 0:
          !this.eksAddOnInternalSearchData.paginator
            ? (this.eksAddOnInternalSearchData.paginator = this.paginator)
            : null;
          break;
        case 1:
          !this.eksGlobalSearchData.paginator
            ? (this.eksGlobalSearchData.paginator = this.paginator2)
            : null;
          break;
        case 2:
          !this.eksPWPlaySearchData.paginator
            ? (this.eksPWPlaySearchData.paginator = this.paginator3)
            : null;
          break;
      }
    });
  }

  handleOnContentIDClick(element) {
    let contentType = (element.assettypecode == "I") ? "WI" : (element.assettypecode == "G") ? "GB" : (element.assettypecode == "S") ? "DS" : (element.assettypecode == "A") ? "AP" : (element.assettypecode == "C") ? "CG" : (element.assettypecode == "K") ? "KP" : (element.assettypecode == "R") ? "RC" : (element.assettypecode == "T") ? "TOC" : '';
    sessionStorage.setItem('componentType', contentType);
    sessionStorage.setItem('contentNumber', element.contentid);
    sessionStorage.setItem('contentType', 'published');
    sessionStorage.setItem('redirectUrlPath', 'search');
    sessionStorage.setItem('statusCheck', 'true');

    if (element.assettypecode == 'I' || element.assettypecode == 'G' || element.assettypecode == 'S' || element.assettypecode == 'D') {
      //this.router.navigate([documentPath.publishViewPath, element.contentid]);
      window.open(documentPath.publishViewPath + '/' + element.contentid, '_blank');
    } else if (element.assettypecode === 'M' || element.assettypecode === 'Map') {
      window.open('/process-maps/edit/' + element.contentnumber, '_blank');
      //this.router.navigate(['/process-maps/edit', element.contentnumber]);
    } else {
      var assetTypecode = (element.assettypecode === 'A') ? "AP" : (element.assettypecode === 'K') ? "KP" : (element.assettypecode === 'T') ? "TOC" : (element.assettypecode === 'R') ? "RC" : (element.assettypecode === 'C') ? "CG" : (element.assettypecode === 'P') ? "SP" : (element.assettypecode === 'F') ? "SF" : '';
      window.open(documentPath.publishViewPath + '/' + assetTypecode + '/' + element.contentid, '_blank');
      //this.router.navigate([documentPath.publishViewPath, assetTypecode, element.contentid]);
    }
  }

  removeHTMLTags(string: any) {
    if ((string === null) || (string === ''))
      return false;
    else
      string = string.toString();
    return string.replace(/(<([^>]+)>)/ig, '');
  }

  formatPurposeData(string: any) {
    if ((string === null) || (string === ''))
      return "NA";
    else
      string = string.toString();
    let purposeData = JSON.parse(string);
    return purposeData.PurposeDescription;
  }

}
