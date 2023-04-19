import { AnyAction } from 'redux';

import { Category } from './category.types';

import {
  featchCategoriesStart, featchCategoriesSuccess, featchCategoriesFailed, featchAllCategoriesStart, featchAllCategoriesSuccess, featchCategoriesInitialState, featchUpdateCategories, featchPreviewCategories, featchSubCategoryData, featchSubCategoryDataSucceeded, featchSubCategory, featchSubCategorySucceeded,
} from './category.action';
import { NewItemValues } from '../../components/add-firebase/add-item.component';

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

  if (featchPreviewCategories.match(action)) {
    return { ...state, isLoading: true };
  }

  if (featchUpdateCategories.match(action)) {
    const newCategories = action.payload;
    // map the newCategories and check for key(main category) if no exsist add this newMap to the categories
    newCategories.forEach((newCategoryValue, key) => {
      if (state.categories.has(key)) {
        const subCategoriesArray = state.categories.get(key)!;
        // loop and check each category if exsist in the current state
        newCategoryValue.forEach((category) => {
          // if catrgory exsit check the items[] leangth
          if (subCategoriesArray.some((exsistCategory) => exsistCategory.title === category.title)) {
            const exsistCategory = subCategoriesArray.find((exsistCategory) => exsistCategory.title === category.title)!;
            // if leangth is of the current state small replace
            if (exsistCategory.items.length < category.items.length) {
              for (let i = 0; i < subCategoriesArray.length; i++) {
                if (subCategoriesArray[i].title === category.title) {
                  subCategoriesArray[i].items = category.items;
                  break;
                }
              }
            }
          } else {
            subCategoriesArray.push(category);
            state.categories.set(key, subCategoriesArray);
          }
        });
      } else {
        state.categories.set(key, newCategoryValue);
      }
    });
  
    return { ...state, isLoading: false, categories: state.categories };
  }

  if (featchSubCategorySucceeded.match(action)) {
    const newCategories = action.payload;
    const mergedCategories = new Map([...state.categories, ...newCategories]);
    return { ...state, categories: mergedCategories };
  }

  if (featchSubCategoryData.match(action)) {
    return { ...state, isLoading: true };
  }
  
  if (featchSubCategoryDataSucceeded.match(action)) {
    const { collectionMapKey, title, sliceItems } = action.payload;
    const categoryArray = state.categories.get(collectionMapKey);
    if (categoryArray !== undefined) {
      if (categoryArray.some((c) => c.title === title)) {
        const subCategoryItems = categoryArray.find((c) => c.title === title);
        
        if (subCategoryItems && subCategoryItems.items) {
          subCategoryItems.items.push(
            ...sliceItems.filter(
              (newItem) => !subCategoryItems.items.some((existingItem) => existingItem.id === newItem.id),
            ),
          );
          categoryArray.map((c) => c.title === subCategoryItems.title && c.items === subCategoryItems.items);
          state.categories.set(collectionMapKey, categoryArray);
        }
      }
    }

    return { ...state, isLoading: false, categories: state.categories };
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

