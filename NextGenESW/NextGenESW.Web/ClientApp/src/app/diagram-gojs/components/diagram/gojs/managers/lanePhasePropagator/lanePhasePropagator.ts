import * as go from 'gojs';
import * as _ from 'lodash/fp';

import { SELECTORS, PROPAGATE_SELECTOR } from './selectors';

export const propagateEventsForLanePhases = (
  selectors: PROPAGATE_SELECTOR[],
  part: go.Part,
  event: (part: go.Part) => void
) => {
  _.flowRight(
    _.forEach(event),
    _.flatten,
    _.map((selector: string) => SELECTORS[selector](part))
  )(selectors)
}
