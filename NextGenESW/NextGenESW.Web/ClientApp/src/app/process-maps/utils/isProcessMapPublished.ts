import { ProcessMap } from '../process-maps.model';
import { ASSET_STATUSES } from '@environments/constants';

export const isProcessMapPublished = (
  processMap: ProcessMap
) => (processMap.assetStatus === ASSET_STATUSES.PUBLISHED || processMap.assetStatus === ASSET_STATUSES.CURRENT || processMap.assetStatus === ASSET_STATUSES.ARCHIVED || processMap.assetStatus === ASSET_STATUSES.OBSOLETE || processMap.assetStatus === ASSET_STATUSES.APPROVED_WAITING_FOR_JC);
