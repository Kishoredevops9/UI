import * as go from 'gojs';

export const defineMoveAnimation = () => {
  go.AnimationManager.defineAnimationEffect('move', (
    obj: go.Part,
    {
      x: startX,
      y: startY
    },
    {
      x: endX,
      y: endY
    },
    easing: go.EasingFunction,
    currentTime: number,
    duration: number
  ) => {
    obj.moveTo(
      easing(currentTime, startX, endX - startX, duration),
      easing(currentTime, startY, endY - startY, duration),
      true
    );
  });
};
