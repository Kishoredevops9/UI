import * as go from 'gojs';
import { getApiForDiagram } from '../api/getApiForDiagram';
import { skipUndoManager } from '../utils/skipUndoManager';

export const proceedNodesAfterPaste = (diagram: go.Diagram, subject: go.Iterator<go.Part>) => {
  subject.each((part: go.Part) => {
    if (part instanceof go.Node) {
      handlePastedNode(diagram, part);
    } else if (part instanceof go.Link) {
      skipUndoManager(diagram, () => diagram.remove(part));
    }
  });
};

const handlePastedNode = (diagram: go.Diagram, part: go.Part) => {
  if (!part.containingGroup) {
    return diagram.remove(part);
  }

  part.location = part.containingGroup.location;
  getApiForDiagram(diagram).showPropertiesForPastedNode(
    part.containingGroup,
    part
  );
}
