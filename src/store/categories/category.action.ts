import { CATEGORIES_ACTION_TYPES, PreviewCategory } from './category.types';

import {
  createAction, ActionWithPayload, withMatcher, Action, 
} from '../../utils/reducer/reducer.utils';
import { ItemPreview } from '../../components/add-firebase/add-item.component';
import { SortOption } from '../../routes/category/category.component';

export type FeatchPreviewCategories = ActionWithPayload<CATEGORIES_ACTION_TYPES.FETCH_PREVIEW_CATEGORIES_START, string>;

export type FeatchUpdateCategoriesSucceeded = ActionWithPayload<CATEGORIES_ACTION_TYPES.FETCH_UPDATE_CATEGORIES_SUCCEEDED, Map<string, PreviewCategory[]>>;

export type FeatchUpdateCategory = ActionWithPayload<CATEGORIES_ACTION_TYPES.FETCH_UPDATE_CATEGORY, { collectionKey: string, docKey: string, newItems: ItemPreview[], sortOption?: SortOption }>;

export type FeatchUpdateCategorySucceeded = ActionWithPayload<CATEGORIES_ACTION_TYPES.FETCH_UPDATE_CATEGORY_SUCCEEDED, { collectionKey: string, docKey: string, newItems: ItemPreview[], sortOption?: SortOption }>;

export type FeatchCategoriesExsist = Action<CATEGORIES_ACTION_TYPES.FETCH_CATEGORIES_EXSIST>;

export type FeatchCategoriesFailed = ActionWithPayload<CATEGORIES_ACTION_TYPES.FETCH_CATEGORIES_FAILED, Error>;


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

export const featchCategoriesExsist = withMatcher(
  (): FeatchCategoriesExsist => createAction(CATEGORIES_ACTION_TYPES.FETCH_CATEGORIES_EXSIST),
);

export const featchCategoriesFailed = withMatcher(
  (error: Error): FeatchCategoriesFailed => createAction(CATEGORIES_ACTION_TYPES.FETCH_CATEGORIES_FAILED, error),
);
