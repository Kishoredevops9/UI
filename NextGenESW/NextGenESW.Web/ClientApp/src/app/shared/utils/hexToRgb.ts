import * as _ from 'lodash/fp';

const getAppropriateHex = (hex: string): string => {
  const hexAsArray = _.split('')(hex);
  const digits = hex.startsWith('#') ? _.tail(hexAsArray) : hexAsArray;

  if (digits.length < 3) {
    throw new Error('Inappropriate hex color');
  }

  if (digits.length >= 3 && digits.length < 6) {
    const [r, g, b] = digits;
    return `#${r}${r}${g}${g}${b}${b}`;
  }

  return `#${_.join('')(_.slice(0, 6)(digits))}`;
};

export const hexToRgb = (hex: string) => {
  const appropriateHex = getAppropriateHex(hex);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(appropriateHex);
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  };
};
