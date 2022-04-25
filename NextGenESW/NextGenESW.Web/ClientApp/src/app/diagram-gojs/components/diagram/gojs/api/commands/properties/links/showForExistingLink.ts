import * as go from 'gojs';
import * as _ from 'lodash/fp';

import { Connector } from '../../../../../../../../process-maps/process-maps.model';
import { LinkData } from '../../../../../../../types/node';
import { getApiForDiagram } from '../../../getApiForDiagram';
import { handleLinkUpdate } from './handleLinkUpdate';

export const showPropertiesForExistingLink = _.curry(async (
  diagram: go.Diagram,
  linkData: LinkData
) => {
  const api = getApiForDiagram(diagram);
  const result = await api.openDialogBox({
    type: 'UpdateLink',
    payload: linkData
  }) as Connector;

  if (!result) {
    return;
  }

  const httpResult = await api.http.handleLinkUpdate({
    ...result,
    id: linkData.key as number,
    activityBlockId: linkData.to as number,
    previousActivityBlockId: linkData.from as number
  });
  handleLinkUpdate(diagram, linkData.key, httpResult);
});
