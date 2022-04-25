import { Mode } from './types';
import { laneMode } from './laneMode';
import { lanePhaseMode } from './lanePhaseMode';

export const LANE_MODE = 'laneMode';
export const LANE_PHASE_MODE = 'lanePhaseMode';

export const MODES: {[key: string]: Mode} = {
  [LANE_MODE]: laneMode,
  [LANE_PHASE_MODE]: lanePhaseMode
};
