import { AfterViewInit, ChangeDetectorRef, Directive, Input, OnInit } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

const DEFAULT_PAGE_INDEX = 0;
const DEFAULT_PAGE_SIZE = 10;

@Directive({
  selector: '[paginationCaching]'
})
export class PaginationCachingDirective implements OnInit, AfterViewInit {
  @Input() paginationCaching: string;

  get pageSize() {
    return parseInt(localStorage.getItem(this.getSesstionStorageKey('pageSize')), 10) || DEFAULT_PAGE_SIZE;
  }

  set pageSize(size: number) {
    localStorage.setItem(this.getSesstionStorageKey('pageSize'), '' + size);
  }

  get pageIndex() {
    return parseInt(localStorage.getItem(this.getSesstionStorageKey('pageIndex')), 10) || DEFAULT_PAGE_INDEX;
  }

  set pageIndex(pageIndex: number) {
    localStorage.setItem(this.getSesstionStorageKey('pageIndex'), '' + pageIndex);
  }

  constructor(private element: MatPaginator, private cd: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.element.pageSize = this.pageSize;
    this.element.pageIndex = this.pageIndex;
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.element.pageSize = this.pageSize;
      this.element.pageIndex = this.pageIndex;
      this.cd.detectChanges();
    });
    this.element.page.subscribe((page: PageEvent) => {
      this.pageSize = page.pageSize;
      this.pageIndex = page.pageIndex;
    });
  }

  getSesstionStorageKey(type) {
    return `${ this.paginationCaching }.paginator.${ type }`;
  }

  removePaginationData() {
    localStorage.removeItem(this.getSesstionStorageKey('pageSize'));
    localStorage.removeItem(this.getSesstionStorageKey('pageIndex'));
    this.element.pageSize = DEFAULT_PAGE_SIZE;
    this.element.pageIndex = DEFAULT_PAGE_INDEX;
  }
}
