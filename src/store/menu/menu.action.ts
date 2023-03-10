import { ActionWithPayload, createAction, withMatcher } from '../../utils/reducer/reducer.utils';
import { MENU_ACTION_TYPES } from './menu.types';

export type SetIsMenuOpen = ActionWithPayload<MENU_ACTION_TYPES.SET_IS_MENU_OPEN, boolean>;
export type SetSelected = ActionWithPayload<MENU_ACTION_TYPES.SET_SELECTED, string>;

export const setIsMenuOpen = withMatcher((boolean: boolean): SetIsMenuOpen => createAction(MENU_ACTION_TYPES.SET_IS_MENU_OPEN, boolean));
export const setSelected = withMatcher((string: string): SetSelected => createAction(MENU_ACTION_TYPES.SET_SELECTED, string));
