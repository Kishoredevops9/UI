import * as go from 'gojs';

import { Connector } from '../../../../../../../../process-maps/process-maps.model';
import { skipUndoManager } from '../../../../utils/skipUndoManager';
import { Diagram } from '../../../../types';

export const handleLinkUpdate = (
  diagram: go.Diagram,
  linkKey: go.Key,
  connector: Connector
) => {
  const link = diagram.findLinkForKey(linkKey);
  link.visible = (diagram as Diagram).linksVisibility;
  skipUndoManager(diagram, () => {
    (diagram.model as go.GraphLinksModel).setKeyForLinkData(
      link.data,
      connector.id
    );
    diagram.model.setDataProperty(link.data, 'label', connector.captionMiddle);
    diagram.model.setDataProperty(link.data, 'fromLabel', connector.captionStart);
    diagram.model.setDataProperty(link.data, 'toLabel', connector.captionEnd);
  });
};
