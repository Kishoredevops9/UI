
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ContextService } from '@app/shared/component/global-panel/context/context.service';
import { ContextInfo } from '@app/shared/component/global-panel/context/context.model';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { Title } from '@angular/platform-browser';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})

export class DashboardComponent implements OnInit {
  public opened = true;
  public sharedValue: any;
  @ViewChild('divElements')
  public divElements: ElementRef;
  activeClass: string;
  expandBtn: boolean = false;
  fullViewTask: boolean = false;
  fullViewTodo: boolean = false;
  fullViewContent: boolean = false;
  fullViewNews: boolean = false;
  items: any;
  fullViewContainer: string = "";
  draggableAres: string[] = [
    'todo-item-list',
    'content-list',
    'task-item-list',
    'news-list',
  ];

  ngOnInit() {
    this.loadContextInfo();
    // sessionStorage.removeItem('sfID');
    // sessionStorage.removeItem('sfcontentId');
    // sessionStorage.removeItem('sfStatus');
    // sessionStorage.removeItem('sfversion');
    // sessionStorage.removeItem('sfcontentType');
    this.DashboardService.getTiles().subscribe((node) => {
      //console.log(node)  
    })
  }

  loadContextInfo() {
    this.contextService.ContextInfo = this.getContextInfo();
  }

  getContextInfo() {
    const contextInfo: ContextInfo = new ContextInfo();
    contextInfo.entityInfo = null;
    contextInfo.screenPath = 'Dashboard';
    return contextInfo;
  }

  dropped($event) {
    this.items = [
      parseInt(document.getElementsByClassName("listItem")[0].getAttribute("data-index")),
      parseInt(document.getElementsByClassName("listItem")[1].getAttribute("data-index")),
      parseInt(document.getElementsByClassName("listItem")[2].getAttribute("data-index")),
      parseInt(document.getElementsByClassName("listItem")[3].getAttribute("data-index"))
    ];
    localStorage.setItem("tiles", JSON.stringify(this.items))
    this.DashboardService.updateTiles(JSON.stringify(this.items)).subscribe((data) => {
      console.log(data)
    })
    //console.log(this.items)
  }

  // Start function Full View Task
  getFullViewTask(event: boolean) {
    this.fullViewTask = event;
    this.expandBtn = event;
  }

  // Start function Full View ToDo
  getFullViewTodo(event: boolean) {
    this.fullViewTodo = event;
    this.expandBtn = event;
  }

  // Start function Full View Content
  getFullViewContent(event: boolean) {
    this.fullViewContent = event;
    this.expandBtn = event;
    this.fullViewContainer = event ? 'full-view-content' : ''
  }

  // Start function Full View News
  getFullViewNews(event: boolean) {
    this.fullViewNews = event;
    this.expandBtn = event;
  }

  constructor(private contextService: ContextService,
    public DashboardService: DashboardService,
    private ngxService: NgxUiLoaderService,
    private titleService: Title
  ) {
    this.titleService.setTitle(`EKS | Dashboard`);

    let localTiles = localStorage.getItem("tiles");
    if (localTiles) {
      this.items = JSON.parse(localTiles)
    }
    else {
      this.items = [1, 3, 2, 4]
    }

  }

  // loadContextInfo() {
  //   this.contextService.ContextInfo = this.getContextInfo();
  // }

  // getContextInfo() {
  //   const contextInfo: ContextInfo = new ContextInfo();
  //   contextInfo.entityInfo = 'Dashboard';
  //   return contextInfo;
  // }

  ngAfterViewInit() { }

}


