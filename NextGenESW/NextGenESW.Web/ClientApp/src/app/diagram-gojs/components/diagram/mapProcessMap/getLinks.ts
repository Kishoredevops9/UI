import * as _ from 'lodash/fp';
import * as go from 'gojs';
import { Activity, Connector } from '../../../../process-maps/process-maps.model';
import { HttpAction } from '@app/diagram-gojs/components/diagram/gojs/types';

type LinksAndApiChanges = {
  links: go.ObjectData[],
  linksApiChanges: HttpAction[]
};

const mapToLinks = (activity: Activity) => _.map((connector: Connector) => ({
  key: connector.id,
  from: connector.previousActivityBlockId,
  to: activity.id,
  toLabel: connector.captionEnd,
  label: connector.captionMiddle,
  fromLabel: connector.captionStart
}))(activity.activityConnections);

const shouldRemoveLink = (
  link: go.ObjectData,
  activityBlocks: Activity[]
) => !_.some(({ id }: Activity) => id === link.from)(activityBlocks)
  || !_.some(({ id }: Activity) => id === link.to)(activityBlocks);

export const getLinks = ({ activityBlocks }) => _.flowRight(
  _.reduce((result: LinksAndApiChanges, link: go.ObjectData) => shouldRemoveLink(link, activityBlocks)
      ? {
        links: result.links,
        linksApiChanges: [...result.linksApiChanges, {
          type: 'DeleteLink',
          payload: link
        }]
      }
      : {
        links: [...result.links, link],
        linksApiChanges: result.linksApiChanges
      }
  , { links: [], linksApiChanges: [] }),
  _.flatten,
  _.map(mapToLinks),
  _.filter((activity: Activity) => activity.activityConnections)
)(activityBlocks);
