import * as _ from 'lodash/fp';

import { Activity } from '../../../../process-maps/process-maps.model';
import { HttpAction } from '../gojs/types';
import { mapActivityToNodeData } from '../gojs/utils/mapActivityToNodeData';

type ActivityBlocksAndApiChanges = {
  activities: Activity[],
  activitiesApiChanges: HttpAction[]
};

export const getActivityBlocks = ({ activityBlocks }, phases) => _.flowRight(
  ({ activities, activitiesApiChanges }) => ({
    activitiesApiChanges,
    activities: _.map((activity) => mapActivityToNodeData(
      { key: activity.id },
      activity
    ))(activities)
  }),
  _.reduce((result: ActivityBlocksAndApiChanges, activity: Activity) => {
    const firstPhaseId = _.first(phases).id;
    let propertiesToUpdate = {};

    if (!activity.phaseId) {
      propertiesToUpdate = { ...propertiesToUpdate, phaseId: activity.phaseId || firstPhaseId };
    }

    if (!activity.locationX || !activity.locationY) {
      propertiesToUpdate = { ...propertiesToUpdate, locationX: 0, locationY: 0 };
    }

    return _.isEmpty(propertiesToUpdate)
      ? {
        activities: [...result.activities, activity],
        activitiesApiChanges: result.activitiesApiChanges
      }
      : {
        activities: [...result.activities, { ...activity, ...propertiesToUpdate }],
        activitiesApiChanges: [
          ...result.activitiesApiChanges,
          {
            type: 'UpdateActivity',
            payload: { 
              ...activity,
              id: activity.id,
              ...propertiesToUpdate
            }
          }
        ]
      };
  }, { activities: [], activitiesApiChanges: [] })
)(activityBlocks);
