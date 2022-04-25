import * as _ from 'lodash/fp';
import * as go from 'gojs';

import { TemplateCreator } from '../types';

export const createTemplateMap = <TTemplate>(
  ...creators: TemplateCreator<TTemplate>[]
): go.Map<string, TTemplate> => {
  const result = new go.Map<string, TTemplate>();
  _.forEach(
    ({ category, template }: TemplateCreator<TTemplate>) => {
      result.add(category, template);
    }
  )(creators);
  return result;
};
