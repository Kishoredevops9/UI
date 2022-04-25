import { NodeCategory, NodeType } from '../../../../types/node';

const nodeTypeToCategoryMap: Record<NodeType, NodeCategory> = {
  [NodeType.ActivityBlock]: NodeCategory.SeeThroughNode,
  [NodeType.Data]: NodeCategory.TextNode,
  [NodeType.Decision]: NodeCategory.TextNode,
  [NodeType.EmptyBlock]: NodeCategory.TextNode,
  [NodeType.End]: NodeCategory.EdgeNode,
  [NodeType.KPack]: NodeCategory.SeeThroughNode,
  [NodeType.Milestone]: NodeCategory.TextNode,
  [NodeType.OffPageReference]: NodeCategory.TextNode,
  [NodeType.Start]: NodeCategory.EdgeNode,
  [NodeType.Step]: NodeCategory.TextNode,
  [NodeType.SubMapLink]: NodeCategory.TextNode,
  [NodeType.Terminator]: NodeCategory.TextNode
};

export const mapNodeTypeToCategory = (
  nodeType: NodeType
): NodeCategory => nodeTypeToCategoryMap[nodeType];
