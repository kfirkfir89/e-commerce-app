// import { all, call, takeLatest, put } from "redux-saga/effects";
import {
  all, call, takeLatest, put, select,
} from 'typed-redux-saga';

import {
  getPreviewCategoriesAndDocuments, 
} from '../../utils/firebase/firebase.utils';

import {
  featchCategoriesFailed,
  FeatchUpdateCategorySucceeded, 
  featchUpdateCategorySucceeded,
  featchUpdateCategoriesSucceeded,
  FeatchPreviewCategories,
  featchCategoriesExsist,
} from './category.action';

import { CATEGORIES_ACTION_TYPES } from './category.types';
import { selectCategoriesPreview } from './category.selector';

export function* featchPreviewCategoriesAndDocuments({ payload: collectionKey }: FeatchPreviewCategories) {
  try {
    const categoriesPreviewSelector = yield* select(selectCategoriesPreview);
    if (categoriesPreviewSelector.has(collectionKey)) {
      yield* put(featchCategoriesExsist());
    } else {
      const categoriesArray = yield* call(getPreviewCategoriesAndDocuments, collectionKey);
      yield* put(featchUpdateCategoriesSucceeded(categoriesArray));
    }
  } catch (error) {
    yield* put(featchCategoriesFailed(error as Error));
  }
}

export function* featchUpdateCategory({
  payload: {
    collectionKey, docKey, newItems, sortOption, 
  }, 
} : FeatchUpdateCategorySucceeded) {
  try {
    yield* put(featchUpdateCategorySucceeded(collectionKey, docKey, newItems, sortOption));
  } catch (error) {
    yield* put(featchCategoriesFailed(error as Error));
  }
}

export function* onPreviewFetchCategories() {
  yield* takeLatest(CATEGORIES_ACTION_TYPES.FETCH_PREVIEW_CATEGORIES_START, featchPreviewCategoriesAndDocuments);
}

export function* onUpdateCategoryFetch() {
  yield* takeLatest(CATEGORIES_ACTION_TYPES.FETCH_UPDATE_CATEGORY, featchUpdateCategory);
}

export function* categoriesSaga() {
  yield* all([
    call(onPreviewFetchCategories), 
    call(onUpdateCategoryFetch),
  ]);
}
