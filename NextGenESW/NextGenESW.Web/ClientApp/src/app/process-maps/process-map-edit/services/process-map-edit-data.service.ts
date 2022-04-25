import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, map, take, tap } from 'rxjs/operators';

import { selectedProcessMapIdSelector, selectedProcessMapSelector } from '../../process-maps.selectors';
import * as ProcessMapsActions from '../../process-maps.actions';
import { ProcessMapsState } from '../../process-maps.reducer';
import { ProcessMap } from '../../process-maps.model';
import { isProcessMapPublished } from '../../utils/isProcessMapPublished';

@Injectable()
export class ProcessMapEditDataService {

  constructor(
    private store: Store<ProcessMapsState>
  ) {}

  /**
   * @deprecated
   */
  loadProcessMap(id: number) {
    // TODO: Remove this call!
    console.warn('ProcessMapEditDataService#loadProcessMap is deprecated, please remove usage of this method');
    this.store.dispatch(
      ProcessMapsActions.loadProcessMap({ id: Number(id) })
    );
  }

  getLoadedProcessMap() {
    return this.store.select(selectedProcessMapSelector)
      .pipe(
        filter((processMap) => !!processMap),
        tap((processMap) => {
          if (!processMap.phases?.length) {
            this.ensureAtLeastOnePhaseIsCreated();
          }
        }),
        filter((processMap) => !!processMap.phases?.length)
      );
  }

  getIsPublishedMap() {
    return this.store.select(selectedProcessMapSelector)
      .pipe(
        filter((processMap) => !!processMap),
        map((processMap) => this.isPublishedMap(processMap))
      );
  }

  ensureAtLeastOnePhaseIsCreated() {
    this.store.select(selectedProcessMapIdSelector)
      .pipe(take(1))
      .subscribe((mapId) => {
        this.store.dispatch(ProcessMapsActions.addPhase({
          phase: {
            name: 'Phase',
            caption: '',
            sequenceNumber: 1,
            processMapId: mapId
          }
        }));
      });
  }

  private isPublishedMap(processMap: ProcessMap) {
    return isProcessMapPublished(processMap);
  }

}
