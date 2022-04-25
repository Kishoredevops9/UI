import { NodeCategory, NodeType } from '../../diagram-gojs/types/node';
import { PaletteItem } from '../../diagram-gojs/types/palette';

export const PROCESS_MAP_EDIT_PALETTE_ITEMS: PaletteItem[] = [
  {
    category: NodeCategory.SeeThroughNode,
    type: NodeType.ActivityBlock,
    text: 'Activity Block'
  },
  // {
  //   category: NodeCategory.TextNode,
  //   type: NodeType.SubMapLink,
  //   text: 'Sub Map Link'
  // },
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
  // {
  //   category: NodeCategory.TextNode,
  //   type: NodeType.OffPageReference,
  //   text: 'Off Page Reference'
  // },
  // {
  //   category: NodeCategory.TextNode,
  //   type: NodeType.Data,
  //   text: 'Data'
  // },
  {
    category: NodeCategory.TextNode,
    type: NodeType.EmptyBlock,
    text: 'Empty Block'
  },
  // {
  //   category: NodeCategory.SeeThroughNode,
  //   type: NodeType.KPack,
  //   text: 'K-Pack'
  // },
  {
    category: NodeCategory.EdgeNode,
    type: NodeType.Start,
    text: 'Start'
  },
  {
    category: NodeCategory.EdgeNode,
    type: NodeType.End,
    text: 'End'
  }
];
