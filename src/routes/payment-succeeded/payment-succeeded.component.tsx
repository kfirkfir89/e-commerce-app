import { useDispatch, useSelector } from 'react-redux';

import { useEffect } from 'react';
import { selectOrderDetails } from '../../store/orders/order.selector';

import { resetCartItemsState } from '../../store/cart/cart.action';
import NotFound from '../not-found/not-found.component';

export const PaymentSucceeded = () => {
  const orderDetailsSelector = useSelector(selectOrderDetails);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetCartItemsState());
  }, [dispatch]);

  if (orderDetailsSelector === null) return <NotFound />;

  const {
    orderItems,
    paymentIntent,
    orderId,
    createDate,
    deliveryAddress,
    user,
  } = orderDetailsSelector;

  return (
    <div className="flex h-full w-full flex-col items-center bg-white p-4">
      <div className="container flex max-w-6xl flex-col  border-[1px] border-dashed border-slate-700 bg-green-200 p-2 sm:flex-row sm:p-6">
        <div className="flex w-full flex-1 flex-col gap-4 p-6 font-smoochSans capitalize tracking-wider">
          <h1 className="text-lg font-semibold">
            Thank you for your order {user.displayName}!
          </h1>
          <div className="flex flex-col gap-2 px-3 text-sm">
            <span>
              Payment Successful on {createDate.toDate().toLocaleString()}
            </span>
            <span>Order Number: {orderId}</span>
            <div className="flex w-full flex-col gap-y-1 font-smoochSans tracking-widest">
              <span>address:</span>
              <div className="flex flex-col px-4">
                <span>
                  {deliveryAddress.firstName} {deliveryAddress.lastName}
                </span>
                <span>{deliveryAddress.address}</span>
                <span>{deliveryAddress.city}</span>
                <span>{deliveryAddress.country}</span>
                <span>{deliveryAddress.postcode}</span>
                <span>{deliveryAddress.state}</span>
                <span>{deliveryAddress.mobile}</span>
              </div>
            </div>
          </div>
          <span className="flex text-lg font-semibold">
            <span className="flex-1">Total amount: </span>
            <span className="flex-none">${paymentIntent.amount / 100}</span>
          </span>
        </div>
        <div className="flex h-full w-full max-w-xs md:order-1 md:col-span-1">
          <div className="flex w-full flex-col justify-start gap-2 overflow-y-auto bg-gray-100 p-4  ">
            {orderItems.map((item) => (
              <div
                key={item.colorId}
                className="flex w-full space-x-2 bg-white font-dosis uppercase tracking-wide text-slate-700"
              >
                <img
                  src={`${item.previewImage}`}
                  alt={`${item.productName}`}
                  className="h-full w-1/3 flex-shrink-0 rounded-none object-cover outline-none"
                />
                <div className="flex h-full w-full flex-col gap-y-2 px-1 capitalize">
                  <div className="flex flex-1 flex-col gap-y-1 text-base font-semibold">
                    <h3>{item.productName}</h3>
                    <p>$ {item.price}</p>
                    <div className="grid grid-cols-2 text-sm font-normal">
                      <div className="flex flex-col">
                        <span>Color:</span>
                        <span>Size:</span>
                        <span>Quantity:</span>
                      </div>
                      <div className="flex flex-col">
                        <span>{item.color}</span>
                        <span>{item.size}</span>
                        <span>{item.quantity}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSucceeded;
