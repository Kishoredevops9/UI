import * as go from 'gojs';
import { HEADER_WIDTH, MAIN_SHAPE_NAME } from '../../consts';

export const collapseBinding = () => new go.Binding(
  'desiredSize',
  'isLaneCollapsed',
  (isLaneCollapsed, obj: go.Shape) => {
    const width = obj.part.findObject(MAIN_SHAPE_NAME).width;
    const desiredSize = go.Size.parse(obj.part.data.size);

    return isLaneCollapsed ? new go.Size(width, HEADER_WIDTH) : desiredSize;
  }
);
