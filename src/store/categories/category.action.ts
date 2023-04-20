import { CATEGORIES_ACTION_TYPES, Category } from './category.types';

import {
  createAction, Action, ActionWithPayload, withMatcher, 
} from '../../utils/reducer/reducer.utils';
import { NewItemValues } from '../../components/add-firebase/add-item.component';

export type FeatchPreviewCategories = Action<CATEGORIES_ACTION_TYPES.FETCH_PREVIEW_CATEGORIES_START>;

export type FeatchUpdateCategoriesSucceeded = ActionWithPayload<CATEGORIES_ACTION_TYPES.FETCH_UPDATE_CATEGORIES_SUCCEEDED, Map<string, Category[]>>;

export type FeatchUpdateCategory = ActionWithPayload<CATEGORIES_ACTION_TYPES.FETCH_UPDATE_CATEGORY, { collectionKey: string, docKey: string, newItems: NewItemValues[] }>;

export type FeatchUpdateCategorySucceeded = ActionWithPayload<CATEGORIES_ACTION_TYPES.FETCH_UPDATE_CATEGORY_SUCCEEDED, { collectionKey: string, docKey: string, newItems: NewItemValues[] }>;

export type FeatchSubCategory = ActionWithPayload<CATEGORIES_ACTION_TYPES.FETCH_SUB_CATEGORY, { collectionKey: string, docKey: string }>;

export type FeatchSubCategorySucceeded = ActionWithPayload<CATEGORIES_ACTION_TYPES.FETCH_SUB_CATEGORY_SUCCEEDED, Map<string, Category[]>>;

export type FeatchCategoriesFailed = ActionWithPayload<CATEGORIES_ACTION_TYPES.FETCH_CATEGORIES_FAILED, Error>;

export const featchPreviewCategories = withMatcher(
  (): FeatchPreviewCategories => createAction(CATEGORIES_ACTION_TYPES.FETCH_PREVIEW_CATEGORIES_START),
);

export const featchUpdateCategoriesSucceeded = withMatcher(
  (categoriesArray: Map<string, Category[]>): FeatchUpdateCategoriesSucceeded => createAction(CATEGORIES_ACTION_TYPES.FETCH_UPDATE_CATEGORIES_SUCCEEDED, categoriesArray),
);

export const featchUpdateCategory = withMatcher(
  (collectionKey: string, docKey: string, newItems: NewItemValues[]): FeatchUpdateCategory => createAction(CATEGORIES_ACTION_TYPES.FETCH_UPDATE_CATEGORY, { collectionKey, docKey, newItems }),
);

export const featchUpdateCategorySucceeded = withMatcher(
  (collectionKey: string, docKey: string, newItems: NewItemValues[]): FeatchUpdateCategorySucceeded => createAction(CATEGORIES_ACTION_TYPES.FETCH_UPDATE_CATEGORY_SUCCEEDED, { collectionKey, docKey, newItems }),
);

export const featchSubCategory = withMatcher(
  (collectionKey: string, docKey: string): FeatchSubCategory => createAction(CATEGORIES_ACTION_TYPES.FETCH_SUB_CATEGORY, { collectionKey, docKey }),
);

export const featchSubCategorySucceeded = withMatcher(
  (category: Map<string, Category[]>): FeatchSubCategorySucceeded => createAction(CATEGORIES_ACTION_TYPES.FETCH_SUB_CATEGORY_SUCCEEDED, category),
);

export const featchCategoriesFailed = withMatcher(
  (error: Error): FeatchCategoriesFailed => createAction(CATEGORIES_ACTION_TYPES.FETCH_CATEGORIES_FAILED, error),
);
