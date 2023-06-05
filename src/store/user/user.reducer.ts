import { AnyAction } from 'redux';

import {
  signInFailed,
  signUpFailed,
  signOutFailed,
  signOutSuccess,
  signInSuccess,
  updateUserDataStart,
  updateUserDataSuccess,
  updateUserDataFailed,
  updateUserAddressStart,
  removeUserAddress,
  updateUserFavoriteProducts,
  updateUserOrders,
} from './user.action';
import { UserData } from '../../utils/firebase/firebase.user.utils';

export type UserState = {
  readonly currentUser: UserData | null;
  readonly isLoading: boolean;
  readonly error: Error | null;
};

const INITIAL_STATE: UserState = {
  currentUser: null,
  isLoading: false,
  error: null,
};

export const userReducer = (state = INITIAL_STATE, action: AnyAction) => {
  if (updateUserFavoriteProducts.match(action)) {
    if (state.currentUser !== null) {
      const currentFavoriteProducts = state.currentUser.favoriteProducts;
      const productId = action.payload;

      if (currentFavoriteProducts.includes(productId)) {
        const updatedFavorites = currentFavoriteProducts.filter(
          (item) => item !== productId
        );
        const updatedUser = {
          ...state.currentUser,
          favoriteProducts: updatedFavorites,
        };
        return { ...state, currentUser: updatedUser };
      }

      const updatedFavorites = [...currentFavoriteProducts, productId];
      const updatedUser = {
        ...state.currentUser,
        favoriteProducts: updatedFavorites,
      };

      return { ...state, currentUser: updatedUser };
    }
    return state;
  }

  if (updateUserOrders.match(action)) {
    if (state.currentUser) {
      const user = state.currentUser;
      user.orders.push(action.payload);
      return { ...state, currentUser: user };
    }
    return state;
  }

  if (updateUserDataStart.match(action)) {
    return { ...state, isLoading: true };
  }

  if (updateUserAddressStart.match(action)) {
    return { ...state, isLoading: true };
  }

  if (removeUserAddress.match(action)) {
    return { ...state, isLoading: true };
  }

  if (updateUserDataSuccess.match(action)) {
    return {
      ...state,
      isLoading: false,
      currentUser: action.payload,
      error: null,
    };
  }

  if (signInSuccess.match(action)) {
    return { ...state, currentUser: action.payload, error: null };
  }

  if (signOutSuccess.match(action)) {
    return { ...state, currentUser: null };
  }

  if (
    signUpFailed.match(action) ||
    updateUserDataFailed.match(action) ||
    signInFailed.match(action) ||
    signOutFailed.match(action)
  ) {
    return { ...state, error: action.payload };
  }

  return state;
};
