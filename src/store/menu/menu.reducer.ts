import { AnyAction } from 'redux';

import { setIsMenuOpen, setSelected } from './menu.action';

export type MenuState = {
  readonly isMenuOpen: boolean;
  readonly selected: string;
};

const INITIAL_STATE: MenuState = {
  isMenuOpen: false,
  selected: '',
};

export const menuReducer = (
  state = INITIAL_STATE,
  action: AnyAction,
): MenuState => {
  if (setIsMenuOpen.match(action)) {
    return { ...state, isMenuOpen: action.payload };
  }

  if (setSelected.match(action)) {
    return { ...state, selected: action.payload };
  }

  return state;
};



