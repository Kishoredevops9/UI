import * as go from 'gojs';

export const collapseBinding = () => new go.Binding(
  'visible',
  '',
  ({ isLaneCollapsed, isPhaseCollapsed }: go.ObjectData) =>
    !isLaneCollapsed && !isPhaseCollapsed
);
