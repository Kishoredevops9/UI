import { Component,
  ComponentFactory,
  ComponentFactoryResolver,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ActivityPageService } from '@app/activity-page/activity-page.service';
import { TodoItemsListService } from '@app/dashboard/todo-items-list/todo-items-list.service';
import { element } from 'protractor';
import { Subscription } from 'rxjs';
import { GlobalInnerContentComponent } from '../../global-inner-content/global-inner-content.component';


@Component({
  selector: 'app-eks-tab-result',
  templateUrl: './eks-tab-result.component.html',
  styleUrls: ['./eks-tab-result.component.scss']
})
export class EksTabResultComponent implements OnInit {
  @Input() eksAdvSearchData: any; 
  @ViewChild(MatTable) table: MatTable<any>;
  searchTerm;
  suggesterm;
  advterm;
  expanded: boolean = false;
  @ViewChildren('searchDetails', { read: ViewContainerRef }) rowContainers;
  displayedColumns: string[] = [
    'title',
    'contentid',
    'componenttype',
    'version',
    'lastUpdate',
    'jc',
    'outsourcable',
  ];
  index: number;
  searchList = [];
  copySearchList;
  @Output() searchListCountEventHander = new EventEmitter<string>();
  count;
  cdid: any;
  cdname: any;
  shurl: any;
  advurl: any;
  selectedAddons = [];

  private subscription: Subscription;

  title;

  advsearchDoc: any;
  componenttypename: any;
  contentidname: any;
  advRecords: any[];
  advTable$: any;
  constructor(
    private todoItemsListService: TodoItemsListService,
    private route: ActivatedRoute,
    private resolver: ComponentFactoryResolver,
    private advsearch: ActivityPageService
  ) { }



  @ViewChild('f') advform: NgForm;

  ngOnInit(): void {

    this.route.queryParams.subscribe((data) => {
      console.log(data);
      this.searchTerm = data.q;
      this.suggesterm = data.q;

      if (this.searchTerm) {
        this.todoItemsListService
          .getSearchTerm(this.searchTerm)
          .subscribe((data) => {
            var res = JSON.parse(JSON.stringify(data));
            this.searchList = res.hits.hits;
            console.log(this.searchList);
            this.cdid = window.location.host + '/' + this.searchList[0]._source.componenttype + '/' + this.searchList[0]._source.contentid;
            this.count = this.searchList.length > 0 && this.searchList.length;
            this.title = {
              count: this.count ? `${this.count}\u00A0\u00A0\RESULTS` : '',
              searchTerm: `${this.searchTerm}`,
            };
            this.searchListCountEventHander.emit(this.title);
            this.searchList.forEach((el) => {
              el._source.componenttype = el._source.componenttype.toUpperCase();
              el.expanded = false;
              if (el._source['lastupdate']) {
                var date = new Date(el._source['lastupdate']);
                el._source['lastupdate'] =
                  date.getDate() +
                  '/' +
                  (date.getMonth() + 1) +
                  '/' +
                  date.getFullYear();
              }
              if (el._source.componenttype == 'MAP') {
                return (el._source.componenttype = 'M');
              }

              this.copySearchList = [...this.searchList];
            });
          });
      }

      this.advterm = data.q;
      if (this.advterm) {
        this.todoItemsListService
          .getSearchTerm(this.advterm)
          .subscribe((data) => {
            var res = JSON.parse(JSON.stringify(data));
            this.searchList = res.hits.hits;
            console.log(this.searchList);
            this.count = this.searchList.length > 0 && this.searchList.length;
            this.title = {
              count: this.count ? `${this.count}\u00A0\u00A0\RESULTS` : '',
              searchTerm: `${this.searchTerm}`,
            };
            this.searchListCountEventHander.emit(this.title);
            this.searchList.forEach((el) => {
              el._source.componenttype = el._source.componenttype.toUpperCase();
              el.expanded = false;
              if (el._source['lastupdate']) {
                var date = new Date(el._source['lastupdate']);
                el._source['lastupdate'] =
                  date.getDate() +
                  '/' +
                  (date.getMonth() + 1) +
                  '/' +
                  date.getFullYear();
              }
              if (el._source.componenttype == 'MAP') {
                return (el._source.componenttype = 'M');
              }

              this.copySearchList = [...this.searchList];
            });
          });
      }

    });


  }

  expandChildItemDetails(item, action, index) {
    if (this.index != null) {
      // clear old message
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


  getSearchContentType(searchContent) {
    this.searchList = this.copySearchList.filter(
      (el) => el._source.componenttype == searchContent
    );
    this.count = this.searchList.length > 0 && this.searchList.length;
    this.title = {
      count: this.count ? `${this.count}\u00A0\u00A0\RESULTS` : '',
      searchTerm: `${this.searchTerm}`,
    };
    this.searchListCountEventHander.emit(this.title);
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

}
