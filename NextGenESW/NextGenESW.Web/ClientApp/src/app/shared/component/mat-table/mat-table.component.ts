import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { GridOptions } from '@app/shared/models/mat-table';
import { environment } from '@environments/environment';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, tap } from 'rxjs/operators';
import { ScrollableTableComponent } from './scroll-table/scrollable-table.component';

@Component({
  selector: 'app-mat-table',
  templateUrl: './mat-table.component.html',
  styleUrls: ['./mat-table.component.scss'],
})
export class MatTableComponent implements OnInit {
  @Input() gridHeight = '500px';
  @Input() nbOfRowsPerScroll = 200;
  @Input() gridOptions!: GridOptions;
  @Input() loading = false;
  @Input() withPaginator = true;
  @Input() pageSize = 10;
  @Input() pageLength = 10;
  @Input() pageSizeOptions = environment.pageRowCounters;
  @Input() partialDatasource = false;
  @Output() onPageChanged = new EventEmitter<{ pageEvent?: PageEvent, paginator?: MatPaginator }>();

  searchTerm = '';

  private _rowData: any[] = [];
  @Input() get rowData() {
    return this._rowData;
  }
  set rowData(value: any[]) {
    if (value) {
      this.rowDataSub.next(value);
    }
  }

  rowDataSub = new BehaviorSubject<any[]>([]);
  rowData$!: Observable<any[]>;

  searchTermSub = new BehaviorSubject<string>('');
  searchTerm$ = this.searchTermSub.pipe(
    tap(searchTerm => console.log(searchTerm)),
    debounceTime(300),
    distinctUntilChanged()
  );

  get paginator() { return this.scrollableTable && this.scrollableTable.paginator };

  @ViewChild('scrollableTable') scrollableTable: ScrollableTableComponent

  ngOnInit(): void {
    this.rowData$ = combineLatest([this.rowDataSub.asObservable(), this.searchTerm$]).pipe(
      map(([allData, searchTerm]) => {
        if (!searchTerm) return allData;

        const colDefs = this.gridOptions.columnDefs || [];
        const filterCols = colDefs.filter(item => !item.quickFilterDisabled);
        return allData.filter(rowData => {
          // Exist at least one col that contain searchTerm
          // in the value
          return filterCols.find(col => {
            const colValue = col.valueGetter ? col.valueGetter(rowData) : col.field && rowData[col.field];
            const strColValue = colValue && `${colValue}`;

            if (!strColValue) return false;

            return strColValue.toLowerCase().includes(searchTerm.toLowerCase());
          });
        });
      })
    );
  }
  
}
