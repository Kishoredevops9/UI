import * as go from 'gojs';
import html2canvas from 'html2canvas';

import { makePdf } from './makePdf';
import { makeSvg } from './makeSvg';
import { makePng } from './makePng';
import { getLastLane } from '../../../utils/getLanes';
import { LANE_PLUS_BUTTON_ADORNMENT } from '../../../consts';
import { NodeCategory } from '@app/diagram-gojs/types/node';
import { getApiForDiagram } from '../../getApiForDiagram';

const getHeader = async (): Promise<{ canvas: HTMLCanvasElement | null, height: number, width: number }> => {
  const docTitle = document.getElementById('docTitle');
  const docType = document.getElementsByClassName('document-type')[0] as HTMLElement;
  const headerMargin = 20;

  if (!docType || !docTitle) {
    return { canvas: null, height: 0, width: 0 };
  }

  const docTitleCanvas = await html2canvas(docTitle);
  const docTypeCanvas = await html2canvas(docType);

  const canvasWidth = docTitle.getBoundingClientRect().width + docType.getBoundingClientRect().width + headerMargin;
  const canvasHeight = docType.getBoundingClientRect().height;

  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(docTypeCanvas, 0, 0);
  ctx.drawImage(docTitleCanvas, docType.getBoundingClientRect().width, 0);

  return {
    canvas,
    height: canvasHeight + headerMargin,
    width: canvasWidth
  };
};

export const prepareDiagramForExport = async (
  diagram: go.Diagram,
  callback: () => Promise<void>
) => {
  const plusButton = getLastLane(diagram).findAdornment(LANE_PLUS_BUTTON_ADORNMENT);
  const prevRect = diagram.viewportBounds.copy();
  const prevScale = diagram.scale;
  const { canvas, height, width } = await getHeader();
  const titleData = {
    element: canvas,
    size: `${width} ${height}`,
    loc: `${0} -${height + 38}`,
    category: NodeCategory.Title
  };
  diagram.model.addNodeData(titleData);

  const prevButtonVisible = plusButton?.visible;
  if (plusButton) {
    plusButton.visible = false;
  }
  diagram.commandHandler.zoomToFit();

  const result = await callback();

  diagram.model.removeNodeData(titleData);
  if (plusButton) {
    plusButton.visible = prevButtonVisible;
  }
  diagram.scale = prevScale;
  diagram.centerRect(prevRect);

  return result;
};

const getFilename = (diagram: go.Diagram, extension: string) => {
  const api = getApiForDiagram(diagram);
  const { contentId } = api.processMap.get();

  return `${contentId}.${extension}`;
}

const downloadBlob = (blob: Blob, filename: string) => {
  // IE11 Support
  if ((window.navigator as any).msSaveBlob) {
    (window.navigator as any).msSaveBlob(blob, filename);
    return;
  }

  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);

  requestAnimationFrame(() => {
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  });
};

export const exportAsSVG = (
  diagram: go.Diagram
) => prepareDiagramForExport(diagram, async () => {
  const svg = await makeSvg(diagram);
  const svgString = new XMLSerializer().serializeToString(svg);
  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  const filename = getFilename(diagram, 'svg');

  downloadBlob(blob, filename);
});

export const exportAsPDF = (
  diagram: go.Diagram
) => prepareDiagramForExport(diagram, async () => {
  const pdf = await makePdf(diagram);
  const filename = getFilename(diagram, 'pdf');

  pdf.getBlob((blob: Blob) => {
    downloadBlob(blob, filename);
  });
});

export const exportAsPNG = (
  diagram: go.Diagram,
  scale: number
) => prepareDiagramForExport(diagram, async () => {
  const blob = await makePng(diagram, scale);
  const filename = getFilename(diagram, 'png');

  downloadBlob(blob, filename);
});
