export const shakeObject = (obj) => {
  const { x, y } = obj.location;
  obj.moveTo(x + 1, y, true);
  obj.moveTo(x, y, true);
};
