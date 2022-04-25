import * as go from 'gojs';
import * as _ from 'lodash/fp';

import { LinkData } from '../../../../../../../types/node';
import { getApiForDiagram } from '../../../getApiForDiagram';
import { handleLinkUpdate } from './handleLinkUpdate';

export const showPropertiesForNewLink = _.curry(async (
  diagram: go.Diagram,
  link: LinkData,
) => {
  const api = getApiForDiagram(diagram);
  const httpResult = await api.http.handleLinkInsert({
    activityBlockId: link.to as number,
    previousActivityBlockId: link.from as number
  });

  handleLinkUpdate(diagram, link.key, httpResult);
});
