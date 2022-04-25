import { Subject, Observable } from 'rxjs';

import { SeeThroughModel } from '../types';

export const seeThroughApi = () => {
  const seeThrough = new Subject<SeeThroughModel>();

  const getSeeThrough = () => seeThrough as Observable<SeeThroughModel>;
  const setSeeThrough = (model: SeeThroughModel) => {
    seeThrough.next(model);
  };

  return {
    getSeeThrough,
    setSeeThrough
  };
};
