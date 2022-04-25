import * as go from 'gojs';

import { hidePortsPanel, showPortsPanel } from '../../animations/showHidePortsPanel';
import { locationBinding } from './bindings/locationBinding';
import { nodeSelection } from './nodeSelection';
import { MAIN_SHAPE_NAME, NODE_SELECTION_NAME } from '../../consts';
import { ports } from './ports';
import { contextMenu } from './contextMenu';
import { nodeDragComputation } from '../../managers/nodeDragComputation/nodeDragComputation';
import { pinIcon } from './pinIcon';
import { addNodesToGroup } from '../../utils/addNodesToGroup';

const $ = go.GraphObject.make;

const cursorBinding = () => new go.Binding('cursor', 'published',
  (published) => published ? 'default' : 'grab'
).ofModel();

const movableBinding = () => new go.Binding('movable', 'published',
  (published) => !published
).ofModel();

const unselectedBinding = () => new go.Binding('opacity', 'unselected', (unselected) => unselected ? .3 : 1);

const deletableBinding = () => new go.Binding('deletable', 'primary', (primary) => !primary);

export const baseNode = (
  {
    mainShapeName = MAIN_SHAPE_NAME,
    abovePorts = []
  },
  ...children: go.GraphObject[]
) => $(
  go.Node,
  go.Panel.Spot,
  {
    selectionAdorned: false,
    locationObjectName: mainShapeName,
    selectionChanged: (node: go.Node) => {
      node.findObject(NODE_SELECTION_NAME).visible = node.isSelected;
    },
    alignmentFocus: go.Spot.TopLeft,
    dragComputation: nodeDragComputation,
    mouseEnter: (__, obj: go.GraphObject) => {
      if (obj.diagram.model.modelData.published) {
        return;
      }
      showPortsPanel(obj.part);
    },
    mouseLeave: (__, obj: go.GraphObject) => {
      if (obj.diagram?.model.modelData.published) {
        return;
      }
      hidePortsPanel(obj.part);
    },
    mouseDrop: (event: go.InputEvent, obj: go.Node) => addNodesToGroup(event, obj.containingGroup),
    cursor: 'grab',
    contextMenu: contextMenu(),
    movable: false
  },
  locationBinding(),
  cursorBinding(),
  movableBinding(),
  unselectedBinding(),
  deletableBinding(),
  ...children,
  ports(),
  nodeSelection(),
  ...abovePorts,
  pinIcon(),
);
