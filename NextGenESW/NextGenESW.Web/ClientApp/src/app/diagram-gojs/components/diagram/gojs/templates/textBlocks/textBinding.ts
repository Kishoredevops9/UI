import * as go from 'gojs';
import { updateAttentionIndicator } from '../shared/updateAttentionIndicator';

export const textBinding = () => new go.Binding(
  'text',
  'text',
  (text: string, obj: go.TextBlock) => {
    updateAttentionIndicator(obj, 'text', text);
    return text;
  }
);
