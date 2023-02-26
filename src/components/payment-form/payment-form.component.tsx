import { FormEvent, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { StripeCardElement } from '@stripe/stripe-js';

import { selectCurrentUser } from '../../store/user/user.selector';
import { selectCartTotal } from '../../store/cart/cart.selector';
import { selectIsLoadingOrder, selectOrderDetails } from '../../store/orders/order.selector';

import { createOrderStart } from '../../store/orders/order.action';

import { PaymentFormContainer, FormContainer, PaymentButton } from './payment-form.styles';
import { BUTTON_TYPE_CLASSES } from '../button/button.component';


const ifValidCardElement = (card: StripeCardElement | null): card is StripeCardElement => card !== null;

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const amount = useSelector(selectCartTotal);
  const currentUser = useSelector(selectCurrentUser);
  const orderIsLoading = useSelector(selectIsLoadingOrder);
  const orderDetails = useSelector(selectOrderDetails);

  const shouldRedirect = useMemo(() => {
    if (orderDetails !== null) {
      return true;
    }
    return false;
  }, [orderDetails]);
  
  const paymentHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);
    if (!ifValidCardElement(card)) return;

    dispatch(createOrderStart(amount, card, currentUser, stripe));
  };

  return (
    <PaymentFormContainer>
      <FormContainer onSubmit={paymentHandler}>
        <h2>Credit Card Payment</h2>
        <CardElement />
        <PaymentButton isLoading={orderIsLoading} buttonType={BUTTON_TYPE_CLASSES.inverted}>Pay Now</PaymentButton>
        { shouldRedirect && <Navigate to="/payment-succeeded" /> } 
      </FormContainer>
    </PaymentFormContainer>
  );
};

export default PaymentForm;
