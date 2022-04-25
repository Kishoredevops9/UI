import * as _ from 'lodash/fp';

export const mergeApiChanges = (apiChanges) => {
  const stackedApiChanges = _.reduce((result, { type, payload }) =>({
    ...result,
    [type]: {
      ...(result[type] || {}),
      [payload.id]: {
        ...(result[type] && result[type][payload.id] || {}),
        ...payload
      }
    }
  }), {})(apiChanges);

  return _.flowRight(
    _.flatMap(
      (apiChangeType) => _.flowRight(
        _.map((apiChangeObject) => ({ type: apiChangeType, payload: apiChangeObject })),
        _.values
      )(stackedApiChanges[apiChangeType])
    ),
    _.keys
  )(stackedApiChanges);
};
