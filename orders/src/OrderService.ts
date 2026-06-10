import { Cart, Order, OrderRequest } from './OrderModels';

export class OrderService {
  private readonly cartUrl = 'http://localhost:8082';
  private readonly orderUrl = 'http://localhost:8083';

  async getCart(): Promise<Cart> {
    const res = await fetch(`${this.cartUrl}/cart`);
    return res.json();
  }

  async finaliseOrder(orderRequest: OrderRequest): Promise<Order> {
    const res = await fetch(`${this.orderUrl}/order/finalise`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...orderRequest.shippingAddress,
        acquireType: orderRequest.acquireType,
      }),
    });
    return res.json();
  }

  async getOrderHistory(): Promise<Order[]> {
    const res = await fetch(`${this.orderUrl}/order/history`);
    return res.json();
  }
}
