import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { TodoItemsListService } from '@app/dashboard/todo-items-list/todo-items-list.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from '@environments/environment';
@Component({
  selector: 'app-eks-video-tab',
  templateUrl: './eks-video-tab.component.html',
  styleUrls: ['./eks-video-tab.component.scss']
})
export class EksVideoTabComponent implements OnInit {

  isActive = false;
  allVideos = [];

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatTable) table: MatTable<any>;
  @Output() eksVideoCount = new EventEmitter<any>();
  @Input() set filterActive(value){
    this.isActive = value;
    this.filterActiveVideos();
    this.setDataSource();
  }
  searchTerm: any;
  advterm: any;
  globalLength: number = 0;
  startAt: number = 0;
  startEnd: number = 50;
  pageSize: number = 50;
  pwPlayDisplayedColumns: string[] = ['video', 'videotitle', 'description', 'publishDate', 'time', 'views', 'jc', 'outsourceable'];
  pageRowCounters = environment.pageRowCounters;
  pwPlaySearchData: any;
  EKSPWPlaySearchCount: number;
  EKSPWPlayData: any;
  constructor(
    private todoItemsListService: TodoItemsListService,
    private route: ActivatedRoute
  ) { }
  ngOnInit(): void {
    this.route.queryParams.subscribe((data) => {
      const searchText = (new URLSearchParams(data.q)).get('searchText');
      this.searchTerm = searchText;
      this.advterm = data.a;
      if (searchText || this.advterm) {
        this.getEKSPWPlaySearchData(0, "load");
      }
    });
  }

  getEKSPWPlaySearchData(startNumber, load) {
    if (this.searchTerm || this.advterm) {
      this.todoItemsListService.getPWPlayData(this.searchTerm).subscribe(data => {
        this.allVideos = data['videos'].map(pwPlay => {
          pwPlay.duration = this.formatDuration(pwPlay.duration);
          pwPlay.speechResult?.forEach(speech => {
            speech.time = this.formatDuration(speech.time);
          });
          return pwPlay;
        });
        this.filterActiveVideos();
        this.setDataSource();
      });
    }
  }


  onPageGlobalEvent(event: PageEvent) {
    this.startAt = (event.pageSize * event.pageIndex) + 1;
    this.startEnd = (event.pageIndex + 1) * event.pageSize;
    this.pageSize = event.pageSize;
    this.globalLength = this.globalLength;
    this.getEKSPWPlaySearchData(this.startAt,'');
    //console.log("this.pageSize, this.startAt + this.startEnd + this.globalLength", this.pageSize, this.startAt, this.startEnd, this.globalLength);
  }

  private formatDuration(value) {
    if ( !value ) {
      return '';
    }
    return value.replace(/(\..*)/g, '');
  }

  private filterActiveVideos(){
    if ( this.isActive ) {
      this.pwPlaySearchData = this.allVideos.filter(video => video.status === 'Active');
    } else {
      this.pwPlaySearchData = this.allVideos;
    }
  }

  private setDataSource(){
    this.EKSPWPlayData = new MatTableDataSource(this.pwPlaySearchData);
    this.EKSPWPlayData.paginator = this.paginator;
    this.EKSPWPlaySearchCount = this.pwPlaySearchData.length > 0 && this.pwPlaySearchData.length ? this.pwPlaySearchData.length : 0;
    this.eksVideoCount.emit(this.EKSPWPlaySearchCount);
  }
}
