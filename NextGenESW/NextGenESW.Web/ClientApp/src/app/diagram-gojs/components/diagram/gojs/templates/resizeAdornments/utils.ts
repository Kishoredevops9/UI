import * as go from 'gojs';
import { MAIN_SHAPE_NAME } from '../../consts';

export const ADORNMENT_THICKNESS = 6;

export const getMainShape = (obj: go.GraphObject) =>
  (obj.part as go.Adornment).adornedPart.findObject(MAIN_SHAPE_NAME);
