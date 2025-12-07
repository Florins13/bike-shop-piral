import * as React from 'react';
import { Link } from 'react-router-dom';
import type { PiletApi } from 'piral-shell';

const Cart = React.lazy(() => import('./Cart'));

export function setup(app: PiletApi) {
  app.registerPage('/cart', Cart);
  
  // app.showNotification('Hello from Piral to CART!', {
  //   autoClose: 2000,
  // });
  // app.registerMenu(() => <Link to="/cart">Page</Link>);
  app.registerTile(() => <Cart />);
}
