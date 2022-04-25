import * as go from 'gojs';
import * as _ from 'lodash/fp';

import { NodeCategory, NodeData } from '../../../types/node';
import { Phase } from '../../../../process-maps/process-maps.model';
import { getLanePhaseKey } from '../gojs/utils/getLanePhaseKey';

export const getLanePhases = (swimlanes: NodeData[], phases: Phase[]) => {
  let newY = 0;

  return _.flowRight(
    _.flatten,
    _.map((swimlane: NodeData) => {
        let newX = 0;
        const { key: swimlaneKey, borderColor } = swimlane;
        const swimLaneSize = go.Size.parse(swimlane.size);

        const newPhases = phases.map((phase: Phase) => {
            const phaseSize = go.Size.parse(phase.size);

            const newPhase =  {
              key: getLanePhaseKey(phase.id, swimlaneKey),
              category: NodeCategory.LanePhase,
              order: phase.sequenceNumber,
              group: swimlaneKey,
              size: go.Size.stringify(new go.Size(phaseSize.width, swimLaneSize.height)),
              loc: go.Point.stringify(new go.Point(newX, newY)),
              isGroup: true,
              name: phase.name,
              caption: phase.caption,
              borderColor
            };
            newX += phaseSize.width;
            return newPhase;
          }
        );

        newY += swimLaneSize.height;
        return newPhases;
      }
    )
  )(swimlanes);
};

