import * as _ from 'lodash/fp';
import { Activity, Connector } from '../../../../process-maps/process-maps.model';

export const mapActivityBlocksToLinksModel = _.flowRight(
  _.flatten,
  _.map((activity: Activity) =>
    _.map((connector: Connector) => ({
      key: connector.id,
      from: connector.previousActivityBlockId,
      to: activity.id,
      toLabel: connector.captionEnd,
      label: connector.captionMiddle,
      fromLabel: connector.captionStart
    }))(activity.activityConnections)
  ),
  _.filter((activity: Activity) => activity.activityConnections)
);
