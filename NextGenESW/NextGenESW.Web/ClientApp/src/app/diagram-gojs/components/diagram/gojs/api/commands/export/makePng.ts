import * as go from 'gojs';

export const makePng = (
  diagram: go.Diagram,
  scale: number
) => new Promise<Blob>((resolve) => {
  const padding = 50;
  const { width, height } = diagram.documentBounds;
  const scaledWidth = scale * (width + padding);
  const scaledHeight = scale * (height + padding);

  diagram.makeImageData({
    scale,
    returnType: 'blob',
    maxSize: new go.Size(scaledWidth, scaledHeight),
    callback: (blob) => resolve(blob)
  });
});
