import { NodeCategory } from '../../../../../types/node';
import { baseBackground } from '../shared/baseBackground';
import { baseNode } from '../shared/baseNode';
import { seeThroughButton } from './seeThroughButton';
import { defaultTextBlock } from '../textBlocks/defaultTextBlock';
import { statusIndicator } from './statusIndicator';

export const seeThroughNode = () => ({
  category: NodeCategory.SeeThroughNode,
  template: baseNode(
    {
      abovePorts: [
        seeThroughButton(),
        statusIndicator()
      ]
    },
    baseBackground({}),
    defaultTextBlock()
  )
});
