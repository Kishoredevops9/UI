import * as go from 'gojs';

export const runListenerOnce = (
  diagram: go.Diagram,
  diagramEvent: go.DiagramEventName,
  callback: () => void
) => {
  const eventHandler = () => {
    callback();
    diagram.removeDiagramListener(diagramEvent, eventHandler)
  }

  diagram.addDiagramListener(diagramEvent, eventHandler);
}
