import { CATEGORIES_ACTION_TYPES, Category, PreviewCategory } from './category.types';

import {
  createAction, Action, ActionWithPayload, withMatcher, 
} from '../../utils/reducer/reducer.utils';
import { ItemPreview, NewItemValues } from '../../components/add-firebase/add-item.component';
import { SortOption } from '../../routes/category/category.component';

export type FeatchPreviewCategories = ActionWithPayload<CATEGORIES_ACTION_TYPES.FETCH_PREVIEW_CATEGORIES_START, string>;

export type FeatchUpdateCategoriesSucceeded = ActionWithPayload<CATEGORIES_ACTION_TYPES.FETCH_UPDATE_CATEGORIES_SUCCEEDED, Map<string, PreviewCategory[]>>;

export type FeatchUpdateCategory = ActionWithPayload<CATEGORIES_ACTION_TYPES.FETCH_UPDATE_CATEGORY, { collectionKey: string, docKey: string, newItems: ItemPreview[], sortOption?: SortOption }>;

export type FeatchUpdateCategorySucceeded = ActionWithPayload<CATEGORIES_ACTION_TYPES.FETCH_UPDATE_CATEGORY_SUCCEEDED, { collectionKey: string, docKey: string, newItems: ItemPreview[], sortOption?: SortOption }>;

export type FeatchSubCategory = ActionWithPayload<CATEGORIES_ACTION_TYPES.FETCH_SUB_CATEGORY, { collectionKey: string, docKey: string, sortOption?: SortOption }>;

export type FeatchSubCategorySucceeded = ActionWithPayload<CATEGORIES_ACTION_TYPES.FETCH_SUB_CATEGORY_SUCCEEDED, { category: Map<string, PreviewCategory[]>, sortOption?: SortOption }>;

export type FeatchCategoriesFailed = ActionWithPayload<CATEGORIES_ACTION_TYPES.FETCH_CATEGORIES_FAILED, Error>;

export type FeatchNewSort = ActionWithPayload<CATEGORIES_ACTION_TYPES.FETCH_NEW_SORT, SortOption>;

export const featchPreviewCategories = withMatcher(
  (collectionKey: string): FeatchPreviewCategories => createAction(CATEGORIES_ACTION_TYPES.FETCH_PREVIEW_CATEGORIES_START, collectionKey),
);

export const featchUpdateCategoriesSucceeded = withMatcher(
  (categoriesArray: Map<string, PreviewCategory[]>): FeatchUpdateCategoriesSucceeded => createAction(CATEGORIES_ACTION_TYPES.FETCH_UPDATE_CATEGORIES_SUCCEEDED, categoriesArray),
);

export const featchUpdateCategory = withMatcher(
  (collectionKey: string, docKey: string, newItems: ItemPreview[], sortOption?: SortOption): FeatchUpdateCategory => createAction(CATEGORIES_ACTION_TYPES.FETCH_UPDATE_CATEGORY, {
    collectionKey, docKey, newItems, sortOption, 
  }),
);

export const featchUpdateCategorySucceeded = withMatcher(
  (collectionKey: string, docKey: string, newItems: ItemPreview[], sortOption?: SortOption): FeatchUpdateCategorySucceeded => createAction(CATEGORIES_ACTION_TYPES.FETCH_UPDATE_CATEGORY_SUCCEEDED, {
    collectionKey, docKey, newItems, sortOption, 
  }),
);

export const featchSubCategory = withMatcher(
  (collectionKey: string, docKey: string, sortOption?: SortOption): FeatchSubCategory => createAction(CATEGORIES_ACTION_TYPES.FETCH_SUB_CATEGORY, { collectionKey, docKey, sortOption }),
);

export const featchSubCategorySucceeded = withMatcher(
  (category: Map<string, PreviewCategory[]>, sortOption?: SortOption): FeatchSubCategorySucceeded => createAction(CATEGORIES_ACTION_TYPES.FETCH_SUB_CATEGORY_SUCCEEDED, { category, sortOption }),
);

export const featchCategoriesFailed = withMatcher(
  (error: Error): FeatchCategoriesFailed => createAction(CATEGORIES_ACTION_TYPES.FETCH_CATEGORIES_FAILED, error),
);

export const featchNewSort = withMatcher(
  (sortOption: SortOption): FeatchNewSort => createAction(CATEGORIES_ACTION_TYPES.FETCH_NEW_SORT, sortOption),
);
