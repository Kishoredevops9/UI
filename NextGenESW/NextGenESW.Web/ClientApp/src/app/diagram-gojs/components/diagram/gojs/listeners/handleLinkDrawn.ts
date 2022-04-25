import * as go from 'gojs';
import { getApiForDiagram } from '../api/getApiForDiagram';

export const handleLinkDrawn = (event: go.DiagramEvent) => {
  const { diagram, subject } = event;
  const api = getApiForDiagram(diagram);
  api.showPropertiesForNewLink(subject.data);
};
