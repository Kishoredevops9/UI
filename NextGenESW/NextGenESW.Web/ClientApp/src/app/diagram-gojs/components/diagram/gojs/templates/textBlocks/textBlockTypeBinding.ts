import * as go from 'gojs';
import * as _ from 'lodash/fp';

import { NodeType } from '../../../../../types/node';

export const textBlockTypeBinding = (types?: NodeType[]) => new go.Binding(
  'visible',
  'type',
  (type) => !types.length || _.includes(type)(types)
);
