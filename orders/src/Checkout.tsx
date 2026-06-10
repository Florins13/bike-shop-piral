import * as React from 'react';
import { useEffect, useState, useCallback } from 'react';
import { Cart, CartItem, OrderRequest } from './OrderModels';
import { OrderService } from './OrderService';
import OrderHistory from './OrderHistory';

const orderService = new OrderService();

const Checkout: React.FC = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [acquireMode, setAcquireMode] = useState<'buy' | 'rent'>('buy');
  const [form, setForm] = useState({
    fullName: '',
    address: '',
    telephone: '',
    zipCode: '',
  });

  const loadCart = useCallback(async () => {
    try {
      const data = await orderService.getCart();
      setCart(data);
    } catch (err) {
      console.error('Error loading cart:', err);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const cartItems = cart?.cartItems ?? [];

  const cartTotal = cartItems
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
    .toFixed(2);

  const rentTotal = cartItems
    .reduce((sum, item) => sum + item.price * item.quantity * 0.3, 0)
    .toFixed(2);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const finaliseOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    const orderRequest: OrderRequest = {
      shippingAddress: form,
      acquireType: acquireMode,
    };

    try {
      await orderService.finaliseOrder(orderRequest);
      setRefreshTrigger((prev) => prev + 1);
      await loadCart();
      setForm({ fullName: '', address: '', telephone: '', zipCode: '' });
    } catch (err) {
      console.error('Error finalising order:', err);
    }
  };

  return (
    <div>
      <h1 style={{ marginLeft: '5px' }}>Checkout</h1>

      <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-around' }}>
        {/* Customer form */}
        <div>
          <form onSubmit={finaliseOrder} style={{ display: 'flex', flexDirection: 'column', alignItems: 'baseline', gap: '5px' }}>
            <label htmlFor="fullName">Full name</label>
            <input id="fullName" name="fullName" value={form.fullName} onChange={handleChange} required type="text" />

            <label htmlFor="address">Address</label>
            <input id="address" name="address" value={form.address} onChange={handleChange} required type="text" />

            <label htmlFor="telephone">Telephone</label>
            <input id="telephone" name="telephone" value={form.telephone} onChange={handleChange} required type="number" />

            <label htmlFor="zipCode">Zipcode</label>
            <input id="zipCode" name="zipCode" value={form.zipCode} onChange={handleChange} required type="text" />

            <div>
              <label htmlFor="buy">Buy</label>
              <input
                type="radio"
                id="buy"
                name="acquireType"
                value="buy"
                checked={acquireMode === 'buy'}
                onChange={() => setAcquireMode('buy')}
              />

              <label htmlFor="rent">Rent for 3 days</label>
              <input
                type="radio"
                id="rent"
                name="acquireType"
                value="rent"
                checked={acquireMode === 'rent'}
                onChange={() => setAcquireMode('rent')}
              />
            </div>

            <button type="submit" style={{ alignSelf: 'end' }}>Finalise</button>
          </form>
        </div>

        {/* Order summary */}
        <div>
          <table>
            <thead>
              <tr>
                <th>Bike</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item: CartItem) => (
                <tr key={item.id}>
                  <td>{item.model}</td>
                  <td>{item.quantity}</td>
                  <td>{item.price} €</td>
                </tr>
              ))}
              <tr>
                <td></td>
                <td style={{ textAlign: 'end', fontWeight: 'bold' }}>Total:</td>
                <td style={{ fontWeight: 'bold' }}>
                  {acquireMode === 'buy' ? cartTotal : rentTotal} €
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Order history */}
      <OrderHistory orderService={orderService} refreshTrigger={refreshTrigger} />
    </div>
  );
};

export default Checkout;
