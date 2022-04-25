import * as _ from 'lodash/fp';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { DiagramConfiguration, DiagramModel } from './diagram.types';
import { ProcessMapDiagram } from '../../types/processMap';
import { mapProcessMap } from './mapProcessMap/mapProcessMap';

@Injectable()
export class DiagramDataService {

  private processMap$ = new BehaviorSubject<ProcessMapDiagram>(null);
  private configuration$ = new BehaviorSubject<DiagramConfiguration>(null);

  setProcessMap(processMap: ProcessMapDiagram) {
    this.processMap$.next(processMap);
  }

  getCurrentProcessMap(): ProcessMapDiagram {
    return this.processMap$.getValue();
  }

  getDiagramModel(): Observable<DiagramModel> {
    return this.processMap$.pipe(
      filter(_.identity),
      filter((processMap) => !processMap.skipsDiagramUpdate),
      map((processMap) => mapProcessMap(processMap, this.getCurrentConfiguration()))
    );
  }

  setConfiguration(configuration: DiagramConfiguration) {
    this.configuration$.next(configuration);
  }

  getConfiguration(): Observable<DiagramConfiguration> {
    return this.configuration$;
  }

  getCurrentConfiguration() {
    return this.configuration$.getValue();
  }

}
