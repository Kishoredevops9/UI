import * as _ from 'lodash/fp';
import * as go from 'gojs';

export const togglePinShape = _.curry((
  diagram: go.Diagram,
  data: go.ObjectData
) => {
  diagram.model.set(data, 'isPinned', !data.isPinned);
});
