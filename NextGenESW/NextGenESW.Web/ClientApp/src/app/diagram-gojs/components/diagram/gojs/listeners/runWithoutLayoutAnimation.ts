import * as go from 'gojs';
import { runListenerOnce } from './runListenerOnce';

export const runWithoutLayoutAnimation = (
  diagram: go.Diagram,
  handler: () => void,
  afterComplete: boolean = false
) => {
  const prevCanStart = diagram.animationManager.canStart;
  diagram.animationManager.canStart = (reason) => reason !== 'Layout';
  afterComplete || handler();

  const callback = () => {
    afterComplete && handler();
    diagram.animationManager.canStart = prevCanStart;
  }

  runListenerOnce(diagram, 'LayoutCompleted', callback);
}
