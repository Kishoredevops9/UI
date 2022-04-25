import * as go from 'gojs';
import { Observable, BehaviorSubject } from 'rxjs';

import { ContextMenuModel } from '../types';

export const createContextMenuApi = (diagram: go.Diagram) => {
  const contextMenu = new BehaviorSubject<ContextMenuModel>(null);

  const getContextMenu = () => contextMenu as Observable<ContextMenuModel>
  const getCurrentContextMenu = () => contextMenu.getValue();
  const setContextMenu = (model: ContextMenuModel) => {
    contextMenu.next(model);
    if (!model) {
      diagram.toolManager.contextMenuTool.doCancel();
      diagram.focus();
    }
  };

  return {
    getContextMenu,
    getCurrentContextMenu,
    setContextMenu
  };
};
