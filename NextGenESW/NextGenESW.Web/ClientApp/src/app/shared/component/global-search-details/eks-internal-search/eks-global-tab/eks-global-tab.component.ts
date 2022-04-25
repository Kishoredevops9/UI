import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { TodoItemsListService } from '@app/dashboard/todo-items-list/todo-items-list.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from '@environments/environment';
import { SharedService } from '@app/shared/shared.service';

@Component({
  selector: 'app-eks-global-tab',
  templateUrl: './eks-global-tab.component.html',
  styleUrls: ['./eks-global-tab.component.scss']
})
export class EksGlobalTabComponent implements OnInit {

  @ViewChild('paginator2') paginator2: MatPaginator;
  @ViewChild(MatTable) table: MatTable<any>;
  @Output() eksGlobalCount = new EventEmitter<any>();
  searchTerm: any;
  advterm: any;
  globalLength: number = 0;
  startAt: number = 0;
  startEnd: number = 50;
  pageSize: number = 50;
  expanded: boolean = false;
  globalDisplayedColumns: string[] = ['arrow', 'title', 'type', 'link', 'publishDate'];
  pageRowCounters = environment.pageRowCounters;
  hclenv = environment.hclenv;
  globalSearchData = new Array();
  citrus: any;
  EKSGlobalSearchData: any;
  EKSGlobalSearchCount: number;

  constructor(
    private todoItemsListService: TodoItemsListService,
    private route: ActivatedRoute,
    private sharedData: SharedService
  ) {

    this.sharedData.resiveMessage.subscribe(() => {
      if (window.location.pathname == '/_search') {
        this.ngOnInit()

      }

    })

  }

  ngOnInit(): void {
    console.log('-----hclenv---', this.hclenv);
    this.route.queryParams.subscribe((data) => {
      this.searchTerm = data.q;
      this.advterm = data.a;

      console.log(this.searchTerm)
      if (this.searchTerm || this.advterm) {
        this.getEKSGloablSearchData(0, "load");
      }
    });
  }

  navigationLink(linkUrl) {
    window.open(linkUrl, '_blank');
  }

  getEKSGloablSearchData(startNumber, load) {
    if (this.searchTerm || this.advterm) {
      if (this.hclenv == 'ok') {
        this.todoItemsListService.getGlobalSearchDataOnCallLocal(this.searchTerm, startNumber, this.startEnd, this.pageSize).subscribe(data => {
          this.globalSearchData = data['results'];
          console.log('data from API in global tab data count', this.globalSearchData);

          this.citrus = this.globalSearchData.slice(startNumber, this.startEnd);
          // console.log('this.citrus',this.citrus);
          // console.log(' startNumber',startNumber);
          // console.log(' this.startEnd',this.startEnd);
          //let pushData:any= this.citrus;
          //this.globalSearchData.push(pushData);
          this.globalSearchData = this.citrus;
          this.globalLength = (data['total_results'] > 0) ? data['total_results'] : 0;
          this.eksGlobalCount.emit(this.globalLength);
          this.EKSGlobalSearchData = new MatTableDataSource(this.globalSearchData);
          this.EKSGlobalSearchData.paginator2 = this.paginator2;

          // if(load == 'load') {
          //   this.paginator2.pageIndex = 0;
          // } else {
          //   this.EKSGlobalSearchData.paginator2 = this.paginator2;
          // }
          this.EKSGlobalSearchCount = (data['total_results'] > 0) ? data['total_results'] : 0;
        });
      }
      else {

         let textbox = this.searchTerm.split("&tags=&a")[0].split("searchText=")[1];

        this.todoItemsListService.getGlobalSearchDataOnCall( textbox , startNumber, this.startEnd, this.pageSize).subscribe(data => {
          this.globalSearchData = data['results'];
          this.globalLength = (data['total_results'] > 0) ? data['total_results'] : 0;
          this.eksGlobalCount.emit(this.globalLength);
          this.EKSGlobalSearchData = new MatTableDataSource(this.globalSearchData);
          this.EKSGlobalSearchData.paginator2 = this.paginator2;

          // if(load == 'load') {
          //   this.paginator2.pageIndex = 0;
          // } else {
          //   this.EKSGlobalSearchData.paginator2 = this.paginator2;
          // }
          this.EKSGlobalSearchCount = (data['total_results'] > 0) ? data['total_results'] : 0;
        });

      }



    }
  }

  onPageGlobalEvent(event: PageEvent) {
    this.startAt = (event.pageSize * event.pageIndex) + 1;
    this.startEnd = (event.pageIndex + 1) * event.pageSize;
    this.pageSize = event.pageSize;
    this.globalLength = this.globalLength;
    this.getEKSGloablSearchData(this.startAt, '');
    //console.log("this.pageSize, this.startAt + this.startEnd + this.globalLength", this.pageSize, this.startAt, this.startEnd, this.globalLength);
  }

}
