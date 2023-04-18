// import { all, call, takeLatest, put } from "redux-saga/effects";
import {
  all, call, takeLatest, put, 
} from 'typed-redux-saga';

import {
  getAllCategoriesAndDocuments, getCategoriesAndDocuments, getPreviewCategoriesAndDocuments, getSubCategoryDocument, 
} from '../../utils/firebase/firebase.utils';

import {
  featchCategoriesSuccess, featchCategoriesFailed, FeatchCategoriesStart, FeatchAllCategoriesStart, featchAllCategoriesSuccess, featchUpdateCategories, FeatchSubCategoryData, featchSubCategoryDataSucceeded, 
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

export function* featchSubCategoryData({ payload: { collectionKey, docKey } } : FeatchSubCategoryData) {
  try {
    const categoriesArray = yield* call(getSubCategoryDocument, collectionKey, docKey);
    // console.log({categoriesArray});
    yield* put(featchSubCategoryDataSucceeded(collectionKey, categoriesArray));
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
  yield* takeLatest(CATEGORIES_ACTION_TYPES.FETCH_SUB_CATEGORYS_DATA, featchSubCategoryData);
}

export function* categoriesSaga() {
  yield* all([call(onFetchCategories), call(onAllFetchCategories), call(onPreviewFetchCategories), call(onSubCategoryFetchData)]);
}
