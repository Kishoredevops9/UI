import * as go from 'gojs';
import * as _ from 'lodash/fp';

import { getLanes } from '../../utils/getLanes';
import { HEADER_WIDTH, MAIN_SHAPE_NAME } from '../../consts';

export const enlargeOtherLanes = (size: string, obj: go.Part) => {
  const { width } = go.Size.parse(size);
  const lanes = getLanes(obj.diagram);
  const desiredSize = go.Size.parse(size);

  _.forEach<go.Group>((lane) => {
    const mainShape = lane.findObject(MAIN_SHAPE_NAME);
    if (lane.key !== obj.part.key && mainShape.width !== width) {
      mainShape.width = width;
    }
  })(lanes);

  return new go.Size(width, obj.part.data.isLaneCollapsed ? HEADER_WIDTH : desiredSize.height);
};
