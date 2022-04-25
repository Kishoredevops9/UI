import * as go from 'gojs';

export const borderStyleBinding = () => new go.Binding(
  'strokeDashArray',
  'borderStyle',
  (borderStyle: string) => borderStyle.toLowerCase() === 'dashed' ? [10, 5] : null
);
