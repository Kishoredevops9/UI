import { selectNewsList } from './../../reducers/index';
import { NewsListsState } from './news-list.reducer';
import { NewsList } from './news-list.model';
import { Observable } from 'rxjs';
import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as fromActions from './news-list.actions';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AdminService } from "../../../app/admin/admin.service";
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';
let datePipe = new DatePipe("en-US");

@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.scss'],
})
export class NewsListComponent implements OnInit {
  newsList$: Observable<NewsList[]>;

  fullView = false;
  public newsDataSource:any;

  totalRecords: number = 0 ;
  pageRowCounts = [10,20,50,this.totalRecords];

  dataSource: MatTableDataSource<NewsList>;

  // Output Event
  @Output() fullViewEvent = new EventEmitter();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['item', 'posted', 'type'];
  contentFilterForm: FormGroup;
  contentFilterArray = [];
  uniqueItem = [];
  uniqueType = [];
  uniquePosted = [];
  filterPopShow: boolean = false;
  taskDataSource:any;
  announceType:any;
  isValidDate:any;
  constructor(private store: Store<NewsListsState>, private ngxService: NgxUiLoaderService,
    public adminService : AdminService) {
    this.ngxService.startLoader("news-loader");
    this.contentFilterForm = new FormGroup({
      adminItem: new FormControl(),
      adminPosted: new FormControl(),
      adminType: new FormControl(),
      postedStartDate: new FormControl(),
      postedEndDate: new FormControl(),
    });
  }

  ngOnInit(): void {
    //this.store.dispatch(fromActions.loadNewsLists());
    this.loadGetAnnouncementsType();
  }

  loadGetAnnouncementsType(){
    this.adminService.getAnnouncementsType().subscribe((data) =>{
      this.announceType = data;
      this.loadNewsLists();
    });
  }

  // Load News Lists
  loadNewsLists() {
      this.adminService.getAnnouncements().subscribe((data) =>{
        let getData:any = data;
        let pushData : any = [];
        getData.forEach(function(item: any){
          const postedData = datePipe.transform(item.effectiveFrom, 'MM/dd/yyyy');
          const today = datePipe.transform(new Date(), 'MM/dd/yyyy');
          this.isValidDate = this.validateDates(postedData, today);
          // console.log("isValidDate::item", item);
          // if(item.isActive && this.isValidDate) {
          if(item.isActive && !item.isHidden) {
            let tableModel: any = {
              item : item.title,
              type : this.populateDropDownCode(this.announceType, item.typeId, "name", "id"),
              announcementUrl : item.announcementUrl,
              posted : item.effectiveFrom,
              lastupdate:  item.lastUpdateDateTime
            };
            pushData.push(tableModel);
          }

        }.bind(this))

        var lastupdateDdata = pushData.sort(function(a, b){
          var dateA:any = new Date(a.lastupdate), dateB:any = new Date(b.lastupdate)
          return dateB-dateA
        })

        if(!this.fullView){
          this.taskDataSource = lastupdateDdata.slice(0,5);;
          this.dataSource = new MatTableDataSource(this.taskDataSource);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.ngxService.stopLoader("news-loader");
          this.totalRecords = lastupdateDdata.length;
          this.uniqueFunction();
        } else{
          this.taskDataSource = lastupdateDdata;
          this.dataSource = new MatTableDataSource(lastupdateDdata);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.ngxService.stopLoader("news-loader");
          this.totalRecords = lastupdateDdata.length;
          this.uniqueFunction();
        }

      });


    // if(!this.fullView){
    //   this.newsList$.subscribe( data => {
    //     this.newsDataSource = data.slice(0,5);
    //     this.dataSource = new MatTableDataSource(this.newsDataSource);
    //     this.ngxService.stopLoader("news-loader");
    //   });
    // }else{
    //   this.newsList$.subscribe( data => {
    //     this.newsDataSource = data;
    //     this.dataSource = new MatTableDataSource(this.newsDataSource);
    //     this.ngxService.stopLoader("news-loader");
    //     this.totalRecords = data.length;
    //     this.dataSource.paginator = this.paginator;
    //     this.dataSource.sort = this.sort;
    //     this.rowCounters();

    //   });
    // }
  }

  validateDates(sDate: string, eDate: string){
    this.isValidDate = true;
    if((sDate == null || eDate ==null)){
     // this.error={isError:true,errorMessage:'Date of Post and Expiration date are required.'};
      this.isValidDate = false;
    }

    if((sDate != null && eDate !=null) && (eDate) < (sDate)){
     // this.error={isError:true,errorMessage:'Expiration date should be greater then Date of Post.'};
      this.isValidDate = false;
    }
    return this.isValidDate;
  }

  populateDropDownCode(eName:any, eValue:any, eType: string, exType: string) {
    if(eValue && eName != undefined){
      if(exType === 'name') {
        const code = eName.filter(record => record[exType].toLowerCase() === eValue.toLocaleLowerCase())
        .map(record => record[eType]);
        return code[0]
      }
      else{
        const code = eName.filter(record =>  record[exType] === eValue)
        .map(record => record[eType]);
        return code[0];
      }
    }
  }

  // Widget Full View
  widgetFullView() {
    window.scrollTo(0, 0);
    this.fullView = !this.fullView;
    this.fullViewEvent.emit(this.fullView);
    this.loadNewsLists();
  }

  rowCounters(){

    this.pageRowCounts.splice(0,this.pageRowCounts.length);
    if(this.totalRecords <=10){
      this.pageRowCounts.push(this.totalRecords);
    }else if (this.totalRecords <=20) {
      this.pageRowCounts.push(10,this.totalRecords);
    }else if(this.totalRecords <=50){
      this.pageRowCounts.push(10,20,this.totalRecords);
    }else if(this.totalRecords >50){
      this.pageRowCounts.push(10,20,50,this.totalRecords);
    }

    this.dataSource.paginator.pageSizeOptions = this.pageRowCounts;

  }

  clearFilter() {
    this.dataSource.filter = '';
  }

  uniqueFunction() {
    let tasklistdata = this.taskDataSource;
    //console.log("tasklistdata", tasklistdata);
    let uniquePostedArray = [];
    let uniqueTypeArray = [];
    for (let i in tasklistdata) {
      uniquePostedArray.push(tasklistdata[i].posted);
      uniqueTypeArray.push(tasklistdata[i].type);
    }

    this.uniqueType = uniqueTypeArray.filter(
      (elem, i, arr) => arr.indexOf(elem) === i
    );
    this.uniqueType.sort();
    this.uniqueType.reverse();

   this.uniquePosted = uniquePostedArray.filter(
      (elem, i, arr) => arr.indexOf(elem) === i
    );
    this.uniquePosted.sort();
    this.uniquePosted.reverse();



  }

  filterpop() {
    this.filterPopShow = !this.filterPopShow;
  }

  closeFilterPop() {
    this.dataSource.filter = '';
    this.filterPopShow = false;
  }

  applyContentFilter() {
    let arrayContentData = [];
    this.contentFilterArray = [];
    let dataholders = this.taskDataSource;

    dataholders.forEach((element) => {
      let emptyFlag = '';
      let checkingFlag = '';

      if (
        this.contentFilterForm.value.adminItem != '' &&
        this.contentFilterForm.value.adminItem != undefined &&
        this.contentFilterForm.value.adminItem != null
      ) {
        emptyFlag = emptyFlag + '1';
        if (element.item === this.contentFilterForm.value.adminItem) {
          checkingFlag = checkingFlag + '1';
        } else {
          checkingFlag = checkingFlag + '0';
        }
      } else {
        emptyFlag = emptyFlag + '0';
        checkingFlag = checkingFlag + '0';
      }

      if (
        this.contentFilterForm.value.adminType != '' &&
        this.contentFilterForm.value.adminType != undefined &&
        this.contentFilterForm.value.adminType != null
      ) {
        emptyFlag = emptyFlag + '1';
        if (element.type === this.contentFilterForm.value.adminType) {
          checkingFlag = checkingFlag + '1';
        } else {
          checkingFlag = checkingFlag + '0';
        }
      } else {
        emptyFlag = emptyFlag + '0';
        checkingFlag = checkingFlag + '0';
      }

      if ( this.contentFilterForm.value.postedStartDate && this.contentFilterForm.value.postedEndDate ) {
        emptyFlag = emptyFlag + '1';
        const postedDate = +new Date(element.posted);

        if ( postedDate >= +(this.contentFilterForm.value.postedStartDate.setUTCHours(0, 0, 0, 0))
          && postedDate <= +this.contentFilterForm.value.postedEndDate.setUTCHours(23, 59, 59, 999) ) {
          checkingFlag = checkingFlag + '1';
        } else {
          checkingFlag = checkingFlag + '0';
        }
      } else {
        emptyFlag = emptyFlag + '0';
        checkingFlag = checkingFlag + '0';
      }


      if (
        this.contentFilterForm.value.adminPosted != '' &&
        this.contentFilterForm.value.adminPosted != undefined &&
        this.contentFilterForm.value.adminPosted != null
      ) {
        emptyFlag = emptyFlag + '1';
        if (element.posted === this.contentFilterForm.value.adminPosted) {
          checkingFlag = checkingFlag + '1';
        } else {
          checkingFlag = checkingFlag + '0';
        }
      } else {
        emptyFlag = emptyFlag + '0';
        checkingFlag = checkingFlag + '0';
      }

      if (emptyFlag == checkingFlag) {
        this.contentFilterArray.push(element);
      }
    });

    arrayContentData = this.contentFilterArray;
    this.dataSource.data = arrayContentData;
    this.totalRecords = arrayContentData.length;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.filterPopShow = false;
  }

  resetFilterPop() {
    this.contentFilterForm.reset();

    this.dataSource = new MatTableDataSource(this.taskDataSource);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }



}
