import { defaultTextBlock } from './defaultTextBlock';
import { dataTextBlock } from './dataTextBlock';
import { NodeType } from '../../../../../types/node';
import { oneLineTextBlock } from './oneLineTextBlock';

export const textBlocks = () => [
  defaultTextBlock([
    NodeType.SubMapLink,
    NodeType.Milestone,
    NodeType.KPack,
    NodeType.OffPageReference,
    NodeType.EmptyBlock,
    NodeType.Step
  ]),
  dataTextBlock([NodeType.Data]),
  oneLineTextBlock([
    NodeType.Decision,
    NodeType.Terminator,
    NodeType.Start,
    NodeType.End
  ])
];
