import { CATEGORIES_ACTION_TYPES, Category, PreviewCategory } from './category.types';

import {
  createAction, Action, ActionWithPayload, withMatcher, 
} from '../../utils/reducer/reducer.utils';
import { ItemPreview, NewItemValues } from '../../components/add-firebase/add-item.component';

export type FeatchPreviewCategories = ActionWithPayload<CATEGORIES_ACTION_TYPES.FETCH_PREVIEW_CATEGORIES_START, string>;

export type FeatchUpdateCategoriesSucceeded = ActionWithPayload<CATEGORIES_ACTION_TYPES.FETCH_UPDATE_CATEGORIES_SUCCEEDED, Map<string, PreviewCategory[]>>;

export type FeatchUpdateCategory = ActionWithPayload<CATEGORIES_ACTION_TYPES.FETCH_UPDATE_CATEGORY, { collectionKey: string, docKey: string, newItems: ItemPreview[] }>;

export type FeatchUpdateCategorySucceeded = ActionWithPayload<CATEGORIES_ACTION_TYPES.FETCH_UPDATE_CATEGORY_SUCCEEDED, { collectionKey: string, docKey: string, newItems: ItemPreview[] }>;

export type FeatchSubCategory = ActionWithPayload<CATEGORIES_ACTION_TYPES.FETCH_SUB_CATEGORY, { collectionKey: string, docKey: string }>;

export type FeatchSubCategorySucceeded = ActionWithPayload<CATEGORIES_ACTION_TYPES.FETCH_SUB_CATEGORY_SUCCEEDED, Map<string, PreviewCategory[]>>;

export type FeatchCategoriesFailed = ActionWithPayload<CATEGORIES_ACTION_TYPES.FETCH_CATEGORIES_FAILED, Error>;

export const featchPreviewCategories = withMatcher(
  (collectionKey: string): FeatchPreviewCategories => createAction(CATEGORIES_ACTION_TYPES.FETCH_PREVIEW_CATEGORIES_START, collectionKey),
);

export const featchUpdateCategoriesSucceeded = withMatcher(
  (categoriesArray: Map<string, PreviewCategory[]>): FeatchUpdateCategoriesSucceeded => createAction(CATEGORIES_ACTION_TYPES.FETCH_UPDATE_CATEGORIES_SUCCEEDED, categoriesArray),
);

export const featchUpdateCategory = withMatcher(
  (collectionKey: string, docKey: string, newItems: ItemPreview[]): FeatchUpdateCategory => createAction(CATEGORIES_ACTION_TYPES.FETCH_UPDATE_CATEGORY, { collectionKey, docKey, newItems }),
);

export const featchUpdateCategorySucceeded = withMatcher(
  (collectionKey: string, docKey: string, newItems: ItemPreview[]): FeatchUpdateCategorySucceeded => createAction(CATEGORIES_ACTION_TYPES.FETCH_UPDATE_CATEGORY_SUCCEEDED, { collectionKey, docKey, newItems }),
);

export const featchSubCategory = withMatcher(
  (collectionKey: string, docKey: string): FeatchSubCategory => createAction(CATEGORIES_ACTION_TYPES.FETCH_SUB_CATEGORY, { collectionKey, docKey }),
);

export const featchSubCategorySucceeded = withMatcher(
  (category: Map<string, PreviewCategory[]>): FeatchSubCategorySucceeded => createAction(CATEGORIES_ACTION_TYPES.FETCH_SUB_CATEGORY_SUCCEEDED, category),
);

export const featchCategoriesFailed = withMatcher(
  (error: Error): FeatchCategoriesFailed => createAction(CATEGORIES_ACTION_TYPES.FETCH_CATEGORIES_FAILED, error),
);
