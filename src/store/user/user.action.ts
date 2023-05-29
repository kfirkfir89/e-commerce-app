import { User } from 'firebase/auth';
import { USER_ACTION_TYPES } from './user.types';
import {
  createAction,
  withMatcher,
  Action,
  ActionWithPayload,
} from '../../utils/reducer/reducer.utils';
import {
  UserData,
  AddittionalInformation,
  UserAddress,
} from '../../utils/firebase/firebase.utils';
import { FormFields } from '../../components/sign-up-form/sign-up-form.component';
import { UserDetailsFormFields } from '../../routes/user-profile/user-details.component';

export type CheckUserSession = Action<USER_ACTION_TYPES.CHECK_USER_SESSION>;

export type SetCurrentUser = ActionWithPayload<
  USER_ACTION_TYPES.SET_CURRENT_USER,
  UserData
>;

export type GoogleSignInStart = Action<USER_ACTION_TYPES.GOOGLE_SIGN_IN_START>;
export type EmailSignInStart = ActionWithPayload<
  USER_ACTION_TYPES.EMAIL_SIGN_IN_START,
  { email: string; password: string }
>;

export type SignInSuccess = ActionWithPayload<
  USER_ACTION_TYPES.SIGN_IN_SUCCESS,
  UserData
>;
export type SignInFailed = ActionWithPayload<
  USER_ACTION_TYPES.SIGN_IN_FAILED,
  Error
>;

export type SignUpStart = ActionWithPayload<
  USER_ACTION_TYPES.SIGN_UP_START,
  FormFields
>;

export type SignUpSuccess = ActionWithPayload<
  USER_ACTION_TYPES.SIGN_UP_SUCCESS,
  { user: User; additionalDetails: AddittionalInformation }
>;

export type UpdateUserDataStart = ActionWithPayload<
  USER_ACTION_TYPES.UPDATE_USER_DATA_START,
  { formDetails: UserDetailsFormFields; uid: string }
>;

export type UpdateUserDefualtAddress = ActionWithPayload<
  USER_ACTION_TYPES.UPDATE_USER_DEFUALT_ADDRESS_START,
  { addressId: string; userId: string }
>;

export type RemoveAddress = ActionWithPayload<
  USER_ACTION_TYPES.REMOVE_USER_ADDRESS_START,
  { removeAddressId: string; userId: string }
>;

export type UpdateUserAddressStart = ActionWithPayload<
  USER_ACTION_TYPES.UPDATE_USER_ADDRESS_START,
  { formDetails: UserAddress; uid: string }
>;

export type UpdateUserDataSuccess = ActionWithPayload<
  USER_ACTION_TYPES.UPDATE_USER_DATA_SUCCESS,
  UserData
>;

export type UpdateUserDataFailed = ActionWithPayload<
  USER_ACTION_TYPES.UPDATE_USER_DATA_FAILED,
  Error
>;

export type SignUpFailed = ActionWithPayload<
  USER_ACTION_TYPES.SIGN_IN_FAILED,
  Error
>;

export type SignOutStart = Action<USER_ACTION_TYPES.SIGN_OUT_START>;
export type SignOutSuccess = Action<USER_ACTION_TYPES.SIGN_OUT_SUCCESS>;
export type SignOutFailed = ActionWithPayload<
  USER_ACTION_TYPES.SIGN_OUT_FAILED,
  Error
>;

export const checkUserSession = withMatcher(
  (): CheckUserSession => createAction(USER_ACTION_TYPES.CHECK_USER_SESSION)
);

export const setCurrentUser = withMatcher(
  (user: UserData): SetCurrentUser =>
    createAction(USER_ACTION_TYPES.SET_CURRENT_USER, user)
);

export const googleSignInStart = withMatcher(
  (): GoogleSignInStart => createAction(USER_ACTION_TYPES.GOOGLE_SIGN_IN_START)
);

export const emailSignInStart = withMatcher(
  (email: string, password: string): EmailSignInStart =>
    createAction(USER_ACTION_TYPES.EMAIL_SIGN_IN_START, { email, password })
);

export const signInSuccess = withMatcher(
  (user: UserData): SignInSuccess =>
    createAction(USER_ACTION_TYPES.SIGN_IN_SUCCESS, user)
);

export const signInFailed = withMatcher(
  (error: Error): SignInFailed =>
    createAction(USER_ACTION_TYPES.SIGN_IN_FAILED, error)
);

export const signUpStart = withMatcher(
  (form: FormFields): SignUpStart =>
    createAction(USER_ACTION_TYPES.SIGN_UP_START, form)
);

export const signUpSuccess = withMatcher(
  (user: User, additionalDetails: AddittionalInformation): SignUpSuccess =>
    createAction(USER_ACTION_TYPES.SIGN_UP_SUCCESS, { user, additionalDetails })
);

export const updateUserDataStart = withMatcher(
  (formDetails: UserDetailsFormFields, uid: string): UpdateUserDataStart =>
    createAction(USER_ACTION_TYPES.UPDATE_USER_DATA_START, {
      formDetails,
      uid,
    })
);

export const updateUserDefualtAddress = withMatcher(
  (addressId: string, userId: string): UpdateUserDefualtAddress =>
    createAction(USER_ACTION_TYPES.UPDATE_USER_DEFUALT_ADDRESS_START, {
      addressId,
      userId,
    })
);

export const removeUserAddress = withMatcher(
  (removeAddressId: string, userId: string): RemoveAddress =>
    createAction(USER_ACTION_TYPES.REMOVE_USER_ADDRESS_START, {
      removeAddressId,
      userId,
    })
);

export const updateUserAddressStart = withMatcher(
  (formDetails: UserAddress, uid: string): UpdateUserAddressStart =>
    createAction(USER_ACTION_TYPES.UPDATE_USER_ADDRESS_START, {
      formDetails,
      uid,
    })
);

export const updateUserDataSuccess = withMatcher(
  (user: UserData): UpdateUserDataSuccess =>
    createAction(USER_ACTION_TYPES.UPDATE_USER_DATA_SUCCESS, user)
);

export const updateUserDataFailed = withMatcher(
  (error: Error): UpdateUserDataFailed =>
    createAction(USER_ACTION_TYPES.UPDATE_USER_DATA_FAILED, error)
);

export const signUpFailed = withMatcher(
  (error: Error): SignUpFailed =>
    createAction(USER_ACTION_TYPES.SIGN_IN_FAILED, error)
);

export const signOutStart = withMatcher(
  (): SignOutStart => createAction(USER_ACTION_TYPES.SIGN_OUT_START)
);

export const signOutSuccess = withMatcher(
  (): SignOutSuccess => createAction(USER_ACTION_TYPES.SIGN_OUT_SUCCESS)
);

export const signOutFailed = withMatcher(
  (error: Error): SignOutFailed =>
    createAction(USER_ACTION_TYPES.SIGN_OUT_FAILED, error)
);
