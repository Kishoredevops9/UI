import * as _ from 'lodash/fp';
import * as go from 'gojs';

import { NodeData } from '../../../types/node';

export const adjustSwimLanesSizes = (swimLanes: NodeData[], phases: NodeData[]) => {
  return _.map((swimLane: NodeData) => {
    const size = go.Size.parse(swimLane.size);
    const lanePhases = _.filter({ group: swimLane.key })(phases);
    size.width = _.flowRight(
      _.sum,
      _.map(_.get('width')),
      _.map(go.Size.parse),
      _.map(_.get('size'))
    )(lanePhases) + lanePhases.length;

    return {
      ...swimLane,
      size: go.Size.stringify(size)
    };
  })(swimLanes);
};

export const adjustLanePhasesSizes = (swimLanes: NodeData[], phases: NodeData[]) => _.flowRight(
  _.flatten,
  _.map((swimLane: NodeData) => {
    const swimLaneHeight = go.Size.parse(swimLane.size).height;

    return _.flowRight(
      _.map((lanePhase: NodeData) => {
        const lanePhaseSize = go.Size.parse(lanePhase.size);
        lanePhaseSize.height = swimLaneHeight;

        return {
          ...lanePhase,
          size: go.Size.stringify(lanePhaseSize)
        };
      }),
      _.filter({ group: swimLane.key })
    )(phases);
  })

)(swimLanes);
