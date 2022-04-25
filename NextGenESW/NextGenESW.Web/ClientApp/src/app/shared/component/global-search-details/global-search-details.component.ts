import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TodoItemsListService } from '@app/dashboard/todo-items-list/todo-items-list.service';

@Component({
  selector: 'app-global-search-details',
  templateUrl: './global-search-details.component.html',
  styleUrls: ['./global-search-details.component.scss'],
})
export class GlobalSearchDetailsComponent implements OnInit {
  selectedIndex = 0;
  searchTerm;
  suggesterm: string = '' ;
  data;
  searchListCount = '';
  newTerm = 'false';
  constructor(private todoItemsListService: TodoItemsListService,
    private route: ActivatedRoute,) {}

  ngOnInit(): void {
    var querySearch =window.location.href.split("=");
    this.searchTerm = querySearch[1];
    this.suggesterm = querySearch[1]
  }
  
  nextTab(redirect) {
    if (redirect) {
      this.selectedIndex = this.selectedIndex + 1;
    }
  }
  onTabClick(event) {
  }

  searchListCountEventHander(title) {
    this.searchListCount = title.count;
    this.searchTerm = title.searchTerm;
    this.newTerm = title.searchTerm;    
  }
}
