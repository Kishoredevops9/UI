import * as go from 'gojs';

export const makeSvg = (
  diagram: go.Diagram
) => new Promise<SVGElement>((resolve) => {
  diagram.makeSvg({
    scale: 1,
    callback: (svgElement: SVGElement) => {
      resolve(svgElement);
    }
  } as go.SvgRendererOptions);
});
