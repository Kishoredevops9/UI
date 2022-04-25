/* eslint-disable @typescript-eslint/no-explicit-any */
import * as go from 'gojs';

export enum NodeCategory {
  TextNode = 'TextNode',
  ShapeNode = 'ShapeNode',
  EdgeNode = 'EdgeNode',
  SeeThroughNode = 'SeeThroughNode',
  Lane = 'Lane',
  LanePhase = 'LanePhase',
  AttentionIndicator = 'AttentionIndicator',
  Title = 'Title'
}

export enum NodeType {
  ActivityBlock = 'ActivityBlock',
  Data = 'Data',
  Decision = 'Decision',
  EmptyBlock = 'EmptyBlock',
  End = 'End',
  KPack = 'KPack',
  Milestone = 'Milestone',
  OffPageReference = 'OffPageReference',
  Start = 'Start',
  SubMapLink = 'SubMapLink',
  Step = 'Step',
  Terminator = 'Terminator'
}

export type NodeData = {
  key?: go.Key;
  type?: NodeType;
  category: NodeCategory;
  isGroup?: boolean;
  [key: string]: any;
};

export type LinkData = {
  key?: go.Key;
  from: go.Key;
  to: go.Key;
  [key: string]: any;
};

export type ModelData = {
  [key: string]: any;
};

export enum IndicatorShape {
  Top = 'indicatorAtTheTop',
  Right = 'indicatorOnTheRight',
  Bottom = 'indicatorAtTheBottom',
  Left = 'indicatorOnTheLeft'
};
