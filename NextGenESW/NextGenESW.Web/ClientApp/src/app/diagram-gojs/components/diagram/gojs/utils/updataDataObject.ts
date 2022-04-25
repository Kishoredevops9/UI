import * as _ from 'lodash/fp';
import * as go from 'gojs';

export const updateDataObject = (
  diagram: go.Diagram,
  prevData: go.ObjectData,
  nextData: go.ObjectData
) => _.flowRight(
  _.map((key: string) =>
    diagram.model.setDataProperty(prevData, key, nextData[key])
  ),
  _.keys
)(nextData);
