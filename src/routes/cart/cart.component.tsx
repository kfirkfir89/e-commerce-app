import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  selectCartItems,
  selectCartTotal,
} from '../../store/cart/cart.selector';
import CheckoutItem from '../../components/checkout-item/checkout-item.component';

const Cart = () => {
  const cartItemsSelector = useSelector(selectCartItems);
  const cartTotalSelector = useSelector(selectCartTotal);

  return (
    <div className="flex h-full w-full flex-col items-center ">
      <h2 className="mb-6 text-center text-2xl font-semibold capitalize text-slate-700 lg:m-2 lg:mb-8">
        My Bag
      </h2>
      <div className="container flex h-full w-full flex-col items-center gap-2">
        <div className="flex max-w-2xl flex-col items-center justify-start overflow-y-auto bg-white p-2">
          {cartItemsSelector.length > 0 ? (
            cartItemsSelector.map((cartItem) => (
              <CheckoutItem key={cartItem.colorId} cartItem={cartItem} />
            ))
          ) : (
            <div className="leading-0 flex max-w-3xl flex-col font-dosis text-sm font-semibold uppercase tracking-wide text-slate-700">
              {/* cart items */}
              <span className="m-auto my-4 text-lg font-medium">
                Your bag is empty
              </span>
            </div>
          )}
        </div>
        <div className="leading-0 flex w-screen justify-center bg-gray-100 py-8 font-dosis text-sm uppercase tracking-wide text-slate-700">
          <div className="container max-w-2xl px-4">
            <span className="flex text-lg  font-semibold">
              <span className="flex-1">Total amount: </span>
              <span className="flex-none">${cartTotalSelector}</span>
            </span>
            <p className="text-sm text-gray-400">
              Not including taxes and shipping costs
            </p>
          </div>
        </div>
        <div className="container mt-4 max-w-2xl">
          <button
            className="btn w-full rounded-none p-0 shadow-sm"
            disabled={cartItemsSelector.length === 0}
          >
            <Link
              to="/checkout"
              className="flex h-full w-full items-center justify-center"
            >
              <span className="leading-0 flex pt-1 font-smoochSans text-xs font-semibold uppercase tracking-widest">
                checkout
              </span>
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
