import { PaletteItem } from '@app/diagram-gojs/types/palette';
import { NodeCategory, NodeType } from '@app/diagram-gojs/types/node';

export const STEP_FLOW_MAP_PALETTE: PaletteItem[] = [
  {
    category: NodeCategory.TextNode,
    type: NodeType.Step,
    text: 'STEP'
  },
  {
    category: NodeCategory.TextNode,
    type: NodeType.Decision,
    text: 'Decision'
  },
  {
    category: NodeCategory.TextNode,
    type: NodeType.Terminator,
    text: 'Terminator'
  },
  {
    category: NodeCategory.TextNode,
    type: NodeType.Milestone,
    text: 'Milestone'
  },
  {
    category: NodeCategory.EdgeNode,
    type: NodeType.Start,
    text: 'Start'
  },
  {
    category: NodeCategory.EdgeNode,
    type: NodeType.End,
    text: 'End'
  },
  {
    category: NodeCategory.TextNode,
    type: NodeType.EmptyBlock,
    text: 'Empty Block'
  },
];
