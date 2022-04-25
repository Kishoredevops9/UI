import * as go from 'gojs';
import * as _ from 'lodash/fp';

import { Phase } from '../../../../../../../../process-maps/process-maps.model';
import { getApiForDiagram } from '../../../getApiForDiagram';
import { LANE_PHASE_WIDTH } from '../../../../consts';
import { handlePhaseUpdate } from './handlePhaseUpdate';
import { getLanePhases } from '../../../../utils/getLanePhases';
import { skipUndoManager } from '../../../../utils/skipUndoManager';
import { runWithoutLayoutAnimation } from '../../../../listeners/runWithoutLayoutAnimation';
import { updateLanesWidth } from '../../../../managers/resize/updateLanesWidth';
import { registerHeaders } from '../../../../listeners/registerHeaders';
import { getPhases } from '../../../../utils/getPhases';

export const showPropertiesForNewPhase = _.curry(async (
  diagram: go.Diagram,
  order: number
) => {
  const api = getApiForDiagram(diagram);
  const result = await api.openDialogBox({
    type: 'InsertPhase'
  }) as Phase;

  if (!result) {
    removeLanePhases(diagram, order);
    return;
  }

  const httpResult = await api.http.handlePhaseInsert({
    ...result,
    sequenceNumber: order,
    size: `${LANE_PHASE_WIDTH} 0`
  });
  handlePhaseUpdate(diagram, order, httpResult);
  handleAppendingPhasesOrderUpdate(diagram, order);
});

const handleAppendingPhasesOrderUpdate = (diagram: go.Diagram, order: number) => {
  const api = getApiForDiagram(diagram);
  _.flowRight(
    _.forEach((data: go.ObjectData) => api.http.handlePhaseUpdate({ id: data.key, sequenceNumber: data.order })),
    _.filter((phase: go.ObjectData) => phase.order > order),
    getPhases
  )(diagram);
};

export const removeLanePhases = (
  diagram: go.Diagram,
  order: number
) => skipUndoManager(diagram, () => {
  _.flowRight(
    _.each((lanePhase: go.Group) => diagram.remove(lanePhase)),
    _.filter({ data: { order } }),
    getLanePhases
  )(diagram);

  runWithoutLayoutAnimation(
    diagram,
    () => {
      updateLanesWidth(diagram);
      registerHeaders(diagram);
      diagram.updateAllTargetBindings();
    },
    true
  );
});
