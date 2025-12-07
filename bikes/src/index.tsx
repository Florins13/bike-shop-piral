import * as React from 'react';
import { Link } from 'react-router-dom';
import type { PiletApi } from 'piral';

const Bikes = React.lazy(() => import('./Bikes'));

export function setup(app: PiletApi) {
  // app.registerPage('/page', Bikes);

  // app.showNotification('Hello from Piral to BIKES!', {
  //   autoClose: 2000,
  // });
  // app.registerMenu(() => <Link to="/bikes">Bikes</Link>);
  app.registerTile(() => <Bikes />);
}
