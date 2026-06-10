import * as React from 'react';
import type { PiletApi } from 'piral-shell';

const Checkout = React.lazy(() => import('./Checkout'));

export function setup(app: PiletApi) {
  app.registerPage('/checkout', Checkout);
}
