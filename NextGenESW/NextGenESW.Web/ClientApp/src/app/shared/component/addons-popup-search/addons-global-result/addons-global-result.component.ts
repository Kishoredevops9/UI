import { Component, OnInit } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { GridOptions } from '@app/shared/models/mat-table';
import { map } from 'rxjs/operators';
import { GlobalDetailField } from '../addons-popup-search.state';
import { AddonsPopupSearchStore } from '../addons-popup-search.store';

@Component({
  selector: 'app-addons-global-result',
  templateUrl: './addons-global-result.component.html',
  styleUrls: ['./addons-global-result.component.scss']
})
export class AddonsGlobalResultComponent implements OnInit {
  globalSearchResult$ = this.addonsPopupSearchStore.globalSearchResult$;
  globalGridOptions: GridOptions;
  globalGridData$ = this.globalSearchResult$.pipe(map(item => item.globalDetailItems));

  constructor(private addonsPopupSearchStore: AddonsPopupSearchStore) { }

  ngOnInit(): void {
    this.globalGridOptions = {
      columnDefs: [
        { headerName: 'Title', field: GlobalDetailField.Title, width: 45, cellClass: 'font-weight-bold' },
        { headerName: 'Type', field: GlobalDetailField.Type, width: 15 },
        { headerName: 'Link', field: GlobalDetailField.Link, width: 45, cellClass: 'font-weight-bold' },
        { headerName: 'Publish Date', field: GlobalDetailField.CreatedDate, width: 15 }
      ],
      footerEnabled: false
    };
  }

  onPageChanged($event: { pageEvent: PageEvent, paginator: MatPaginator }) {
    this.addonsPopupSearchStore.patchState(state => ({
      globalQueryObject: {
        ...state.globalQueryObject,
        startAt: $event.pageEvent.pageIndex * $event.pageEvent.pageSize
      }
    }))
  }
}
