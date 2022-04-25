import * as go from 'gojs';
import * as _ from 'lodash/fp';

import { getLanePhases } from '../../utils/getLanePhases';

type SelectorFunction = (part: go.Part) => go.Part[];

const parentSelector: SelectorFunction = (part) => {
  return [part.containingGroup]
}

const verticalSelector: SelectorFunction = (part) => {
  return _.filter<go.Part>(
    ({ data }) => data.order === part.data.order
  )(getLanePhases(part.diagram))
}

const horizontalSelector: SelectorFunction = (part) => {
  const group = part.containingGroup;
  let parts = [];

  group.memberParts.each((member) => {
    if (member.category === part.category) {
      parts = [...parts, member]
    }
  });

  return parts;
}

const childrenSelector: SelectorFunction = (part: go.Group) => {
  let parts = [];

  part.memberParts.each((member) => parts = [...parts, member]);

  return parts;
}

export enum PROPAGATE_SELECTOR {
    HORIZONTALLY = 'horizontally',
    VERTICALLY = 'vertically',
    PARENT = 'parent',
    CHILDREN = 'children'
}

export const SELECTORS: { [key: string]: SelectorFunction} = {
  [PROPAGATE_SELECTOR.HORIZONTALLY]: horizontalSelector,
  [PROPAGATE_SELECTOR.PARENT]: parentSelector,
  [PROPAGATE_SELECTOR.VERTICALLY]: verticalSelector,
  [PROPAGATE_SELECTOR.CHILDREN]: childrenSelector
}
