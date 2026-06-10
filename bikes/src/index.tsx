import * as React from 'react';
import type { PiletApi } from 'piral-shell';

const Bikes = React.lazy(() => import('./Bikes'));

export function setup(app: PiletApi) {
  app.registerTile(() => <Bikes />);
}
