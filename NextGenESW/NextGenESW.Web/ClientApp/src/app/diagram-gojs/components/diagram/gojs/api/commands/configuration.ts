import * as go from 'gojs';

import { DiagramConfiguration } from '../../../diagram.types';
import { skipUndoManager } from '../../utils/skipUndoManager';

export const createConfigurationApi = (diagram: go.Diagram) => {
  let _configuration: DiagramConfiguration;

  return {
    setConfiguration: (configuration: DiagramConfiguration) => {
      _configuration = configuration;
      setConfiguration(diagram, configuration);
    },
    getConfiguration: () => _configuration
  };
};

const setConfiguration = (
  diagram: go.Diagram,
  {
    viewOnly,
    isBlankMap,
    isTaskMap,
    showStatusIndicator,
    isStepFlowMap,
    isStepMap,
    isTaskExecutionMap,
    isTaskExecutionStepMap
  }: DiagramConfiguration
) => {
  skipUndoManager(diagram, () => {
    diagram.model.setDataProperty(
      diagram.model.modelData,
      'published',
      !!viewOnly
    );
    diagram.model.setDataProperty(
      diagram.model.modelData,
      'blank',
      !!isBlankMap
    );
    diagram.model.setDataProperty(
      diagram.model.modelData,
      'task',
      !!isTaskMap
    );
    diagram.model.setDataProperty(
      diagram.model.modelData,
      'showStatusIndicator',
      !!showStatusIndicator
    );
    diagram.model.setDataProperty(
      diagram.model.modelData,
      'stepFlow',
      !!isStepFlowMap
    );
    diagram.model.setDataProperty(
      diagram.model.modelData,
      'step',
      !!isStepMap
    );
    diagram.model.setDataProperty(
      diagram.model.modelData,
      'taskExecution',
      !!isTaskExecutionMap
    );
    diagram.model.setDataProperty(
      diagram.model.modelData,
      'taskExecutionStep',
      !!isTaskExecutionStepMap
    );
  });
};
