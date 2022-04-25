import * as go from 'gojs';

export const locationBinding = () => new go.Binding(
  'location',
  'loc',
  go.Point.parse
).makeTwoWay(go.Point.stringify);
