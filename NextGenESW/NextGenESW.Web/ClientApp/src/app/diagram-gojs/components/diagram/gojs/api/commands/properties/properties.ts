import * as go from 'gojs';

import { showPropertiesForNewNode } from './nodes/showForNewNode';
import { showPropertiesForExistingNode } from './nodes/showForExistingNode';
import { showPropertiesForNewPhase } from './phases/showForNewPhase';
import { showPropertiesForExistingPhase } from './phases/showForExistingPhase';
import { showPropertiesForNewSwimLane } from './lanes/showForNewSwimLane';
import { showPropertiesForExistingSwimLane } from './lanes/showForExistingSwimLane';
import { showPropertiesForNewLink } from './links/showForNewLink';
import { showPropertiesForExistingLink } from './links/showForExistingLink';
import { showPropertiesForPastedNode } from './nodes/showForPastedNode';

export const createPropertiesApi = (diagram: go.Diagram) => ({
  showPropertiesForNewNode: showPropertiesForNewNode(diagram),
  showPropertiesForExistingNode: showPropertiesForExistingNode(diagram),
  showPropertiesForNewPhase: showPropertiesForNewPhase(diagram),
  showPropertiesForExistingPhase: showPropertiesForExistingPhase(diagram),
  showPropertiesForNewSwimLane: showPropertiesForNewSwimLane(diagram),
  showPropertiesForExistingSwimLane: showPropertiesForExistingSwimLane(diagram),
  showPropertiesForNewLink: showPropertiesForNewLink(diagram),
  showPropertiesForExistingLink: showPropertiesForExistingLink(diagram),
  showPropertiesForPastedNode: showPropertiesForPastedNode(diagram)
});
