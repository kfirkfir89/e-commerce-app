import { useSelector } from 'react-redux';

import { selectOrderDetails } from '../../store/orders/order.selector';

import CheckoutItem from '../../components/checkout-item/checkout-item.component';

export const PaymentSucceeded = () => {
  const orderDetails = useSelector(selectOrderDetails);
  if (orderDetails === null || orderDetails.user === null) return <div></div>;

  const { createDate, orderId, user, orderItems } = orderDetails;

  return (
    <div>
      <h1>ty {user.displayName}</h1>
      {orderItems.map((cartItem) => (
        <CheckoutItem key={cartItem.id} cartItem={cartItem} />
      ))}
      <span>Payment Successful on {createDate.toString()}</span>
      <span>Your Order Number: {orderId}</span>
    </div>
  );
};

export default PaymentSucceeded;
