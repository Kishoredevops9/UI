import * as go from 'gojs';
import { IndicatorShape } from '../../../../../types/node';
import {
  horizontalRectangleWithArrow,
  verticalRectangleWithArrow
} from '../../managers/attentionIndicator/consts';
import { SHAPE_HEIGHT, SHAPE_WIDTH } from './consts';

const isVertical = (orientation: string) =>
  orientation === IndicatorShape.Top || orientation === IndicatorShape.Bottom;

const getAlignment = (orientation: string) => ({
  [IndicatorShape.Top]: new go.Spot(0.5, 1, 0, -3),
  [IndicatorShape.Bottom]: new go.Spot(0.5, 1, 0, -12),
  [IndicatorShape.Left]: new go.Spot(0.5, 0.5, 3, 9),
  [IndicatorShape.Right]: new go.Spot(0.5, 0.5, -3, 9)
}[orientation]);

const getAngle = (orientation: string) =>
  orientation === IndicatorShape.Bottom || orientation === IndicatorShape.Right ? 0 : 180;

const getTextSize = (orientation: string) => isVertical(orientation)
  ? new go.Size(SHAPE_WIDTH, SHAPE_HEIGHT - 6)
  : new go.Size(SHAPE_WIDTH, SHAPE_HEIGHT - 6);

const getShapeSize = (orientation: string) => isVertical(orientation)
  ? new go.Size(SHAPE_WIDTH, SHAPE_HEIGHT)
  : new go.Size(SHAPE_WIDTH + 12, SHAPE_HEIGHT - 6);

const getGeometryString = (orientation: string) => isVertical(orientation)
  ? go.Geometry.fillPath(verticalRectangleWithArrow)
  : go.Geometry.fillPath(horizontalRectangleWithArrow);

export const textPanelOrientationBindings = () => [
  new go.Binding('alignment', 'orientation', getAlignment)
];

export const textOrientationBindings = () => [
  new go.Binding('desiredSize', 'orientation', getTextSize),
];

export const shapeOrientationBindings = () => [
  new go.Binding('angle', 'orientation', getAngle),
  new go.Binding('geometryString', 'orientation', getGeometryString),
  new go.Binding('desiredSize', 'orientation', getShapeSize),
];
