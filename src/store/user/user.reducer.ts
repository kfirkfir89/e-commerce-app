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
} from './user.action';
import { UserData } from '../../utils/firebase/firebase.utils';

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
