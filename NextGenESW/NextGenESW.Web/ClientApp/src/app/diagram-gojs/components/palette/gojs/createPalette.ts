import * as go from 'gojs';
import { nodeTemplate } from './templates/node';

const $ = go.GraphObject.make;

const layout = () => $(
  go.GridLayout,
  {
    wrappingColumn: 2
  }
);

export const createPalette = () => $(
  go.Palette,
  {
    layout: layout(),
    nodeTemplate: nodeTemplate(),
    allowZoom: false
  }
);
