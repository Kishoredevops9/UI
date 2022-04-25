import * as _ from 'lodash/fp';
import * as go from 'gojs';

import { isLanePhase } from '../utils/getLanePhases';

export class LanePhasesLayout extends go.Layout {
  doLayout(coll: go.Group) {
    let lanePhases = [];
    let newPosition = 0;

    coll.memberParts
      .filter(isLanePhase)
      .each((lanePhase: go.Group) => lanePhases = [...lanePhases, lanePhase]);

    lanePhases
      .sort(({ data: dataA }, { data: dataB }) => {
        if (dataA.order === dataB.order) {
          return 0;
        }

        return dataA.order > dataB.order ? 1 : -1;
      })
      .forEach((lanePhase: go.Group) => {
        const y = _.isNaN(coll.actualBounds.y) ? 0 : coll.actualBounds.y;
        lanePhase.moveTo(newPosition, y, true);
        newPosition += lanePhase.actualBounds.width;
      })
  }
}
