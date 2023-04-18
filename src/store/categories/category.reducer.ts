import { AnyAction } from 'redux';

import { Category } from './category.types';

import {
  featchCategoriesStart, featchCategoriesSuccess, featchCategoriesFailed, featchAllCategoriesStart, featchAllCategoriesSuccess, featchCategoriesInitialState, featchUpdateCategories, featchPreviewCategories, featchSubCategoryData, featchSubCategoryDataSucceeded,
} from './category.action';

// read only is an additional property you can add so that you force it, 
// that this state object can never be modified.It can only be read.
// with reducers you never modify the state. You always spread over and create a new state.
export type CategoriesState = {
  readonly categories: Map<string, Category[]>;
  readonly isLoading: boolean;
  readonly error: Error | null;
};

export const CATEGORIES_INITIAL_STATE : CategoriesState = {
  categories: new Map(),
  isLoading: false,
  error: null,
};

export const categoriesReducer = (
  state = CATEGORIES_INITIAL_STATE,
  action: AnyAction,
): CategoriesState => {
  if (featchCategoriesInitialState.match(action)) {
    // set initial state for catefories when app first load to follow the expanding categories
    const initState = new Map<string, Category[]>();
    action.payload.forEach((key) => { initState.set(key, []); });

    return { ...state, categories: initState };
  }

  if (featchUpdateCategories.match(action)) {
    const newCategories = action.payload;
    const mergedCategories = new Map([...state.categories, ...newCategories]);
    return { ...state, categories: mergedCategories };
  }

  if (featchSubCategoryData.match(action)) {
    return { ...state, isLoading: true };
  }

  if (featchSubCategoryDataSucceeded.match(action)) {
    const { collectionKey, subCategory } = action.payload;
    const categoryArray = state.categories.get(collectionKey) || [];
    let subCategoryUpdated = false;
    for (let i = 0; i < categoryArray.length; i++) {
      if (categoryArray[i].title === subCategory.title) {
        categoryArray[i] = subCategory; // replace the existing subCategory with the same title
        subCategoryUpdated = true;
        break;
      }
    }
    if (!subCategoryUpdated) {
      categoryArray.push(subCategory); // if no matching subCategory found, append the subCategory to the array
    }
    // Update the categoryArray in state.categories
    state.categories.set(collectionKey, categoryArray);
    
    return { ...state, isLoading: false, categories: new Map(state.categories) };
  }


  if (featchCategoriesStart.match(action)) {
    return { ...state, isLoading: true };
  }
    
  if (featchAllCategoriesStart.match(action)) {
    return { ...state, isLoading: true };
  }

  if (featchCategoriesSuccess.match(action)) {
    // Clone the existing Map to create a new Map instance
    const updatedCategories = new Map(state.categories);

    // Assuming action.payload is of type Map<string, Category[]>
    const fetchedCategories: Map<string, Category[]> = action.payload;

    // Merge the fetched categories into the existing Map
    fetchedCategories.forEach((value, key) => {
      updatedCategories.set(key, value);
    });

    return { ...state, categories: updatedCategories, isLoading: false };
  }

  if (featchAllCategoriesSuccess.match(action)) {
    return { ...state, categories: action.payload, isLoading: false };
  }

  if (featchCategoriesFailed.match(action)) {
    return { ...state, error: action.payload, isLoading: false };
  }

  return state;
};

