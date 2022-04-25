import * as go from 'gojs';
import { getLanes } from '../../utils/getLanes';

export const updateLanesWidth = (diagram: go.Diagram) => {
  const lane = getLanes(diagram)[0];
  const { height } = go.Size.parse(lane.data.size);
  let newWidth = 0;
  lane.memberParts.each((lanePhase) => {
    lanePhase.ensureBounds();
    newWidth += lanePhase.actualBounds.width;
  });
  diagram.model.set(
    lane.data,
    'size',
    go.Size.stringify(new go.Size(newWidth, height))
  );
  lane.updateTargetBindings();
};
