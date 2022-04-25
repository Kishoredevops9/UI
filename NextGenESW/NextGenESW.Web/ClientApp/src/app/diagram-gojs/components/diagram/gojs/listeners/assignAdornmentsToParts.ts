import * as go from 'gojs';
import * as _ from 'lodash/fp';
import { registerAdornment } from '../utils/registerAdornments';
import { positionHeaders } from './positionHeaders';

const getAdornmentsArray = (diagram: go.Diagram, layer: string) => {
  let adornments = [];
  diagram.findLayer(layer).parts.each((part: go.Part) => {
    if (part instanceof go.Adornment) {
      adornments = [...adornments, part];
    }
  });
  return adornments;
};

export const assignAdornmentsToParts = (diagram: go.Diagram) => {
  _.flowRight(
    _.forEach((adornment: go.Adornment) => {
      const adornedPart = diagram.findNodeForKey(adornment.data.key);
      registerAdornment(adornment, adornment.category, adornedPart);
    }),
    _.concat(getAdornmentsArray(diagram, 'Foreground'))
  )(getAdornmentsArray(diagram, 'Adornment'));
  positionHeaders(diagram);
};
