import { TemplateRef, Type } from '@angular/core';
import { SelectItem } from './common';

export enum ColSortOrder {
  'DESC' = 'desc',
  'ASC' = 'asc',
  'NULL' = 'null',
}

export interface ColumnDef {
  headerName?: string;
  width?: number;
  name?: string;
  field?: string;
  code?: string;
  headerClass?: any;
  headerStyle?: any;
  cellWrapperStyle?: any;
  cellClass?: any;
  cellStyle?: any;
  quickFilterDisabled?: string;
  cellRenderer?: any;
  cellRendererType?: string;
  cellRendererParams?: any;
  cellEditor?: any;
  cellEditorType?: string;
  cellEditorParams?: any;
  valueFormatter?: (params: any) => any;
  valueGetter?: (params: any) => any;
  pinned?: string;
  editable?: true;
  type?: string;
  checkboxSelection?: boolean;
  checkboxSelectable?:(nodeData: any) => boolean,
  checked?:(nodeData: any) => boolean,
  headerCheckboxSelection?: boolean;
}

export interface GridOptions {
  columnDefs: ColumnDef[];
  searchEnabled?: boolean;
  quickFilterEnabled?: boolean;
  showHideEnabled?: boolean;
  densityEnabled?: boolean;
  footerEnabled?: boolean;
  footerRenderer?: TemplateRef<HTMLElement>;
  isCompacted?: boolean;
  fullscreenEnabled?: boolean;
  headerSticky?: boolean;
  footerSticky?: boolean;
  rowData?: any[];
  rowHeight?: number | string;
  footerClass?: any;
  getRowId?: (rowData: any) => string | number;
  suppressRowClickSelection?: boolean;
  rowSelection?: string;
  onRowClicked?: (rowData: any) => void;
  onSelectionChanged?: (selected: any) => void;
  frameworkComponents?: {
    [key: string]: Type<any>;
  };
}
