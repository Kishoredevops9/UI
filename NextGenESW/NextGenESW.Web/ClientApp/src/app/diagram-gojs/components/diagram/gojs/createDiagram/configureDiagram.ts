import * as _ from 'lodash/fp';
import * as go from 'gojs';
import { v4 as uuid } from 'uuid';

import { createTemplateMap } from '../utils/createTemplateMap';
import { LanesLayout } from '../layouts/LanesLayout';
import { MIN_SCALE, MAX_SCALE, HEADER_WIDTH } from '../consts';
import { lane } from '../templates/lane/lane';
import { edgeNode } from '../templates/edgeNode';
import { shapeNode } from '../templates/shapeNode';
import { textNode } from '../templates/textNode';
import { link } from '../templates/link/link';
import { contextMenu } from '../templates/shared/contextMenu';
import { lanePhase } from '../templates/lanePhase/lanePhase';
import { seeThroughNode } from '../templates/seeThroughNode/seeThroughNode';
import { attentionIndicatorNode } from '../templates/attentionIndicatorNode/attentionIndicatorNode';
import { titleTemplate } from '@app/diagram-gojs/components/diagram/gojs/templates/titleTemplate/titleTemplate';

const $ = go.GraphObject.make;

const model = () => $(
  go.GraphLinksModel,
  {
    linkKeyProperty: 'key',
    makeNodeDataKeyUnique: uuid
  }
);

export const configureDiagram = (diagram: go.Diagram) => {
  diagram.groupTemplateMap = createTemplateMap(
    lane(),
    lanePhase()
  );
  diagram.nodeTemplateMap = createTemplateMap(
    textNode(),
    shapeNode(),
    edgeNode(),
    seeThroughNode(),
    titleTemplate(),
    attentionIndicatorNode()
  );
  diagram.padding = new go.Margin(HEADER_WIDTH);
  diagram.linkTemplate = link();
  diagram.model = model();
  diagram.initialPosition = new go.Point(-HEADER_WIDTH, -HEADER_WIDTH);
  // diagram.scrollMode = go.Diagram.InfiniteScroll;
  diagram.layout = new LanesLayout();
  diagram.scaleComputation = (__, newScale: number) => _.clamp(
    MIN_SCALE,
    MAX_SCALE
  )(newScale);
  diagram.contextMenu = contextMenu();
  diagram.animationManager.duration = 200;

  return diagram;
}
