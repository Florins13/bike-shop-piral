interface Bike {
  id: number;
  model: string;
  imageSource: string;
  stock: number;
  details: string;
  electric: boolean;
  price: number;
}

export interface CartItem extends Bike {
  quantity: number;
}

export interface Cart {
  cartItems: CartItem[];
  cartTotal: number;
  cartIsEmpty: boolean;
}

export class CartService {
  private apiUrl = 'http://localhost:8082';

  async getCart(): Promise<Cart> {
    const res = await fetch(`${this.apiUrl}/cart`);
    return res.json();
  }

  async addToCart(bikeId: number): Promise<void> {
    await fetch(`${this.apiUrl}/cart/add/${bikeId}`, { method: 'POST' });
  }

  async deleteCartItem(id: number): Promise<void> {
    await fetch(`${this.apiUrl}/cart/delete/${id}`, { method: 'POST' });
  }

  async updateCartItemQuantity(id: number, type: 'increase' | 'decrease'): Promise<void> {
    await fetch(`${this.apiUrl}/cart/updateQuantity/${id}/${type}`, { method: 'POST' });
  }
}
