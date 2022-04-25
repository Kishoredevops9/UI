import * as go from 'gojs';

import { insertPhaseAfter, insertPhaseAtTheEnd } from './commands/insert/insertPhase';
import { insertLaneBelow, insertLaneAtTheEnd } from './commands/insert/insertLane';
import { exportAsPDF, exportAsPNG, exportAsSVG } from './commands/export/export';
import { insertShapeBelow } from './commands/insert/insertShapeBelow';
import { deleteLinkByKey, deleteNodeByKey } from './commands/delete';
import { createContextMenuApi } from './commands/contextMenu';
import { zoomIn, zoomOut, zoomToFit } from './commands/zoom';
import { insertShape } from './commands/insert/insertShape';
import { createDialogBoxApi } from './commands/dialogBox';
import { createPropertiesApi } from './commands/properties/properties';
import { toggleLinksVisibility } from './commands/toggleLinksVisibility';
import { expandCollapseLane } from './commands/expandCollapseLane';
import { expandCollapsePhase } from './commands/expandCollapsePhase';
import { createHttpApi } from './commands/http/http';
import { seeThroughApi } from './commands/seeThrough';
import { toggleTraceShape } from './commands/toggleTraceShape';
import { DiagramApi } from './types';
import { registerHeaders } from '../listeners/registerHeaders';
import { registerPlusButtons } from '../listeners/registerPlusButtons';
import { Diagram } from '../types';
import { togglePinShape } from './commands/togglePinShape';
import { createConfigurationApi } from './commands/configuration';
import { toggleNodeSelection } from './commands/toggleNodeSelection';
import { makeSnapshot } from './commands/export/makeSnapshot';
import { createSnackBarApi } from './commands/snackBar';
import { createProcessMapApi } from './commands/processMap';

const assignApiToDiagram = (diagram: go.Diagram, api: DiagramApi) => {
  const diagramWithApi = diagram as Diagram;
  diagramWithApi.api = api;
};

export const createApi = (diagram: go.Diagram) => {
  const api = {
    zoomToFit: zoomToFit(diagram),
    zoomIn: zoomIn(diagram),
    zoomOut: zoomOut(diagram),
    deleteNodeByKey: deleteNodeByKey(diagram),
    deleteLinkByKey: deleteLinkByKey(diagram),
    insertShape: insertShape(diagram),
    insertShapeBelow: insertShapeBelow(diagram),
    insertLaneBelow: insertLaneBelow(diagram),
    insertLaneAtTheEnd: () => insertLaneAtTheEnd(diagram),
    insertPhaseAfter: insertPhaseAfter(diagram),
    insertPhaseAtTheEnd: () => insertPhaseAtTheEnd(diagram),
    exportAsPDF: () => exportAsPDF(diagram),
    exportAsSVG: () => exportAsSVG(diagram),
    exportAsPNG: (scale: number = 3) => exportAsPNG(diagram, scale),
    makeSnapshot: (width: number = 400, height: number = 200) =>
      makeSnapshot(diagram, width, height),
    toggleLinksVisibility: toggleLinksVisibility(diagram),
    toggleTraceShape: toggleTraceShape(diagram),
    togglePinShape: togglePinShape(diagram),
    updateAdornments: () => {
      registerHeaders(diagram);
      registerPlusButtons(diagram);
    },
    ...createContextMenuApi(diagram),
    ...createDialogBoxApi(),
    ...createPropertiesApi(diagram),
    ...seeThroughApi(),
    ...createConfigurationApi(diagram),
    ...createSnackBarApi(),
    http: createHttpApi(),
    expandCollapseLane: expandCollapseLane(diagram),
    expandCollapsePhase: expandCollapsePhase(diagram),
    toggleNodeSelection: toggleNodeSelection(diagram),
    processMap: createProcessMapApi()
  };
  assignApiToDiagram(diagram, api);

  return api;
};
