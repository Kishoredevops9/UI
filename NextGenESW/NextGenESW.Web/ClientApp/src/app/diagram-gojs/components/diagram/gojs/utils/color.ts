import * as _ from 'lodash/fp';

export const isColorDark = (hexColor: string) => {
  const regEx = new RegExp(`.{${hexColor.length / 3}}`, 'g');
  const RGBValues = hexColor.match(regEx);
  const summedColorValue = _.reduce((sum, val) => sum + parseInt(val, 16),
    0)(RGBValues);

  return summedColorValue < 383;
};

export const addHash = (color: string) => color.startsWith('#') ? color : `#${color}`;
