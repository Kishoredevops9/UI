export const createProcessMapApi = () => {
  let processMap: any;

  return {
    get: () => processMap,
    set: (_processMap: any) => {
      processMap = _processMap;
    }
  };
}
