import * as _ from 'lodash/fp';

import { Activity } from '../../../../process-maps/process-maps.model';
import { LinkData } from '../../../types/node';

export const adjustLinksPrimaryStatus = (
  activityBlocks: Activity[],
  links: LinkData[]
) => _.map((link: LinkData) => {
  const fromActivity = _.find({
    id: link.from
  })(activityBlocks);
  const toActivity = _.find({
    id: link.to
  })(activityBlocks);

  return {
    ...link,
    primary: fromActivity?.primary || toActivity?.primary
  };
})(links);
