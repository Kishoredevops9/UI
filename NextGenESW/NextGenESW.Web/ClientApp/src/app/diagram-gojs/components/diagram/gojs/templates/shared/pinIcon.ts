import * as go from 'gojs';

const $ = go.GraphObject.make;

const PIN_SIZE = 24;

export const pinIcon = () => $(
  go.Panel,
  go.Panel.Spot,
  {
    visible: false,
    alignment: new go.Spot(.5, 0, 0, -(PIN_SIZE / 2) + 4)
  },
  $(
    go.Picture,
    {
      source: '/assets/icons/pin.svg',
      desiredSize: new go.Size(PIN_SIZE, PIN_SIZE)
    }
  ),
  new go.Binding('visible', 'isPinned')
);
