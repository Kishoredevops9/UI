import * as go from 'gojs';

import { LANES_BREAK } from '../consts';

export class LanesLayout extends go.GridLayout {

    wrappingColumn = 1;
    spacing = new go.Size(LANES_BREAK, LANES_BREAK);
    isViewportSized = false;

    comparer = (partA, partB) => {
      const { order: orderA } = partA.data;
      const { order: orderB } = partB.data;

      if (orderA < orderB) {
        return -1;
      }
      if (orderA > orderB) {
        return 1;
      }
      return 0;
    }
}
