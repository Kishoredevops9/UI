import * as go from 'gojs';

export const registerAdornment = (
  adornment: go.Adornment,
  name: string,
  part: go.Part
): go.Adornment => {
  adornment.adornedObject = part;
  part.addAdornment(name, adornment);
  return part.findAdornment(name);
};

export const unregisterAdornment = (
  part: go.Part,
  name: string
) => {
  if (!part.findAdornment(name)) {
    return;
  }

  const adornment = part.findAdornment(name);
  adornment.adornedObject = null;
  part.removeAdornment(name);
};
