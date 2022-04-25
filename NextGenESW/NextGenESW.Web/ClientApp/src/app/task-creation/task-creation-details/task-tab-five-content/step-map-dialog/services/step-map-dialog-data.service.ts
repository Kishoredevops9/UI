import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import * as _ from 'lodash/fp';

import { ProcessMapsDiagramDataService } from '../../../../../process-maps/process-maps-diagram-data.service';
import { ProcessMap } from '../../../../../process-maps/process-maps.model';
import { Item } from '../../../../task-creation.model';
import { filterSelectedDisciplines } from '../utils/filterSelectedDisciplines';
import { filterSelectedActivityBlocks } from '../utils/filterSelectedActivityBlocks';

@Injectable()
export class StepMapDialogDataService {

  constructor(
    private service: ProcessMapsDiagramDataService
  ) {}

  getTaskExecutionStepDiagram(
    contentId: any,
    taskExecutionData: any,
    taskExecutionStep: Item
  ) {
    return this.service.getTaskExecutionStepDiagramWithContentId(contentId)
      .pipe(
        map((processMap) => {
          return this.mergeMapWithTaskExecution(processMap, taskExecutionData);
        }),
        map((processMap) => filterSelectedDisciplines(taskExecutionStep, processMap)),
        map((processMap) => filterSelectedActivityBlocks(taskExecutionStep, processMap))
      );
  }

  private mergeMapWithTaskExecution(
    processMap: ProcessMap,
    taskExecutionData: any
  ): ProcessMap {
    const { activityBlocks } = processMap;
    const nextBlocks = activityBlocks.map((block) => ({
      ...block,
      assetStatusId: taskExecutionData[(block as any).assetContentId]
    }))

    return {
      ...processMap,
      activityBlocks: nextBlocks
    };
  }

}
