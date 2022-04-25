import { DialogBoxHandler } from '../../types';

export const createDialogBoxApi = () => {
  let handler: DialogBoxHandler;

  return {
    setDialogBoxHandler: (nextHandler: DialogBoxHandler) => {
      handler = nextHandler;
    },
    openDialogBox: (action) => handler(action)
  };
};
