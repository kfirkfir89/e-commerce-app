import {
  ItemPreview,
  NewItemValues,
} from '../../components/add-firebase/add-item.component';
import { SelectOption } from '../../components/select/select.component';

export enum CATEGORIES_ACTION_TYPES {
  FETCH_PREVIEW_CATEGORIES_START = 'category/FETCH_PREVIEW_CATEGORIES_START',
  FETCH_UPDATE_CATEGORIES_SUCCEEDED = 'category/FETCH_UPDATE_CATEGORIES_SUCCEEDED',
  FETCH_UPDATE_CATEGORY = 'category/FETCH_UPDATE_CATEGORY',
  FETCH_UPDATE_CATEGORY_SUCCEEDED = 'category/FETCH_UPDATE_CATEGORY_SUCCEEDED',
  FETCH_SEARCH_PREVIEW = 'category/FETCH_SEARCH_PREVIEW',
  FETCH_CATEGORIES_EXSIST = 'category/FETCH_CATEGORIES_EXSIST',
  FETCH_SELECT_SORT_OPTION = 'category/FETCH_SELECT_SORT_OPTION',
  FETCH_UPDATE_SORT = 'category/FETCH_UPDATE_SORT',
  FETCH_CATEGORIES_FAILED = 'category/FETCH_CATEGORIES_FAILED',
}

export type Category = {
  title: string;
  items: NewItemValues[];
};

export type PreviewCategory = {
  title: string;
  items: ItemPreview[];
};

export type SelectSortOption = {
  sizesOption: SelectOption[];
  colorsOption: SelectOption[];
};
