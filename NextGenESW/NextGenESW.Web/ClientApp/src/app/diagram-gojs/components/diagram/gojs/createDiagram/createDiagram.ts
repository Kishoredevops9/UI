import * as go from 'gojs';
import * as _ from 'lodash/fp';

import { subscribeListeners } from './subscribeListeners';
import { configureToolManager } from './configureToolManager';
import { configureDiagram } from './configureDiagram';

const $ = go.GraphObject.make;

export const createDiagram = (): go.Diagram => {
  go.Diagram.licenseKey = "2bf840e7b56458c511d35a25403e7efb0ef32e63ce824ef65a5616f4ed0a6141269fe17c55838c90d6a849ac187e93dfcfd56f7dc7440568b463878945eb87f1bb6477b31d5c438ea30526919ef328a1f42874fb96b474f7dc7f85a1b9abc69a0ce1f6dd499d0bbb7a2a5132522ead4db2f2cb6bff579c496b3fc8a6e8f9ac48f96c688d81e45e";
  const diagram = $(go.Diagram);
  (window as any).diagramGoJS = diagram;

  return _.flowRight(
    configureToolManager,
    subscribeListeners,
    configureDiagram
  )(diagram);
}
