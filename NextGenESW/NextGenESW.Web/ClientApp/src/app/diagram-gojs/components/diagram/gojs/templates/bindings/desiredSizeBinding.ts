import * as go from 'gojs';

export const desiredSizeBinding = (
  firstWayModifier?: (size: string, obj: go.Part) => go.Size,
  secondWayModifier?: (desiredSize: go.Size, data: go.ObjectData) => string
) => new go.Binding(
  'desiredSize',
  'size',
  firstWayModifier || go.Size.parse
).makeTwoWay(secondWayModifier || go.Size.stringify);
