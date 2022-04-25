import * as go from 'gojs';
import * as _ from 'lodash/fp';

import { ActivityGroup } from '../../../../../../../../process-maps/process-maps.model';
import { getLanes } from '../../../../utils/getLanes';
import { skipUndoManager } from '../../../../utils/skipUndoManager';
import { propagateEventsForLanePhases } from '../../../../managers/lanePhasePropagator/lanePhasePropagator';
import { PROPAGATE_SELECTOR } from '../../../../managers/lanePhasePropagator/selectors';
import { getApiForDiagram } from '../../../getApiForDiagram';
import { getLanePhaseKey, parseLanePhaseKey } from '../../../../utils/getLanePhaseKey';

export const handleSwimLaneUpdate = (
  diagram: go.Diagram,
  order: number,
  httpResult: ActivityGroup
) => {
  const swimlane = _.flowRight(
    _.head,
    _.filter({ data: { order } }),
    getLanes
  )(diagram);

  skipUndoManager(diagram, () => {
    const { data } = swimlane;
    const {
      id, disciplineText, color, borderColor, borderStyle, borderWidth, description
    } = httpResult;

    diagram.model.setKeyForNodeData(data, id);
    propagateEventsForLanePhases(
      [PROPAGATE_SELECTOR.CHILDREN],
      swimlane.part,
      (lanePhase) => {
        const { phaseId } = parseLanePhaseKey(lanePhase.key as string);
        diagram.model.setKeyForNodeData(lanePhase.data, getLanePhaseKey(phaseId, id));
        diagram.model.setDataProperty(lanePhase.data, 'borderColor', borderColor)
      }
    );

    diagram.model.setDataProperty(data, 'name', getDisciplineText(diagram, disciplineText));
    diagram.model.setDataProperty(data, 'description', description);
    diagram.model.setDataProperty(data, 'backgroundColor', color);
    diagram.model.setDataProperty(data, 'borderColor', borderColor);
    diagram.model.setDataProperty(data, 'borderStyle', borderStyle);
    diagram.model.setDataProperty(data, 'borderWidth', borderWidth);
  });
};

const getDisciplineText = (
  diagram: go.Diagram,
  value: string
) => {
  const { isStepFlowMap } = getApiForDiagram(diagram).getConfiguration();
  if (!isStepFlowMap) {
    return value;
  }

  return value || 'STEP';
}
