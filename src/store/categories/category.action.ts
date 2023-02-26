import { CATEGORIES_ACTION_TYPES, Category } from './category.types';

import {
  createAction, Action, ActionWithPayload, withMatcher, 
} from '../../utils/reducer/reducer.utils';

export type FeatchCategoriesStart = Action<CATEGORIES_ACTION_TYPES.FETCH_CATEGORIES_START>;

export type FeatchCategoriesSuccess = ActionWithPayload<CATEGORIES_ACTION_TYPES.FETCH_CATEGORIES_SUCCESS, Category[]>;

export type FeatchCategoriesFailed = ActionWithPayload<CATEGORIES_ACTION_TYPES.FETCH_CATEGORIES_FAILED, Error>;

export const featchCategoriesStart = withMatcher(
  (): FeatchCategoriesStart => createAction(CATEGORIES_ACTION_TYPES.FETCH_CATEGORIES_START),
);

export const featchCategoriesSuccess = withMatcher(
  (categoriesArray: Category[]): FeatchCategoriesSuccess => createAction(CATEGORIES_ACTION_TYPES.FETCH_CATEGORIES_SUCCESS, categoriesArray),
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
