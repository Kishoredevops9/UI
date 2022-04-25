import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { GridOptions } from '@app/shared/models/mat-table';
import { AddonsPopupSearchStore } from '../addons-popup-search.store';
import { map } from 'rxjs/operators';
import { PwPlayField } from '../addons-popup-search.state';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
@Component({
  selector: 'app-addons-pwplay-result',
  templateUrl: './addons-pwplay-result.component.html',
  styleUrls: ['./addons-pwplay-result.component.scss']
})
export class AddonsPwplayResultComponent implements OnInit, AfterViewInit {
  pwPlaySearchResult$ = this.addonsPopupSearchStore.pwPlaySearchResult$;
  pwPlayGridOptions: GridOptions;
  pwPlayGridData$ = this.pwPlaySearchResult$.pipe(map(item => item.pwPlayItems));

  @ViewChild('videoCellRenderer') videoCellRenderer: TemplateRef<HTMLElement>;
  @ViewChild('descriptionRenderer') descriptionRenderer: TemplateRef<HTMLElement>;

  constructor(
    private addonsPopupSearchStore: AddonsPopupSearchStore
  ) { }

  ngOnInit(): void {}
  ngAfterViewInit(): void {
    this.pwPlayGridOptions = {
      columnDefs: [
        { headerName: '', field: 'video', width: 15, cellRenderer: this.videoCellRenderer },
        { headerName: 'Title', field: PwPlayField.Title, width: 25 },
        { headerName: 'Description', field: PwPlayField.Description, width: 50, cellRenderer: this.descriptionRenderer },
        { headerName: 'Published', field: PwPlayField.WhenPublished, width: 5 },
        { headerName: 'Duration', field: PwPlayField.Duration, width: 5 }
      ],
      footerEnabled: false
    };
  }

  onPageChanged($event: { pageEvent: PageEvent, paginator: MatPaginator }) {
    this.addonsPopupSearchStore.patchState(state => ({
      pwPlayQueryObject: {
        ...state.pwPlayQueryObject,
        startAt: $event.pageEvent.pageIndex * $event.pageEvent.pageSize
      }
    }))
  }
}
