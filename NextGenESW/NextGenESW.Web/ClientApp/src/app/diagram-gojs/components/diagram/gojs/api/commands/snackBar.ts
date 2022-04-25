import { SnackBarHandler } from '../../types'

export const createSnackBarApi = () => {
  let handler: SnackBarHandler;

  return {
    setSnackBarHandler: (nextHandler: SnackBarHandler) => {
      handler = nextHandler;
    },
    showSnackBar: (message: string) => handler(message)
  };
}
