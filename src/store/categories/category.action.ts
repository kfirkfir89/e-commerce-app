import { CATEGORIES_ACTION_TYPES, Category } from './category.types';

import {
  createAction, Action, ActionWithPayload, withMatcher, 
} from '../../utils/reducer/reducer.utils';
import { CategoryDataState } from '../../utils/firebase/firebase.utils';

export type FeatchCategoriesInitialState = ActionWithPayload<CATEGORIES_ACTION_TYPES.FETCH_CATEGORIES_INITIAL_STATE, string[]>;

export type FeatchUpdateCategories = ActionWithPayload<CATEGORIES_ACTION_TYPES.FETCH_UPDATE_CATEGORIES, Map<string, Category[]>>;

export type FeatchPreviewCategories = Action<CATEGORIES_ACTION_TYPES.FETCH_PREVIEW_CATEGORIES_START>;

export type FeatchSubCategory = ActionWithPayload<CATEGORIES_ACTION_TYPES.FETCH_SUB_CATEGORY, { collectionKey: string, docKey: string }>;

export type FeatchSubCategorySucceeded = ActionWithPayload<CATEGORIES_ACTION_TYPES.FETCH_SUB_CATEGORY_SUCCEEDED, Map<string, Category[]>>;

export type FeatchSubCategoryData = ActionWithPayload<CATEGORIES_ACTION_TYPES.FETCH_SUB_CATEGORY_DATA, { collectionKey: string, docKey: string, skipItemsCounter: number }>;

export type FeatchSubCategoryDataSucceeded = ActionWithPayload<CATEGORIES_ACTION_TYPES.FETCH_SUB_CATEGORY_DATA_SUCCEEDED, CategoryDataState>;

export type FeatchAllCategoriesStart = ActionWithPayload<CATEGORIES_ACTION_TYPES.FETCH_ALL_CATEGORIES_START, string[]>;

export type FeatchCategoriesStart = ActionWithPayload<CATEGORIES_ACTION_TYPES.FETCH_CATEGORIES_START, { collectionKey?: string }>;

export type FeatchCategoriesSuccess = ActionWithPayload<CATEGORIES_ACTION_TYPES.FETCH_CATEGORIES_SUCCESS, Map<string, Category[]>>;

export type FeatchAllCategoriesSuccess = ActionWithPayload<CATEGORIES_ACTION_TYPES.FETCH_ALL_CATEGORIES_SUCCESS, Map<string, Category[]>>;

export type FeatchCategoriesFailed = ActionWithPayload<CATEGORIES_ACTION_TYPES.FETCH_CATEGORIES_FAILED, Error>;

export const featchCategoriesInitialState = withMatcher(
  (userCollectionKeys: string[]): FeatchCategoriesInitialState => createAction(CATEGORIES_ACTION_TYPES.FETCH_CATEGORIES_INITIAL_STATE, userCollectionKeys),
);

export const featchUpdateCategories = withMatcher(
  (categoriesArray: Map<string, Category[]>): FeatchUpdateCategories => createAction(CATEGORIES_ACTION_TYPES.FETCH_UPDATE_CATEGORIES, categoriesArray),
);

export const featchAllCategoriesStart = withMatcher(
  (userCollectionKeys: string[]): FeatchAllCategoriesStart => createAction(CATEGORIES_ACTION_TYPES.FETCH_ALL_CATEGORIES_START, userCollectionKeys),
);

export const featchPreviewCategories = withMatcher(
  (): FeatchPreviewCategories => createAction(CATEGORIES_ACTION_TYPES.FETCH_PREVIEW_CATEGORIES_START),
);

export const featchSubCategory = withMatcher(
  (collectionKey: string, docKey: string): FeatchSubCategory => createAction(CATEGORIES_ACTION_TYPES.FETCH_SUB_CATEGORY, { collectionKey, docKey }),
);

export const featchSubCategorySucceeded = withMatcher(
  (category: Map<string, Category[]>): FeatchSubCategorySucceeded => createAction(CATEGORIES_ACTION_TYPES.FETCH_SUB_CATEGORY_SUCCEEDED, category),
);

export const featchSubCategoryData = withMatcher(
  (collectionKey: string, docKey: string, skipItemsCounter: number): FeatchSubCategoryData => createAction(CATEGORIES_ACTION_TYPES.FETCH_SUB_CATEGORY_DATA, { collectionKey, docKey, skipItemsCounter }),
);

export const featchSubCategoryDataSucceeded = withMatcher(
  (categoryData: CategoryDataState): FeatchSubCategoryDataSucceeded => createAction(CATEGORIES_ACTION_TYPES.FETCH_SUB_CATEGORY_DATA_SUCCEEDED, categoryData),
);

export const featchCategoriesStart = withMatcher(
  (collectionKey?: string): FeatchCategoriesStart => createAction(CATEGORIES_ACTION_TYPES.FETCH_CATEGORIES_START, { collectionKey }),
);

export const featchCategoriesSuccess = withMatcher(
  (categoriesArray: Map<string, Category[]>): FeatchCategoriesSuccess => createAction(CATEGORIES_ACTION_TYPES.FETCH_CATEGORIES_SUCCESS, categoriesArray),
);

export const featchAllCategoriesSuccess = withMatcher(
  (categoriesArray: Map<string, Category[]>): FeatchAllCategoriesSuccess => createAction(CATEGORIES_ACTION_TYPES.FETCH_ALL_CATEGORIES_SUCCESS, categoriesArray),
);

export const featchCategoriesFailed = withMatcher(
  (error: Error): FeatchCategoriesFailed => createAction(CATEGORIES_ACTION_TYPES.FETCH_CATEGORIES_FAILED, error),
);


// thunk option
/* export const featchCategoriesAsync = () => async (dispatch) => {
  dispatch(featchCategoriesStart());

  try {
    const categoriesArray = await getCategoriesAndDocuments();
    dispatch(featchCategoriesSuccess(categoriesArray));
  }
  catch (error) {
    dispatch(featchCategoriesFailed(error));
  }
}; */
