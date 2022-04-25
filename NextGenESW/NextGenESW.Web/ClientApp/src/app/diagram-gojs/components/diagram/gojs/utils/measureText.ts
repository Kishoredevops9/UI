import * as go from 'gojs';

const $ = go.GraphObject.make;

const temporaryTextBlock = $(
  go.Part,
  $(go.TextBlock)
);

export const measureText = (text: string, font: string): go.Size => {
  const textBlock = temporaryTextBlock.elt(0) as go.TextBlock;
  textBlock.text = text;
  textBlock.font = font;
  temporaryTextBlock.ensureBounds();

  return textBlock.naturalBounds.size;
};
