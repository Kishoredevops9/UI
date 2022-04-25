import { baseBackground } from './shared/baseBackground';
import { NodeCategory } from '../../../../types/node';
import { baseNode } from './shared/baseNode';

export const shapeNode = () => ({
  category: NodeCategory.ShapeNode,
  template: baseNode(
    {},
    baseBackground({})
  )
});
