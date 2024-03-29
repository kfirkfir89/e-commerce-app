import { Action, AnyAction } from 'redux';
import { createSelector } from 'reselect';
import { NewItemValues } from '../../components/add-firebase/add-item.component';
import {
  ActionWithPayload,
  createAction,
  withMatcher,
} from '../../utils/reducer/reducer.utils';
import { RootState } from '../store';
import { SelectOption } from '../../components/select/select.component';

// SELECTORS
export const selectAddFirebaseReducer = (state: RootState): AddFireBaseState =>
  state.addFirebase;

export const selectAddFirebaseItems = createSelector(
  [selectAddFirebaseReducer],
  (addFirebase) => addFirebase.items
);

// TYPES
export enum ADDFIREBASE_ACTION_TYPES {
  FETCH_SET_COLLECTION_KEY = 'addFirebase/FETCH_SET_COLLECTION_KEY',
  FETCH_SET_TITLE_DOC_KEY = 'addFirebase/FETCH_SET_TITLE_DOC_KEY',
  FETCH_SET_SORT_OPTION = 'addFirebase/FETCH_SET_SORT_OPTION',
  FETCH_SET_ITEM = 'addFirebase/FETCH_SET_ITEM',
  FETCH_DEL_ITEM = 'addFirebase/FETCH_DEL_ITEM',
  FETCH_ADD_FIREBASE_DATA = 'addFirebase/FETCH_ADD_FIREBASE_DATA',
  FETCH_ADD_FIREBASE_DATA_SUCCESSDED = 'addFirebase/FETCH_ADD_FIREBASE_DATA_SUCCESSDED',
  FETCH_ADD_FIREBASE_DATA_FAILED = 'addFirebase/FETCH_ADD_FIREBASE_DATA_FAILED',
}

export type AddFireBaseState = {
  readonly collectionKey: string;
  readonly docKey: string;
  readonly items: NewItemValues[];
  readonly sizeSortOption: SelectOption;
  readonly isLoading: boolean;
  readonly error: Error | null;
};

// ACTIONS
export type FeatchSetCollectionKey = ActionWithPayload<
  ADDFIREBASE_ACTION_TYPES.FETCH_SET_COLLECTION_KEY,
  string
>;

export type FeatchSetTitleDocKey = ActionWithPayload<
  ADDFIREBASE_ACTION_TYPES.FETCH_SET_TITLE_DOC_KEY,
  string
>;

export type FeatchSetSortOption = ActionWithPayload<
  ADDFIREBASE_ACTION_TYPES.FETCH_SET_SORT_OPTION,
  SelectOption
>;

export type FeatchAddItem = ActionWithPayload<
  ADDFIREBASE_ACTION_TYPES.FETCH_SET_ITEM,
  NewItemValues
>;

export type FeatchRemoveItem = ActionWithPayload<
  ADDFIREBASE_ACTION_TYPES.FETCH_DEL_ITEM,
  NewItemValues
>;

export type FeatchAddFirebaseData =
  Action<ADDFIREBASE_ACTION_TYPES.FETCH_ADD_FIREBASE_DATA>;

export type FeatchAddFirebaseDataSuccessded =
  Action<ADDFIREBASE_ACTION_TYPES.FETCH_ADD_FIREBASE_DATA_SUCCESSDED>;

export type FeatchAddFirebaseDataFailed = ActionWithPayload<
  ADDFIREBASE_ACTION_TYPES.FETCH_ADD_FIREBASE_DATA_FAILED,
  Error
>;

export const featchSetCollectionKey = withMatcher(
  (collectionKey: string): FeatchSetCollectionKey =>
    createAction(
      ADDFIREBASE_ACTION_TYPES.FETCH_SET_COLLECTION_KEY,
      collectionKey
    )
);

export const featchSetTitleDocKey = withMatcher(
  (titleDoc: string): FeatchSetTitleDocKey =>
    createAction(ADDFIREBASE_ACTION_TYPES.FETCH_SET_TITLE_DOC_KEY, titleDoc)
);

export const featchSetSortOption = withMatcher(
  (sortOption: SelectOption): FeatchSetSortOption =>
    createAction(ADDFIREBASE_ACTION_TYPES.FETCH_SET_SORT_OPTION, sortOption)
);

export const featchAddItem = withMatcher(
  (item: NewItemValues): FeatchAddItem =>
    createAction(ADDFIREBASE_ACTION_TYPES.FETCH_SET_ITEM, item)
);

export const featchRemoveItem = withMatcher(
  (item: NewItemValues): FeatchRemoveItem =>
    createAction(ADDFIREBASE_ACTION_TYPES.FETCH_DEL_ITEM, item)
);

export const featchAddFirebaseData = withMatcher(
  (): FeatchAddFirebaseData =>
    createAction(ADDFIREBASE_ACTION_TYPES.FETCH_ADD_FIREBASE_DATA)
);

export const featchAddFirebaseDataSuccessded = withMatcher(
  (): FeatchAddFirebaseDataSuccessded =>
    createAction(ADDFIREBASE_ACTION_TYPES.FETCH_ADD_FIREBASE_DATA_SUCCESSDED)
);

export const featchAddFirebaseDataFailed = withMatcher(
  (error: Error): FeatchAddFirebaseDataFailed =>
    createAction(ADDFIREBASE_ACTION_TYPES.FETCH_ADD_FIREBASE_DATA_FAILED, error)
);

// REDUCER
export const ADDFIREBASE_INITIAL_STATE: AddFireBaseState = {
  collectionKey: '',
  docKey: '',
  items: [],
  sizeSortOption: { label: '', value: '' },
  isLoading: false,
  error: null,
};

export const addFirebaseReducer = (
  state = ADDFIREBASE_INITIAL_STATE,
  action: AnyAction
): AddFireBaseState => {
  if (featchSetCollectionKey.match(action)) {
    return { ...state, collectionKey: action.payload };
  }

  if (featchSetTitleDocKey.match(action)) {
    return { ...state, docKey: action.payload };
  }

  if (featchSetSortOption.match(action)) {
    return { ...state, sizeSortOption: action.payload };
  }

  if (featchAddItem.match(action)) {
    return { ...state, items: [...state.items, action.payload] };
  }

  if (featchRemoveItem.match(action)) {
    return {
      ...state,
      items: state.items.filter((item) => item.id !== action.payload.id),
    };
  }

  if (featchAddFirebaseData.match(action)) {
    return { ...state, isLoading: true };
  }

  if (featchAddFirebaseDataSuccessded.match(action)) {
    return {
      collectionKey: '',
      docKey: '',
      items: [],
      sizeSortOption: { label: '', value: '' },
      error: null,
      isLoading: false,
    };
  }

  if (featchAddFirebaseDataFailed.match(action)) {
    return { ...state, isLoading: false, error: action.payload };
  }

  return state;
};
