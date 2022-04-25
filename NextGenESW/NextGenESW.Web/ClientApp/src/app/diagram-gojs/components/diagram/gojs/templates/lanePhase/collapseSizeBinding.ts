import * as go from 'gojs';

export const collapseSizeBinding = (
  desiredSize,
  {
    size,
    isPhaseCollapsed,
    isLaneCollapsed
  }
) => {
  const { width, height } = go.Size.parse(size);
  const { width: newWidth, height: newHeight } = desiredSize;

  return go.Size.stringify(new go.Size(
    isPhaseCollapsed ? width : newWidth,
    isLaneCollapsed ? height : newHeight
  ));
};
