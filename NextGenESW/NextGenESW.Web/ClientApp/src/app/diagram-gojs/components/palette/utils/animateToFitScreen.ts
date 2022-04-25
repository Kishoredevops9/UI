import { Renderer2 } from '@angular/core';

const DURATION = 300;

export const animateToFitScreen = (
  renderer: Renderer2,
  element: HTMLElement,
  targetPosition: { x: number, y: number }
) => new Promise((resolve) => {
  const prevTransition = element.style.transition;
  renderer.setStyle(element, 'transition', `${DURATION}ms`);

  const { x, y } = targetPosition;
  renderer.setStyle(element, 'transform', `translate(${x}px, ${y}px)`);

  setTimeout(() => {
    renderer.setStyle(element, 'transition', prevTransition);
    resolve(null);
  }, DURATION);
})
