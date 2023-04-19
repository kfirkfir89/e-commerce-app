// import { all, call, takeLatest, put } from "redux-saga/effects";
import {
  all, call, takeLatest, put, 
} from 'typed-redux-saga';

import {
  getAllCategoriesAndDocuments, getCategoriesAndDocuments, getCategory, getPreviewCategoriesAndDocuments, getSubCategoryDocument, 
} from '../../utils/firebase/firebase.utils';

import {
  featchCategoriesSuccess, featchCategoriesFailed, FeatchCategoriesStart, FeatchAllCategoriesStart, featchAllCategoriesSuccess, featchUpdateCategories, FeatchSubCategoryData, featchSubCategoryDataSucceeded, FeatchSubCategory, featchSubCategorySucceeded, 
} from './category.action';

import { CATEGORIES_ACTION_TYPES } from './category.types';

export function* featchCategoriesAsync({ payload: { collectionKey } } :FeatchCategoriesStart) {
  try {
    const categoriesArray = yield* call(getCategoriesAndDocuments, collectionKey);
    // console.log({categoriesArray});
    yield* put(featchCategoriesSuccess(categoriesArray));
  } catch (error) {
    yield* put(featchCategoriesFailed(error as Error));
  }
}

export function* featchAllCategoriesAsync({ payload: userCollectionKeys } :FeatchAllCategoriesStart) {
  try {
    const categoriesArray = yield* call(getAllCategoriesAndDocuments, userCollectionKeys);
    // console.log({categoriesArray});
    yield* put(featchAllCategoriesSuccess(categoriesArray));
  } catch (error) {
    yield* put(featchCategoriesFailed(error as Error));
  }
}

export function* featchPreviewCategoriesAndDocuments() {
  try {
    const categoriesArray = yield* call(getPreviewCategoriesAndDocuments);
    // console.log({categoriesArray});
    yield* put(featchUpdateCategories(categoriesArray));
  } catch (error) {
    yield* put(featchCategoriesFailed(error as Error));
  }
}

export function* featchSubCategoryData({ payload: { collectionKey, docKey, skipItemsCounter } } : FeatchSubCategoryData) {
  try {
    const categoriesArray = yield* call(getSubCategoryDocument, collectionKey, docKey, skipItemsCounter);
    // console.log({categoriesArray});
    yield* put(featchSubCategoryDataSucceeded(categoriesArray));
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

export function* onFetchCategories() {
  yield* takeLatest(CATEGORIES_ACTION_TYPES.FETCH_CATEGORIES_START, featchCategoriesAsync);
}

export function* onAllFetchCategories() {
  yield* takeLatest(CATEGORIES_ACTION_TYPES.FETCH_ALL_CATEGORIES_START, featchAllCategoriesAsync);
}

export function* onPreviewFetchCategories() {
  yield* takeLatest(CATEGORIES_ACTION_TYPES.FETCH_PREVIEW_CATEGORIES_START, featchPreviewCategoriesAndDocuments);
}

export function* onSubCategoryFetchData() {
  yield* takeLatest(CATEGORIES_ACTION_TYPES.FETCH_SUB_CATEGORY_DATA, featchSubCategoryData);
}

export function* onCategoryFetch() {
  yield* takeLatest(CATEGORIES_ACTION_TYPES.FETCH_SUB_CATEGORY, featchCategory);
}

export function* categoriesSaga() {
  yield* all([call(onFetchCategories), call(onAllFetchCategories), call(onPreviewFetchCategories), call(onSubCategoryFetchData), call(onCategoryFetch)]);
}
