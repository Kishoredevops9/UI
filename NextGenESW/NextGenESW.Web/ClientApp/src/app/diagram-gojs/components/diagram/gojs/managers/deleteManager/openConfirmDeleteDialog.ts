import * as go from 'gojs';
import { getApiForDiagram } from '../../api/getApiForDiagram';

export const openConfirmDeleteDialog = (diagram: go.Diagram) => {
  const api = getApiForDiagram(diagram);
  return api.openDialogBox({
    type: 'ConfirmDelete'
  });
};
