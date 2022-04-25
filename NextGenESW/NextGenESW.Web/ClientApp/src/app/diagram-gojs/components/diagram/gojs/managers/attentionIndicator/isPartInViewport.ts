import * as go from 'gojs';

export const isPartInViewport = (
  part: go.Part,
  margin: number
) => {
  const partBoundsWithMargin = part.actualBounds.copy().subtractMargin(
    new go.Margin(margin / part.diagram.scale)
  );

  return part.diagram.viewportBounds.intersectsRect(
    partBoundsWithMargin
  );
};
