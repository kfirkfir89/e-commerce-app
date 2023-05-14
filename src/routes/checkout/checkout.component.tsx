import { useSelector } from 'react-redux';

import { selectCartItems, selectCartTotal } from '../../store/cart/cart.selector';

import CheckoutItem from '../../components/checkout-item/checkout-item.component';

import PaymentForm from '../../components/payment-form/payment-form.component';

const CheckOut = () => {
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);

  return (
    <div className="h-90v flex flex-col items-center m-auto mr-12">
      <div className="w-full pr-2 flex justify-between border-b-2">
        <div className="capitalize w-1/4 last:w-1/12">
          <span>Product</span>
        </div>
        <div className="capitalize w-1/4 last:w-1/12">
          <span>Description</span>
        </div>
        <div className="capitalize w-1/4 last:w-1/12">
          <span>Quantity</span>
        </div>
        <div className="capitalize w-1/4 last:w-1/12">
          <span>Price</span>          
        </div>
        <div className="capitalize w-1/4 last:w-1/12">
          <span>Remove</span>
        </div>
      </div>
      {
        cartItems.map((cartItem) => (<CheckoutItem key={cartItem.colorId} cartItem={cartItem} />))
      }
      <span className="mt-7 ml-auto text-3xl">
        Total: $
        {cartTotal}
      </span>
      <PaymentForm />
    </div>
  );
};

export default CheckOut;
