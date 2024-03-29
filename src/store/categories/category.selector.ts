import { createSelector } from 'reselect';

import { RootState } from '../store';

import { CategoriesState } from './category.reducer';

// memoization/cache
// any change in redux store will rerun all the useSelectors in the app
// initial selector to get the data/slice that we need
const selectCategoryReducer = (state: RootState): CategoriesState =>
  state.categories;

export const selectCategories = createSelector(
  // input
  [selectCategoryReducer],
  // output the output will run only if the input value change
  (categoriesSlice) => categoriesSlice.categories
);

export const selectCategoriesPreview = createSelector(
  // input
  [selectCategoryReducer],
  // output the output will run only if the input value change
  (categoriesSlice) => categoriesSlice.categoriesPreview
);

export const selectCategoriesSearchPreview = createSelector(
  // input
  [selectCategoryReducer],
  // output the output will run only if the input value change
  (categoriesSlice) => categoriesSlice.searchPreview
);

export const selectSizeSortOption = createSelector(
  // input
  [selectCategoryReducer],
  // output the output will run only if the input value change
  (categoriesSlice) => categoriesSlice.sizeSortOption
);

export const selectCategoriesIsLoading = createSelector(
  [selectCategoryReducer],
  (categoriesSlice) => categoriesSlice.isLoading
);
