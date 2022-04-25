import * as _ from 'lodash/fp';
import * as go from 'gojs';

export const changeOrder = _.curry((
  orderShift: number,
  lane: go.Part
) => lane.diagram.model.setDataProperty(
  lane.data,
  'order',
  lane.data.order + orderShift
));
