import * as go from 'gojs';
import * as _ from 'lodash/fp';

import { prepareDiagramForExport } from './export';

export const makeSnapshot = _.curry((
  diagram: go.Diagram,
  width: number,
  height: number
) => {
  const {
    width: diagramWidth,
    height: diagramHeight
  } = diagram.documentBounds;

  const widthScale = width / diagramWidth;
  const heightScale = height / diagramHeight;
  const scale = Math.min(widthScale, heightScale);

  return prepareDiagramForExport(diagram, () => new Promise((resolve) => {
    diagram.makeImageData({
      size: new go.Size(diagramWidth * scale, diagramHeight * scale),
      callback: (img) => resolve(img)
    })
  }));
});
