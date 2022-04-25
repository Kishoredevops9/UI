import { NodeCategory } from '../../../../types/node';
import { baseBackground } from './shared/baseBackground';
import { baseNode } from './shared/baseNode';
import { textBlocks } from './textBlocks/textBlocks';

export const textNode = () => ({
  category: NodeCategory.TextNode,
  template: baseNode(
    {},
    baseBackground({}),
    ...textBlocks()
  )
});
