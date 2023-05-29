import { takeLatest, put, all, call } from 'typed-redux-saga';
import { User } from 'firebase/auth';

import { USER_ACTION_TYPES } from './user.types';

import {
  signInSuccess,
  signInFailed,
  signUpSuccess,
  signUpFailed,
  signOutSuccess,
  signOutFailed,
  EmailSignInStart,
  SignUpStart,
  SignUpSuccess,
  updateUserDataFailed,
  updateUserDataSuccess,
  UpdateUserDataStart,
  UpdateUserAddressStart,
  UpdateUserDefualtAddress,
  RemoveAddress,
} from './user.action';

import {
  getCurrentUser,
  createUserDocumentFromAuth,
  signInWithGooglePopup,
  signInAuthUserWithEmailAndPassword,
  createAuthUserWithEmailAndPassword,
  signOutUser,
  AddittionalInformation,
  updateUserDocument,
} from '../../utils/firebase/firebase.utils';

// getting the user auth to connect or create
export function* getSnapshotFromUserAuth(
  userAuth: User,
  additionalDetails?: AddittionalInformation
) {
  try {
    const userSnapshot = yield* call(
      createUserDocumentFromAuth,
      userAuth,
      additionalDetails
    );

    if (userSnapshot) {
      yield* put(signInSuccess(userSnapshot.data()));
    }
  } catch (error) {
    yield* put(signInFailed(error as Error));
  }
}
// google signin check for exsist and unexsist
export function* signInWithGoogle() {
  try {
    const res = yield* call(signInWithGooglePopup);
    yield* call(getSnapshotFromUserAuth, res.user);
  } catch (error) {
    yield* put(signInFailed(error as Error));
  }
}

// email and password login
export function* signInWithEmail({
  payload: { email, password },
}: EmailSignInStart) {
  try {
    const userCredential = yield* call(
      signInAuthUserWithEmailAndPassword,
      email,
      password
    );
    if (userCredential) {
      const { user } = userCredential;
      yield* call(getSnapshotFromUserAuth, user);
    }
  } catch (error) {
    yield* put(signInFailed(error as Error));
  }
}

// check for cuttent user
export function* isUserAuthenticated() {
  try {
    const userAuth = yield* call(getCurrentUser);
    if (!userAuth) return;
    yield* call(getSnapshotFromUserAuth, userAuth);
  } catch (error) {
    yield* put(signInFailed(error as Error));
  }
}

// signup a new user with email and password
export function* signUp({
  payload: {
    email,
    password,
    dateOfBirth,
    firstName,
    lastName,
    sendNotification,
  },
}: SignUpStart) {
  try {
    const userCredential = yield* call(
      createAuthUserWithEmailAndPassword,
      email,
      password
    );
    if (userCredential) {
      const { user } = userCredential;
      const addittionalInfo: AddittionalInformation = {
        firstName,
        lastName,
        dateOfBirth,
        defualtAddressId: '',
        addresses: [],
        favoriteProducts: [],
        orders: [],
        isAdmin: false,
        sendNotification,
      };
      yield* put(signUpSuccess(user, addittionalInfo));
    }
  } catch (error) {
    yield* put(signUpFailed(error as Error));
  }
}

export function* updateUserData({
  payload: { formDetails, uid },
}: UpdateUserDataStart) {
  try {
    const userData = {
      ...formDetails,
      uid,
    };
    const res = yield* call(updateUserDocument, userData);
    if (res) {
      yield* put(updateUserDataSuccess(res));
    }
  } catch (error) {
    yield* put(updateUserDataFailed(error as Error));
  }
}

export function* updateDefualtAddress({
  payload: { addressId, userId },
}: UpdateUserDefualtAddress) {
  try {
    const res = yield* call(updateUserDocument, {
      defualtAddressId: addressId,
      uid: userId,
    });
    if (res) {
      yield* put(updateUserDataSuccess(res));
    }
  } catch (error) {
    yield* put(updateUserDataFailed(error as Error));
  }
}

export function* updateUserAddress({
  payload: { formDetails, uid },
}: UpdateUserAddressStart) {
  try {
    const userData = {
      ...formDetails,
      uid,
    };
    const res = yield* call(updateUserDocument, userData);
    if (res) {
      yield* put(updateUserDataSuccess(res));
    }
  } catch (error) {
    yield* put(updateUserDataFailed(error as Error));
  }
}

export function* removeAddress({
  payload: { removeAddressId, userId },
}: RemoveAddress) {
  try {
    const userData = {
      removeAddressId,
      uid: userId,
    };
    const res = yield* call(updateUserDocument, userData);
    if (res) {
      yield* put(updateUserDataSuccess(res));
    }
  } catch (error) {
    yield* put(updateUserDataFailed(error as Error));
  }
}

export function* signOut() {
  try {
    yield* call(signOutUser);
    yield* put(signOutSuccess());
  } catch (error) {
    yield* put(signOutFailed(error as Error));
  }
}

export function* signInAfterSignUp({
  payload: { user, additionalDetails },
}: SignUpSuccess) {
  yield* call(getSnapshotFromUserAuth, user, additionalDetails);
}

export function* onGoogleSignInStart() {
  yield* takeLatest(USER_ACTION_TYPES.GOOGLE_SIGN_IN_START, signInWithGoogle);
}

export function* onEmailSignInStart() {
  yield* takeLatest(USER_ACTION_TYPES.EMAIL_SIGN_IN_START, signInWithEmail);
}

export function* onCheckUserSession() {
  yield* takeLatest(USER_ACTION_TYPES.CHECK_USER_SESSION, isUserAuthenticated);
}

export function* onSignUpStart() {
  yield* takeLatest(USER_ACTION_TYPES.SIGN_UP_START, signUp);
}

export function* onUpdateUserData() {
  yield* takeLatest(USER_ACTION_TYPES.UPDATE_USER_DATA_START, updateUserData);
}

export function* onUpdateUserDefualtAddress() {
  yield* takeLatest(
    USER_ACTION_TYPES.UPDATE_USER_DEFUALT_ADDRESS_START,
    updateDefualtAddress
  );
}

export function* onUpdateUserAddress() {
  yield* takeLatest(
    USER_ACTION_TYPES.UPDATE_USER_ADDRESS_START,
    updateUserAddress
  );
}

export function* onRemoveUserAddress() {
  yield* takeLatest(USER_ACTION_TYPES.REMOVE_USER_ADDRESS_START, removeAddress);
}

export function* onSignUpSuccess() {
  yield* takeLatest(USER_ACTION_TYPES.SIGN_UP_SUCCESS, signInAfterSignUp);
}

export function* onSignOutStart() {
  yield* takeLatest(USER_ACTION_TYPES.SIGN_OUT_START, signOut);
}

export function* userSagas() {
  yield* all([
    call(onCheckUserSession),
    call(onGoogleSignInStart),
    call(onEmailSignInStart),
    call(onSignUpStart),
    call(onSignUpSuccess),
    call(onSignOutStart),
    call(onUpdateUserData),
    call(onUpdateUserAddress),
    call(onUpdateUserDefualtAddress),
    call(onRemoveUserAddress),
  ]);
}
