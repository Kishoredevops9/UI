import * as go from 'gojs';
import { defineMoveAnimation } from '../animations/moveAnimation';
import { shakeObject } from './shakeObject';

export type AnimationPart<T, V> = [T, string, V, V] | [];

export enum Easing {
    LINEAR,
    IN_QUAD,
    OUT_QUAD,
    IN_OUT_QUAD,
    IN_EXPO,
    OUT_EXPO,
}

const easingMapping = {
  [Easing.LINEAR]: go.Animation.EaseLinear,
  [Easing.IN_QUAD]: go.Animation.EaseInQuad,
  [Easing.OUT_QUAD]: go.Animation.EaseOutQuad,
  [Easing.IN_OUT_QUAD]: go.Animation.EaseInOutQuad,
  [Easing.IN_EXPO]: go.Animation.EaseInExpo,
  [Easing.OUT_EXPO]: go.Animation.EaseOutExpo,
};

defineMoveAnimation();

export const animate = <T extends go.GraphObject | go.Diagram, V>(
  parts: AnimationPart<T, V>[],
  duration: number,
  easing: Easing = Easing.IN_OUT_QUAD,
  forceRedraw: boolean = false
) => {
  const animation = new go.Animation();
  animation.duration = duration;
  animation.easing = easingMapping[easing];

  parts.forEach((part) => {
    const [object, property, start, stop] = part;
    animation.add(object, property, start, stop);
  });

  return new Promise((resolve) => {
    animation.finished = resolve;
    animation.start();
    setTimeout(
      () => {
        animation.stop();
        parts.forEach(([object]) => forceRedraw && shakeObject(object))
      },
      animation.duration + 1,
    );
  });
};
