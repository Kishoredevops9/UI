import * as _ from 'lodash/fp';
import * as go from 'gojs';
import { skipUndoManager } from '../../utils/skipUndoManager';
import { Diagram } from '../../types';

export const toggleLinksVisibility = _.curry((
  diagram: go.Diagram,
  visibility: boolean
) => skipUndoManager(diagram, () => {
  diagram.links.each(
    (link: go.Link) => link.visible = visibility
  );
  (diagram as Diagram).linksVisibility = visibility;
}));
