import * as go from 'gojs';

export const updateAttentionIndicator = (
  obj: go.Shape | go.TextBlock,
  propertyName: string,
  propertyValue: string
) => {
  const indicator = obj.diagram
    .findNodesByExample({ originalNodeKey: obj.part.key })
    .first() as go.Node;
  if (indicator) {
    obj.diagram.model.set(
      indicator.data,
      propertyName,
      propertyValue
    );
  }
};
