import { createSelector } from 'reselect';
import { RootState } from '../store';
import { MenuState } from './menu.reducer';

const selectMenuReducer = (state: RootState): MenuState => state.menu;

export const selectIsMenuOpen = createSelector(
  [selectMenuReducer],
  (cart) => cart.isMenuOpen,
);
