import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { Appearance, PaymentIntentResult, Stripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { apply } from 'redux-saga/effects';
import { v4 } from 'uuid';
import { sendEmailVerification } from 'firebase/auth';
import {
  selectCartCount,
  selectCartItems,
  selectCartTotal,
} from '../../store/cart/cart.selector';

import CheckoutItem from '../../components/checkout-item/checkout-item.component';

import PaymentForm from '../../components/payment-form/payment-form.component';
import {
  selectCurrentUser,
  selectUserIsLoading,
} from '../../store/user/user.selector';
import {
  UserAddress,
  getCurrentUser,
} from '../../utils/firebase/firebase.utils';

import { ReactComponent as DeleteIcon } from '../../assets/delete.svg';
import { CartItemPreview } from '../../store/cart/cart.types';
import { clearItemFromCart } from '../../store/cart/cart.action';
import {
  stripePaymentIntent,
  stripePromise,
} from '../../utils/stripe/stripe.utils';
import UserDetails from '../user-profile/user-details.component';
import UserAddressBook from '../user-profile/user-address-book.component';
import { popUpMessageContext } from '../navigation/navigation.component';

const appearance: Appearance = {
  theme: 'flat',
  variables: {
    fontFamily: '"Smooch-Sans", sans-serif',
    fontLineHeight: '1.5',
    borderRadius: '0px',
    colorBackground: '#fff',
    colorPrimaryText: '#334155',
  },
  rules: {
    '.Block': {
      backgroundColor: 'var(--colorBackground)',
      boxShadow: 'none',
      padding: '0px',
      margin: '0px',
    },
    '.Input': {
      padding: '10px',
    },
    '.Input:disabled, .Input--invalid:disabled': {
      color: '#f3f4f6',
    },
    '.Tab': {
      padding: '10px 12px 8px 12px',
    },
    '.Tab:hover': {
      border: 'none',
      boxShadow:
        '0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 7px rgba(18, 42, 66, 0.04)',
    },
    '.Tab--selected, .Tab--selected:focus, .Tab--selected:hover': {
      border: '1px var(--colorPrimaryText) dashed',
      backgroundColor: '#fff',
    },
    '.Label': {
      opacity: '0',
      color: 'red',
      fontWeight: '0',
      fontSize: '0.4rem',
      padding: '0',
      margin: '0',
    },
  },
};
const CheckOut = () => {
  const currentUserSelector = useSelector(selectCurrentUser);
  const cartItemsSelector = useSelector(selectCartItems);
  const cartTotalSelector = useSelector(selectCartTotal);
  const cartCountSelector = useSelector(selectCartCount);
  const { setMessage } = useContext(popUpMessageContext);

  const [stripePromiseState, setStripePromiseState] = useState<Stripe | null>();
  const [clientSecret, setClientSecret] = useState<string>();
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isDiffrentAddress, setIsDiffrentAddress] = useState(false);
  const [isExpressDelivery, setIsExpressDelivery] = useState(false);
  const [finalTotal, setFinalTotal] = useState(0);
  const [deliveryAddress, setDeliveryAddress] = useState<UserAddress>();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // fetch stripe obj
  useEffect(() => {
    const getStripe = async () => {
      try {
        const stripe = await stripePromise;
        setStripePromiseState(stripe);
      } catch (error) {
        console.log('error:', error);
      }
    };
    const res = getStripe();
  }, []);
  // create payment intent
  useEffect(() => {
    const getClientSecret = async (amount: number) => {
      try {
        const res = await stripePaymentIntent(amount);
        if (res && res.paymentIntent) {
          setClientSecret(res.paymentIntent.client_secret as string);
        }
      } catch (error) {
        console.log('error:', error);
      }
    };

    if (cartTotalSelector) {
      if (isExpressDelivery) {
        setFinalTotal(cartTotalSelector + 15.99);
      } else {
        setFinalTotal(cartTotalSelector);
      }

      const res = getClientSecret(finalTotal);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartTotalSelector, isExpressDelivery]);
  // handling the address change option
  useEffect(() => {
    setIsDiffrentAddress(false);
    if (currentUserSelector) {
      const address = currentUserSelector.addresses.find(
        (a) => a.aid === currentUserSelector.defualtAddressId
      );
      setDeliveryAddress(address);
    }
  }, [currentUserSelector, currentUserSelector?.defualtAddressId]);

  const getAuthUserEmailVerified = async () => {
    try {
      const user = await getCurrentUser();
      if (user) {
        setIsEmailVerified(user.emailVerified);
      }
    } catch (error) {
      console.log('error:', error);
    }
  };
  useEffect(() => {
    if (currentUserSelector === null) {
      navigate('/authentication');
    }
    const getUserVerification = getAuthUserEmailVerified();
  }, [currentUserSelector, navigate]);

  const emailVereficationHandler = async () => {
    try {
      const user = await getCurrentUser();
      if (user) {
        await sendEmailVerification(user);
        setMessage({ message: 'Please check your email for verification' });
      }
    } catch (error) {
      console.log('error:', error);
    }
  };
  console.log('isExpressDelivery:', isExpressDelivery);
  return (
    <div className="flex h-full w-full justify-center bg-white">
      <div className="container max-w-5xl">
        <div className="grid h-full w-full justify-items-center gap-3 px-2 md:grid-cols-3">
          {/* payment page */}
          <div className="order-2 flex h-full w-full flex-col gap-3 bg-white md:order-1  md:col-span-2">
            {/* user details */}
            <div className="flex h-fit w-full flex-col bg-gray-100 px-4 pb-4">
              {!(
                currentUserSelector?.displayName ||
                currentUserSelector?.lastName ||
                currentUserSelector?.dateOfBirth
              ) ? (
                <>
                  <h1 className="flex p-4 py-4 font-smoochSans font-semibold uppercase tracking-wider text-slate-700">
                    my details
                  </h1>
                  <span className="flex justify-center px-4 font-smoochSans text-sm capitalize tracking-wider text-yellow-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 flex-shrink-0 stroke-current"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    <span className="px-2 leading-6 text-slate-500">
                      Please finish your account details before continuing
                      checkout
                    </span>
                  </span>
                  <UserDetails />
                </>
              ) : (
                <>
                  <h1 className="flex p-4 py-4 font-smoochSans font-semibold uppercase tracking-wider text-slate-700">
                    email address
                  </h1>
                  <div className="flex w-full flex-col gap-y-1 px-6 pb-2  font-smoochSans tracking-widest">
                    <span>
                      {currentUserSelector.firstName}{' '}
                      {currentUserSelector.lastName}
                    </span>
                    <span>{currentUserSelector.email}</span>
                  </div>
                </>
              )}
            </div>
            {/* user address */}
            <div className="scrollbarStyle flex  w-full flex-col bg-gray-100 px-4">
              <h1 className="flex p-4 py-4 font-smoochSans font-semibold uppercase tracking-wider text-slate-700">
                delivery address
              </h1>
              {deliveryAddress && !isDiffrentAddress ? (
                <div className="flex h-full w-full justify-end pb-4 text-sm">
                  <div className="flex w-full flex-1 flex-col gap-y-1 px-6 pb-2  font-smoochSans tracking-widest">
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
                  <div className="flex flex-col">
                    <button
                      onClick={() => setIsDiffrentAddress(true)}
                      className={` btn w-full max-w-md rounded-none shadow-sm`}
                    >
                      <div className="flex w-full items-center justify-center ">
                        <span className="leading-0 flex pt-1 font-smoochSans text-xs font-semibold uppercase tracking-widest">
                          change
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex h-[28rem] w-full flex-col text-sm">
                  <UserAddressBook />
                </div>
              )}
            </div>
            {/* delivery option */}
            <div className="scrollbarStyle flex  w-full flex-col bg-gray-100 px-4">
              <h1 className="flex p-4 py-4 font-smoochSans font-semibold uppercase tracking-wider text-slate-700">
                DELIVERY OPTIONS
              </h1>
              <div className="flex h-full w-full flex-col justify-end gap-2 pb-4 font-smoochSans text-sm capitalize tracking-widest">
                <div className="form-control">
                  <label className="flex cursor-pointer">
                    <input
                      type="radio"
                      name="radio-10"
                      className="radio checked:bg-slate-700"
                      onChange={() => setIsExpressDelivery(false)}
                      checked={!isExpressDelivery}
                    />
                    <span className="flex-1 px-2 leading-6">Free Delivery</span>
                    <span className="px-2 font-semibold leading-6">$ 0</span>
                  </label>
                </div>
                <div className="form-control">
                  <label className="flex cursor-pointer">
                    <input
                      type="radio"
                      name="radio-10"
                      className="radio checked:bg-slate-700"
                      onChange={() => setIsExpressDelivery(true)}
                      checked={isExpressDelivery}
                    />
                    <span className="flex-1 px-2 leading-6">
                      express Delivery
                    </span>
                    <span className="px-2 font-semibold leading-6">
                      $ 15.99
                    </span>
                  </label>
                </div>
              </div>
            </div>
            {/* stripe payment form */}
            <div className="flex w-full justify-center bg-gray-100 p-4">
              {stripePromiseState && clientSecret && isEmailVerified ? (
                <Elements
                  stripe={stripePromiseState!}
                  options={{ clientSecret, appearance }}
                >
                  <PaymentForm />
                </Elements>
              ) : (
                <div className="flex w-full flex-col items-center  gap-5 p-4">
                  <span className="flex justify-center px-4 font-smoochSans text-sm capitalize tracking-wider text-yellow-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 flex-shrink-0 stroke-current"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    <span className="px-2 leading-6 text-slate-500">
                      please confirm your email address before making a payment.
                    </span>
                  </span>
                  <button
                    onClick={emailVereficationHandler}
                    className={` btn w-full max-w-xs rounded-none shadow-sm`}
                  >
                    <div className="flex w-full items-center justify-center ">
                      <span className="leading-0 flex pt-1 font-smoochSans text-xs font-semibold uppercase tracking-widest">
                        Send verification email
                      </span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
          {/* side cart  */}
          <div className="h-full w-full md:order-1 md:col-span-1">
            <div className="flex w-full flex-col  justify-start gap-2 overflow-y-auto bg-gray-100 px-4 ">
              <div className="leading-0 flex max-w-3xl flex-col p-2 font-dosis text-xs font-normal uppercase tracking-wide text-slate-700">
                <h2>
                  My Bag,{' '}
                  <span className="pl-1 text-base font-semibold capitalize">
                    {cartCountSelector} items
                  </span>
                </h2>
              </div>
              {cartItemsSelector.map((cartItemsSelector) => (
                <div
                  key={cartItemsSelector.colorId}
                  className="flex w-full space-x-2 bg-white font-dosis uppercase tracking-wide text-slate-700"
                >
                  <img
                    src={`${cartItemsSelector.previewImage}`}
                    alt={`${cartItemsSelector.productName}`}
                    className="h-full w-1/3 flex-shrink-0 rounded-none object-cover outline-none"
                  />
                  <div className="flex h-full w-full flex-col gap-y-2 px-1 capitalize">
                    <div className="flex flex-1 flex-col gap-y-1 text-base font-semibold">
                      <h3>{cartItemsSelector.productName}</h3>
                      <p>$ {cartItemsSelector.price}</p>
                      <div className="grid grid-cols-2 text-sm font-normal">
                        <div className="flex flex-col">
                          <span>Color:</span>
                          <span>Size:</span>
                          <span>Quantity:</span>
                        </div>
                        <div className="flex flex-col">
                          <span>{cartItemsSelector.color}</span>
                          <span>{cartItemsSelector.size}</span>
                          <span>{cartItemsSelector.quantity}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="leading-0 my-4 w-full bg-white p-4 font-dosis text-sm uppercase tracking-wide text-slate-700">
                <span className="flex text-lg  font-semibold">
                  <span className="flex-1">Total amount: </span>
                  <span className="flex-none">${finalTotal}</span>
                </span>
                <p className="text-sm text-gray-400">
                  Not including taxes and shipping costs
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
