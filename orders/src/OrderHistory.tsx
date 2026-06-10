import * as React from 'react';
import { useEffect, useState } from 'react';
import { Order } from './OrderModels';
import { OrderService } from './OrderService';

interface OrderHistoryProps {
  orderService: OrderService;
  refreshTrigger: number;
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ orderService, refreshTrigger }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    orderService.getOrderHistory().then(setOrders).catch(console.error);
  }, [refreshTrigger]);

  return (
    <div style={{ paddingLeft: '10px' }}>
      <h3>Order history:</h3>
      <table style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Transaction</th>
            <th>Order state</th>
            <th>Acquire Type</th>
            <th>Items:</th>
            <th>Total</th>
            <th>Address</th>
            <th>User</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.transaction}>
              <td>{order.transaction}</td>
              <td>{order.orderState}</td>
              <td>{order.acquireType}</td>
              <td style={{ display: 'flex', flexDirection: 'column' }}>
                {order.shippingItems.map((item) => (
                  <span key={item.id}>{item.quantity}x {item.model}</span>
                ))}
              </td>
              <td>{order.totalPrice} €</td>
              <td>
                <span>
                  {order.shippingAddress.fullName},
                  {order.shippingAddress.address},
                  {order.shippingAddress.telephone}.
                  {order.shippingAddress.zipCode}
                </span>
              </td>
              <td>{order.username}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderHistory;
