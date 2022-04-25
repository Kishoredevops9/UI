import * as go from 'gojs';

export const getMembersEdges = (group: go.Group) => {
  let groupRightEdge = 0;
  let groupBottomEdge = 0;

  group.memberParts.each((member: go.Part) => {
    const { x, y } = member.getDocumentPoint(go.Spot.BottomRight);

    groupRightEdge = Math.max(groupRightEdge, x - group.actualBounds.x);
    groupBottomEdge = Math.max(groupBottomEdge, y - group.actualBounds.y);
  });

  return { right: groupRightEdge, bottom: groupBottomEdge };
}
