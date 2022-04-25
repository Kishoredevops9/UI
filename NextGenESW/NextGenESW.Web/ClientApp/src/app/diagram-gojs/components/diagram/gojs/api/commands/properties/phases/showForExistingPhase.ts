import * as go from 'gojs';
import * as _ from 'lodash/fp';

import { Phase } from '../../../../../../../../process-maps/process-maps.model';
import { getApiForDiagram } from '../../../getApiForDiagram';
import { NodeData } from '../../../../../../../types/node';
import { parseLanePhaseKey } from '../../../../utils/getLanePhaseKey';
import { handlePhaseUpdate } from './handlePhaseUpdate';

export const showPropertiesForExistingPhase = _.curry(async (
  diagram: go.Diagram,
  phaseData: NodeData
) => {
  const api = getApiForDiagram(diagram);
  const dialogResult = await api.openDialogBox({
    type: 'UpdatePhase',
    payload: phaseData
  }) as Partial<Phase>;
  if (!dialogResult) {
    return;
  }

  const { phaseId } = parseLanePhaseKey(phaseData.key as string);

  const httpResult = await api.http.handlePhaseUpdate({
    id: phaseId,
    size: phaseData.size,
    ...dialogResult
  });

  handlePhaseUpdate(diagram, phaseData.order, httpResult);
});


