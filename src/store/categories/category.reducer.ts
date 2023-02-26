import { AnyAction } from 'redux';

import { Category } from './category.types';

import { featchCategoriesStart, featchCategoriesSuccess, featchCategoriesFailed } from './category.action';

// read only is an additional property you can add so that you force it, 
// that this state object can never be modified.It can only be read.
// with reducers you never modify the state. You always spread over and create a new state.
export type CategoriesState = {
  readonly categories: Category[];
  readonly isLoading: boolean;
  readonly error: Error | null;
};

export const CATEGORIES_INITIAL_STATE : CategoriesState = {
  categories: [],
  isLoading: false,
  error: null,
};

export const categoriesReducer = (
  state = CATEGORIES_INITIAL_STATE,
  action: AnyAction,
): CategoriesState => {
  if (featchCategoriesStart.match(action)) {
    return { ...state, isLoading: true };
  }
    
  if (featchCategoriesSuccess.match(action)) {
    return { ...state, categories: action.payload, isLoading: false };
  }

  if (featchCategoriesFailed.match(action)) {
    return { ...state, error: action.payload, isLoading: false };
  }

  return state;
};

