import * as React from 'react';
import { useEffect, useState, useCallback } from 'react';

import { Cart, CartItem, CartService } from './CartService';
import { createNavigation } from 'piral-core/lib/defaults/navigator_none';
import { Link } from 'react-router-dom';


const cartService = new CartService();

export const CartComponent: React.FC = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  // const navigate = createNavigation('/cart');


  // Load cart from backend
  const loadCart = useCallback(async () => {
    const data = await cartService.getCart();
    setCart(data);
  }, []);

  // Add to cart event handler
  const handleAddToCartEvent = useCallback(
    async (event: Event) => {
      const customEvent = event as CustomEvent<number>;
      const bikeId = customEvent.detail;
      console.log('Received bikeId from event:', bikeId);

      try {
        await cartService.addToCart(bikeId);
        await loadCart();
      } catch (err) {
        console.error('Error adding bike to cart:', err);
      }
    },
    [loadCart]
  );

  useEffect(() => {
    loadCart();
    window.addEventListener('add-to-cart', handleAddToCartEvent as EventListener);

    return () => {
      console.log('CartComponent destroyed');
      window.removeEventListener('add-to-cart', handleAddToCartEvent as EventListener);
    };
  }, [handleAddToCartEvent, loadCart]);

  // Remove item
  const removeItem = async (id: number) => {
    try {
      await cartService.deleteCartItem(id);
      await loadCart();
    } catch (err) {
      console.error('Error removing item from cart:', err);
    }
  };

  // Update quantity
  const updateQuantity = async (id: number, type: 'increase' | 'decrease') => {
    try {
      await cartService.updateCartItemQuantity(id, type);
      await loadCart();
    } catch (err) {
      console.error(`Error updating quantity (${type}):`, err);
    }
  };

  // Computed values
  const cartTotal = cart
    ? cart.cartItems.reduce((sum, item) => sum + item.bike.price * item.quantity, 0).toFixed(2)
    : '0.00';

  const cartIsEmpty = cart ? cart.cartItems.length === 0 : true;



  return (
    <div>
      <h3>Your Cart</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'space-evenly' }}>
        {cart?.cartItems.map((item: CartItem) => (
          <div
            key={item.id}
            className="bike__box"
            style={{ border: '1px solid #ccc', borderRadius: 5, padding: 10, width: 200, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <button
              onClick={() => removeItem(item.id)}
              style={{ alignSelf: 'flex-end', width: 25 }}
            >
              X
            </button>

            <h4 style={{ textAlign: 'center' }}>Model: {item.bike.model}</h4>
            {item.bike.imageSource && (
              <img src={item.bike.imageSource} height={70} width={70} alt={item.bike.model} />
            )}
            <span>Price: {item.bike.price}€</span>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button onClick={() => updateQuantity(item.id, 'decrease')}>-</button>
              <p style={{ margin: 0 }}>{item.quantity}</p>
              <button onClick={() => updateQuantity(item.id, 'increase')}>+</button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 20, paddingRight: 50, marginTop: 20 }}>
        <h3>Total: {cartTotal} €</h3>
        <Link to="/sometest">
          <button disabled={cartIsEmpty} style={{ height: 30 }}>Checkout</button>
        </Link>

      </div>
    </div>
  );
};

export default CartComponent;
