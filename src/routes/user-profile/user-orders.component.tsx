import { useSelector } from 'react-redux';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  selectCurrentUser,
  selectUserIsLoading,
} from '../../store/user/user.selector';
import { NewOrderDetails } from '../../store/orders/order.types';
import { getUserOrders } from '../../utils/firebase/firebase.order.utils';
import Spinner from '../../components/spinner/spinner.component';

const UserOrders = () => {
  const currentUserSelector = useSelector(selectCurrentUser);
  const [userOrders, setUserOrders] = useState<NewOrderDetails[]>([]);
  const [isViewOrder, setIsViewOrder] = useState<NewOrderDetails>();
  const modalRef = useRef<HTMLInputElement>(null);
  const currentUserIsLoading = useSelector(selectUserIsLoading);

  const fetchUserOrders = useCallback(async () => {
    if (!currentUserSelector) return;
    try {
      const res = await getUserOrders(currentUserSelector.orders);
      setUserOrders(res);
    } catch (error) {
      console.log('error:', error);
    }
  }, [currentUserSelector]);

  useEffect(() => {
    const res = fetchUserOrders();
  }, [currentUserSelector, fetchUserOrders]);

  return (
    <div className="relative flex h-full w-full flex-col items-center">
      {/* modal */}
      <div className="z-[100] w-full">
        <div className="flex w-full ">
          <div className="flex w-full justify-center bg-gray-100">
            <input
              ref={modalRef}
              type="checkbox"
              id="my-modal-4"
              className="modal-toggle"
            />
            <label htmlFor="my-modal-4" className="modal cursor-pointer">
              <label
                className="modal-box relative max-w-4xl bg-white p-4"
                htmlFor=""
              >
                {isViewOrder && (
                  <>
                    <h3 className="m-4 text-lg font-bold tracking-wider">
                      Order Number: {isViewOrder.orderId}
                    </h3>
                    <div className="container flex max-w-6xl flex-col items-center  border-[1px] border-dashed border-slate-700   sm:flex-row sm:p-6">
                      <div className="flex w-full flex-1 flex-col gap-4 p-6 font-smoochSans capitalize tracking-wider">
                        <div className="flex flex-col gap-2 px-3 text-sm">
                          <div className="grid grid-cols-3  gap-4 whitespace-nowrap px-3 text-xs sm:text-sm">
                            <div className="col-span-1 flex flex-col place-items-end gap-2 font-semibold">
                              <span>order date:</span>
                            </div>
                            <div className="col-span-2 flex w-full flex-col gap-y-1 whitespace-normal font-smoochSans tracking-widest">
                              <span>
                                {isViewOrder.createDate
                                  .toDate()
                                  .toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <div className="grid grid-cols-3  gap-4 whitespace-nowrap px-3 text-xs sm:text-sm">
                            <div className="col-span-1 flex flex-col place-items-end gap-2 font-semibold">
                              <span>address:</span>
                            </div>
                            <div className="col-span-2 flex w-full flex-col gap-y-1 whitespace-normal font-smoochSans tracking-widest">
                              <div className="flex flex-col">
                                <span>
                                  {isViewOrder.deliveryAddress.firstName}{' '}
                                  {isViewOrder.deliveryAddress.lastName}
                                </span>
                                <span>
                                  {isViewOrder.deliveryAddress.address}
                                </span>
                                <span>{isViewOrder.deliveryAddress.city}</span>
                                <span>
                                  {isViewOrder.deliveryAddress.country}
                                </span>
                                <span>
                                  {isViewOrder.deliveryAddress.postcode}
                                </span>
                                <span>{isViewOrder.deliveryAddress.state}</span>
                                <span>
                                  {isViewOrder.deliveryAddress.mobile}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-3  gap-4 whitespace-nowrap px-3 text-xs sm:text-sm">
                            <div className="col-span-1 flex flex-col place-items-end gap-2 font-semibold">
                              <span className="flex-1">Total amount: </span>
                            </div>
                            <div className="col-span-2 flex w-full flex-col gap-y-1 whitespace-normal font-smoochSans tracking-widest">
                              <span className="flex font-semibold sm:text-lg">
                                ${isViewOrder.paymentIntent.amount / 100}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* items rendering */}
                      <div className="flex h-full w-full max-w-xs ">
                        <div className="flex w-full flex-col justify-center gap-2 overflow-y-auto bg-gray-100 p-4  ">
                          {isViewOrder.orderItems.map((item) => (
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
                  </>
                )}

                <button className="mt-4 h-full w-full">
                  <label
                    htmlFor="my-modal-4"
                    className="btn z-50 w-full max-w-md rounded-none shadow-sm"
                  >
                    <div className={`flex w-full items-center justify-center `}>
                      <span className="leading-0 flex  font-smoochSans text-xs font-semibold uppercase tracking-widest">
                        close
                      </span>
                    </div>
                  </label>
                </button>
              </label>
            </label>
          </div>
        </div>
      </div>

      {/* orders */}
      <div className="absolute flex h-full w-full pb-2">
        <div className="scrollbarStyle relative flex h-full w-full flex-col gap-4 overflow-y-auto px-2 sm:px-4">
          {currentUserIsLoading && (
            <div className="absolute z-50 flex h-full w-full flex-col items-center justify-center bg-gray-400 opacity-50">
              <Spinner />
            </div>
          )}
          {userOrders &&
            userOrders.map((order) => (
              <div key={order.orderId} className="flex w-full flex-col">
                <div className="container flex max-w-6xl  flex-col items-center gap-2 bg-white p-2 sm:p-6">
                  <div className="flex w-full flex-1 flex-col py-4 font-smoochSans capitalize tracking-wider sm:p-6">
                    <div className="flex flex-col gap-3 sm:items-start">
                      <div className="grid w-full grid-cols-3 gap-4 whitespace-nowrap px-3 text-xs sm:text-sm">
                        <div className="col-span-1 flex flex-col place-items-end gap-2 font-semibold sm:place-items-start">
                          <span>order date:</span>
                        </div>
                        <div className="col-span-2 flex w-full flex-col gap-y-1 whitespace-normal font-smoochSans tracking-widest">
                          <span>
                            {order.createDate.toDate().toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="grid w-full grid-cols-3 gap-4 whitespace-nowrap px-3 text-xs sm:text-sm">
                        <div className="col-span-1 flex flex-col place-items-end gap-2 font-semibold sm:place-items-start">
                          <span>Order no.:</span>
                        </div>
                        <div className="col-span-2 flex w-full flex-col gap-y-1 whitespace-normal font-smoochSans tracking-widest">
                          <span>
                            <span>{order.orderId}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* images */}
                  <div className="flex h-full w-full  ">
                    <div className="flex w-full flex-wrap  gap-2 overflow-y-auto bg-gray-100 p-4 sm:flex-nowrap">
                      {order.orderItems.map((item) => (
                        <div
                          key={item.colorId}
                          className="flex  space-x-2 bg-gray-100 font-dosis uppercase tracking-wide text-slate-700"
                        >
                          <img
                            src={`${item.previewImage}`}
                            alt={`${item.productName}`}
                            className="h-36 w-full flex-shrink-0 rounded-none object-cover outline-none "
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    className="mt-2 h-full w-full max-w-xs"
                    onClick={() => setIsViewOrder(order)}
                  >
                    <label
                      htmlFor="my-modal-4"
                      className="btn z-50 w-full max-w-md rounded-none shadow-sm"
                    >
                      <div
                        className={`flex w-full items-center justify-center `}
                      >
                        <span className="leading-0 flex  font-smoochSans text-xs font-semibold uppercase tracking-widest">
                          view order
                        </span>
                      </div>
                    </label>
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default UserOrders;
