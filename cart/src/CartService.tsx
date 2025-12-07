interface Bike {
  id: number;
  model: string;
  imageSource: string;
  stock: number;
  details: string;
  electric: boolean;
  price: number;
}

export interface CartItem {
  id: number;
  bike: Bike;
  quantity: number;
}

export interface Cart {
  cartItems: CartItem[];
  cartTotal: number;
  cartIsEmpty: boolean;
}

export class CartService {
  private apiUrl = 'http://localhost:8080';

  async getCart(): Promise<Cart> {
    const res = await fetch(`${this.apiUrl}/cart`);
    return res.json();
  }

  async addToCart(id: number): Promise<void> {
    await fetch(`${this.apiUrl}/cart/add/${id}`, { method: 'POST' });
  }

  async deleteCartItem(id: number): Promise<void> {
    await fetch(`${this.apiUrl}/cart/deleteItem/${id}`, { method: 'POST' });
  }

  async updateCartItemQuantity(id: number, type: 'increase' | 'decrease'): Promise<void> {
    await fetch(`${this.apiUrl}/cart/updateQuantity/${id}/${type}`, { method: 'POST' });
  }
}
