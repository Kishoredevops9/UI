import * as go from 'gojs';
import * as _ from 'lodash/fp';

import { getLanePhasesToDelete } from './getLanePhasesToDelete';
import { getLanesToDelete } from './getLanesToDelete';
import { updateLanesWidth } from '../resize/updateLanesWidth';
import { registerHeaders } from '../../listeners/registerHeaders';
import { unregisterAdornments } from './unregisterAdornments';
import { openConfirmDeleteDialog } from './openConfirmDeleteDialog';
import { sendDeleteRequest } from './sendDeleteRequests';
import { getNodesAndLinksToDelete } from './getNodesAndLinksToDelete';
import { updateOrders } from './updateOrders';
import { adjustLinksSelection } from '../../api/commands/toggleNodeSelection';
import { validateGroupsToDelete } from './validateGroupsToDelete';

const beforeDeleteSelection = (diagram: go.Diagram) => {
  const lanesToDelete = getLanesToDelete(diagram);
  const lanePhasesToDelete = getLanePhasesToDelete(diagram);
  const [nodesToUnselect, nodesAndLinksToDelete] = getNodesAndLinksToDelete(diagram);
  sendDeleteRequest(diagram, [
    ...lanesToDelete,
    ...lanePhasesToDelete,
    ...nodesAndLinksToDelete
  ]);

  diagram.startTransaction();

  unregisterAdornments(lanesToDelete, lanePhasesToDelete);

  _.forEach((node: go.Node) => {
    node.diagram.model.set(node.data, 'unselected', true);
  })(nodesToUnselect);
  if (nodesToUnselect.length) {
    adjustLinksSelection(diagram);
  }

  _.flowRight(
    _.forEach(({ part }) => part.deletable = true),
    _.concat(lanesToDelete),
  )(lanePhasesToDelete);
};

const afterDeleteSelection = (diagram: go.Diagram) => {
  updateLanesWidth(diagram);
  registerHeaders(diagram);
  updateOrders(diagram);
  diagram.updateAllTargetBindings();
  diagram.commitTransaction();
};

export const createDeleteManager = () => ({
  validateGroupsToDelete,
  beforeDeleteSelection,
  afterDeleteSelection,
  openConfirmDeleteDialog
});

export type DeleteManager = ReturnType<typeof createDeleteManager>
