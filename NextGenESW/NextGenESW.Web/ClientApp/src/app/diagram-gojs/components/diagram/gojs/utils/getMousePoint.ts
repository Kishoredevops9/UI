import * as go from 'gojs';

export const getDiagramMousePoint = (diagram: go.Diagram) =>
  diagram.lastInput.documentPoint;
