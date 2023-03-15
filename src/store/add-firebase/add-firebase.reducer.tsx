import { Action, AnyAction } from 'redux';
import {
  all, call, takeLatest, put, 
} from 'typed-redux-saga';
import { ActionWithPayload, createAction, withMatcher } from '../../utils/reducer/reducer.utils';

// SELECTORS

// TYPES
export enum ADDFIREBASE_ACTION_TYPES {
  FETCH_ADDFIREBASE_START = 'addFirebase/FETCH_ADDFIREBASE_START',
  FETCH_ADDFIREBASE_SUCCESS = 'addFirebase/FETCH_ADDFIREBASE_SUCCESS',
  FETCH_ADDFIREBASE_FAILED = 'addFirebase/FETCH_ADDFIREBASE_FAILED',
}

export type NewCollectionDocItemsForm = {
  collectionKey: string;
  title: string;
  items: NewItem[];
};

export type StockItem = {
  size: string | number;
  color?: string;
  supply: number;
};

export type NewItem = {
  id: string;
  imageUrl: string[];
  productName: string;
  price: 0;
  sizes: string[] | number[];
  colors?: string[];
  stock: StockItem[];
};


export type AddFireBaseState = {
  readonly newItems: NewCollectionDocItemsForm;
  readonly isLoading: boolean;
  readonly error: Error | null;
};

// ACTIONS
export type FeatchAddFirebaseStart = Action<ADDFIREBASE_ACTION_TYPES.FETCH_ADDFIREBASE_START>;

export type FeatchAddFirebaseSuccess = ActionWithPayload<ADDFIREBASE_ACTION_TYPES.FETCH_ADDFIREBASE_SUCCESS, NewCollectionDocItemsForm>;

export type FeatchAddFirebaseFailed = ActionWithPayload<ADDFIREBASE_ACTION_TYPES.FETCH_ADDFIREBASE_FAILED, Error>;

export const featchAddFirebaseStart = withMatcher(
  (collectionKey?: string): FeatchAddFirebaseStart => createAction(ADDFIREBASE_ACTION_TYPES.FETCH_ADDFIREBASE_START, { collectionKey }),
);

export const featchAddFirebaseSuccess = withMatcher(
  (newItems: NewCollectionDocItemsForm): FeatchAddFirebaseSuccess => createAction(ADDFIREBASE_ACTION_TYPES.FETCH_ADDFIREBASE_SUCCESS, newItems),
);

export const featchAddFirebaseFailed = withMatcher(
  (error: Error): FeatchAddFirebaseFailed => createAction(ADDFIREBASE_ACTION_TYPES.FETCH_ADDFIREBASE_FAILED, error),
);


// REDUCER
export const ADDFIREBASE_INITIAL_STATE : AddFireBaseState = {
  newItems: {
    collectionKey: '',
    title: '',
    items: [],
  },
  isLoading: false,
  error: null,
};

export const addFirebaseReducer = (
  state = ADDFIREBASE_INITIAL_STATE,
  action: AnyAction,
): AddFireBaseState => {
  if (featchAddFirebaseStart.match(action)) {
    return { ...state, isLoading: true };
  }
    
  if (featchAddFirebaseSuccess.match(action)) {
    return { ...state, newItems: action.payload, isLoading: false };
  }

  if (featchAddFirebaseFailed.match(action)) {
    return { ...state, error: action.payload, isLoading: false };
  }

  return state;
};

// // SAGA
// export function* addNewItem({ payload: { collectionKey } } :FeatchCategoriesStart) {
//   try {
//     const categoriesArray = yield* call(getCategoriesAndDocuments, collectionKey);
//     // console.log({categoriesArray});
//     yield* put(featchCategoriesSuccess(categoriesArray));
//   } catch (error) {
//     yield* put(featchCategoriesFailed(error as Error));
//   }
// }

// export function* onFetchCategories() {
//   yield* takeLatest(ADDFIREBASE_ACTION_TYPES.FETCH_ADDFIREBASE_START, featchCategoriesAsync);
// }

// export function* categoriesSaga() {
//   yield* all([call(onFetchCategories)]);
// }
