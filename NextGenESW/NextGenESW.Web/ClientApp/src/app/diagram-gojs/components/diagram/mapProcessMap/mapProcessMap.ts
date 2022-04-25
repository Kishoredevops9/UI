import { getSwimLanes } from './getSwimLanes';
import { getLanePhases } from './getLanePhases';
import { getLinks } from './getLinks';
import { adjustSwimLanesSizes, adjustLanePhasesSizes } from './adjustSizes';
import { getPhases } from './getPhases';
import { getActivityBlocks } from './getActivityBlocks';
import { adjustActivities } from './adjustActivities';
import { adjustLinksPrimaryStatus } from './adjustLinksPrimaryStatus';
import { ProcessMapDiagram } from '../../../types/processMap';
import { DiagramConfiguration } from '../diagram.types';
import { layoutNewActivities } from './layoutNewActivities';
import { mergeApiChanges } from './mergeApiChanges';

export const mapProcessMap = (processMap: ProcessMapDiagram, configuration: DiagramConfiguration) => {
  // Update missing but needed properties
  const { links, linksApiChanges } = getLinks(processMap);
  const { phases, phasesApiChanges } = getPhases(processMap);
  const { lanes, lanesApiChanges } = getSwimLanes(processMap, configuration);
  const { activities, activitiesApiChanges } = getActivityBlocks(processMap, phases);

  // Update activities, lanes and phases if there are new activities added without gojs
  const {
    layoutedPhases,
    layoutedLanes,
    layoutedActivities,
    layoutApiChanges
  } = layoutNewActivities(phases, lanes, activities);
  const lanePhases = getLanePhases(layoutedLanes, layoutedPhases);

  // Adjust elements without updating database
  const adjustedLanes = adjustSwimLanesSizes(layoutedLanes, lanePhases);
  const adjustedLanePhases = adjustLanePhasesSizes(adjustedLanes, lanePhases);
  const adjustedActivities = adjustActivities(layoutedActivities, adjustedLanePhases);
  const adjustedLinks = adjustLinksPrimaryStatus(processMap.activityBlocks, links);

  return {
    nodes: [
      ...adjustedLanes,
      ...adjustedLanePhases,
      ...adjustedActivities
    ],
    links: adjustedLinks,
    skipsDiagramUpdate: processMap.skipsDiagramUpdate,
    apiChanges: [
      ...mergeApiChanges([
        ...lanesApiChanges,
        ...phasesApiChanges,
        ...activitiesApiChanges,
        ...layoutApiChanges
      ]),
      ...linksApiChanges,
    ]
  };
};
