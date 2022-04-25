import * as _ from 'lodash/fp';

import { ActivityGroup, ProcessMap } from '../../../../../process-maps/process-maps.model';
import { isIncluded } from '../../../../../process-maps/task-execution-map/utils/isIncluded';
import { Item } from '../../../../task-creation.model';

const findMathingDiscipline = (
  lane: ActivityGroup,
  disciplines: Item[]
): Item => {
  const { disciplineText } = lane;
  return _.find((item) => {
    const { discipline1, discipline2, discipline3 } = item.content;
    return discipline1 === disciplineText
      || discipline2 === disciplineText
      || discipline3 === disciplineText;
  })(disciplines);
};

export const filterSelectedDisciplines = (
  taskExecutionStep: Item,
  processMap: ProcessMap
) => {
  const swimLanes = _.filter((lane: ActivityGroup) => {
    const discipline = findMathingDiscipline(lane, taskExecutionStep.children);
    if (!discipline) {
      console.warn(`Discipline ${lane.disciplineText} is not in task execution data`);
    }
    return isIncluded(discipline);
  })(processMap.swimLanes);

  return {
    ...processMap,
    swimLanes
  };
};

