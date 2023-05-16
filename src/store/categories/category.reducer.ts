import { AnyAction } from 'redux';

import { PreviewCategory } from './category.types';

import {
  featchCategoriesFailed, 
  featchPreviewCategories, 
  featchUpdateCategory, 
  featchUpdateCategorySucceeded,
  featchUpdateCategoriesSucceeded,
  featchCategoriesExsist,
  featchSearchPreview,
} from './category.action';
import { ItemPreview } from '../../components/add-firebase/add-item.component';

// read only is an additional property you can add so that you force it, 
// that this state object can never be modified.It can only be read.
// with reducers you never modify the state. You always spread over and create a new state.
export type CategoriesState = {
  readonly categories: Map<string, PreviewCategory[]>;
  readonly categoriesPreview: Map<string, PreviewCategory[]>,
  readonly searchPreview: ItemPreview[],
  readonly isLoading: boolean;
  readonly error: Error | null;
};

export const CATEGORIES_INITIAL_STATE : CategoriesState = {
  categories: new Map(),
  categoriesPreview: new Map(),
  searchPreview: [],
  isLoading: false,
  error: null,
};

export const categoriesReducer = (
  state = CATEGORIES_INITIAL_STATE,
  action: AnyAction,
): CategoriesState => {
  if (featchUpdateCategory.match(action)) {
    return { ...state, isLoading: true };
  }
  if (featchPreviewCategories.match(action)) {
    return { ...state, isLoading: true };
  }
  if (featchSearchPreview.match(action)) {
    return { ...state, searchPreview: action.payload };
  }
  if (featchUpdateCategorySucceeded.match(action)) {
    const { collectionKey, docKey, newItems } = action.payload;
    const categoriesMap = state.categories;

    // if map not exsist
    if (categoriesMap.size === 0) {
      categoriesMap.set(collectionKey, [{ title: docKey, items: newItems }]);
      return { ...state, isLoading: false, categories: categoriesMap };
    }
    // chcking for exsisting category if not exsist creating one
    if (categoriesMap.has(collectionKey)) {
      const currentCategories = categoriesMap.get(collectionKey);
      // check for the subCategory title if already exsist
      if (currentCategories !== undefined && currentCategories.some((category) => category.title === docKey)) {
        const currentCategory = currentCategories.find((category) => category.title === docKey)!;
        const updatedArray = currentCategory.items;
        updatedArray.push(...newItems.filter((newItem) => !updatedArray.some((prevItem) => prevItem.id === newItem.id)));
        currentCategory.items = updatedArray;
        return { ...state, isLoading: false, categories: categoriesMap };
      }

      // update the new category in case the payload category is not exsist in the current Map
      const updatedCategories = [...currentCategories!, { title: docKey, items: newItems }];
      categoriesMap.set(collectionKey, updatedCategories);
      return { ...state, isLoading: false, categories: categoriesMap };
    }

    // creating new Map in case is not exsist
    categoriesMap.set(collectionKey, [{ title: docKey, items: newItems }]);

    return { ...state, isLoading: false, categories: categoriesMap };
  }

  if (featchUpdateCategoriesSucceeded.match(action)) {
    const categoriesMap = state.categories;
    action.payload.forEach((value, key) => {
      categoriesMap.set(key, value);
    });

    return { ...state, isLoading: false, categoriesPreview: categoriesMap };
  }

  if (featchCategoriesExsist.match(action)) {
    return { ...state, isLoading: false };
  }

  if (featchCategoriesFailed.match(action)) {
    return { ...state, error: action.payload, isLoading: false };
  }

  return state;
};

