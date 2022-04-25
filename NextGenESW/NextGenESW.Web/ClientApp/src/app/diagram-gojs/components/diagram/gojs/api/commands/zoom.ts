import * as go from 'gojs';

export const zoomToFit = (diagram: go.Diagram) => () => {
  diagram.commandHandler.zoomToFit();
};

export const zoomIn = (diagram: go.Diagram) => (scaleStep: number = 0.1) => {
  diagram.scale += scaleStep
};

export const zoomOut = (diagram: go.Diagram) => (scaleStep: number = 0.1) => {
  diagram.scale -= scaleStep
};
