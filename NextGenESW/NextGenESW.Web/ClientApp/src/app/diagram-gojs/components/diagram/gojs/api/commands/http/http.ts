import { ActivityGroup, Connector, Phase } from '../../../../../../../process-maps/process-maps.model';
import { LinkData, NodeData } from '../../../../../../types/node';
import { HttpAction, HttpActionHandler } from '../../../types';

export const createHttpApi = () => {
  let handler: HttpActionHandler;
  return {
    setHttpActionHandler: (nextHandler: HttpActionHandler) => handler = nextHandler,
    handleActivityInsert: (activity: NodeData) => handler({
      type: 'InsertActivity',
      payload: activity
    }),
    handlePhaseInsert: (phaseProperties: Partial<Phase>) => handler({
      type: 'InsertPhase',
      payload: phaseProperties
    }),
    handleSwimLaneInsert: (swimLane: Partial<ActivityGroup>) => handler({
      type: 'InsertSwimLane',
      payload: swimLane
    }),
    handleSwimLaneUpdate: (swimLane: Partial<ActivityGroup>) => handler({
      type: 'UpdateSwimLane',
      payload: swimLane
    }),
    handleActivityUpdate: (activityProperties) => handler({
      type: 'UpdateActivity',
      payload: activityProperties
    }),
    handleActivityDelete: (activityId) => handler({
      type: 'DeleteActivity',
      payload: activityId
    }),
    handlePhaseDelete: (phaseId: number) => handler({
      type: 'DeletePhase',
      payload: phaseId
    }),
    handleSwimLaneDelete: (swimLaneId: number) => handler({
      type: 'DeleteSwimLane',
      payload: swimLaneId
    }),
    handlePhaseUpdate: (phase: Partial<Phase>) => handler({
      type: 'UpdatePhase',
      payload: phase
    }),
    handleLinkInsert: (link: Connector) => handler({
      type: 'InsertLink',
      payload: link
    }),
    handleLinkDelete: (link: LinkData) => handler({
      type: 'DeleteLink',
      payload: link
    }),
    handleLinkUpdate: (link: Connector) => handler({
      type: 'UpdateLink',
      payload: link
    }),
    handleAction: (action: HttpAction) => handler(action)
  };
};
