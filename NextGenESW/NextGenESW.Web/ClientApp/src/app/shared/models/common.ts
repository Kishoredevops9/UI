export class SelectItem {
  label?: string
  value?: any
  disabled?: boolean
  selectable?: boolean
  children?: SelectItem[]
  data?: any
  [key: string]: any
}

export class FlatSelectItem {
  label?: string
  value?: any
  disabled?: boolean
  selectable?: boolean
  level?: number
  expandable?: boolean
  nbChildren?: number
  data?: any
}

export interface EksCollectionItem {
  name?: string,
  code?: string,
  keyword?: string,
  class?: string,
  value?: number,
  checked?: boolean,
  active?: boolean
}