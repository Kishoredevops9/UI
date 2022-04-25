import { SelectItem } from "@app/shared/models/common"

export const EskPopupType = {
  StepFlow: 'stepFlow',
  ExcludeApSfSp: 'AP_SF_SP_Not'
}

export const PopupExportedTypesDict = {
  [EskPopupType.StepFlow]: ['sf', 'sp', 'ap', 'toc'],
  [EskPopupType.ExcludeApSfSp]: ['ap', 'sf', 'sp']
}

export const AddonsPopupTabDict = {
  Eks: 'Eks',
  Global: 'Global',
  PwPlay: 'PwPlay'
}

export enum AggregationPrefix {
  Phase = 'Phase_',
  Tags = 'Tags_'
}

export function getPhaseTagValues(sltValues: string[], prefix: AggregationPrefix) {
  return sltValues
    .filter(item => item.startsWith(prefix))
    .map(item => item.slice(prefix.length));
}