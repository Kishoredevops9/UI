import * as go from 'gojs';

import { handleDropOnTheDiagram } from '../listeners/handleDropOnTheDiagram';
import { updatePlusButtons } from '../templates/lane/plusButton';
import { registerHeaders } from '../listeners/registerHeaders';
import { proceedNodesAfterPaste } from '../listeners/proceedNodesAfterPaste';
import { registerPlusButtons } from '../listeners/registerPlusButtons';
import { assignAdornmentsToParts } from '../listeners/assignAdornmentsToParts';
import { handleLinkDrawn } from '../listeners/handleLinkDrawn';
import { handleViewportBoundsChanged } from '../listeners/handleViewportBoundsChanged';

export const subscribeListeners = (diagram: go.Diagram) => {
  diagram.addDiagramListener(
    'ViewportBoundsChanged',
    handleViewportBoundsChanged(diagram)
  );
  diagram.addDiagramListener(
    'LayoutCompleted',
    () => updatePlusButtons(diagram)
  );
  diagram.addDiagramListener(
    'InitialLayoutCompleted',
    () => {
      registerHeaders(diagram);
      registerPlusButtons(diagram);
    }
  );
  diagram.addDiagramListener(
    'ClipboardPasted',
    ({ subject }) => proceedNodesAfterPaste(diagram, subject)
  );
  // HACK: After delete undo adornments are not assigned to part
  // This fix such behaviour but it can probably solved better
  diagram.addModelChangedListener(({ propertyName }) => {
    if (propertyName === 'FinishedUndo') {
      assignAdornmentsToParts(diagram);
    }
  });
  diagram.mouseDrop = handleDropOnTheDiagram;
  diagram.addDiagramListener('LinkDrawn', handleLinkDrawn);

  return diagram;
};
