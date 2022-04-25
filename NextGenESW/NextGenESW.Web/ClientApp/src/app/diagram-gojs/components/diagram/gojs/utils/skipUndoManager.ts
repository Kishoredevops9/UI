import * as go from 'gojs';

export const skipUndoManager = (
  diagram: go.Diagram,
  func: () => void
) => {
  const prevSkipsUndoManager = diagram.skipsUndoManager;
  diagram.skipsUndoManager = true;
  func();
  diagram.skipsUndoManager = prevSkipsUndoManager;
};
