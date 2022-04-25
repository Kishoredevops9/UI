import * as go from 'gojs';

import { getMembersEdges } from './getMembersEdges';

const getMinHeight = (height: number, part: go.Part) => {
  let minHeight = height;

  (part as go.Group).memberParts.each((lanePhase: go.Group) => {
    const { bottom } = getMembersEdges(lanePhase);
    minHeight = Math.max(minHeight, bottom);
  })

  return minHeight;
}

export const computeLaneMinSize = (
  groupMinSize: go.Size,
  part: go.Part
): go.Size => new go.Size(
  groupMinSize.width,
  getMinHeight(groupMinSize.height, part)
);
