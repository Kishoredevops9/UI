import {
  AfterViewInit,
  ApplicationRef,
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  EventEmitter,
  Injector,
  Input,
  OnChanges,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject } from 'rxjs';
import { CdkDragEnd, moveItemInArray } from '@angular/cdk/drag-drop';
import { SelectionModel } from '@angular/cdk/collections';
import { ColumnDef, GridOptions } from '@app/shared/models/mat-table';
import { environment } from '@environments/environment';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

interface CellRendererItem {
  cellId: string;
  cellRenderer: any;
  cellProps: any;
}

const pinnedValueMap: { [key: string]: number } = {
  left: -1,
  undefined: 0,
  right: 1,
};

function sortFnColDef(colA: ColumnDef, colB: ColumnDef) {
  const valueColA = pinnedValueMap[`${colA.pinned}`];
  const valueColB = pinnedValueMap[`${colB.pinned}`];
  if (valueColA < valueColB) return -1;
  if (valueColA > valueColB) return 1;
  return 0;
}

class ModifcationModel {
  isOnEditCell(colDef: ColumnDef, rowData: any) {
    return true;
  }
}
@Component({
  selector: 'app-scrollable-table',
  templateUrl: './scrollable-table.component.html',
  styleUrls: ['./scrollable-table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ScrollableTableComponent implements OnInit, OnChanges, AfterViewInit {
  dataSource: MatTableDataSource<any[]> = new MatTableDataSource();
  selection = new SelectionModel<any>(true, []);
  modificationModel = new ModifcationModel();
  gridDataSub = new BehaviorSubject<any[]>([]);
  gridData$ = this.gridDataSub.asObservable();
  displayedColumns: string[] = [];
  allRowData: any[] = [];
  nbPinnedLCols: number = 0;
  nbPinnedRCols: number = 0;
  gridId: string = '';
  storedRowIdItems: { rowId: string; rowData: any }[] = [];

  componentCellRendererIdsDict: { [key: string]: string } = {};
  cellRendererIdRowDataDict: { [key: string]: any } = {};
  rendereredCellIds: string[] = [];
  toRenderCells: CellRendererItem[] = [];

  @Input() gridHeight: string = '500px';
  @Input() nbOfRowsPerScroll = 200;
  @Input() loading = false;
  @Input() withPaginator = true;
  @Input() pageSize = 10;
  @Input() pageLength = 10;
  @Input() pageSizeOptions = environment.pageRowCounters;
  @Input() partialDatasource = false;
  @Output() onPageChanged = new EventEmitter<{ pageEvent?: PageEvent, paginator?: MatPaginator }>();

  @ViewChild('paginator') paginator!: MatPaginator;

  private _gridOptions!: GridOptions;
  @Input() get gridOptions() {
    return this._gridOptions;
  }
  set gridOptions(value: GridOptions) {
    if (value) {
      this._gridOptions = value;

      // Sort columnDefs by pinned "left", "no", "right"
      const columnDefs = value.columnDefs || [];
      const sortedColDefs = columnDefs.sort(sortFnColDef);
      this.nbPinnedLCols = columnDefs.filter(colDef => colDef.pinned === 'left').length;
      this.nbPinnedRCols = columnDefs.filter(colDef => colDef.pinned === 'right').length;
      this.displayedColumns = sortedColDefs.map((item, idx) => item.field || `Col_${idx}`);
    }
  }

  private _rowData: any[] = [];
  @Input() get rowData() {
    return this._rowData;
  }
  set rowData(value: any[]) {
    if (value) {
      this.allRowData = value;
      this.storedRowIdItems = value.map((rowData, rowIdx) => ({
        rowId: `${new Date().getTime()}` + rowIdx,
        rowData,
      }));
    }
  }

  @ViewChild(MatTable) advancedTable!: MatTable<any>;
  @ViewChild(MatSort) sort!: MatSort;

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  constructor(
    private renderer: Renderer2,
    private injector: Injector,
    private applicationRef: ApplicationRef,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  ngOnInit(): void {
    this.gridId = `advanced-grid-${new Date().getTime()}`;
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Subscribe to the "selection" value
    // and emit event when it changes
    if (this.gridOptions.onSelectionChanged) {
      this.selection.changed.subscribe(_ => {
        if (this.gridOptions.onSelectionChanged) {
          this.gridOptions.onSelectionChanged(this.selection.selected);
        }
      });
    }

    if (changes['rowData']) {
      // Wait until data input is available
      // Display first part of gridData
      const { allRowData, nbOfRowsPerScroll, gridOptions } = this;
      const firstTrunk = allRowData.slice(0, nbOfRowsPerScroll);
      this.dataSource.data = firstTrunk;

      // render cell with customized cellRenderer
      const toRenderCellOptions = this.getRenderCellOptions(allRowData, gridOptions);
      if (toRenderCellOptions.toRenderCells.length) {
        this.toRenderCells = toRenderCellOptions.toRenderCells;
        this.cellRendererIdRowDataDict = toRenderCellOptions.cellRendererIdRowDataDict;
        this.renderCellComponents();
      }
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;    
    this.withPaginator && !this.partialDatasource &&(this.dataSource.paginator = this.paginator);
  }

  getRenderCellOptions(allRowData: any[], gridOptions: GridOptions) {
    const toRenderCells: CellRendererItem[] = [];
    const cellRendererIdRowDataDict: { [key: string]: any } = {};
    const columnDefs = gridOptions.columnDefs;
    columnDefs.forEach(colDef => {
      const componentCellRenderer = this.getComponentCellRenderer(colDef, gridOptions);
      if (componentCellRenderer) {
        allRowData.forEach(rowData => {
          const cellId = this.getCellId(colDef, rowData);
          cellRendererIdRowDataDict[cellId] = rowData;
          toRenderCells.push({
            cellId: this.getCellId(colDef, rowData),
            cellRenderer: componentCellRenderer,
            cellProps: colDef.cellRendererParams,
          });
        });
      }
    });
    return {
      toRenderCells,
      cellRendererIdRowDataDict,
    };
  }

  renderCellComponents() {
    let observer = new MutationObserver((mutations, mo) => this.loadCellRendererComponents(mutations, mo, this));
    observer.observe(document, {
      childList: true,
      subtree: true,
    });
  }

  loadCellRendererComponents(mutations: MutationRecord[], mo: MutationObserver, that: any) {
    let cellRendererExists = document.getElementsByClassName(`${this.gridId}-cell-renderer`);
    const { toRenderCells } = this;
    if (cellRendererExists) {
      mo.disconnect();

      // render all cell components
      toRenderCells
        .filter(item => !this.rendereredCellIds.includes(item.cellId))
        .forEach(cellRenderer => {
          this.createComponentInstance(cellRenderer);
        });
    }

    setTimeout(() => {
      mo.disconnect();
    }, 3000); // auto-disconnect after 5 seconds
  }

  createComponentInstance(cellRenderer: CellRendererItem) {
    const cellContainer = document.getElementById(cellRenderer.cellId);
    if (cellContainer) {
      let component = this.createComponentAtElement(cellRenderer);
      if (cellRenderer.cellProps) {
        this.renderer.setProperty(component.instance, 'data', {
          ...cellRenderer.cellProps,
          rowData: this.cellRendererIdRowDataDict[cellRenderer.cellId],
        });
        component.changeDetectorRef.detectChanges();
      }
      this.rendereredCellIds.push(cellRenderer.cellId);
    }
  }

  createComponentAtElement(cellRenderer: CellRendererItem) {
    const element = document.getElementById(cellRenderer.cellId);
    const cellRendererFactory = this.componentFactoryResolver.resolveComponentFactory(cellRenderer.cellRenderer);
    const componentRef = cellRendererFactory.create(this.injector, [], element);
    this.applicationRef.attachView(componentRef.hostView);

    return componentRef;
  }

  getCellId(colDef: ColumnDef, rowData: any) {
    const colId = colDef.field || colDef.name || JSON.stringify(colDef);
    return `cell-${colId}-${this.getRowId(rowData)}`;
  }

  getRowId(rowData: any) {
    const { gridOptions } = this;
    if (gridOptions.getRowId) return gridOptions.getRowId(rowData);

    const foundStoredIdItem = this.storedRowIdItems.find(item => item['rowData'] === rowData);
    return foundStoredIdItem && foundStoredIdItem.rowId;
  }

  getComponentCellRenderer(colDef: ColumnDef, gridOptions: GridOptions) {
    const frameworkComponents = (gridOptions && gridOptions.frameworkComponents) || {};
    const cellRenderer = colDef.cellRenderer;
    return cellRenderer && frameworkComponents[cellRenderer];
  }

  getInnerHtmlCellRenderer(colDef: ColumnDef, gridOptions: GridOptions) {
    const frameworkComponents = (gridOptions && gridOptions.frameworkComponents) || {};
    const cellRenderer = colDef.cellRenderer;
    return !frameworkComponents[cellRenderer] && cellRenderer;
  }

  getComponentCellEditor(colDef: ColumnDef, gridOptions: GridOptions) {
    const frameworkComponents = (gridOptions && gridOptions.frameworkComponents) || {};
    const cellEditor = colDef.cellEditor;
    return cellEditor && frameworkComponents[cellEditor];
  }

  getInnerHtmlCellEditor(colDef: ColumnDef, gridOptions: GridOptions) {
    const frameworkComponents = (gridOptions && gridOptions.frameworkComponents) || {};
    const cellEditor = colDef.cellEditor;
    return !frameworkComponents[cellEditor] && cellEditor;
  }

  drop($event: any) {
    console.log($event);
    // The currentIndex should not be in range of 'pinned' col.
    const currentIndex = $event.currentIndex;
    const { nbPinnedLCols, nbPinnedRCols, displayedColumns } = this;
    let adjustedIdx = currentIndex;
    if (currentIndex <= nbPinnedLCols) adjustedIdx = nbPinnedLCols;
    if (currentIndex >= displayedColumns.length - nbPinnedRCols)
      adjustedIdx = displayedColumns.length - nbPinnedRCols - 1;
    moveItemInArray(this.displayedColumns, $event.previousIndex, adjustedIdx);
  }

  getHeadingName(field?: string) {
    return field || '--';
  }

  getCellValue(rowData: any, colDef: ColumnDef) {
    const value = colDef.valueGetter ? colDef.valueGetter(rowData) : colDef.field && rowData[colDef.field];

    return colDef.valueFormatter ? colDef.valueFormatter({ rowData, value }) : value;
  }

  displayMoreData() {
    const currRowData = this.dataSource.data || [];
    const { allRowData, nbOfRowsPerScroll } = this;

    if (currRowData.length >= allRowData.length) return;

    const toDisplayMoreRows = allRowData.slice(currRowData.length, currRowData.length + nbOfRowsPerScroll);
    const updatedRowData = currRowData.concat(toDisplayMoreRows);
    this.dataSource.data = updatedRowData;

    this.renderCellComponents();
  }

  onTableScroll($event: any) {
    console.log($event);
    const tableViewHeight = $event.target.offsetHeight; // height off table container
    const tableScrollHeight = $event.target.scrollHeight; // length of all table
    const scrollLocation = $event.target.scrollTop; // how far user scrolled

    const buffer = 200; // If the user has scrolled within 200px of the bottom, add more data
    const limit = tableScrollHeight - tableViewHeight - buffer;

    if (scrollLocation > limit) {
      this.displayMoreData();
    }
  }

  onDragColEnded($event: CdkDragEnd) {
    console.log($event.source);
    console.log(this.displayedColumns);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(rowData?: any): string {
    if (!rowData) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(rowData) ? 'deselect' : 'select'} row ${rowData.position + 1}`;
  }

  onRowClicked(rowData: any, $event?: string) {
    const { gridOptions, selection } = this;
    const isMultipleSelection = gridOptions.rowSelection === 'multiple';

    if ($event === 'checkboxClicked' || !gridOptions.suppressRowClickSelection) {
      if (!isMultipleSelection) {
        selection.selected.forEach(item => item !== rowData && selection.deselect(item));
      }
      selection.toggle(rowData);
    }

    gridOptions.onRowClicked && gridOptions.onRowClicked(rowData);
  }
}
