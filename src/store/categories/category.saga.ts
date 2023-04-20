// import { all, call, takeLatest, put } from "redux-saga/effects";
import {
  all, call, takeLatest, put, 
} from 'typed-redux-saga';

import {
  getCategory, getPreviewCategoriesAndDocuments, 
} from '../../utils/firebase/firebase.utils';

import {
  featchCategoriesFailed, 
  FeatchSubCategory, 
  featchSubCategorySucceeded, 
  FeatchUpdateCategorySucceeded, 
  featchUpdateCategorySucceeded,
  featchUpdateCategoriesSucceeded,
} from './category.action';

import { CATEGORIES_ACTION_TYPES } from './category.types';

export function* featchPreviewCategoriesAndDocuments() {
  try {
    const categoriesArray = yield* call(getPreviewCategoriesAndDocuments);
    // console.log({categoriesArray});
    yield* put(featchUpdateCategoriesSucceeded(categoriesArray));
  } catch (error) {
    yield* put(featchCategoriesFailed(error as Error));
  }
}

export function* featchCategory({ payload: { collectionKey, docKey } } : FeatchSubCategory) {
  try {
    const categoriesArray = yield* call(getCategory, collectionKey, docKey);
    // console.log({categoriesArray});
    yield* put(featchSubCategorySucceeded(categoriesArray));
  } catch (error) {
    yield* put(featchCategoriesFailed(error as Error));
  }
}

export function* featchUpdateCategory({ payload: { collectionKey, docKey, newItems } } : FeatchUpdateCategorySucceeded) {
  try {
    yield* put(featchUpdateCategorySucceeded(collectionKey, docKey, newItems));
  } catch (error) {
    yield* put(featchCategoriesFailed(error as Error));
  }
}

export function* onPreviewFetchCategories() {
  yield* takeLatest(CATEGORIES_ACTION_TYPES.FETCH_PREVIEW_CATEGORIES_START, featchPreviewCategoriesAndDocuments);
}

export function* onCategoryFetch() {
  yield* takeLatest(CATEGORIES_ACTION_TYPES.FETCH_SUB_CATEGORY, featchCategory);
}

export function* onUpdateCategoryFetch() {
  yield* takeLatest(CATEGORIES_ACTION_TYPES.FETCH_UPDATE_CATEGORY, featchUpdateCategory);
}

export function* categoriesSaga() {
  yield* all([
    call(onPreviewFetchCategories), 
    call(onCategoryFetch),
    call(onUpdateCategoryFetch),
  ]);
}
