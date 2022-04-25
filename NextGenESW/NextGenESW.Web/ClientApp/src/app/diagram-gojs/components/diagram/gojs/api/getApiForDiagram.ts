import * as go from 'gojs';
import { DiagramApi } from './types';
import { Diagram } from '../types';

export const getApiForDiagram = (diagram: go.Diagram): DiagramApi => {
  const diagramWithApi = diagram as Diagram;
  return diagramWithApi.api;
};
