import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import * as _ from 'lodash/fp';

import { ProcessMapsDiagramDataService } from '../../process-maps-diagram-data.service';
import { Item } from '../../../task-creation/task-creation.model';
import { ProcessMap } from '../../process-maps.model';
import { ActivityTaskStatusMap } from '../utils/activityTask';
import { parseTaskExecutionData } from '../utils/parseTaskExecutionData';
import { getIncludedStepFlows } from '../utils/getIncludedStepFlows';
import { filterTaskStepFlow } from '../utils/filterTaskStepFlow';
import { getTaskExecutionChildByContentId } from '../utils/getTaskExecutionChildByContentId';

export type TaskExecutionData = {
  loading: boolean;
  processMap?: ProcessMap;
}

@Injectable()
export class TaskExecutionMapDataService {

  private activityStatusMap = new BehaviorSubject<ActivityTaskStatusMap>({});
  private taskExecutionData = new BehaviorSubject<Item>(null);

  private data = new BehaviorSubject<TaskExecutionData>({
    loading: true
  });

  constructor(
    private dataService: ProcessMapsDiagramDataService
  ) { }

  setTaskExecutionData(data: Item) {
    const next = parseTaskExecutionData(data);
    this.activityStatusMap.next(next);
    this.taskExecutionData.next(data);
  }

  setSelectedContentId(contentId: string) {
    this.data.next({ loading: true });
    this.dataService.getTaskExecutionDiagramWithContentId(contentId)
      .pipe(
        withLatestFrom(this.taskExecutionData),
        map(([processMap, taskExecutionData]) => filterTaskStepFlow(
          taskExecutionData,
          contentId,
          processMap
        ))
      )
      .subscribe((processMap) => this.data.next({
        loading: false,
        processMap
      }));
  }
  
  getDropdownItems() {
    return this.taskExecutionData.pipe(
      map((item) => _.flowRight(
        _.map(({ content }: Item) => ({
          name: content.title,
          value: content.contentId
        })),
        getIncludedStepFlows
      )(item))
    )
  }

  getData(): Observable<TaskExecutionData> {
    return combineLatest(
      this.data,
      this.activityStatusMap
    ).pipe(
      map(
        ([data, taskExecution]) =>
          this.joinWithTaskExecutionData(data, taskExecution)
      )
    );
  }

  getCurrentActivityStatusMap() {
    return this.activityStatusMap.getValue();
  }

  getCurrentTaskExecutionData() {
    return this.taskExecutionData.getValue();
  }

  getStepTaskExecution(stepFlowContentId: string, stepContentId: string) {
    const stepFlow = getTaskExecutionChildByContentId(
      this.getCurrentTaskExecutionData(),
      stepFlowContentId
    );
    return getTaskExecutionChildByContentId(
      stepFlow,
      stepContentId
    );
  }

  private joinWithTaskExecutionData(
    data: TaskExecutionData,
    taskExecution: ActivityTaskStatusMap
  ): TaskExecutionData {
    if (data.loading) {
      return data;
    }

    return {
      ...data,
      processMap: this.adjustProcessMap(data.processMap, taskExecution)
    }
  }

  private adjustProcessMap(
    processMap: ProcessMap,
    taskExecution: ActivityTaskStatusMap
  ): ProcessMap {
    const next = processMap.activityBlocks.map((block) => ({
      ...block,
      assetStatusId: taskExecution[(block as any).assetContentId]
    }));

    return {
      ...processMap,
      activityBlocks: next
    };
  }

}
