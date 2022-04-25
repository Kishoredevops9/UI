import { Component, Directive, Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable()
export class BaseComponent implements OnDestroy {
  private isAlive$ = new Subject<any>();

  protected unsubsribeOnDestroy = <T = unknown>(source: Observable<T>): Observable<T> =>
    source.pipe(takeUntil(this.isAlive$));

  public ngOnDestroy() {
    this.isAlive$.next();
    this.isAlive$.complete();
  }
}
