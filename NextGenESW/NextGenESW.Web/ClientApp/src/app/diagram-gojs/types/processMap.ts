import { ProcessMap } from '../../process-maps/process-maps.model';

export type ProcessMapDiagram =
  & ProcessMap
  & {
    skipsDiagramUpdate: boolean;
  };
