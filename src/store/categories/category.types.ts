import { NewItemValues } from '../../components/add-firebase/add-item.component';

export enum CATEGORIES_ACTION_TYPES {
  FETCH_CATEGORIES_START = 'category/FETCH_CATEGORIES_START',
  FETCH_CATEGORIES_SUCCESS = 'category/FETCH_CATEGORIES_SUCCESS',
  FETCH_CATEGORIES_FAILED = 'category/FETCH_CATEGORIES_FAILED',
}

export type Category = {
  title: string;
  imageUrl?: string;
  items: NewItemValues[];
};

export type CategoryMap = {
  [key: string]: NewItemValues[];
};
