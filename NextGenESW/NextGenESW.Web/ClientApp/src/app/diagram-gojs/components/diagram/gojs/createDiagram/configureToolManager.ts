import * as go from 'gojs';

import { ResizingTool } from '../tools/ResizingTool';
import { DraggingTool } from '../tools/draggingTool/DraggingTool';
import { CommandHandler } from '../tools/CommandHandler';

export const configureToolManager = (diagram: go.Diagram) => {
  diagram.toolManager.resizingTool = new ResizingTool();
  diagram.toolManager.draggingTool = new DraggingTool();
  diagram.commandHandler = new CommandHandler();

  return diagram;
};
