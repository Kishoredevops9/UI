import * as go from 'gojs';

export const getRelativeLoc = (diagram: go.Diagram, { loc, group }: go.ObjectData) => {
  const groupNode = diagram.findNodeForKey(group);
  const { x: groupX, y: groupY } = go.Point.parse(groupNode.data.loc);
  const { x, y } = go.Point.parse(loc);

  return go.Point.stringify(
    new go.Point(
      Math.max(x - groupX, 0),
      Math.max(y - groupY, 0)
    )
  );
};
