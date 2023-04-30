import { AnyAction } from 'redux';

import { Category, PreviewCategory } from './category.types';

import {
  featchCategoriesFailed, 
  featchPreviewCategories, 
  featchSubCategory, 
  featchSubCategorySucceeded, 
  featchUpdateCategory, 
  featchUpdateCategorySucceeded,
  featchUpdateCategoriesSucceeded,
} from './category.action';

// read only is an additional property you can add so that you force it, 
// that this state object can never be modified.It can only be read.
// with reducers you never modify the state. You always spread over and create a new state.
export type CategoriesState = {
  readonly categories: Map<string, PreviewCategory[]>;
  readonly categoriesPreview: Map<string, PreviewCategory[]>,
  readonly isLoading: boolean;
  readonly error: Error | null;
};

export const CATEGORIES_INITIAL_STATE : CategoriesState = {
  categories: new Map(),
  categoriesPreview: new Map(),
  isLoading: false,
  error: null,
};

export const categoriesReducer = (
  state = CATEGORIES_INITIAL_STATE,
  action: AnyAction,
): CategoriesState => {
  if (featchPreviewCategories.match(action)) {
    return { ...state, isLoading: true };
  }
  
  if (featchUpdateCategory.match(action)) {
    return { ...state, isLoading: true };
  }
  
  if (featchSubCategory.match(action)) {
    return { ...state, isLoading: true };
  }
  
  if (featchUpdateCategorySucceeded.match(action)) {
    const { collectionKey, docKey, newItems } = action.payload;

    const currentCategoriesArray = state.categories.get(collectionKey);

    if (currentCategoriesArray !== undefined) {
      const categoryIndex = currentCategoriesArray.findIndex((c) => c.title === docKey);
      const itemArray = currentCategoriesArray[categoryIndex].items;
      newItems.forEach((newItem) => {
        if (newItem.id && !itemArray.some((existingItem) => existingItem.id === newItem.id)) {
          itemArray.push(newItem);
        }
      });
    }
    return { ...state, isLoading: false, categories: state.categories };
  }

  if (featchUpdateCategoriesSucceeded.match(action)) {
    const newCategories = action.payload;
    // map the newCategories and check for key(main category) if no exsist add this newMap to the categories
    // newCategories.forEach((newCategoryValue, key) => {
    //   if (state.categories.has(key)) {
    //     const subCategoriesArray = state.categories.get(key)!;
    //     // loop and check each category if exsist in the current state
    //     newCategoryValue.forEach((category) => {
    //       // if catrgory exsit check the items[] leangth
    //       if (subCategoriesArray.some((exsistCategory) => exsistCategory.title === category.title)) {
    //         const exsistCategory = subCategoriesArray.find((exsistCategory) => exsistCategory.title === category.title);
    //         // if leangth is of the current state small replace
    //         if (exsistCategory && exsistCategory.items.length < category.items.length) {
    //           for (let i = 0; i < subCategoriesArray.length; i++) {
    //             if (subCategoriesArray[i].title === category.title) {
    //               subCategoriesArray[i].items = category.items;
    //               break;
    //             }
    //           }
    //         }
    //       } else {
    //         subCategoriesArray.push(category);
    //         state.categories.set(key, subCategoriesArray);
    //       }
    //     });
    //   } else {
    //     state.categories.set(key, newCategoryValue);
    //   }
    // });
    return { ...state, isLoading: false, categoriesPreview: action.payload };
  }

  if (featchSubCategorySucceeded.match(action)) {
    const newCategories = action.payload;

    newCategories.forEach((value, key) => {
      if (!state.categories.has(key)) {
        state.categories.set(key, value);
      } else {
        const stateCategory = state.categories.get(key)!;
        const newCategory = newCategories.get(key)!;

        newCategory.forEach((newCategory) => {
          if (!stateCategory.some((c) => c.title === newCategory.title)) {
            stateCategory.push(newCategory);
          }
        });
      }
    });

    return { ...state, isLoading: false, categories: state.categories };
  }

  if (featchCategoriesFailed.match(action)) {
    return { ...state, error: action.payload, isLoading: false };
  }

  return state;
};

