import { NodeCategory } from '@app/diagram-gojs/types/node';
import * as go from 'gojs';
import { locationBinding } from '@app/diagram-gojs/components/diagram/gojs/templates/shared/bindings/locationBinding';
import { desiredSizeBinding } from '@app/diagram-gojs/components/diagram/gojs/templates/bindings/desiredSizeBinding';

const $ = go.GraphObject.make;

export const titleTemplate = () => ({
  category: NodeCategory.Title,
  template: $(
    go.Node,
    {
      isLayoutPositioned: false
    },
    $(
      go.Picture,
      {},
      new go.Binding('element'),
    ),
    locationBinding(),
    desiredSizeBinding(),
  )
});
