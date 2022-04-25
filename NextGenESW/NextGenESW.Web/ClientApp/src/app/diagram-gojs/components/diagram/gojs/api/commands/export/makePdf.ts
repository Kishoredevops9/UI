import * as go from 'gojs';
import { makeSvg } from './makeSvg';

const MARGIN = 12;

const getFonts = () => ({
  Barlow: {
    bold: `${window.location.origin}/assets/fonts/Barlow/Barlow-Bold.ttf`,
    bolditalics: `${window.location.origin}/assets/fonts/Barlow/Barlow-Bold.ttf`,
    italics: `${window.location.origin}/assets/fonts/Barlow/Barlow-Regular.ttf`,
    normal: `${window.location.origin}/assets/fonts/Barlow/Barlow-Regular.ttf`
  }
});

const getPageSize = (diagram: go.Diagram) => {
  const { width, height } = diagram.documentBounds;
  return {
    width: width + MARGIN,
    height: height + MARGIN
  }
}

export const makePdf = async (diagram: go.Diagram) => {
  const pdfMake = await import('pdfmake');
  const svg = await makeSvg(diagram);
  const svgString = new XMLSerializer().serializeToString(svg);

  const content = {
    pageSize: getPageSize(diagram),
    pageMargins: MARGIN,
    content: [
      {
        svg: svgString
      },
    ],
    defaultStyle: {
      font: 'Barlow'
    }
  };

  const fonts = getFonts();
  return pdfMake.createPdf(content, null, fonts);
};
