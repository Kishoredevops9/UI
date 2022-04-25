import * as _ from 'lodash/fp';
import * as go from 'gojs';

import { ActivityGroup } from '../../../../process-maps/process-maps.model';
import { NodeCategory } from '../../../types/node';
import { LANE_HEIGHT } from '../gojs/consts';
import { HttpAction } from '../gojs/types';
import { DiagramConfiguration } from '../diagram.types';

const _reduce = _.reduce.convert({ cap: false });

type LanesAndApiChanges = {
  lanes: ActivityGroup[],
  lanesApiChanges: HttpAction[]
};

const mapLanes = (configuration: DiagramConfiguration) => _.map((swimLane: ActivityGroup) => {
  const {
    id, disciplineText, sequenceNumber, color, borderColor,
    borderStyle, borderWidth, description, size
  } = swimLane;

  return {
    key: id,
    category: NodeCategory.Lane,
    isGroup: true,
    size,
    name: configuration.isStepFlowMap ? 'STEP' : disciplineText,
    order: sequenceNumber,
    backgroundColor: color,
    borderColor,
    borderStyle,
    borderWidth,
    description
  };
});

export const getSwimLanes = ({ swimLanes }, configuration: DiagramConfiguration) => _.flowRight(
  ({ lanes, lanesApiChanges }) => ({ lanesApiChanges, lanes: mapLanes(configuration)(lanes) }),
  _reduce((result: LanesAndApiChanges, lane: ActivityGroup, idx: number) => {
    let propertiesToUpdate = {};

    if (!lane.sequenceNumber || lane.sequenceNumber !== idx + 1) {
      const sequenceNumber = idx + 1;
      propertiesToUpdate = { ...propertiesToUpdate, sequenceNumber };
    }

    if (!lane.size) {
      const size = go.Size.stringify(new go.Size(0, LANE_HEIGHT));
      propertiesToUpdate = { ...propertiesToUpdate, size };
    }

    if (!lane.color) {
      const backgroundColor = '#ffffff';
      propertiesToUpdate = { ...propertiesToUpdate, backgroundColor };
    }

    return _.isEmpty(propertiesToUpdate)
      ? {
        lanes: [...result.lanes, lane],
        lanesApiChanges: result.lanesApiChanges
      }
      : {
        lanes: [...result.lanes, { ...lane, ...propertiesToUpdate }],
        lanesApiChanges: [
          ...result.lanesApiChanges,
          {
            type: 'UpdateSwimLane',
            payload: { id: lane.id, ...propertiesToUpdate }
          }
        ]
      };
  }, { lanes: [], lanesApiChanges: [] }),
  _.sortBy(({ sequenceNumber }) => sequenceNumber)
)(swimLanes);
