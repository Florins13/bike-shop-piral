import * as React from 'react';
import { useEffect, useState, useCallback } from 'react';
import { Cart, CartItem, CartService } from './CartService';

const cartService = new CartService();
const BIKE_IMAGE_BASE_URL = 'http://localhost:8082';

export const CartComponent: React.FC = () => {
  const [cart, setCart] = useState<Cart | null>(null);

  const loadCart = useCallback(async () => {
    const data = await cartService.getCart();
    setCart(data);
  }, []);

  const handleAddToCartEvent = useCallback(
    async (event: Event) => {
      const customEvent = event as CustomEvent;
      const bikeId = customEvent.detail?.bike?.id;
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

  const removeItem = async (id: number) => {
    try {
      await cartService.deleteCartItem(id);
      await loadCart();
    } catch (err) {
      console.error('Error removing item from cart:', err);
    }
  };

  const updateQuantity = async (id: number, type: 'increase' | 'decrease') => {
    try {
      await cartService.updateCartItemQuantity(id, type);
      await loadCart();
    } catch (err) {
      console.error(`Error updating quantity (${type}):`, err);
    }
  };

  const cartTotal = cart
    ? cart.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)
    : '0.00';

  const cartIsEmpty = cart ? cart.cartItems.length === 0 : true;

  const goToCheckout = () => {
    window.location.href = '/checkout';
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'space-evenly', width: '250px' }}>
        Your Cart:
        {cart?.cartItems.map((item: CartItem) => (
          <div key={item.id} style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
            <div className="cart__bike__box">
              <button
                onClick={() => removeItem(item.id)}
                style={{ width: '25px', alignSelf: 'flex-end' }}
              >
                X
              </button>

              <h4 style={{ textAlign: 'center' }}>Model: {item.model}</h4>
              {item.imageSource && (
                <img src={`${BIKE_IMAGE_BASE_URL}/${item.imageSource}`} height={70} width={70} alt={item.model} />
              )}
              <span>Price: {item.price}€</span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <button onClick={() => updateQuantity(item.id, 'decrease')}>-</button>
                <p>{item.quantity}</p>
                <button onClick={() => updateQuantity(item.id, 'increase')}>+</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '5px' }}>
        <h3>Total: {cartTotal} €</h3>
        <button
          onClick={goToCheckout}
          disabled={cartIsEmpty}
          style={{ height: '30px', alignSelf: 'center' }}
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default CartComponent;
