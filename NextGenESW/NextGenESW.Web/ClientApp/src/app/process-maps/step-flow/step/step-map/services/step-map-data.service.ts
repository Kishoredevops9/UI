import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { map, mergeMap, take, tap } from 'rxjs/operators';

import { ProcessMapsDiagramDataService } from '../../../../process-maps-diagram-data.service';
import * as ProcessMapsActions from '../../../../process-maps.actions';
import { ProcessMap } from '../../../../process-maps.model';
import { selectedProcessMapSelector } from '../../../../process-maps.selectors';

export type StepMapData = {
  loading: boolean;
  processMap?: ProcessMap;
};

@Injectable()
export class StepMapDataService {

  data = new BehaviorSubject<StepMapData>({
    loading: true
  });

  constructor(
    private dataService: ProcessMapsDiagramDataService,
    private route: ActivatedRoute,
    private store: Store
  ) { }

  getProcessMapBasedOnUrl() {
    this.updateData({
      loading: true
    });

    this.route.params
      .pipe(
        take(1),
        map(params => ({ ...params, ...this.route.snapshot.queryParams })),
        mergeMap((params) => this.dataService.getStepDiagramWithUrlParams(params)),
        tap((processMap) => {
          this.store.dispatch(ProcessMapsActions.loadProcessMapSuccess({
            selectedProcessMap: processMap
          }));
          this.store.dispatch(ProcessMapsActions.setSelectedProcessMapId({
            id: processMap.id
          }));
        }),
        mergeMap(() => this.store.select(selectedProcessMapSelector))
      )
      .subscribe((processMap) => {
        this.updateData({
          loading: false,
          processMap
        });
      });
  }

  getData(): Observable<StepMapData> {
    return this.data;
  }

  private updateData(data: StepMapData) {
    this.data.next(data);
  }

}
